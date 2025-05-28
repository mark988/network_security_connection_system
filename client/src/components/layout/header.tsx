import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, User, Lock, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // 通知相关状态
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "安全告警", message: "检测到异常登录尝试", time: "2分钟前", type: "warning" },
    { id: 2, title: "系统更新", message: "安全策略已更新", time: "10分钟前", type: "info" },
    { id: 3, title: "高风险用户", message: "用户张三风险评分过高", time: "1小时前", type: "error" }
  ]);
  
  const userInfo = {
    firstName: "系统",
    lastName: "管理员",
    email: "admin@company.com",
    department: "技术部"
  };

  // 处理菜单点击
  const handleUserInfoClick = () => {
    setLocation("/user-profile");
  };

  const handlePasswordChangeClick = () => {
    setLocation("/change-password");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            网络安全管理平台
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 通知铃铛 */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold">通知消息</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border-b last:border-0 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  查看所有通知
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* 用户下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {userInfo.firstName[0]}{userInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                  <p className="text-xs text-gray-500">在线</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleUserInfoClick} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                用户信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePasswordChangeClick} className="cursor-pointer">
                <Lock className="h-4 w-4 mr-2" />
                修改密码
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}