"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { currency } from "@/lib/utils";

export function WealthChart({ data }: { data: { year: number; wealth: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="wealth" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tickFormatter={(year) => `${year}a`} stroke="hsl(var(--muted-foreground))" />
          <YAxis tickFormatter={(value) => currency(Number(value)).replace("R$", "")} stroke="hsl(var(--muted-foreground))" />
          <Tooltip formatter={(value) => currency(Number(value))} labelFormatter={(value) => `${value} anos`} />
          <Area type="monotone" dataKey="wealth" stroke="hsl(var(--primary))" fill="url(#wealth)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScenarioChart({ data }: { data: { name: string; roi: number; score: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="score" name="Nota" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          <Bar dataKey="roi" name="ROI x100" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
