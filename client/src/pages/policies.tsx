import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit, Play, Shield, Check } from "lucide-react";
import PolicyEditor from "@/components/policies/policy-editor";
import PolicyTestModal from "@/components/policies/policy-test-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Policy } from "@shared/schema";

export default function Policies() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testingPolicy, setTestingPolicy] = useState<Policy | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["/api/policies"],
  }) as { data: Policy[], isLoading: boolean };

  // 删除策略功能
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/policies/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      toast({
        title: "删除成功",
        description: "策略已成功删除",
      });
    },
    onError: () => {
      toast({
        title: "删除失败",
        description: "删除策略时发生错误，请重试",
        variant: "destructive",
      });
    },
  });

  const handleCreateNew = () => {
    setSelectedPolicy(null);
    setIsCreating(true);
  };

  const handleSelectPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsCreating(false);
  };

  const handleTestPolicy = (policy: Policy) => {
    setTestingPolicy(policy);
    setTestModalOpen(true);
  };

  const handleDeletePolicy = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">访问策略配置</h1>
        <p className="text-carbon-gray-70">创建和管理基于上下文的动态访问控制策略</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>策略管理</CardTitle>
            <Button 
              onClick={handleCreateNew}
              className="bg-carbon-blue hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建策略
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              加载策略数据中...
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">暂无安全策略</p>
              <p className="text-sm">点击上方"新建策略"按钮开始创建您的第一个安全策略</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((policy: Policy) => (
                <div
                  key={policy.id}
                  className={`group relative border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${
                    selectedPolicy?.id === policy.id 
                      ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50" 
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectPolicy(policy)}
                >
                  {/* 策略状态指示器 */}
                  <div className="absolute top-4 right-4">
                    <div className={`h-3 w-3 rounded-full ${policy.enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                  </div>

                  {/* 策略图标 */}
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${
                    policy.enabled ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Shield className={`h-6 w-6 ${policy.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>

                  {/* 策略标题 */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {policy.name}
                  </h3>

                  {/* 策略描述 */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {policy.description}
                  </p>

                  {/* 策略信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={policy.enabled ? "default" : "secondary"}
                        className={`text-xs ${
                          policy.enabled 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {policy.enabled ? "已启用" : "已禁用"}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          policy.action === 'allow' 
                            ? 'text-green-600 border-green-200' 
                            : policy.action === 'deny'
                            ? 'text-red-600 border-red-200'
                            : 'text-yellow-600 border-yellow-200'
                        }`}
                      >
                        {policy.action === 'allow' ? '允许' : policy.action === 'deny' ? '拒绝' : '监控'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                        优先级 {policy.priority}
                      </span>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestPolicy(policy);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          测试
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              删除
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除策略</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除策略 "{policy.name}" 吗？此操作不可撤销，删除后该策略将停止生效。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteMutation.mutate(policy.id);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                确认删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>

                  {/* 选中状态覆盖层 */}
                  {selectedPolicy?.id === policy.id && (
                    <div className="absolute top-2 left-2">
                      <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 策略测试弹窗 */}
      <PolicyTestModal
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
        policyName={testingPolicy?.name || ""}
      />
    </div>
  );
}
