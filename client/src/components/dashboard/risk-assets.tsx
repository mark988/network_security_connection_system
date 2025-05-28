import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, User, Monitor } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface RiskAssetsProps {
  users?: UserType[];
}

export default function RiskAssets({ users }: RiskAssetsProps) {
  // Mock data for demonstration
  const mockAssets = [
    {
      id: "srv-web-01",
      name: "srv-web-01",
      type: "server",
      identifier: "192.168.1.10",
      riskLevel: "high",
    },
    {
      id: "admin",
      name: "admin",
      type: "user",
      identifier: "特权账户",
      riskLevel: "medium",
    },
    {
      id: "laptop-user123",
      name: "LAPTOP-USER123",
      type: "device",
      identifier: "192.168.1.45",
      riskLevel: "high",
    },
  ];

  // Transform users data to risk assets format
  const userAssets = users?.filter(user => user.riskScore !== undefined && user.riskScore <= 60)
    .slice(0, 3)
    .map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      type: "user",
      identifier: user.email || "",
      riskLevel: user.riskScore! <= 30 ? "high" : "medium",
    })) || [];

  const riskAssets = userAssets.length > 0 ? userAssets : mockAssets;

  const getIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="w-5 h-5" />;
      case "user":
        return <User className="w-5 h-5" />;
      case "device":
        return <Monitor className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getIconColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-carbon-red";
      case "medium":
        return "text-carbon-yellow";
      case "low":
        return "text-carbon-green";
      default:
        return "text-gray-500";
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">高风险</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">中风险</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">低风险</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>高风险资产</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {riskAssets.length === 0 ? (
            <div className="text-center py-8 text-carbon-gray-70">
              暂无高风险资产
            </div>
          ) : (
            riskAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className={getIconColor(asset.riskLevel)}>
                    {getIcon(asset.type)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {asset.name}
                    </p>
                    <p className="text-xs text-carbon-gray-70">
                      {asset.identifier}
                    </p>
                  </div>
                </div>
                {getRiskBadge(asset.riskLevel)}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
