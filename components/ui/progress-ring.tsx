export function ProgressRing({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="grid size-24 place-items-center rounded-full"
      style={{ background: `conic-gradient(#0F4A32 ${clamped}%, #E4DCCB 0)` }}
    >
      <div className="grid size-20 place-items-center rounded-full bg-[#FBF8F1] text-center">
        <div>
          <div className="font-[var(--font-display)] text-3xl font-semibold text-[#0F4A32]">{clamped}%</div>
          {label ? <div className="text-[10px] font-bold uppercase text-[#6B756F]">{label}</div> : null}
        </div>
      </div>
    </div>
  );
}
