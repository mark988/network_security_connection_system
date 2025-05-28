import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址");
      setIsLoading(false);
      return;
    }

    try {
      // 模拟发送重置密码邮件
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsEmailSent(true);
      } else {
        setError(data.message || "发送失败，请稍后重试");
      }
    } catch (error) {
      setError("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-md bg-white/95 border border-white/20 relative z-10">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="relative">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-lg"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              找回密码
            </h1>
            <p className="text-slate-600">
              请输入您的邮箱地址，我们将发送重置密码链接
            </p>
          </div>

          {!isEmailSent ? (
            <div className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <Mail className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  邮箱地址
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入您的邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>发送中...</span>
                  </div>
                ) : (
                  "发送重置链接"
                )}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回登录
              </Button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" />
                  <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-lg"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  重置链接已发送
                </h3>
                <p className="text-slate-600">
                  我们已向 <span className="font-medium text-blue-600">{email}</span> 发送了密码重置链接。
                </p>
                <p className="text-sm text-slate-500">
                  请检查您的邮箱（包括垃圾邮件文件夹），并点击链接重置密码。
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                    setError("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  重新发送
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={handleBackToLogin}
                  className="w-full text-slate-600 hover:text-slate-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回登录
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}