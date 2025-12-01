import { Alert } from "@/lib/vehicleService";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertOctagon, Activity, Zap, CornerUpRight } from "lucide-react";
import { format } from "date-fns";

interface AlertFeedProps {
  alerts: Alert[];
}

export function AlertFeed({ alerts }: AlertFeedProps) {
  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'Crash Detection': return AlertOctagon;
      case 'Tilt Alert': return AlertTriangle;
      case 'Over Speed': return Zap;
      case 'Sharp Turn': return CornerUpRight;
      default: return Activity;
    }
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Recent Alerts</h3>
        <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium border border-destructive/20 animate-pulse">
          Live
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
            <Activity className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <div 
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border flex items-start gap-3 transition-all animate-in slide-in-from-left-2",
                  alert.severity === 'Critical' 
                    ? "bg-destructive/10 border-destructive/20 hover:bg-destructive/15" 
                    : "bg-warning/5 border-warning/10 hover:bg-warning/10"
                )}
              >
                <div className={cn(
                  "p-2 rounded-md shrink-0",
                  alert.severity === 'Critical' ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className={cn(
                      "text-sm font-medium truncate",
                      alert.severity === 'Critical' ? "text-destructive" : "text-warning"
                    )}>
                      {alert.type}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {format(alert.timestamp, 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs font-mono mt-1 opacity-70">
                    Value: {alert.value} {alert.unit}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
