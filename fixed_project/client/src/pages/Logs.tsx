import DashboardLayout from "@/components/layout/DashboardLayout";
import { useVehicleData } from "@/lib/vehicleService";
import { format } from "date-fns";

export default function Logs() {
  const { history } = useVehicleData();
  // Reverse history to show newest first
  const logs = [...history].reverse();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Logs</h2>
          <p className="text-muted-foreground">Raw telemetry data stream</p>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left font-mono">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 font-sans">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Speed (km/h)</th>
                  <th className="px-6 py-3">Accel (m/s²)</th>
                  <th className="px-6 py-3">Braking (m/s²)</th>
                  <th className="px-6 py-3">Tilt (°)</th>
                  <th className="px-6 py-3">Rotation (°/s)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log, i) => (
                  <tr key={log.timestamp + i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 text-muted-foreground">
                      {format(log.timestamp, 'yyyy-MM-dd HH:mm:ss.SSS')}
                    </td>
                    <td className="px-6 py-3 text-primary">{Math.round(log.speed)}</td>
                    <td className="px-6 py-3">{log.acceleration.toFixed(2)}</td>
                    <td className="px-6 py-3">{log.braking.toFixed(2)}</td>
                    <td className="px-6 py-3">{log.tilt.toFixed(2)}</td>
                    <td className="px-6 py-3">{log.rotationRate.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      {log.isCrash ? (
                        <span className="text-destructive font-bold">CRASH DETECTED</span>
                      ) : (
                        <span className="text-green-500 opacity-50">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
