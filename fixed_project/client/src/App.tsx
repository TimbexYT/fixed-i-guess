import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Alerts from "@/pages/Alerts";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Logs from "@/pages/Logs";
import DeviceGuide from "@/pages/DeviceGuide";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route path="/logs" component={Logs} />
      <Route path="/device-guide" component={DeviceGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
