import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Search, Edit, Trash2 } from "lucide-react";
import UserFormDialog from "@/components/users/user-form-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "成功",
        description: "用户已删除",
      });
    },
    onError: () => {
      toast({
        title: "错误",
        description: "删除用户失败",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (userId: string) => {
    if (confirm("确定要删除此用户吗？")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: "高风险", color: "bg-red-100 text-red-800" };
    if (score <= 60) return { label: "中风险", color: "bg-yellow-100 text-yellow-800" };
    return { label: "低风险", color: "bg-green-100 text-green-800" };
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "bg-carbon-red";
    if (score <= 60) return "bg-carbon-yellow";
    return "bg-carbon-green";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">用户管理</h1>
        <p className="text-carbon-gray-70">管理系统用户、角色和访问权限</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>用户列表</CardTitle>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-carbon-blue hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增用户
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-carbon-gray-70" />
              <Input
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="所有状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
                <SelectItem value="locked">锁定</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="所有角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="guest">访客</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead>风险评分</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-carbon-gray-70">
                      没有找到匹配的用户
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: User) => {
                    const riskLevel = getRiskLevel(user.riskScore || 0);
                    return (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.profileImageUrl || ""} />
                              <AvatarFallback className="bg-carbon-blue text-white">
                                {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-carbon-gray-70">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "管理员" : user.role === "user" ? "普通用户" : "访客"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "default" : "destructive"}
                            className={user.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {user.status === "active" ? "活跃" : user.status === "inactive" ? "禁用" : "锁定"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-carbon-gray-70">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : "从未登录"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                              <div 
                                className={`h-2 rounded-full ${getRiskColor(user.riskScore || 0)}`}
                                style={{ width: `${user.riskScore || 0}%` }}
                              />
                            </div>
                            <Badge variant="outline" className={riskLevel.color}>
                              {riskLevel.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="text-carbon-blue hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="text-carbon-red hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        user={null}
      />

      {editingUser && (
        <UserFormDialog
          open={true}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
        />
      )}
    </div>
  );
}
