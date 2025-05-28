import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import ForgotPassword from "@/pages/forgot-password";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Identity from "@/pages/identity";
import Policies from "@/pages/policies";
import Alerts from "@/pages/alerts";
import Topology from "@/pages/topology";
import UserProfile from "@/pages/user-profile";
import ChangePassword from "@/pages/change-password";
import SystemHealth from "@/pages/system-health";
import LoginLogs from "@/pages/login-logs";
import OperationLogs from "@/pages/operation-logs";
import SystemLogs from "@/pages/system-logs";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen flex bg-carbon-gray-10">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/users" component={Users} />
            <Route path="/identity" component={Identity} />
            <Route path="/policies" component={Policies} />
            <Route path="/alerts" component={Alerts} />
            <Route path="/topology" component={Topology} />
            <Route path="/user-profile" component={UserProfile} />
            <Route path="/change-password" component={ChangePassword} />
            <Route path="/system/health" component={SystemHealth} />
            <Route path="/system/logs/login" component={LoginLogs} />
            <Route path="/system/logs/operation" component={OperationLogs} />
            <Route path="/system/logs/system" component={SystemLogs} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
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
