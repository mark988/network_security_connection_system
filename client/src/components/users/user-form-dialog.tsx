import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema, type User, type InsertUser } from "@shared/schema";
import { z } from "zod";

const userFormSchema = insertUserSchema.extend({
  firstName: z.string().min(1, "请输入姓"),
  lastName: z.string().min(1, "请输入名"),
  email: z.string().email("请输入有效的邮箱地址"),
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export default function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      status: "active",
      riskScore: 85,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      await apiRequest("POST", "/api/users", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "成功",
        description: user ? "用户信息已更新" : "用户创建成功",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "错误",
        description: user ? "更新用户信息失败" : "创建用户失败",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<InsertUser>) => {
      await apiRequest("PUT", `/api/users/${user!.id}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "成功",
        description: "用户信息已更新",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "错误",
        description: "更新用户信息失败",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "user",
        status: user.status || "active",
        riskScore: user.riskScore || 85,
      });
    } else {
      form.reset({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
        status: "active",
        riskScore: 85,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    setIsSubmitting(true);
    
    if (user) {
      updateUserMutation.mutate(data);
    } else {
      // Generate a simple ID for new users
      const userData = { ...data, id: `user_${Date.now()}` };
      createUserMutation.mutate(userData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "编辑用户" : "新增用户"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入姓" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱地址</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入邮箱地址" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择角色" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">管理员</SelectItem>
                        <SelectItem value="user">普通用户</SelectItem>
                        <SelectItem value="guest">访客</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">禁用</SelectItem>
                        <SelectItem value="locked">锁定</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="riskScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>风险评分 (0-100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="请输入风险评分"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-carbon-blue hover:bg-blue-700"
              >
                {isSubmitting ? "保存中..." : user ? "更新" : "创建"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
