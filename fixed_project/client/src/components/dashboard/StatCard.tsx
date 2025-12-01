import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ title, value, unit, icon: Icon, status = "normal", trend, trendValue }: StatCardProps) {
  return (
    <div className={cn(
      "glass-card p-6 rounded-xl relative overflow-hidden group",
      status === "critical" && "border-destructive/50 bg-destructive/10",
      status === "warning" && "border-warning/50 bg-warning/10"
    )}>
      {/* Background glow effect */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 transition-all duration-500",
        status === "normal" ? "bg-primary" : 
        status === "warning" ? "bg-warning" : "bg-destructive"
      )} />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-3xl font-bold font-mono tracking-tight",
              status === "critical" && "text-destructive text-glow-danger",
              status === "warning" && "text-warning",
              status === "normal" && "text-foreground"
            )}>
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground font-medium">{unit}</span>}
          </div>
        </div>
        <div className={cn(
          "p-2.5 rounded-lg border backdrop-blur-md transition-colors",
          status === "critical" ? "bg-destructive/20 border-destructive/30 text-destructive" :
          status === "warning" ? "bg-warning/20 border-warning/30 text-warning" :
          "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
          {trend === "up" && <span className="text-destructive">↑ Rising</span>}
          {trend === "down" && <span className="text-success">↓ Falling</span>}
          {trendValue && <span className="text-muted-foreground">{trendValue}</span>}
        </div>
      )}
    </div>
  );
}
