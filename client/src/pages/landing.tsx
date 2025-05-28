import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-carbon-gray-10 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-carbon-blue mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              大规模时变网络安全连接系统
            </h1>
            <p className="text-carbon-gray-70">
              Enterprise Network Security Management Platform
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="text-sm text-carbon-gray-70 space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-carbon-green rounded-full mr-3"></div>
                <span>实时安全态势感知</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-carbon-green rounded-full mr-3"></div>
                <span>动态访问策略控制</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-carbon-green rounded-full mr-3"></div>
                <span>智能威胁检测与响应</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-carbon-green rounded-full mr-3"></div>
                <span>全面身份认证管理</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-carbon-blue hover:bg-blue-700 text-white py-3"
            >
              登录系统
            </Button>
            
            <div className="text-center text-xs text-carbon-gray-70">
              <p>安全 • 可靠 • 高效</p>
              <p className="mt-1">支持企业级大规模部署</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
