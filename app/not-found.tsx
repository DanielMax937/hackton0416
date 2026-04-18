import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="glass-panel w-full max-w-md rounded-sm px-10 py-14 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-zen-muted">
          404
        </p>
        <div className="zen-rule mx-auto mt-6 max-w-[8rem]" aria-hidden />
        <h1 className="mt-8 text-2xl font-light tracking-tight text-foreground">
          This coordinate is empty
        </h1>
        <p className="mt-4 text-sm leading-relaxed tracking-wide text-zen-muted">
          The path does not resolve in this space. Return to the known grid.
        </p>
        <Link
          href="/"
          className="zen-link mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}
