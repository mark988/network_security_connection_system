import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Mail, Phone, Building, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function UserProfile() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [userInfo, setUserInfo] = useState({
    firstName: "系统",
    lastName: "管理员", 
    email: "admin@company.com",
    phone: "138-0013-8000",
    department: "技术部",
    position: "系统管理员",
    joinDate: "2023-01-15",
    lastLogin: "2025-05-28 07:30:00"
  });

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "用户信息已成功更新",
    });
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">用户信息</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户头像卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>头像信息</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {userInfo.firstName[0]}{userInfo.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{userInfo.firstName} {userInfo.lastName}</p>
              <p className="text-gray-600">{userInfo.position}</p>
              <p className="text-sm text-gray-500">{userInfo.department}</p>
            </div>
            <Button variant="outline" size="sm">
              更换头像
            </Button>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">姓</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">名</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">手机号码</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="department">部门</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="department"
                  value={userInfo.department}
                  onChange={(e) => setUserInfo({...userInfo, department: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="position">职位</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="position"
                  value={userInfo.position}
                  onChange={(e) => setUserInfo({...userInfo, position: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统信息 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">加入时间</p>
                  <p className="font-medium">{userInfo.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">最后登录</p>
                  <p className="font-medium">{userInfo.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">用户状态</p>
                  <p className="font-medium text-green-600">在线</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">权限等级</p>
                  <p className="font-medium">超级管理员</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={handleBack}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存修改
        </Button>
      </div>
    </div>
  );
}