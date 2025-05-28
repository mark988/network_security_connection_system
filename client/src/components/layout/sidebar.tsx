import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  AlertTriangle, 
  Network,
  Shield,
  UserCog
} from "lucide-react";

const navigation = [
  { name: "系统概览", href: "/", icon: LayoutDashboard },
  { name: "用户管理", href: "/users", icon: Users },
  { name: "身份管理", href: "/identity", icon: UserCog },
  { name: "访问策略", href: "/policies", icon: Settings },
  { name: "安全告警", href: "/alerts", icon: AlertTriangle },
  { name: "网络拓扑", href: "/topology", icon: Network },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-carbon-blue mr-3" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">安全连接系统</h1>
            <p className="text-xs text-carbon-gray-70">v2.1.0</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`nav-item ${isActive ? "active" : ""}`}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
