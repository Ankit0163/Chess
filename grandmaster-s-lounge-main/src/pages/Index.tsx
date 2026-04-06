import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Swords, History, Trophy, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="animate-fade-in text-center max-w-2xl">
          <div className="text-6xl sm:text-7xl mb-6">♔</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient">Chess</span>
            <span className="text-foreground">Master</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-md mx-auto">
            A premium chess experience. Play locally, sharpen your strategy.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/game")}
            className="text-lg px-8 py-6 rounded-xl glow-primary animate-scale-in gap-2"
          >
            <Swords className="w-5 h-5" />
            Start New Game
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full animate-fade-in">
          {[
            {
              icon: <Swords className="w-6 h-6 text-primary" />,
              title: "Local PvP",
              desc: "Play against a friend on the same device",
            },
            {
              icon: <History className="w-6 h-6 text-primary" />,
              title: "Full Rules",
              desc: "Castling, en passant, promotion & more",
            },
            {
              icon: <Trophy className="w-6 h-6 text-primary" />,
              title: "Game Timer",
              desc: "10-minute timer per player",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass p-5 hover:border-primary/30 transition-all duration-300 group cursor-default"
            >
              <div className="mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        Built with ♟ chess.js
      </footer>
    </div>
  );
};

export default Index;
