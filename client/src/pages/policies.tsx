import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit, Play } from "lucide-react";
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
  });

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Policy List */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-medium text-carbon-gray-70 uppercase tracking-wider mb-4">
                策略列表
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-4 text-carbon-gray-70">
                    加载中...
                  </div>
                ) : policies.length === 0 ? (
                  <div className="text-center py-4 text-carbon-gray-70">
                    暂无策略，点击新建策略开始
                  </div>
                ) : (
                  policies.map((policy: Policy) => (
                    <div
                      key={policy.id}
                      className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPolicy?.id === policy.id 
                          ? "border-l-4 border-l-carbon-blue bg-blue-50" 
                          : ""
                      }`}
                      onClick={() => handleSelectPolicy(policy)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{policy.name}</h5>
                        <Badge 
                          variant={policy.enabled ? "default" : "secondary"}
                          className={policy.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {policy.enabled ? "启用" : "禁用"}
                        </Badge>
                      </div>
                      <p className="text-sm text-carbon-gray-70 line-clamp-2">
                        {policy.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-carbon-gray-70">
                        <span>优先级: {policy.priority}</span>
                        <span>{policy.action}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Policy Editor */}
            <div className="lg:col-span-2">
              <PolicyEditor 
                policy={selectedPolicy} 
                isCreating={isCreating}
                onSave={() => {
                  setSelectedPolicy(null);
                  setIsCreating(false);
                }}
              />
            </div>
          </div>
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
