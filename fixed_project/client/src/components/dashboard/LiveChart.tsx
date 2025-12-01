import { SensorData } from "@/lib/vehicleService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LiveChartProps {
  data: SensorData[];
}

export function LiveChart({ data }: LiveChartProps) {
  // Format data for chart (last 20 points for clarity)
  const chartData = data.slice(-20).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
    speed: d.speed,
    acceleration: d.acceleration * 10, // Scale up for visibility against speed
    braking: d.braking * 10,
  }));

  return (
    <div className="glass-panel p-4 rounded-xl h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Live Telemetry</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Speed (km/h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Accel (x10)</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="acceleration" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
