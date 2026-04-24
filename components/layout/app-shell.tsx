import Link from "next/link";
import { CalendarCheck, ChartNoAxesColumnIncreasing, Dumbbell, Settings } from "lucide-react";
import { Crest } from "@/components/brand/crest";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/today", label: "Today", icon: CalendarCheck },
  { href: "/app/programme", label: "Programme", icon: Dumbbell },
  { href: "/app/progress", label: "Progress", icon: ChartNoAxesColumnIncreasing },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, active }: { children: React.ReactNode; active: string }) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-[#E4DCCB] bg-[#FBF8F1]/95 p-5 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <Crest compact />
          <div>
            <p className="font-[var(--font-display)] text-2xl font-semibold">Forge</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#6B756F]">9-week system</p>
          </div>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-[#6B756F]",
                active === item.label && "bg-[#0F4A32] text-white",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto max-w-6xl px-4 py-5 lg:ml-64 lg:px-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#E4DCCB] bg-[#073B29] px-2 py-2 text-white lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("grid justify-items-center gap-1 rounded-md py-2 text-[11px] text-[#F7F3EA]/70", active === item.label && "text-[#C9A24D]")}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
