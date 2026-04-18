export default function Loading() {
  return (
    <div className="min-h-screen bg-void pt-14 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-neon animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-neon uppercase tracking-widest">Loading cut...</p>
      </div>
    </div>
  );
}
