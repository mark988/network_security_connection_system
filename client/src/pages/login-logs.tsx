import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, Search, Download, Filter, MapPin, Clock, User, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function LoginLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 模拟登录日志数据
  const loginLogs = [
    {
      id: 1,
      username: "admin",
      email: "admin@company.com",
      loginTime: "2025-05-28 07:30:15",
      ipAddress: "192.168.1.100",
      location: "北京, 中国",
      device: "Chrome 120.0 on Windows 10",
      status: "成功",
      sessionDuration: "2小时15分",
      logoutTime: "2025-05-28 09:45:20"
    },
    {
      id: 2,
      username: "zhang.san",
      email: "zhang.san@company.com",
      loginTime: "2025-05-28 06:45:32",
      ipAddress: "192.168.1.101",
      location: "上海, 中国",
      device: "Firefox 119.0 on macOS",
      status: "成功",
      sessionDuration: "3小时22分",
      logoutTime: "2025-05-28 10:07:45"
    },
    {
      id: 3,
      username: "li.si",
      email: "li.si@company.com",
      loginTime: "2025-05-28 06:20:08",
      ipAddress: "203.208.60.1",
      location: "广州, 中国",
      device: "Chrome 120.0 on Android",
      status: "失败",
      sessionDuration: "-",
      logoutTime: "-",
      failReason: "密码错误"
    },
    {
      id: 4,
      username: "wang.wu",
      email: "wang.wu@company.com",
      loginTime: "2025-05-28 05:55:42",
      ipAddress: "192.168.1.102",
      location: "深圳, 中国",
      device: "Safari 17.0 on iPhone",
      status: "成功",
      sessionDuration: "1小时35分",
      logoutTime: "2025-05-28 07:30:15"
    },
    {
      id: 5,
      username: "zhao.liu",
      email: "zhao.liu@company.com",
      loginTime: "2025-05-28 05:30:18",
      ipAddress: "10.0.0.50",
      location: "杭州, 中国",
      device: "Edge 119.0 on Windows 11",
      status: "失败",
      sessionDuration: "-",
      logoutTime: "-",
      failReason: "账户被锁定"
    },
    {
      id: 6,
      username: "chen.qi",
      email: "chen.qi@company.com",
      loginTime: "2025-05-27 23:45:30",
      ipAddress: "192.168.1.103",
      location: "南京, 中国",
      device: "Chrome 120.0 on Linux",
      status: "成功",
      sessionDuration: "8小时12分",
      logoutTime: "2025-05-28 07:57:42"
    },
    {
      id: 7,
      username: "liu.ba",
      email: "liu.ba@company.com",
      loginTime: "2025-05-27 22:15:45",
      ipAddress: "116.228.111.18",
      location: "武汉, 中国",
      device: "Chrome 119.0 on Windows 10",
      status: "失败",
      sessionDuration: "-",
      logoutTime: "-",
      failReason: "IP地址受限"
    },
    {
      id: 8,
      username: "huang.jiu",
      email: "huang.jiu@company.com",
      loginTime: "2025-05-27 21:30:12",
      ipAddress: "192.168.1.104",
      location: "成都, 中国",
      device: "Firefox 118.0 on Ubuntu",
      status: "成功",
      sessionDuration: "45分钟",
      logoutTime: "2025-05-27 22:15:30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "成功": return "bg-green-100 text-green-800";
      case "失败": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = loginLogs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const exportLogs = () => {
    // 模拟导出功能
    console.log("导出登录日志", filteredLogs);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <LogIn className="h-6 w-6 mr-2" />
            登录日志
          </h1>
          <p className="text-gray-600 mt-1">监控和审计系统登录活动</p>
        </div>
        <Button onClick={exportLogs} className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          导出日志
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今日登录</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">成功登录</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">失败登录</p>
                <p className="text-2xl font-bold text-red-600">14</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均会话</p>
                <p className="text-2xl font-bold text-gray-900">2.3小时</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户名、邮箱或IP地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="成功">成功</SelectItem>
                <SelectItem value="失败">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>登录记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">用户</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">登录时间</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">IP地址</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">位置</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">设备</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">会话时长</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.username}</p>
                        <p className="text-xs text-gray-500">{log.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-900">{log.loginTime}</p>
                        {log.logoutTime !== "-" && (
                          <p className="text-xs text-gray-500">退出: {log.logoutTime}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{log.ipAddress}</code>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-sm">{log.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-gray-600 max-w-32 truncate" title={log.device}>
                        {log.device}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        {log.failReason && (
                          <p className="text-xs text-red-500 mt-1">{log.failReason}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{log.sessionDuration}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              显示 {startIndex + 1} 到 {Math.min(startIndex + itemsPerPage, filteredLogs.length)} 条，
              共 {filteredLogs.length} 条记录
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}