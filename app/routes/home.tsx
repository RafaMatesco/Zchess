import type { Route } from "./+types/home";
import { Chess } from "../components/Chess";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Zchess" }, { name: "Zches", content: "Zchess" }];
}

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <Chess></Chess>

      <section className="container mx-4 px-4 py-4 text-center ">
        <h1 className="text-4xl md:text-6xl text-title font-extrabold mb-4 bg-clip-text">Zchess</h1>
        <p className="text-lg md:text-sm text-body mb-8 max-w-2xl mx-auto">Desenvolvido por Rafael Matesco :)</p>
      </section>
    </main>
  );
}
