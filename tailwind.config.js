/** @type {import('tailwindcss').Config} */
module.exports = {
  // Mantendo seu 'content' como estava
  content: ["./index.html", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Atualizando as cores para a paleta "Noite de Inverno"
      colors: {
        "board-light": "#BCCBDD", // Casa clara (Cinza-Azulado Claro)
        "board-dark": "#4A6074", // Casa escura (Azul-Petróleo Escuro)
        "board-highlight": "#F97316", // Destaque (Laranja Vibrante)
        "piece-dark": "#333333", // Peça preta (Cinza Quase Preto)

        // --- Paleta Semântica (UI da Página) ---

        // Fundos e Superfícies
        "page-bg": "#1E293B", // Fundo principal da página (Azul Muito Escuro)
        "surface-bg": "#334155", // Fundo de cards, modais, header (ex: bg-surface-bg)
        "border-subtle": "#4A6074", // Borda sutil (mesma cor da casa escura) (ex: border-border-subtle)

        // Texto (Hierarquia)
        "title": "#F1F5F9", // Títulos e texto importante (Quase Branco) (ex: text-text-heading)
        "body": "#CBD5E1", // Parágrafos e texto normal (Cinza-Azulado Claro) (ex: text-text-body)
        "muted": "#64748B", // Texto sutil, placeholders, rodapé (Cinza) (ex: text-text-muted)

        // Ações (Botões e Links)
        "accent": "#F97316", // Botão primário, links (Laranja) (ex: bg-accent, text-accent)
        "accent-hover": "#EA580C", // Hover do botão primário (Laranja Escuro) (ex: hover:bg-accent-hover)
      },
    },
  },
  plugins: [],
};
