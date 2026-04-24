import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "gold-gradient text-white hover:brightness-95",
        variant === "secondary" && "bg-[#0F4A32] text-white hover:bg-[#073B29]",
        variant === "ghost" && "border border-[#E4DCCB] bg-[#FBF8F1] text-[#10251D] hover:bg-[#F7F3EA]",
        variant === "danger" && "bg-[#B94A48] text-white hover:brightness-95",
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonProps["variant"] }) {
  return (
    <Link
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-semibold transition",
        variant === "primary" && "gold-gradient text-white hover:brightness-95",
        variant === "secondary" && "bg-[#0F4A32] text-white hover:bg-[#073B29]",
        variant === "ghost" && "border border-[#E4DCCB] bg-[#FBF8F1] text-[#10251D] hover:bg-[#F7F3EA]",
        variant === "danger" && "bg-[#B94A48] text-white hover:brightness-95",
        className,
      )}
      {...props}
    />
  );
}
