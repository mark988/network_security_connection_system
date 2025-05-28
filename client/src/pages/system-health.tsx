import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Network,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function SystemHealth() {
  // CPU使用率数据
  const cpuData = [
    { time: "00:00", usage: 45 },
    { time: "04:00", usage: 35 },
    { time: "08:00", usage: 68 },
    { time: "12:00", usage: 78 },
    { time: "16:00", usage: 82 },
    { time: "20:00", usage: 65 },
    { time: "24:00", usage: 45 }
  ];

  // 内存使用率数据
  const memoryData = [
    { time: "00:00", used: 4.2, total: 16 },
    { time: "04:00", used: 3.8, total: 16 },
    { time: "08:00", used: 6.5, total: 16 },
    { time: "12:00", used: 8.2, total: 16 },
    { time: "16:00", used: 9.1, total: 16 },
    { time: "20:00", used: 7.3, total: 16 },
    { time: "24:00", used: 5.1, total: 16 }
  ];

  // 网络流量数据
  const networkData = [
    { time: "00:00", inbound: 120, outbound: 80 },
    { time: "04:00", inbound: 95, outbound: 65 },
    { time: "08:00", inbound: 350, outbound: 280 },
    { time: "12:00", inbound: 480, outbound: 320 },
    { time: "16:00", inbound: 520, outbound: 380 },
    { time: "20:00", inbound: 380, outbound: 250 },
    { time: "24:00", inbound: 200, outbound: 150 }
  ];

  // 磁盘使用分布
  const diskData = [
    { name: "系统盘", value: 35, color: "#3B82F6" },
    { name: "数据盘", value: 45, color: "#10B981" },
    { name: "日志盘", value: 25, color: "#F59E0B" },
    { name: "备份盘", value: 15, color: "#EF4444" }
  ];

  // 服务状态数据
  const serviceData = [
    { name: "Web服务", status: "运行中", uptime: 99.9 },
    { name: "数据库", status: "运行中", uptime: 99.8 },
    { name: "缓存服务", status: "运行中", uptime: 99.5 },
    { name: "消息队列", status: "运行中", uptime: 98.9 },
    { name: "文件服务", status: "警告", uptime: 95.2 },
    { name: "监控服务", status: "运行中", uptime: 99.7 }
  ];

  // 响应时间趋势
  const responseTimeData = [
    { time: "00:00", api: 120, database: 45, cache: 8 },
    { time: "04:00", api: 95, database: 38, cache: 6 },
    { time: "08:00", api: 180, database: 65, cache: 12 },
    { time: "12:00", api: 220, database: 78, cache: 15 },
    { time: "16:00", api: 250, database: 85, cache: 18 },
    { time: "20:00", api: 190, database: 62, cache: 11 },
    { time: "24:00", api: 130, database: 48, cache: 9 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "运行中": return "bg-green-100 text-green-800";
      case "警告": return "bg-yellow-100 text-yellow-800";
      case "错误": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold + 5) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < threshold - 5) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统健康监控</h1>
          <p className="text-gray-600 mt-1">实时监控平台运行状态和性能指标</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-600">系统正常运行</span>
        </div>
      </div>

      {/* 核心指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU使用率</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-gray-900">68%</span>
                  {getTrendIcon(68, 60)}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={68} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">内存使用率</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-gray-900">57%</span>
                  {getTrendIcon(57, 50)}
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={57} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">磁盘使用率</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-gray-900">43%</span>
                  {getTrendIcon(43, 40)}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <HardDrive className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <Progress value={43} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">网络负载</p>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-gray-900">32%</span>
                  {getTrendIcon(32, 30)}
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Progress value={32} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU使用率趋势 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              CPU使用率趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'CPU使用率']} />
                <Area 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 内存使用趋势 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              内存使用趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 16]} />
                <Tooltip formatter={(value) => [`${value}GB`, '已使用内存']} />
                <Area 
                  type="monotone" 
                  dataKey="used" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 网络流量 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="h-5 w-5 mr-2" />
              网络流量监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}MB/s`]} />
                <Legend />
                <Bar dataKey="inbound" fill="#3B82F6" name="入站流量" />
                <Bar dataKey="outbound" fill="#10B981" name="出站流量" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 磁盘使用分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="h-5 w-5 mr-2" />
              磁盘使用分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {diskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '使用率']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 响应时间趋势 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              响应时间趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}ms`]} />
                <Legend />
                <Line type="monotone" dataKey="api" stroke="#3B82F6" name="API响应" />
                <Line type="monotone" dataKey="database" stroke="#10B981" name="数据库" />
                <Line type="monotone" dataKey="cache" stroke="#F59E0B" name="缓存" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 服务状态监控 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              服务状态监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceData.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">{service.name}</span>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.uptime}%</p>
                    <p className="text-xs text-gray-500">可用性</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系统警告和建议 */}
      <Card>
        <CardHeader>
          <CardTitle>系统建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">性能警告</h4>
              <p className="text-sm text-yellow-700">CPU使用率持续偏高，建议优化应用程序或增加服务器资源</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">优化建议</h4>
              <p className="text-sm text-blue-700">内存使用稳定，可考虑启用更多缓存策略提升性能</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">系统状态</h4>
              <p className="text-sm text-green-700">网络和磁盘运行良好，整体系统健康状况优秀</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}