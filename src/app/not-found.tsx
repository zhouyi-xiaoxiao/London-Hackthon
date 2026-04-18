import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-6">
      <p className="font-mono text-xs text-magenta uppercase tracking-widest mb-4">404</p>
      <h1 className="font-condensed text-6xl md:text-9xl font-black uppercase text-chalk mb-6">
        Cut Not Found
      </h1>
      <p className="font-mono text-sm text-chalk/40 mb-10 text-center max-w-sm">
        This cut doesn't exist—or hasn't been developed yet.
      </p>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest border border-neon text-neon px-8 py-3 hover:bg-neon hover:text-void transition-all duration-200"
      >
        Back to the City
      </Link>
    </div>
  );
}
