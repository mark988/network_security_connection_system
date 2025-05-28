import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemHealth() {
  const healthItems = [
    { name: "策略引擎", status: "normal", color: "bg-carbon-green" },
    { name: "日志服务器", status: "normal", color: "bg-carbon-green" },
    { name: "认证服务", status: "warning", color: "bg-carbon-yellow" },
    { name: "数据库", status: "normal", color: "bg-carbon-green" },
    { name: "网络网关", status: "normal", color: "bg-carbon-green" },
    { name: "监控系统", status: "normal", color: "bg-carbon-green" },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case "normal": return "正常";
      case "warning": return "警告";
      case "error": return "异常";
      default: return "未知";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>系统健康状态</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-carbon-gray-70">
                {item.name}
              </span>
              <div className="flex items-center">
                <div className={`w-2 h-2 ${item.color} rounded-full mr-2`}></div>
                <span className="text-sm text-gray-900">
                  {getStatusText(item.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-carbon-gray-70">系统整体健康度</span>
              <span className="font-medium text-carbon-green">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-carbon-green h-2 rounded-full" style={{ width: "95%" }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
