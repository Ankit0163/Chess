import { useState, useCallback, useMemo } from "react";
import { Chess, type Square } from "chess.js";
import { getPieceSymbol, getSquareColor, coordsToSquare, squareToCoords } from "@/lib/chess-utils";

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string, promotion?: string) => boolean;
  flipped?: boolean;
  lastMove?: { from: string; to: string } | null;
}

const ChessBoard = ({ game, onMove, flipped = false, lastMove }: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [promotionSquare, setPromotionSquare] = useState<{ from: string; to: string } | null>(null);

  const legalMoves = useMemo((): string[] => {
    if (!selectedSquare) return [];
    try {
      return game.moves({ square: selectedSquare as Square, verbose: true }).map((m) => m.to as string);
    } catch { return []; }
  }, [selectedSquare, game.fen()]);

  const inCheck = game.inCheck();
  const kingSquare = useMemo(() => {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === "k" && p.color === game.turn()) {
          return coordsToSquare(r, c);
        }
      }
    }
    return null;
  }, [game.fen()]);

  const handleSquareClick = useCallback(
    (square: string) => {
      if (promotionSquare) return;

      if (selectedSquare) {
        if (legalMoves.includes(square)) {
          // Check for pawn promotion
          const piece = game.get(selectedSquare as Square);
          if (piece?.type === "p") {
            const [row] = squareToCoords(square);
            if ((piece.color === "w" && row === 0) || (piece.color === "b" && row === 7)) {
              setPromotionSquare({ from: selectedSquare, to: square });
              return;
            }
          }
          onMove(selectedSquare, square);
          setSelectedSquare(null);
          return;
        }
        setSelectedSquare(null);
      }

      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    },
    [selectedSquare, legalMoves, game, onMove, promotionSquare]
  );

  const handleDragStart = useCallback(
    (square: string) => {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setDraggedPiece(square);
      }
    },
    [game]
  );

  const handleDrop = useCallback(
    (square: string) => {
      if (draggedPiece) {
        const piece = game.get(draggedPiece as Square);
        if (piece?.type === "p") {
          const [row] = squareToCoords(square);
          if ((piece.color === "w" && row === 0) || (piece.color === "b" && row === 7)) {
            const moves = game.moves({ square: draggedPiece as Square, verbose: true });
            if (moves.some((m) => m.to === square)) {
              setPromotionSquare({ from: draggedPiece, to: square });
              setDraggedPiece(null);
              setSelectedSquare(null);
              return;
            }
          }
        }
        onMove(draggedPiece, square);
        setDraggedPiece(null);
        setSelectedSquare(null);
      }
    },
    [draggedPiece, game, onMove]
  );

  const handlePromotion = (piece: string) => {
    if (promotionSquare) {
      onMove(promotionSquare.from, promotionSquare.to, piece);
      setPromotionSquare(null);
      setSelectedSquare(null);
    }
  };

  const rows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="relative">
      <div className="grid grid-cols-8 rounded-xl overflow-hidden shadow-2xl border-2 border-border">
        {rows.map((row) =>
          cols.map((col) => {
            const square = coordsToSquare(row, col);
            const piece = game.get(square as Square) || null;
            const sqColor = getSquareColor(row, col);
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.includes(square);
            const isCheck = inCheck && kingSquare === square;
            const isLastMove =
              lastMove && (lastMove.from === square || lastMove.to === square);

            let bgClass = sqColor === "light" ? "chess-board-light" : "chess-board-dark";
            if (isSelected) bgClass = "chess-board-selected";
            else if (isLastMove) {
              bgClass = sqColor === "light" ? "chess-board-last-move-light" : "chess-board-last-move-dark";
            }

            return (
              <div
                key={square}
                className={`relative aspect-square flex items-center justify-center cursor-pointer transition-colors duration-150 ${bgClass}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(square)}
              >
                {isCheck && (
                  <div className="absolute inset-0 chess-board-check" />
                )}
                {piece && (
                  <span
                    className={`text-2xl sm:text-3xl md:text-4xl select-none z-10 transition-transform duration-100 hover:scale-110 ${
                      draggedPiece === square ? "opacity-40" : ""
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(square)}
                    style={{ filter: piece.color === "w" ? "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))" : "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))" }}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                )}
                {isLegal && (
                  <div
                    className={`absolute z-20 rounded-full ${
                      piece
                        ? "inset-0 border-4 border-primary/60"
                        : "w-3 h-3 bg-primary/50"
                    }`}
                  />
                )}
                {/* Coordinate labels */}
                {col === (flipped ? 7 : 0) && (
                  <span className={`absolute top-0.5 left-1 text-[10px] font-semibold ${sqColor === "light" ? "text-[hsl(160,30%,28%)]" : "text-[hsl(35,30%,72%)]"}`}>
                    {8 - row}
                  </span>
                )}
                {row === (flipped ? 0 : 7) && (
                  <span className={`absolute bottom-0.5 right-1 text-[10px] font-semibold ${sqColor === "light" ? "text-[hsl(160,30%,28%)]" : "text-[hsl(35,30%,72%)]"}`}>
                    {String.fromCharCode(97 + col)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Promotion dialog */}
      {promotionSquare && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/60 backdrop-blur-sm rounded-xl">
          <div className="glass-strong p-4 flex gap-2">
            {["q", "r", "b", "n"].map((p) => (
              <button
                key={p}
                onClick={() => handlePromotion(p)}
                className="w-14 h-14 flex items-center justify-center rounded-lg bg-secondary hover:bg-primary/20 transition-colors text-3xl"
              >
                {getPieceSymbol({ type: p, color: game.turn() })}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
