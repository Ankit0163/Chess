import { Chess } from "chess.js";
import { Trophy, AlertTriangle, Handshake } from "lucide-react";

interface GameStatusProps {
  game: Chess;
  timeoutWinner?: "w" | "b" | null;
}

const GameStatus = ({ game, timeoutWinner }: GameStatusProps) => {
  let message = "";
  let icon = null;
  let variant = "";

  if (timeoutWinner) {
    message = `${timeoutWinner === "w" ? "White" : "Black"} wins on time!`;
    icon = <Trophy className="w-5 h-5" />;
    variant = "text-primary";
  } else if (game.isCheckmate()) {
    const winner = game.turn() === "w" ? "Black" : "White";
    message = `Checkmate! ${winner} wins!`;
    icon = <Trophy className="w-5 h-5" />;
    variant = "text-primary";
  } else if (game.isDraw()) {
    message = game.isStalemate()
      ? "Stalemate — Draw!"
      : game.isThreefoldRepetition()
      ? "Threefold repetition — Draw!"
      : game.isInsufficientMaterial()
      ? "Insufficient material — Draw!"
      : "Draw!";
    icon = <Handshake className="w-5 h-5" />;
    variant = "text-accent";
  } else if (game.inCheck()) {
    message = `${game.turn() === "w" ? "White" : "Black"} is in check!`;
    icon = <AlertTriangle className="w-5 h-5" />;
    variant = "text-destructive";
  } else {
    message = `${game.turn() === "w" ? "White" : "Black"}'s turn`;
  }

  return (
    <div className={`glass px-4 py-3 flex items-center gap-2 font-medium ${variant}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default GameStatus;
