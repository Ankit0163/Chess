import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { useNavigate } from "react-router-dom";
import ChessBoard from "@/components/chess/ChessBoard";
import MoveHistory from "@/components/chess/MoveHistory";
import GameStatus from "@/components/chess/GameStatus";
import GameTimer from "@/components/chess/GameTimer";
import { Button } from "@/components/ui/button";
import { RotateCcw, Flag, ArrowLeft, FlipVertical } from "lucide-react";

const GamePage = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timeoutWinner, setTimeoutWinner] = useState<"w" | "b" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const isGameOver = game.isGameOver() || !!timeoutWinner;

  const handleMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move({ from, to, promotion: promotion || undefined });
        if (result) {
          setGame(gameCopy);
          setMoveHistory((prev) => [...prev, result.san]);
          setLastMove({ from, to });
          if (!gameStarted) setGameStarted(true);
          return true;
        }
      } catch {
        // invalid move
      }
      return false;
    },
    [game, gameStarted]
  );

  const handleReset = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setLastMove(null);
    setTimeoutWinner(null);
    setWhiteTime(600);
    setBlackTime(600);
    setGameStarted(false);
  };

  const handleResign = () => {
    setTimeoutWinner(game.turn() === "w" ? "b" : "w");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-gradient">Chess Game</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFlipped(!flipped)}>
              <FlipVertical className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            {!isGameOver && gameStarted && (
              <Button variant="destructive" size="sm" onClick={handleResign}>
                <Flag className="w-4 h-4 mr-1" />
                Resign
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Left side - Board */}
          <div className="flex flex-col gap-3 w-full max-w-lg">
            <GameTimer
              initialTime={blackTime}
              isActive={gameStarted && !isGameOver && game.turn() === "b"}
              color="b"
              onTimeout={() => setTimeoutWinner("w")}
            />
            <ChessBoard
              game={game}
              onMove={handleMove}
              flipped={flipped}
              lastMove={lastMove}
            />
            <GameTimer
              initialTime={whiteTime}
              isActive={gameStarted && !isGameOver && game.turn() === "w"}
              color="w"
              onTimeout={() => setTimeoutWinner("b")}
            />
          </div>

          {/* Right side - Info */}
          <div className="flex flex-col gap-4 w-full lg:w-72">
            <GameStatus game={game} timeoutWinner={timeoutWinner} />
            <MoveHistory history={moveHistory} />
            {isGameOver && (
              <Button onClick={handleReset} className="w-full animate-pulse-glow">
                New Game
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
