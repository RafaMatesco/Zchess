import React, { useState } from "react";

const createInitialBoard = () => {
  const board = [];
  for (let r = 0; r < 8; r++) {
    const row = [];
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      row.push({
        row: r,
        col: c,
        isLight: isLight,
        piece: null,
      });
    }
    board.push(row);
  }
  return board;
};

export function Chess() {
  const [board, setBoard] = useState(createInitialBoard());
  const handleMovePiece = (fromRow: string, fromCol: string, toRow: string, toCol: string) => {
    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell }))); // Cópia profunda
      const piece = newBoard[fromRow][fromCol].piece;

      newBoard[fromRow][fromCol].piece = null;
      newBoard[toRow][toCol].piece = piece;

      return newBoard;
    });
  };

  return (
    <div className="w-full max-w-2xl grid grid-cols-8 border border-border-subtle rounded-lg overflow-hidden shadow-lg aspect-square">
      {board.map((row, r) => (
        <React.Fragment key={r}>
          {row.map((cell) => {
            const bgColor = cell.isLight ? "bg-board-light" : "bg-board-dark";

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                className={`${bgColor} aspect-square flex items-center justify-center text-text-muted`}
                onClick={() => console.log(`Clicou em: ${cell.row}, ${cell.col}`)}
              >
                {cell.piece && <div className="text-text-heading text-4xl">{cell.piece}</div>}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
