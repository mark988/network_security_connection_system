import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Alert> }) => {
      await apiRequest("PUT", `/api/alerts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "成功",
        description: "告警状态已更新",
      });
    },
    onError: () => {
      toast({
        title: "错误",
        description: "更新告警状态失败",
        variant: "destructive",
      });
    },
  });

  const filteredAlerts = alerts.filter((alert: Alert) => {
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <ExclamationTriangleIcon className="w-5 h-5 text-carbon-red" />;
      case "medium":
        return <InformationCircleIcon className="w-5 h-5 text-carbon-yellow" />;
      case "low":
        return <InformationCircleIcon className="w-5 h-5 text-carbon-green" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "严重", className: "bg-red-100 text-red-800" },
      high: { label: "高", className: "bg-orange-100 text-orange-800" },
      medium: { label: "中", className: "bg-yellow-100 text-yellow-800" },
      low: { label: "低", className: "bg-green-100 text-green-800" },
    };
    
    const { label, className } = config[severity as keyof typeof config] || { label: severity, className: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      new: { label: "新建", className: "bg-blue-100 text-blue-800" },
      "in-progress": { label: "处理中", className: "bg-yellow-100 text-yellow-800" },
      resolved: { label: "已解决", className: "bg-green-100 text-green-800" },
      closed: { label: "已关闭", className: "bg-gray-100 text-gray-800" },
    };
    
    const { label, className } = config[status as keyof typeof config] || { label: status, className: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };

  const handleStatusChange = (alertId: number, newStatus: string) => {
    updateAlertMutation.mutate({
      id: alertId,
      data: { status: newStatus }
    });
  };

  const alertStats = {
    critical: alerts.filter((a: Alert) => a.severity === "critical").length,
    high: alerts.filter((a: Alert) => a.severity === "high").length,
    medium: alerts.filter((a: Alert) => a.severity === "medium").length,
    resolved: alerts.filter((a: Alert) => a.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">安全事件告警</h1>
        <p className="text-carbon-gray-70">集中管理安全告警，提供高效的筛选、调查和响应工具</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>安全告警中心</CardTitle>
            <div className="flex space-x-3">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="所有严重级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有严重级别</SelectItem>
                  <SelectItem value="critical">严重</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="所有状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="new">新建</SelectItem>
                  <SelectItem value="in-progress">处理中</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                  <SelectItem value="closed">已关闭</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-carbon-red" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-carbon-gray-70">严重告警</p>
                  <p className="text-xl font-bold text-carbon-red">{alertStats.critical}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-carbon-gray-70">高优先级</p>
                  <p className="text-xl font-bold text-orange-500">{alertStats.high}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <InformationCircleIcon className="w-8 h-8 text-carbon-yellow" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-carbon-gray-70">中优先级</p>
                  <p className="text-xl font-bold text-carbon-yellow">{alertStats.medium}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-carbon-green" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-carbon-gray-70">已处理</p>
                  <p className="text-xl font-bold text-carbon-green">{alertStats.resolved}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>严重级别</TableHead>
                  <TableHead>告警类型</TableHead>
                  <TableHead>源/目标</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-carbon-gray-70">
                      没有找到匹配的告警
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert: Alert) => (
                    <TableRow key={alert.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(alert.severity)}
                          {getSeverityBadge(alert.severity)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{alert.title}</div>
                          <div className="text-sm text-carbon-gray-70">{alert.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {alert.sourceIp || alert.sourceUser}
                          </div>
                          <div className="text-sm text-carbon-gray-70">
                            → {alert.targetIp || alert.targetService}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-carbon-gray-70">
                        {new Date(alert.createdAt!).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(alert.status)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {alert.assignee || "未分配"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-carbon-blue hover:text-blue-700"
                          >
                            查看详情
                          </Button>
                          {alert.status === "new" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(alert.id!, "in-progress")}
                              className="text-carbon-green hover:text-green-700"
                            >
                              处理
                            </Button>
                          )}
                          {alert.status === "in-progress" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(alert.id!, "resolved")}
                              className="text-carbon-green hover:text-green-700"
                            >
                              解决
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
