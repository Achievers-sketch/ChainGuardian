'use client';

import { TrendingUp } from 'lucide-react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { IoTSensorReading } from '@/lib/types';

type TemperatureChartProps = {
  readings: IoTSensorReading[];
  minTemp: number;
  maxTemp: number;
};

export default function TemperatureChart({ readings, minTemp, maxTemp }: TemperatureChartProps) {
  const chartConfig = {
    temperature: {
      label: 'Temperature (°C)',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={readings} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} unit="°C" />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ReferenceLine y={maxTemp} label={{ value: `Max: ${maxTemp}°C`, position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
          <ReferenceLine y={minTemp} label={{ value: `Min: ${minTemp}°C`, position: 'insideBottomRight', fill: 'hsl(var(--destructive))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              if (payload.temperature > maxTemp || payload.temperature < minTemp) {
                return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--destructive))" stroke="hsl(var(--destructive))" strokeWidth={2} />;
              }
              return <circle cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth={2} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
