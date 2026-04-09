import Groq from "groq-sdk";
import { getGrokApiKey } from "../config/env";
import { redis } from "../utils/redis";
import { Message } from "database";

const groq = new Groq({
    apiKey: getGrokApiKey(),
});

const SYSTEM_PROMPT = `
You are Jarvis, the personal assistant of Manikanta Mamidi, a Full Stack Developer.

Your role is to represent Manikanta and help visitors understand his skills, experience, and projects.

Tone Adaptation:
- Match the user’s tone (casual, sarcastic, or playful) while staying respectful and clear
- Do not overuse humor or lose professionalism

Guidelines:
- Keep responses very simple and try to redude the length max 100 words. 
- Be clear, structured, and concise
- Use bullet points when helpful
- Focus on real-world impact and practical skills
- Do not mention AI, prompts, or backend systems
- Do not make up information

Behavior:
- Always act as Jarvis (third-person about Manikanta)
- Prioritize provided context over assumptions
- If unsure, say you don’t have that detail and suggest contacting Manikanta

Contact Handling:
- When relevant, include 1–2 contact options (email, phone, LinkedIn, GitHub)

Recruiter Focus:
- Emphasize impact, scale, and production experience
- Keep answers result-oriented

Goal:
Help users quickly understand Manikanta’s capabilities and guide them toward hiring or collaboration.
`;

const CONTEXT = `
Manikanta Mamidi – Full Stack Developer (Bangalore, India)

Experience:
- Full Stack Developer, WorldVisa (Mar 2025–Present)
  Built scalable immigration platforms (GetAVisa, DMS, marketing systems)
  Designed system architecture for document workflows and pipelines
  Integrated AI (OpenAI, Perplexity) and OCR (Google Document AI)
  Built real-time systems (Socket.IO, Convex) and Zoho CRM integrations
  Focused on performance, scalability, and reliability

- Web Developer, Webomindapps (Jun 2023–Jun 2024)
  Built production-grade apps with strong UI architecture and performance focus

- Freelance Full Stack Developer (2024–2025)
  Delivered end-to-end scalable applications with full ownership

Core Skills:
Frontend: Next.js, React, Angular, Tailwind  
Backend: Node.js, APIs, system design  
Databases: MongoDB, SQL  
AI: LLM integrations, automation workflows  
Systems: real-time, event-driven architecture  
Engineering: clean code, modular design, DSA fundamentals  

Strengths:
Scalable systems, performance optimization, full-stack ownership

Contact:
Email: msmanikanta25@gmail.com  
Phone: +91 8688014415  
LinkedIn: https://www.linkedin.com/in/sai0421/  
GitHub: https://github.com/mani254  
`;

const CHAT_HISTORY_KEY = (chatId: string) => `chat:history:${chatId}`;

async function getChatContext(chatId: string) {
    try {
        // 1. Try Redis
        const cached = await redis.lrange(CHAT_HISTORY_KEY(chatId), 0, -1);
        if (cached.length > 0) {
            return cached.map(msg => JSON.parse(msg));
        }

        // 2. Fallback to MongoDB
        const messages = await Message.find({ chatId, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const history = messages.reverse().map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }));

        // 3. Populate Redis
        if (history.length > 0) {
            const pipeline = redis.pipeline();
            // Clear just in case
            pipeline.del(CHAT_HISTORY_KEY(chatId));
            history.forEach(msg => pipeline.rpush(CHAT_HISTORY_KEY(chatId), JSON.stringify(msg)));
            pipeline.expire(CHAT_HISTORY_KEY(chatId), 3600); // 1 hour
            await pipeline.exec();
        }

        return history;
    } catch (error) {
        console.error("[getChatContext] Error fetching history:", error);
        return [];
    }
}

export async function generateAIResponse(
    content: string,
    model: string,
    chatId: string,
): Promise<string> {
    const history = await getChatContext(chatId);

    const completion = await groq.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "system",
                content: CONTEXT
            },
            ...history,
            {
                role: "user",
                content: content,
            },
        ],
    });

    return completion.choices[0].message.content || 'something went wrong';
}