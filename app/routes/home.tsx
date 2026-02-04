import React, { useState } from "react";

import type { Route } from "./+types/home";
import { Chessboard } from "../components/Chessboard";
import SelectColor from "../components/SelectColor";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Zchess" }, { name: "Zches", content: "Zchess" }];
}

export default function Home() {
  const [corUser, setCorUser] = useState(true);
  return (
    <main className="flex flex-col items-center w-full select-none">
      <SelectColor value={corUser} onChange={setCorUser} />
      <Chessboard corUser={corUser}></Chessboard>

      <section className="container mx-4 px-4 py-4 text-center ">
        <h1 className="text-4xl md:text-6xl text-title font-extrabold mb-4 bg-clip-text">Zchess</h1>
        <p className="text-lg md:text-sm text-body mb-8 max-w-2xl mx-auto">Desenvolvido por Rafael Matesco :)</p>
      </section>
    </main>
  );
}
