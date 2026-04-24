import { saveReadinessAction } from "@/lib/actions/app-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const groups = [
  { name: "sleepQuality", label: "Sleep quality", options: [["poor", "Poor"], ["ok", "OK"], ["good", "Good"]] },
  { name: "soreness", label: "Soreness", options: [["low", "Low"], ["medium", "Med"], ["high", "High"]] },
  { name: "energyLevel", label: "Energy level", options: [["low", "Low"], ["medium", "Med"], ["high", "High"]] },
  { name: "timeAvailable", label: "Time available", options: [["10", "10 min"], ["20", "20 min"], ["30", "30+ min"]] },
];

export function ReadinessForm({ workoutId }: { workoutId: string }) {
  return (
    <form action={saveReadinessAction} className="grid gap-4">
      <input type="hidden" name="workoutId" value={workoutId} />
      {groups.map((group) => (
        <Card key={group.name} className="p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6B756F]">{group.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {group.options.map(([value, label], index) => (
              <label key={value} className="cursor-pointer">
                <input className="peer sr-only" name={group.name} value={value} type="radio" required defaultChecked={index === 1} />
                <span className="block rounded-md border border-[#E4DCCB] bg-[#F7F3EA] px-3 py-2 text-center text-sm peer-checked:border-[#0F4A32] peer-checked:bg-[#0F4A32] peer-checked:text-white">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </Card>
      ))}
      <Button>Continue</Button>
    </form>
  );
}
