import { Link, useLocation } from "wouter";
import { LayoutDashboard, Bell, Activity, Settings, FileText, Car, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import bgImage from "@assets/generated_images/abstract_dark_technology_background_with_digital_grid_lines.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/analytics", label: "Analytics", icon: Activity },
    { href: "/logs", label: "System Logs", icon: FileText },
    { href: "/device-guide", label: "Device Guide", icon: Cpu },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl z-10 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">VehicleMon</h1>
            <p className="text-xs text-muted-foreground">Fleet Safety System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-panel p-3 rounded-lg flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                System Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
