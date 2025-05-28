import { Card, CardContent } from "@/components/ui/card";
import { Link2, Users, Shield, AlertTriangle } from "lucide-react";
import type { SystemMetrics } from "@shared/schema";

interface KpiCardsProps {
  metrics?: SystemMetrics;
}

export default function KpiCards({ metrics }: KpiCardsProps) {
  const defaultMetrics = {
    activeConnections: 12847,
    authenticatedUsers: 8934,
    threatsBlocked: 247,
    policyViolations: 89,
  };

  const data = metrics || defaultMetrics;

  const cards = [
    {
      title: "活跃连接数",
      value: data.activeConnections.toLocaleString(),
      icon: Link2,
      iconColor: "text-carbon-blue",
      change: "+5.2%",
      changeType: "positive" as const,
    },
    {
      title: "认证用户总数",
      value: data.authenticatedUsers.toLocaleString(),
      icon: Users,
      iconColor: "text-carbon-green",
      change: "+2.1%",
      changeType: "positive" as const,
    },
    {
      title: "阻断威胁数",
      value: data.threatsBlocked.toLocaleString(),
      icon: Shield,
      iconColor: "text-carbon-red",
      change: "+15.3%",
      changeType: "warning" as const,
    },
    {
      title: "策略违规事件",
      value: data.policyViolations.toLocaleString(),
      icon: AlertTriangle,
      iconColor: "text-carbon-yellow",
      change: "-8.7%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon className={`h-8 w-8 ${card.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-carbon-gray-70">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span 
                className={`text-sm ${
                  card.changeType === "positive" 
                    ? "text-carbon-green" 
                    : card.changeType === "warning"
                    ? "text-carbon-red"
                    : "text-carbon-yellow"
                }`}
              >
                {card.change}
              </span>
              <span className="text-sm text-carbon-gray-70 ml-1">
                vs 昨日
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
