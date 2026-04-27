"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LevelChart({ data }: { data: { level: string; clean: number; failed: number }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-64 rounded-lg border border-[#E4DCCB] bg-[#FBF8F1] p-4">
        <p className="mb-1 text-sm font-semibold">Circuits per level</p>
        <p className="mb-3 text-xs text-[#6B756F]">Green = passed · Red = failed</p>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} barSize={14}>
            <CartesianGrid stroke="#E4DCCB" vertical={false} />
            <XAxis dataKey="level" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, name) => [value, name === "clean" ? "Passed" : "Failed"]}
              labelFormatter={(l) => `Level ${l.replace("L", "")}`}
            />
            <Bar dataKey="clean" stackId="a" fill="#0F4A32" radius={[0, 0, 0, 0]} name="clean" />
            <Bar dataKey="failed" stackId="a" fill="#B94A48" radius={[4, 4, 0, 0]} name="failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
