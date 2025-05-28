import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Reload the page to trigger authentication state change
        window.location.reload();
      } else {
        // Fallback to original logout method
        window.location.href = "/api/logout";
      }
    } catch (error) {
      // Fallback to original logout method
      window.location.href = "/api/logout";
    }
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
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-carbon-gray-70" />
            <Input
              type="text"
              placeholder="全局搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 focus:ring-carbon-blue focus:border-carbon-blue"
            />
          </div>
          
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5 text-carbon-gray-70" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-carbon-red text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl || ""} />
              <AvatarFallback className="bg-carbon-blue text-white text-sm">
                {user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') : '管理'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : "系统管理员"}
              </p>
              <p className="text-xs text-carbon-gray-70">在线</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-carbon-gray-70 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
