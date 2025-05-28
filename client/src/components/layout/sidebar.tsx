import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  AlertTriangle, 
  Network,
  Shield,
  UserCog,
  Server,
  ChevronDown,
  ChevronRight,
  FileText,
  Activity,
  LogIn,
  MousePointer,
  Terminal
} from "lucide-react";

const navigation = [
  { name: "系统概览", href: "/", icon: LayoutDashboard },
  {
    name: "系统管理",
    icon: Server,
    children: [
      {
        name: "日志",
        icon: FileText,
        children: [
          { name: "登录日志", href: "/system/logs/login", icon: LogIn },
          { name: "操作日志", href: "/system/logs/operation", icon: MousePointer },
          { name: "系统日志", href: "/system/logs/system", icon: Terminal }
        ]
      },
      { name: "系统健康", href: "/system/health", icon: Activity }
    ]
  },
  { name: "用户管理", href: "/users", icon: Users },
  { name: "身份管理", href: "/identity", icon: UserCog },
  { name: "访问策略", href: "/policies", icon: Settings },
  { name: "安全告警", href: "/alerts", icon: AlertTriangle },
  { name: "网络拓扑", href: "/topology", icon: Network },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const renderNavItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.name);
    const isActive = location === item.href;
    const paddingLeft = depth * 16 + 16;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg mb-1`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center">
              <item.icon className="w-4 h-4 mr-3" />
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4">
              {item.children.map((child: any) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    if (!item.href) return null;
    
    return (
      <Link key={item.name} href={item.href}>
        <a 
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg mb-1 ${
            isActive 
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <item.icon className="w-4 h-4 mr-3" />
          <span>{item.name}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">安全连接系统</h1>
            <p className="text-xs text-gray-500">v2.1.0</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4 space-y-1">
        {navigation.map((item) => renderNavItem(item))}
      </nav>
    </div>
  );
}
