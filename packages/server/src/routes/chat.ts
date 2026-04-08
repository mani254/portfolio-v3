import { Router, Request, Response } from 'express';
import { Chat, Message } from 'database';

const router = Router();

// GET /api/chats — list chats for the current session
router.get('/', async (req: Request, res: Response) => {
    try {
        const sessionId = req.query.sessionId as string;
        if (!sessionId) {
            res.status(400).json({ success: false, message: 'sessionId is required' });
            return;
        }

        const chats = await Chat.find({ sessionId })
            .sort({ updatedAt: -1 })
            .limit(20)
            .lean();

        res.json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch chats' });
    }
});

// GET /api/chats/:chatId/messages — paginated message history
router.get('/:chatId/messages', async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const cursor = req.query.cursor as string | undefined;
        const limit = Math.min(Number(req.query.limit) || 50, 100);

        const query: Record<string, unknown> = { chatId, isDeleted: false };
        if (cursor) query['_id'] = { $lt: cursor };

        const messages = await Message.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        res.json({
            success: true,
            data: messages.reverse(),
            nextCursor: messages.length === limit ? messages[0]._id : null,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

export default router;
