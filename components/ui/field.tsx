export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#10251D]">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-12 rounded-md border border-[#E4DCCB] bg-[#FBF8F1] px-3 text-sm text-[#10251D] outline-none ring-[#C9A24D]/30 transition focus:ring-4";
