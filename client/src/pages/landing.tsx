import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    
    // Simulate login validation
    if (username === "admin" && password === "123") {
      // Redirect to Replit auth
      window.location.href = "/api/login";
    } else {
      setError("账号或者密码错误");
      setIsLoading(false);
    }
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
              大规模时变网络安全连接系统
            </h1>
            <p className="text-slate-600">
              Enterprise Network Security Management Platform
            </p>
          </div>
          
          <div className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                  用户名
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  密码
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登录中...</span>
                </div>
              ) : (
                "登录系统"
              )}
            </Button>
            
            <div className="text-sm text-slate-600 space-y-2 mt-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span>实时安全态势感知</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse delay-100"></div>
                <span>动态访问策略控制</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse delay-200"></div>
                <span>智能威胁检测与响应</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse delay-300"></div>
                <span>全面身份认证管理</span>
              </div>
            </div>
            
            <div className="text-center text-xs text-slate-500 mt-4">
              <p>安全 • 可靠 • 高效</p>
              <p className="mt-1">支持企业级大规模部署</p>
              <p className="mt-2 text-blue-600">默认账号: admin / 密码: 123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
