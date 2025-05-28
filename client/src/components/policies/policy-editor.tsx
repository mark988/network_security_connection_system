import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPolicySchema, type Policy, type InsertPolicy } from "@shared/schema";
import { z } from "zod";
import { Save, Play, RotateCcw, Plus, X } from "lucide-react";

const policyFormSchema = insertPolicySchema.extend({
  name: z.string().min(1, "请输入策略名称"),
  subject: z.string().min(1, "请选择策略主体"),
  object: z.string().min(1, "请输入目标对象"),
  action: z.string().min(1, "请选择执行动作"),
});

interface PolicyEditorProps {
  policy: Policy | null;
  isCreating: boolean;
  onSave: () => void;
}

interface Condition {
  id: string;
  type: string;
  operator: string;
  value: string;
}

export default function PolicyEditor({ policy, isCreating, onSave }: PolicyEditorProps) {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof policyFormSchema>>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      object: "",
      conditions: {},
      action: "",
      priority: 0,
      enabled: true,
    },
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (policyData: InsertPolicy) => {
      await apiRequest("POST", "/api/policies", policyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      toast({
        title: "成功",
        description: "策略创建成功",
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "错误",
        description: "创建策略失败",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async (policyData: Partial<InsertPolicy>) => {
      await apiRequest("PUT", `/api/policies/${policy!.id}`, policyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      toast({
        title: "成功",
        description: "策略更新成功",
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "错误",
        description: "更新策略失败",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (policy) {
      form.reset({
        name: policy.name,
        description: policy.description || "",
        subject: policy.subject,
        object: policy.object,
        conditions: policy.conditions,
        action: policy.action,
        priority: policy.priority || 0,
        enabled: policy.enabled,
      });

      // Parse conditions from policy
      if (policy.conditions && typeof policy.conditions === 'object') {
        const parsedConditions = Object.entries(policy.conditions).map(([key, value], index) => ({
          id: `condition_${index}`,
          type: key,
          operator: "equals",
          value: String(value),
        }));
        setConditions(parsedConditions);
      }
    } else if (isCreating) {
      form.reset({
        name: "",
        description: "",
        subject: "",
        object: "",
        conditions: {},
        action: "",
        priority: 0,
        enabled: true,
      });
      setConditions([]);
    }
  }, [policy, isCreating, form]);

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition_${Date.now()}`,
      type: "ip_range",
      operator: "in",
      value: "",
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const testPolicy = () => {
    // Simulate policy testing
    const hasConditions = conditions.length > 0;
    const hasValidAction = form.getValues("action") !== "";
    
    if (hasConditions && hasValidAction) {
      setTestResult("策略测试通过 - 规则配置正确");
      toast({
        title: "测试成功",
        description: "策略规则验证通过",
      });
    } else {
      setTestResult("策略测试失败 - 请检查条件和动作配置");
      toast({
        title: "测试失败",
        description: "策略配置不完整",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof policyFormSchema>) => {
    setIsSubmitting(true);

    // Convert conditions array to object format
    const conditionsObj = conditions.reduce((acc, condition) => {
      acc[condition.type] = condition.value;
      return acc;
    }, {} as Record<string, any>);

    const policyData = {
      ...data,
      conditions: conditionsObj,
    };

    if (policy) {
      updatePolicyMutation.mutate(policyData);
    } else {
      createPolicyMutation.mutate(policyData);
    }
  };

  const resetForm = () => {
    if (policy) {
      form.reset({
        name: policy.name,
        description: policy.description || "",
        subject: policy.subject,
        object: policy.object,
        conditions: policy.conditions,
        action: policy.action,
        priority: policy.priority || 0,
        enabled: policy.enabled,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        subject: "",
        object: "",
        conditions: {},
        action: "",
        priority: 0,
        enabled: true,
      });
    }
    setConditions([]);
    setTestResult(null);
  };

  if (!policy && !isCreating) {
    return (
      <div className="flex items-center justify-center h-96 text-carbon-gray-70">
        <div className="text-center">
          <h4 className="text-lg font-medium mb-2">选择策略进行编辑</h4>
          <p className="text-sm">从左侧列表中选择一个策略，或点击"新建策略"创建新的访问策略</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-carbon-gray-70 uppercase tracking-wider mb-4">
        策略编辑器
      </h4>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {policy ? `编辑策略: ${policy.name}` : "新建策略"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>策略名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入策略名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="请输入策略描述"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>优先级</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">启用策略</FormLabel>
                          <div className="text-sm text-carbon-gray-70">
                            是否立即生效此策略
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Policy Rules */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">策略规则</h5>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormLabel className="text-sm font-medium text-gray-600 min-w-[60px]">
                            主体:
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="选择策略适用对象" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin_group">管理员组</SelectItem>
                                <SelectItem value="user_group">用户组</SelectItem>
                                <SelectItem value="guest_group">访客组</SelectItem>
                                <SelectItem value="specific_user">特定用户</SelectItem>
                                <SelectItem value="all_users">所有用户</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Object */}
                  <FormField
                    control={form.control}
                    name="object"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormLabel className="text-sm font-medium text-gray-600 min-w-[60px]">
                            目标:
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="输入目标资源 (如: finance-db, 192.168.1.0/24)"
                              className="flex-1"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <FormLabel className="text-sm font-medium text-gray-600">
                        条件:
                      </FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCondition}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        添加条件
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {conditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                          {index > 0 && (
                            <Badge variant="outline" className="text-xs">
                              AND
                            </Badge>
                          )}
                          
                          <Select
                            value={condition.type}
                            onValueChange={(value) => updateCondition(condition.id, "type", value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ip_range">IP地址范围</SelectItem>
                              <SelectItem value="time_range">时间范围</SelectItem>
                              <SelectItem value="device_type">设备类型</SelectItem>
                              <SelectItem value="location">地理位置</SelectItem>
                              <SelectItem value="risk_score">风险评分</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in">在范围内</SelectItem>
                              <SelectItem value="not_in">不在范围内</SelectItem>
                              <SelectItem value="equals">等于</SelectItem>
                              <SelectItem value="greater_than">大于</SelectItem>
                              <SelectItem value="less_than">小于</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder="输入条件值"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                            className="flex-1"
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(condition.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {conditions.length === 0 && (
                        <div className="text-center py-4 text-carbon-gray-70 border-2 border-dashed border-gray-300 rounded">
                          点击"添加条件"来配置策略触发条件
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormLabel className="text-sm font-medium text-gray-600 min-w-[60px]">
                            动作:
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="选择执行动作" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="allow">允许访问</SelectItem>
                                <SelectItem value="deny">拒绝访问</SelectItem>
                                <SelectItem value="require_mfa">需要多因子认证</SelectItem>
                                <SelectItem value="log_only">仅记录日志</SelectItem>
                                <SelectItem value="isolate">隔离设备</SelectItem>
                                <SelectItem value="redirect">重定向</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className={`p-3 rounded-lg border ${
                  testResult.includes("通过") 
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <p className="text-sm font-medium">{testResult}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-carbon-blue hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "保存中..." : "保存策略"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={testPolicy}
                  disabled={isSubmitting}
                >
                  <Play className="w-4 h-4 mr-2" />
                  测试策略
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重置
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
