import { useQuery } from "@tanstack/react-query";
import KpiCards from "@/components/dashboard/kpi-cards";
import TrafficChart from "@/components/dashboard/traffic-chart";
import SystemHealth from "@/components/dashboard/system-health";
import RecentAlerts from "@/components/dashboard/recent-alerts";
import RiskAssets from "@/components/dashboard/risk-assets";

export default function Dashboard() {
  const { data: systemMetrics } = useQuery({
    queryKey: ["/api/system-metrics"],
  });

  const { data: trafficData } = useQuery({
    queryKey: ["/api/traffic-data"],
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">系统概览仪表盘</h1>
        <p className="text-carbon-gray-70">实时监控网络安全态势和系统运行状况</p>
      </div>

      {/* KPI Cards */}
      <KpiCards metrics={systemMetrics} />

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Traffic Chart */}
        <div className="lg:col-span-2">
          <TrafficChart data={trafficData} />
        </div>
        
        {/* System Health */}
        <SystemHealth />
      </div>

      {/* Alerts and Risk Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts alerts={alerts} />
        <RiskAssets users={users} />
      </div>
    </div>
  );
}
