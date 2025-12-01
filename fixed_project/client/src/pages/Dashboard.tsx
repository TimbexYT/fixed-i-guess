import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { LiveChart } from "@/components/dashboard/LiveChart";
import { useVehicleData } from "@/lib/vehicleService";
import { Gauge, Zap, AlertTriangle, Activity, Disc, CornerUpRight } from "lucide-react";

export default function Dashboard() {
  const { data, history, alerts } = useVehicleData();

  return (
    <DashboardLayout>
      {!data ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <Activity className="h-16 w-16 mx-auto text-primary" />
            </div>
            <p className="text-muted-foreground">Waiting for sensor data...</p>
            <p className="text-sm text-muted-foreground/70">Connect your device or check the Device Guide</p>
          </div>
        </div>
      ) : (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Mission Control</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Connection
          </div>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            title="Speed" 
            value={Math.round(data.speed)} 
            unit="km/h" 
            icon={Gauge} 
            status={data.speed > 120 ? "critical" : "normal"}
          />
          <StatCard 
            title="Acceleration" 
            value={data.acceleration.toFixed(1)} 
            unit="m/s²" 
            icon={Zap}
            status={data.acceleration > 4 ? "warning" : "normal"}
          />
          <StatCard 
            title="Braking" 
            value={data.braking.toFixed(1)} 
            unit="m/s²" 
            icon={Disc}
            status={data.braking > 4 ? "warning" : "normal"}
          />
          <StatCard 
            title="Tilt Angle" 
            value={data.tilt.toFixed(1)} 
            unit="°" 
            icon={Activity}
            status={Math.abs(data.tilt) > 45 ? "critical" : "normal"}
          />
          <StatCard 
            title="Rotation" 
            value={Math.abs(data.rotationRate).toFixed(1)} 
            unit="°/s" 
            icon={CornerUpRight}
            status={Math.abs(data.rotationRate) > 35 ? "warning" : "normal"}
          />
          <StatCard 
            title="Status" 
            value={data.isCrash ? "CRASH" : "OK"} 
            unit="" 
            icon={AlertTriangle}
            status={data.isCrash ? "critical" : "normal"}
          />
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          <div className="lg:col-span-2">
            <LiveChart data={history} />
          </div>
          <div>
            <AlertFeed alerts={alerts} />
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}
