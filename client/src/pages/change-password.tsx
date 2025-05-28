import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ChangePassword() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "弱";
    if (strength <= 3) return "中等";
    if (strength <= 4) return "强";
    return "很强";
  };

  const handleSubmit = () => {
    if (!passwords.currentPassword) {
      toast({
        title: "错误",
        description: "请输入当前密码",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast({
        title: "错误",
        description: "新密码长度至少6位",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "错误",
        description: "新密码和确认密码不一致",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "密码修改成功",
      description: "您的密码已成功更新",
    });
    
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleBack = () => {
    setLocation("/");
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">修改密码</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            密码设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 当前密码 */}
          <div>
            <Label htmlFor="currentPassword">当前密码</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="请输入当前密码"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 新密码 */}
          <div>
            <Label htmlFor="newPassword">新密码</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="请输入新密码"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* 密码强度指示器 */}
            {passwords.newPassword && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">密码强度:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength <= 2 ? 'text-red-500' :
                    passwordStrength <= 3 ? 'text-yellow-500' :
                    passwordStrength <= 4 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 确认密码 */}
          <div>
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="请再次输入新密码"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {passwords.confirmPassword && passwords.newPassword && (
              <div className="mt-1 flex items-center">
                {passwords.newPassword === passwords.confirmPassword ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">密码匹配</span>
                  </div>
                ) : (
                  <span className="text-sm text-red-500">密码不匹配</span>
                )}
              </div>
            )}
          </div>

          {/* 密码要求说明 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium text-blue-800">密码安全要求</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 密码长度至少8位</li>
              <li>• 包含大写字母、小写字母</li>
              <li>• 包含数字</li>
              <li>• 包含特殊字符(!@#$%^&*等)</li>
              <li>• 不要使用容易猜测的密码</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={handleBack}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              修改密码
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}