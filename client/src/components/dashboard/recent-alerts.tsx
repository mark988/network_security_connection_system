import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExclamationCircleIcon, ExclamationTriangleIcon, BugAntIcon } from "@heroicons/react/24/outline";
import type { Alert } from "@shared/schema";

interface RecentAlertsProps {
  alerts?: Alert[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  // Enhanced mock alert data
  const mockAlerts = [
    {
      id: 1,
      severity: "critical",
      title: "暴力破解攻击检测",
      sourceIp: "203.124.45.67",
      targetService: "SSH服务",
      createdAt: new Date(Date.now() - 3 * 60 * 1000),
      type: "brute_force",
    },
    {
      id: 2,
      severity: "high",
      title: "异常数据传输",
      sourceUser: "SRV-WEB-02",
      targetIp: "外部服务器",
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      type: "data_exfiltration",
    },
    {
      id: 3,
      severity: "critical",
      title: "恶意软件活动",
      sourceIp: "WKS-DEV-015",
      targetService: "文件系统",
      createdAt: new Date(Date.now() - 12 * 60 * 1000),
      type: "malware",
    },
    {
      id: 4,
      severity: "medium",
      title: "访问策略违规",
      sourceUser: "财务系统用户",
      targetService: "核心数据库",
      createdAt: new Date(Date.now() - 25 * 60 * 1000),
      type: "policy_violation",
    },
    {
      id: 5,
      severity: "high",
      title: "DDoS攻击尝试",
      sourceIp: "多个IP地址",
      targetService: "Web服务",
      createdAt: new Date(Date.now() - 35 * 60 * 1000),
      type: "ddos",
    },
  ];

  const recentAlerts = (alerts && alerts.length > 0) ? alerts.slice(0, 5) : mockAlerts.slice(0, 3);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <ExclamationCircleIcon className="w-5 h-5 text-carbon-red" />;
      case "high":
        return <ExclamationTriangleIcon className="w-5 h-5 text-carbon-red" />;
      case "medium":
        return <ExclamationTriangleIcon className="w-5 h-5 text-carbon-yellow" />;
      default:
        return <BugAntIcon className="w-5 h-5 text-carbon-red" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "border-carbon-red bg-red-50";
      case "medium":
        return "border-carbon-yellow bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>最新安全告警</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-carbon-gray-70">
              暂无安全告警
            </div>
          ) : (
            recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-center p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </p>
                  <p className="text-xs text-carbon-gray-70">
                    来源: {(alert as any).sourceIp || (alert as any).sourceUser || alert.sourceIp} | {getTimeAgo(new Date(alert.createdAt!))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
