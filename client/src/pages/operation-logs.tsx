import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MousePointer, Search, Download, Filter, User, Edit, Trash2, Plus, Settings } from "lucide-react";

export default function OperationLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [operationFilter, setOperationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 模拟操作日志数据
  const operationLogs = [
    {
      id: 1,
      username: "admin",
      operation: "创建用户",
      target: "用户: zhang.san",
      details: "创建新用户账户，分配基础权限",
      timestamp: "2025-05-28 07:45:32",
      ipAddress: "192.168.1.100",
      result: "成功",
      module: "用户管理"
    },
    {
      id: 2,
      username: "admin",
      operation: "修改策略",
      target: "策略: VPN访问策略",
      details: "更新访问规则，添加新的IP白名单",
      timestamp: "2025-05-28 07:30:15",
      ipAddress: "192.168.1.100",
      result: "成功",
      module: "访问策略"
    },
    {
      id: 3,
      username: "zhang.san",
      operation: "查看报告",
      target: "安全报告: 月度总结",
      details: "下载并查看系统安全月度报告",
      timestamp: "2025-05-28 07:15:48",
      ipAddress: "192.168.1.101",
      result: "成功",
      module: "报告中心"
    },
    {
      id: 4,
      username: "li.si",
      operation: "删除告警",
      target: "告警: #ALT-2024-0532",
      details: "标记误报告警为已处理",
      timestamp: "2025-05-28 06:55:23",
      ipAddress: "192.168.1.102",
      result: "成功",
      module: "安全告警"
    },
    {
      id: 5,
      username: "wang.wu",
      operation: "导出数据",
      target: "用户列表",
      details: "导出用户列表数据为Excel格式",
      timestamp: "2025-05-28 06:40:17",
      ipAddress: "192.168.1.103",
      result: "失败",
      module: "用户管理",
      errorMessage: "权限不足"
    },
    {
      id: 6,
      username: "admin",
      operation: "系统配置",
      target: "LDAP集成设置",
      details: "配置LDAP服务器连接参数",
      timestamp: "2025-05-28 06:20:05",
      ipAddress: "192.168.1.100",
      result: "成功",
      module: "系统设置"
    },
    {
      id: 7,
      username: "zhao.liu",
      operation: "批量导入",
      target: "用户账户",
      details: "批量导入50个用户账户",
      timestamp: "2025-05-28 05:45:30",
      ipAddress: "192.168.1.104",
      result: "部分成功",
      module: "用户管理",
      errorMessage: "3个账户创建失败"
    },
    {
      id: 8,
      username: "chen.qi",
      operation: "重置密码",
      target: "用户: liu.ba",
      details: "管理员重置用户密码",
      timestamp: "2025-05-28 05:30:12",
      ipAddress: "192.168.1.105",
      result: "成功",
      module: "用户管理"
    }
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case "成功": return "bg-green-100 text-green-800";
      case "失败": return "bg-red-100 text-red-800";
      case "部分成功": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOperationIcon = (operation: string) => {
    if (operation.includes("创建") || operation.includes("导入")) return <Plus className="h-4 w-4" />;
    if (operation.includes("修改") || operation.includes("配置") || operation.includes("重置")) return <Edit className="h-4 w-4" />;
    if (operation.includes("删除")) return <Trash2 className="h-4 w-4" />;
    if (operation.includes("查看") || operation.includes("导出")) return <MousePointer className="h-4 w-4" />;
    return <Settings className="h-4 w-4" />;
  };

  const filteredLogs = operationLogs.filter(log => {
    const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperation = operationFilter === "all" || log.module === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const exportLogs = () => {
    console.log("导出操作日志", filteredLogs);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MousePointer className="h-6 w-6 mr-2" />
            操作日志
          </h1>
          <p className="text-gray-600 mt-1">记录系统所有用户操作和管理活动</p>
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
                <p className="text-sm font-medium text-gray-600">今日操作</p>
                <p className="text-2xl font-bold text-gray-900">324</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MousePointer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">成功操作</p>
                <p className="text-2xl font-bold text-green-600">298</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Edit className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">失败操作</p>
                <p className="text-2xl font-bold text-red-600">18</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">活跃用户</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <User className="h-6 w-6 text-purple-600" />
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
                placeholder="搜索用户名、操作类型或目标对象..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模块</SelectItem>
                <SelectItem value="用户管理">用户管理</SelectItem>
                <SelectItem value="访问策略">访问策略</SelectItem>
                <SelectItem value="安全告警">安全告警</SelectItem>
                <SelectItem value="系统设置">系统设置</SelectItem>
                <SelectItem value="报告中心">报告中心</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 操作日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getOperationIcon(log.operation)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{log.operation}</h4>
                        <Badge variant="outline">{log.module}</Badge>
                        <Badge className={getResultColor(log.result)}>{log.result}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.target}</p>
                      <p className="text-sm text-gray-500">{log.details}</p>
                      {log.errorMessage && (
                        <p className="text-sm text-red-500 mt-1">错误: {log.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 min-w-0">
                    <p>{log.timestamp}</p>
                    <p className="flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {log.username}
                    </p>
                    <p className="text-xs mt-1">
                      <code className="bg-gray-100 px-1 rounded">{log.ipAddress}</code>
                    </p>
                  </div>
                </div>
              </div>
            ))}
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