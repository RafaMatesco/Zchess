import React, { useState } from "react";

// Definição dos tipos para ficar mais organizado
type PieceType = "torre" | "cavalo" | "bispo" | "rainha" | "rei" | "peao" | null;

interface BoardCell {
  row: number;
  col: number;
  isLight: boolean;
  pieceType: PieceType;
  pieceIsLight: boolean;
  isPossibleMove: boolean;
}

const createInitialBoard = (): BoardCell[][] => {
  const board: BoardCell[][] = [];
  const pieceTypes: PieceType[] = ["torre", "cavalo", "bispo", "rainha", "rei", "bispo", "cavalo", "torre"];

  for (let r = 0; r < 8; r++) {
    const row: BoardCell[] = [];
    for (let c = 0; c < 8; c++) {
      let square: BoardCell = {
        row: r,
        col: c,
        isLight: (r + c) % 2 === 0,
        pieceType: null,
        pieceIsLight: false,
        isPossibleMove: false,
      };

      if (r === 0) {
        square.pieceType = pieceTypes[c];
        square.pieceIsLight = false;
      } else if (r === 1) {
        square.pieceType = "peao";
        square.pieceIsLight = false; 
      } else if (r === 6) {
        square.pieceType = "peao";
        square.pieceIsLight = true; 
      } else if (r === 7) {
        square.pieceType = pieceTypes[c];
        square.pieceIsLight = true; 
      }

      row.push(square);
    }
    board.push(row);
  }
  return board;
};

export function Chess() {
  const [board, setBoard] = useState(createInitialBoard());
  const getPieceImageSrc = (type: PieceType, isLight: boolean) => {
    if (!type) return null;
    const colorSuffix = isLight ? "Branco" : "Preto";
    return `${type}${colorSuffix}.png`;
  };

  const handleMovePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

      const pieceType = newBoard[fromRow][fromCol].pieceType;
      const pieceIsLight = newBoard[fromRow][fromCol].pieceIsLight;

      newBoard[fromRow][fromCol].pieceType = null;
      newBoard[toRow][toCol].pieceType = pieceType;
      newBoard[toRow][toCol].pieceIsLight = pieceIsLight;

      return newBoard;
    });
  };

  const showPossibleMoves = (cell: BoardCell) => {
    console.log("Célula clicada:", cell);
    if (cell.pieceType === "peao") {
      if(cell.pieceIsLight == false){
        
      }
    }
  };

  return (
    <div className="w-full max-w-2xl grid grid-cols-8 border border-border-subtle rounded-lg overflow-hidden shadow-lg aspect-square">
      {board.map((row, r) => (
        <React.Fragment key={r}>
          {row.map((cell) => {
            const bgColor = cell.isLight ? "bg-board-light" : "bg-board-dark";
            const imageSrc = getPieceImageSrc(cell.pieceType, cell.pieceIsLight);

            return (
              <div key={`${cell.row}-${cell.col}`} className={`${bgColor} aspect-square flex items-center justify-center cursor-pointer`} onClick={() => showPossibleMoves(cell)}>
                {}
                {cell.pieceType && imageSrc && (
                  <img
                    src={imageSrc}
                    alt={cell.pieceType}
                    className="w-3/4 h-3/4 select-none object-contain" // Ajuste de estilo para a peça
                  />
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
