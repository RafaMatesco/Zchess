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
    //console.log(cell);

    if (!cell.pieceType) {
      setBoard((currentBoard) => currentBoard.map((row) => row.map((c) => ({ ...c, isPossibleMove: false }))));
      return;
    }

    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((c) => ({ ...c, isPossibleMove: false })));
      const { row, col, pieceType, pieceIsLight } = cell;

      // Função auxiliar para validar se uma posição está dentro do tabuleiro e se pode ser ocupada
      const isValidMove = (row: number, column: number) => {
        if (row < 0 || row >= 8 || column < 0 || column >= 8) return { valid: false, stop: true };
        const target = newBoard[row][column];
        if (target.pieceType === null) return { valid: true, stop: false };
        if (target.pieceIsLight !== pieceIsLight) return { valid: true, stop: true }; // Captura peça inimiga
        return { valid: false, stop: true }; // Peça aliada bloqueia
      };

      // --- Lógica do PEÃO ---
      if (pieceType === "peao") {
        const direction = pieceIsLight ? -1 : 1;
        const startRow = pieceIsLight ? 6 : 1;
        
        // Verifica se não tem peça e mostra onde pode jogar
        if (newBoard[row + direction]?.[col].pieceType === null) {
          if (row === startRow && newBoard[row + direction * 2]?.[col].pieceType === null) {
            newBoard[row + direction * 2][col].isPossibleMove = true;
          } else {
            newBoard[row + direction][col].isPossibleMove = true;
          }
        }

        // Capturas diagonais
        [-1, 1].forEach((side) => {
          const target = newBoard[row + direction][col + side];

          if (target && target.pieceType !== null && target.pieceIsLight !== pieceIsLight) {
            target.isPossibleMove = true;
          }
        });
      }

      // --- Lógica do CAVALO ---
      if (pieceType === "cavalo") {
        const knightMoves = [
          [row - 2, col - 1],
          [row - 2, col + 1],
          [row - 1, col - 2],
          [row - 1, col + 2],
          [row + 1, col - 2],
          [row + 1, col + 2],
          [row + 2, col - 1],
          [row + 2, col + 1],
        ];
        knightMoves.forEach(([r, c]) => {
          const check = isValidMove(r, c);
          if (check.valid) newBoard[r][c].isPossibleMove = true;
        });
      }

      // --- Lógica de PEÇAS DESLIZANTES (Torre, Bispo, Rainha) ---
      const directions: { [key: string]: number[][] } = {
        torre: [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        bispo: [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
        rainha: [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
      };

      if (pieceType === "torre" || pieceType === "bispo" || pieceType === "rainha") {
        directions[pieceType].forEach(([dr, dc]) => {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            const check = isValidMove(r, c);
            if (check.valid) newBoard[r][c].isPossibleMove = true;
            if (check.stop) break; // Para se bater em algo ou capturar
          }
        });
      }

      // --- Lógica do REI ---
      if (pieceType === "rei") {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const check = isValidMove(row + dr, col + dc);
            if (check.valid) newBoard[row + dr][col + dc].isPossibleMove = true;
          }
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
                onClick={() => showPossibleMoves(cell)}
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
