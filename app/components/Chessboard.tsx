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

  const handleClick = (cell: BoardCell) => {
    if (!cell.pieceType) {
      if (cell.isPossibleMove) {
        console.log(cell);
        //movePiece()
      }
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
        return newBoard;
      });
    } else {
      showPossibleMoves(cell);
    }
  };

  const movePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
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
    if (!cell.pieceType) {
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
        return newBoard;
      });
    }

    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell, isPossibleMove: false })));
      const { row, col, pieceType, pieceIsLight } = cell;

      //Lógica do PEAO
      if (pieceType === "peao") {
        const direction = pieceIsLight ? -1 : 1;
        const targetRow = row + direction;

        const startRow = pieceIsLight ? 6 : 1;
        if (row === startRow) {
          const doubleJumpRow = row + direction * 2;
          if (newBoard[targetRow][col].pieceType === null && newBoard[doubleJumpRow][col].pieceType === null) {
            newBoard[doubleJumpRow][col].isPossibleMove = true;
          }
        } else if (targetRow >= 0 && targetRow < 8) {
          const targetCell = newBoard[targetRow][col];
          if (targetCell.pieceType === null) {
            targetCell.isPossibleMove = true;
          }
        }
      } else if (pieceType == "torre") {
        const direction = pieceIsLight ? -1 : 1;
        //for para x
        for (let x = 0; x < 8; x++) {
          const targetCell = newBoard[x][col];
        }
        //for para y
        for (let y = 0; y < 8; y++) {
          const targetCell = newBoard[row][y];
        }
      }

      return newBoard;
    });
  };

  return (
    <div className="w-full max-w-2xl grid grid-cols-8 border border-border-subtle rounded-lg overflow-hidden shadow-lg aspect-square">
      {board.map((row, r) => (
        <React.Fragment key={r}>
          {row.map((cell) => {
            let bgColor = cell.isLight ? "bg-board-light" : "bg-board-dark";
            const imageSrc = getPieceImageSrc(cell.pieceType, cell.pieceIsLight);
            bgColor = cell.isPossibleMove ? "bg-board-highlight" : bgColor;

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                className={`${bgColor} aspect-square flex items-center justify-center cursor-pointer transition-colors duration-300`}
                onClick={() => handleClick(cell)}
              >
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
