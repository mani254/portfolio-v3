import Skills from "@/components/common/Skills";
import { getAllTechnologies } from "sanity-lib";

export default async function Home() {
  const technologies = await getAllTechnologies();

  return (
    <div>
      <div className="flex min-h-screen items-center justify-center font-sans bg-background">
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter opacity-10 blend-difference uppercase text-foreground">
          Portfolio
        </h1>
      </div>

      <Skills technologies={technologies} />
    </div>
  );
}
