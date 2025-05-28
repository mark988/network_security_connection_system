import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut, User, Lock, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // 搜索相关状态
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // 通知相关状态
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "安全告警", message: "检测到异常登录尝试", time: "2分钟前", type: "warning" },
    { id: 2, title: "系统更新", message: "安全策略已更新", time: "10分钟前", type: "info" },
    { id: 3, title: "高风险用户", message: "用户张三风险评分过高", time: "1小时前", type: "error" }
  ]);
  
  // 用户信息相关状态
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userInfo, setUserInfo] = useState({
    firstName: user?.firstName || "系统",
    lastName: user?.lastName || "管理员",
    email: user?.email || "admin@company.com",
    phone: "138-0013-8000",
    department: "技术部"
  });

  // 处理搜索
  const handleSearch = (term: string) => {
    if (term.length > 2) {
      // 模拟搜索结果
      const mockResults = [
        { type: "用户", name: "张三", description: "技术部工程师", url: "/identity" },
        { type: "策略", name: "VPN访问策略", description: "远程访问控制", url: "/policies" },
        { type: "告警", name: "异常登录", description: "检测到可疑活动", url: "/alerts" },
        { type: "设备", name: "服务器-001", description: "核心业务服务器", url: "/topology" }
      ].filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(mockResults);
      setShowSearchDialog(true);
    }
  };

  // 处理密码修改
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码和确认密码不一致",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "密码太短",
        description: "密码长度至少6位",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "密码修改成功",
      description: "您的密码已成功更新",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowUserProfile(false);
  };

  // 保存用户信息
  const handleSaveUserInfo = () => {
    toast({
      title: "信息更新成功",
      description: "您的个人信息已保存",
    });
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
          {/* 全局搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="全局搜索..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.length > 2) {
                  handleSearch(searchTerm);
                }
              }}
              className="pl-10 pr-4 py-2 w-64 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
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

          {/* 用户信息 */}
          <Popover open={showUserProfile} onOpenChange={setShowUserProfile}>
            <PopoverTrigger asChild>
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
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {userInfo.firstName[0]}{userInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{userInfo.firstName} {userInfo.lastName}</p>
                    <p className="text-sm text-gray-600">{userInfo.department}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">姓名</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input 
                        placeholder="姓"
                        value={userInfo.firstName}
                        onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                        className="text-sm"
                      />
                      <Input 
                        placeholder="名"
                        value={userInfo.lastName}
                        onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">邮箱</Label>
                    <Input 
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">电话</Label>
                    <Input 
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">部门</Label>
                    <Input 
                      value={userInfo.department}
                      onChange={(e) => setUserInfo({...userInfo, department: e.target.value})}
                      className="text-sm mt-1"
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h5 className="font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    修改密码
                  </h5>
                  
                  <div>
                    <Label className="text-sm">当前密码</Label>
                    <Input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">新密码</Label>
                    <Input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">确认密码</Label>
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-sm mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" onClick={handleSaveUserInfo} className="flex-1">
                    保存信息
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePasswordChange} className="flex-1">
                    修改密码
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 全局搜索结果对话框 */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>搜索结果</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-gray-600">{result.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      查看
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>输入关键词开始搜索</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
