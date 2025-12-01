import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Save, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_THRESHOLDS = {
  maxSpeed: 120,
  accelThreshold: 4,
  brakingThreshold: 4,
  tiltThreshold: 45,
  turnThreshold: 35,
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_THRESHOLDS);
  const { toast } = useToast();

  const handleChange = (key: keyof typeof DEFAULT_THRESHOLDS, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "New alert thresholds have been applied successfully.",
      variant: "default"
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alert Settings</h2>
          <p className="text-muted-foreground">Configure safety thresholds and triggers</p>
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Max Speed Limit (km/h)</label>
              <p className="text-xs text-muted-foreground">Triggers "Over Speed" alert when exceeded.</p>
              <input 
                type="number" 
                value={settings.maxSpeed}
                onChange={(e) => handleChange('maxSpeed', e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Acceleration Threshold (m/s²)</label>
              <p className="text-xs text-muted-foreground">Sensitivity for "Sudden Acceleration" detection.</p>
              <input 
                type="number" 
                value={settings.accelThreshold}
                onChange={(e) => handleChange('accelThreshold', e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Braking Threshold (m/s²)</label>
              <p className="text-xs text-muted-foreground">Sensitivity for "Sudden Braking" detection.</p>
              <input 
                type="number" 
                value={settings.brakingThreshold}
                onChange={(e) => handleChange('brakingThreshold', e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Tilt Threshold (degrees)</label>
              <p className="text-xs text-muted-foreground">Maximum safe tilt angle before alert.</p>
              <input 
                type="number" 
                value={settings.tiltThreshold}
                onChange={(e) => handleChange('tiltThreshold', e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Sharp Turn Threshold (deg/s)</label>
              <p className="text-xs text-muted-foreground">Sensitivity for aggressive turning detection.</p>
              <input 
                type="number" 
                value={settings.turnThreshold}
                onChange={(e) => handleChange('turnThreshold', e.target.value)}
                className="bg-secondary/50 border border-border rounded-lg p-2.5 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button 
              onClick={() => setSettings(DEFAULT_THRESHOLDS)}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Device Integration Guide */}
        <div className="glass-panel p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Device Integration
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              To connect your science project (Arduino/ESP32/Raspberry Pi), send a POST request to the endpoint below.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">API Endpoint</label>
              <div className="bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-xs text-primary select-all">
                POST /api/telemetry
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Required JSON Format</label>
              <pre className="bg-black/40 border border-white/10 rounded-lg p-3 font-mono text-xs text-muted-foreground overflow-x-auto">
{`{
  "speed": 45.5,        // float (km/h)
  "acceleration": 1.2,  // float (m/s²)
  "braking": 0.0,      // float (m/s²)
  "tilt": 2.5,         // float (degrees)
  "rotationRate": 0.5, // float (degrees/s)
  "isCrash": false     // boolean
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
