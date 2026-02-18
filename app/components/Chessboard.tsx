import React, { useState } from "react";

interface Piece {
  id: string;
  type: string;
  color: boolean;
  hasMoved: boolean;
}

interface BoardCell {
  row: number;
  col: number;
  isLight: boolean;
  piece: Piece | null;
  isPossibleMove: boolean;
}

const createInitialBoard = (): BoardCell[][] => {
  const board: BoardCell[][] = [];
  const pieceTypes = ["torre", "cavalo", "bispo", "rainha", "rei", "bispo", "cavalo", "torre"];

  for (let r = 0; r < 8; r++) {
    const row: BoardCell[] = [];
    for (let c = 0; c < 8; c++) {
      let square: BoardCell = {
        row: r,
        col: c,
        isLight: (r + c) % 2 === 0,
        piece: null,
        isPossibleMove: false,
      };

      if (r === 0 || r === 7) {
        const color = r === 0 ? false : true; // false para preto, true para branco
        square.piece = {
          id: `${pieceTypes[c]}-${color}-${r}-${c}`,
          type: pieceTypes[c],
          color: color,
          hasMoved: false,
        };
      } else if (r === 1 || r === 6) {
        const color = r === 1 ? false : true;
        square.piece = {
          id: `peao-${color}-${r}-${c}`,
          type: "peao",
          color: color,
          hasMoved: false,
        };
      }

      row.push(square);
    }
    board.push(row);
  }
  return board;
};

type ChessboardProps = { corUser: boolean };

export function Chessboard({ corUser }: ChessboardProps) {
  const [board, setBoard] = useState(createInitialBoard());
  const [selectedCell, setSelectedCell] = useState<BoardCell | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);

  const getPieceImageSrc = (piece: Piece | null) => {
    if (!piece) return null;
    const colorSuffix = piece.color ? "Branco" : "Preto";
    return `${piece.type}${colorSuffix}.png`;
  };

  const handlePieceClick = (cell: BoardCell) => {
    console.log("Peças brancas capturadas:", capturedWhite);
    console.log("Peças pretas capturadas:", capturedBlack);
    if (cell.isPossibleMove && selectedCell) {
      movePiece(selectedCell.row, selectedCell.col, cell.row, cell.col);
      setSelectedCell(null);
      return;
    }

    // Caso contrário, mostra os movimentos possíveis
    setSelectedCell(cell);
    showPossibleMoves(cell);
  };

  const movePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell, isPossibleMove: false })));
      const piece = newBoard[fromRow][fromCol].piece;

      if (newBoard[toRow][toCol].piece) {
        const capturedPiece = newBoard[toRow][toCol].piece!;
        if (capturedPiece.color) {
          setCapturedWhite((prev) => prev.some(p => p.id === capturedPiece.id) ? prev : [...prev, capturedPiece]);
        } else {
          setCapturedBlack((prev) => prev.some(p => p.id === capturedPiece.id) ? prev : [...prev, capturedPiece]);
        }
      }

      newBoard[fromRow][fromCol].piece = null;
      newBoard[toRow][toCol].piece = piece;

      return newBoard;
    });
  };

  const showPossibleMoves = (cell: BoardCell) => {
    //console.log(cell);

    if (!cell.piece || corUser !== cell.piece.color) {
      setBoard((currentBoard) => currentBoard.map((row) => row.map((c) => ({ ...c, isPossibleMove: false }))));
      return;
    }

    setBoard((currentBoard) => {
      const newBoard = currentBoard.map((row) => row.map((c) => ({ ...c, isPossibleMove: false })));
      const { row, col } = cell;
      const pieceType = cell.piece!.type;
      // Função auxiliar para validar se uma posição está dentro do tabuleiro e se pode ser ocupada
      const isValidMove = (row: number, column: number) => {
        if (row < 0 || row >= 8 || column < 0 || column >= 8) return { valid: false, stop: true };
        const target = newBoard[row][column];
        if (!target.piece) return { valid: true, stop: false };
        if (target.piece.color !== cell.piece!.color) return { valid: true, stop: true }; // Captura peça inimiga
        return { valid: false, stop: true }; // Peça aliada bloqueia
      };

      // --- Lógica do PEÃO ---
      if (pieceType === "peao") {
        const direction = cell.piece!.color ? -1 : 1;
        const startRow = cell.piece!.color ? 6 : 1;

        // Verifica se não tem peça e mostra onde pode jogar
        if (row === startRow && !newBoard[row + direction * 2]?.[col].piece) {
          newBoard[row + direction * 2][col].isPossibleMove = true;
        } else if (!newBoard[row + direction]?.[col].piece) {
          newBoard[row + direction][col].isPossibleMove = true;
        }

        // Capturas diagonais
        [-1, 1].forEach((side) => {
          const target = newBoard[row + direction][col + side];

          if (target && target.piece && target.piece.color !== cell.piece!.color) {
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
            const imageSrc = getPieceImageSrc(cell.piece);
            bgColor = cell.isPossibleMove ? "bg-board-highlight" : bgColor;

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                className={`${bgColor} aspect-square flex items-center justify-center cursor-pointer transition-colors duration-300`}
                onClick={() => handlePieceClick(cell)}
              >
                {cell.piece && imageSrc && (
                  <img
                    src={imageSrc}
                    alt={cell.piece.type}
                    className="w-3/4 h-3/4 select-none object-contain pointer-events-none" // Ajuste de estilo para a peça
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
