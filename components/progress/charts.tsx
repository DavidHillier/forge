"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyCharts({ data }: { data: { week: string; sessions: number; effort: number }[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-64 rounded-lg border border-[#E4DCCB] bg-[#FBF8F1] p-4">
        <p className="mb-3 text-sm font-semibold">Weekly completion</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid stroke="#E4DCCB" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="sessions" fill="#0F4A32" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64 rounded-lg border border-[#E4DCCB] bg-[#FBF8F1] p-4">
        <p className="mb-3 text-sm font-semibold">Intensity trend</p>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <CartesianGrid stroke="#E4DCCB" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Area dataKey="effort" stroke="#B9903D" fill="#C9A24D" fillOpacity={0.28} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
