import DashboardLayout from "@/components/layout/DashboardLayout";
import { useVehicleData, Alert } from "@/lib/vehicleService";
import { format } from "date-fns";
import { AlertOctagon, AlertTriangle, Zap, Activity, Search, CornerUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Alerts() {
  const { alerts } = useVehicleData();
  const [filter, setFilter] = useState<string>("all");

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'Crash Detection': return AlertOctagon;
      case 'Tilt Alert': return AlertTriangle;
      case 'Over Speed': return Zap;
      case 'Sharp Turn': return CornerUpRight;
      default: return Activity;
    }
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(a => a.severity.toLowerCase() === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Alerts</h2>
            <p className="text-muted-foreground">Real-time safety notifications log</p>
          </div>
          
          <div className="flex items-center bg-card border border-border rounded-lg p-1">
            <button 
              onClick={() => setFilter("all")}
              className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("high")}
              className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === "high" ? "bg-warning text-warning-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              High
            </button>
            <button 
              onClick={() => setFilter("critical")}
              className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === "critical" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Critical
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No alerts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => {
                    const Icon = getIcon(alert.type);
                    return (
                      <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <Icon className={cn(
                            "h-4 w-4",
                            alert.severity === 'Critical' ? "text-destructive" : "text-warning"
                          )} />
                          {alert.type}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{alert.message}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            alert.severity === 'Critical' 
                              ? "bg-destructive/10 text-destructive border-destructive/20" 
                              : "bg-warning/10 text-warning border-warning/20"
                          )}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {alert.value} {alert.unit}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground tabular-nums">
                          {format(alert.timestamp, 'MMM dd, HH:mm:ss')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
