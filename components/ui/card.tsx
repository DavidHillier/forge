import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("forge-card rounded-lg p-5", className)} {...props} />;
}

export function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div className="space-y-1">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9903D]">{eyebrow}</p> : null}
      <h1 className="font-[var(--font-display)] text-3xl font-semibold leading-tight text-[#10251D]">{title}</h1>
      {body ? <p className="max-w-2xl text-sm leading-6 text-[#6B756F]">{body}</p> : null}
    </div>
  );
}
