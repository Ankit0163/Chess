// Unicode chess pieces
const PIECE_SYMBOLS: Record<string, string> = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

export function getPieceSymbol(piece: { type: string; color: string }): string {
  const key = `${piece.color === "w" ? "w" : "b"}${piece.type.toUpperCase()}`;
  return PIECE_SYMBOLS[key] || "";
}

export function getSquareColor(row: number, col: number): "light" | "dark" {
  return (row + col) % 2 === 0 ? "light" : "dark";
}

export function squareToCoords(square: string): [number, number] {
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square[1]);
  return [row, col];
}

export function coordsToSquare(row: number, col: number): string {
  return `${String.fromCharCode(97 + col)}${8 - row}`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
