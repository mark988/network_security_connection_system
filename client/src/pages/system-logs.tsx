import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Search, Download, Filter, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export default function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 模拟系统日志数据
  const systemLogs = [
    {
      id: 1,
      timestamp: "2025-05-28 07:45:32.123",
      level: "ERROR",
      service: "auth-service",
      message: "Database connection timeout during user authentication",
      details: "Connection to primary database failed after 30s timeout. Switched to backup database.",
      thread: "Thread-45",
      source: "AuthController.java:156"
    },
    {
      id: 2,
      timestamp: "2025-05-28 07:44:15.456",
      level: "WARN",
      service: "web-server",
      message: "High memory usage detected",
      details: "JVM heap usage reached 85% (6.8GB/8GB). Consider increasing memory allocation.",
      thread: "GC-Monitor",
      source: "MemoryMonitor.java:89"
    },
    {
      id: 3,
      timestamp: "2025-05-28 07:43:02.789",
      level: "INFO",
      service: "user-service",
      message: "User session created successfully",
      details: "Session ID: sess_1748419382_abc123, User: admin, Duration: 8h",
      thread: "Thread-23",
      source: "SessionManager.java:45"
    },
    {
      id: 4,
      timestamp: "2025-05-28 07:42:18.012",
      level: "DEBUG",
      service: "cache-service",
      message: "Cache hit rate optimization completed",
      details: "Reorganized cache keys, hit rate improved from 78% to 92%",
      thread: "Cache-Worker-1",
      source: "CacheOptimizer.java:203"
    },
    {
      id: 5,
      timestamp: "2025-05-28 07:41:45.234",
      level: "ERROR",
      service: "notification-service",
      message: "Failed to send email notification",
      details: "SMTP server unreachable: smtp.company.com:587. Retrying in 5 minutes.",
      thread: "Email-Queue-3",
      source: "EmailSender.java:78"
    },
    {
      id: 6,
      timestamp: "2025-05-28 07:40:30.567",
      level: "INFO",
      service: "api-gateway",
      message: "Rate limit threshold updated",
      details: "New rate limit: 1000 requests/minute per IP. Previous: 500 requests/minute",
      thread: "Config-Updater",
      source: "RateLimiter.java:124"
    },
    {
      id: 7,
      timestamp: "2025-05-28 07:39:12.890",
      level: "WARN",
      service: "backup-service",
      message: "Backup operation taking longer than expected",
      details: "Daily backup started at 07:00, still running after 39 minutes. Expected: 20 minutes",
      thread: "Backup-Worker",
      source: "BackupManager.java:67"
    },
    {
      id: 8,
      timestamp: "2025-05-28 07:38:05.123",
      level: "INFO",
      service: "security-service",
      message: "Security scan completed",
      details: "Vulnerability scan finished. Found 0 critical, 2 medium, 5 low severity issues",
      thread: "Security-Scanner",
      source: "VulnerabilityScanner.java:156"
    },
    {
      id: 9,
      timestamp: "2025-05-28 07:37:22.456",
      level: "ERROR",
      service: "file-service",
      message: "Disk space critically low",
      details: "Available space: 512MB (2%). Cleanup required immediately.",
      thread: "Disk-Monitor",
      source: "DiskMonitor.java:34"
    },
    {
      id: 10,
      timestamp: "2025-05-28 07:36:48.789",
      level: "DEBUG",
      service: "load-balancer",
      message: "Server health check passed",
      details: "All 5 backend servers responding within 200ms threshold",
      thread: "Health-Checker",
      source: "HealthCheck.java:91"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "bg-red-100 text-red-800";
      case "WARN": return "bg-yellow-100 text-yellow-800";
      case "INFO": return "bg-blue-100 text-blue-800";
      case "DEBUG": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "ERROR": return <XCircle className="h-4 w-4 text-red-500" />;
      case "WARN": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "INFO": return <Info className="h-4 w-4 text-blue-500" />;
      case "DEBUG": return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const exportLogs = () => {
    console.log("导出系统日志", filteredLogs);
  };

  const levelCounts = {
    ERROR: systemLogs.filter(log => log.level === "ERROR").length,
    WARN: systemLogs.filter(log => log.level === "WARN").length,
    INFO: systemLogs.filter(log => log.level === "INFO").length,
    DEBUG: systemLogs.filter(log => log.level === "DEBUG").length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Terminal className="h-6 w-6 mr-2" />
            系统日志
          </h1>
          <p className="text-gray-600 mt-1">监控系统运行状态和异常情况</p>
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
                <p className="text-sm font-medium text-gray-600">错误日志</p>
                <p className="text-2xl font-bold text-red-600">{levelCounts.ERROR}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">警告日志</p>
                <p className="text-2xl font-bold text-yellow-600">{levelCounts.WARN}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">信息日志</p>
                <p className="text-2xl font-bold text-blue-600">{levelCounts.INFO}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">调试日志</p>
                <p className="text-2xl font-bold text-gray-600">{levelCounts.DEBUG}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-gray-600" />
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
                placeholder="搜索服务名称、错误信息或详细描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="ERROR">错误</SelectItem>
                <SelectItem value="WARN">警告</SelectItem>
                <SelectItem value="INFO">信息</SelectItem>
                <SelectItem value="DEBUG">调试</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 系统日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>日志记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 font-mono text-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getLevelIcon(log.level)}
                    <Badge className={getLevelColor(log.level)}>{log.level}</Badge>
                    <span className="text-gray-500">{log.timestamp}</span>
                    <Badge variant="outline">{log.service}</Badge>
                  </div>
                  <span className="text-xs text-gray-400">{log.thread}</span>
                </div>
                
                <div className="ml-7">
                  <p className="font-medium text-gray-900 mb-1">{log.message}</p>
                  <p className="text-gray-600 text-xs mb-2">{log.details}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                      {log.source}
                    </code>
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