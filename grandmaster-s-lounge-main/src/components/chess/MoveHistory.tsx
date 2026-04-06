import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  history: string[];
}

const MoveHistory = ({ history }: MoveHistoryProps) => {
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push([history[i], history[i + 1]]);
  }

  return (
    <div className="glass p-4 h-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Moves</h3>
      <ScrollArea className="h-64 lg:h-80">
        {pairs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No moves yet</p>
        ) : (
          <div className="space-y-1">
            {pairs.map(([white, black], i) => (
              <div key={i} className="flex gap-2 text-sm font-mono">
                <span className="text-muted-foreground w-8">{i + 1}.</span>
                <span className="w-16 font-medium">{white}</span>
                <span className="w-16 text-muted-foreground">{black || ""}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MoveHistory;
