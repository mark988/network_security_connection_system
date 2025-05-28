import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  User, 
  Monitor, 
  Server, 
  Users, 
  Shield,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 模拟身份数据类型
interface Identity {
  id: string;
  name: string;
  type: "user" | "device" | "service" | "group" | "role";
  status: "active" | "inactive" | "suspended";
  email?: string;
  department?: string;
  lastLogin?: string;
  riskScore: number;
  ipAddress?: string;
  groups?: string[];
  roles?: string[];
  deviceType?: string;
  serviceEndpoint?: string;
  createdAt: string;
  description?: string;
}

export default function Identity() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 高级过滤状态
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [filterRiskScore, setFilterRiskScore] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 模拟身份数据
  const mockIdentities: Identity[] = [
    {
      id: "usr_001",
      name: "张三",
      type: "user",
      status: "active",
      email: "zhang.san@company.com",
      department: "技术部",
      lastLogin: "2025-05-28 10:30",
      riskScore: 85,
      groups: ["技术团队", "项目组A"],
      roles: ["开发者", "系统管理员"],
      createdAt: "2024-01-15"
    },
    {
      id: "usr_002", 
      name: "李四",
      type: "user",
      status: "active",
      email: "li.si@company.com",
      department: "财务部",
      lastLogin: "2025-05-28 09:15",
      riskScore: 92,
      groups: ["财务团队"],
      roles: ["财务专员"],
      createdAt: "2024-02-10"
    },
    {
      id: "dev_001",
      name: "财务部工作站",
      type: "device",
      status: "active",
      ipAddress: "192.168.1.100",
      deviceType: "工作站",
      riskScore: 78,
      lastLogin: "2025-05-28 08:45",
      createdAt: "2024-03-01"
    },
    {
      id: "dev_002",
      name: "会议室投影仪",
      type: "device", 
      status: "inactive",
      ipAddress: "192.168.1.205",
      deviceType: "IoT设备",
      riskScore: 65,
      lastLogin: "2025-05-27 16:20",
      createdAt: "2024-04-15"
    },
    {
      id: "svc_001",
      name: "数据库服务",
      type: "service",
      status: "active",
      serviceEndpoint: "db.internal.com:5432",
      riskScore: 95,
      description: "核心业务数据库服务",
      createdAt: "2024-01-01"
    },
    {
      id: "grp_001",
      name: "技术团队",
      type: "group",
      status: "active",
      description: "包含所有技术部门员工",
      riskScore: 88,
      createdAt: "2024-01-01"
    },
    {
      id: "rol_001",
      name: "系统管理员",
      type: "role",
      status: "active",
      description: "拥有系统完整管理权限",
      riskScore: 99,
      createdAt: "2024-01-01"
    }
  ];

  // 过滤身份数据
  const filteredIdentities = useMemo(() => {
    return mockIdentities.filter(identity => {
      const matchesTab = activeTab === "all" || 
        (activeTab === "users" && identity.type === "user") ||
        (activeTab === "devices" && identity.type === "device") ||
        (activeTab === "services" && identity.type === "service") ||
        (activeTab === "groups" && identity.type === "group") ||
        (activeTab === "roles" && identity.type === "role");

      const matchesSearch = identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (identity.email && identity.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = selectedStatus === "all" || identity.status === selectedStatus;
      const matchesType = selectedType === "all" || identity.type === selectedType;

      // 高级过滤
      const matchesAdvancedName = !filterName || identity.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesAdvancedDepartment = !filterDepartment || filterDepartment === "all" ||
        (identity.department && identity.department.includes(filterDepartment));
      const matchesAdvancedRisk = !filterRiskScore || filterRiskScore === "all" ||
        (filterRiskScore === "high" && identity.riskScore >= 90) ||
        (filterRiskScore === "medium" && identity.riskScore >= 70 && identity.riskScore < 90) ||
        (filterRiskScore === "low" && identity.riskScore < 70);

      return matchesTab && matchesSearch && matchesStatus && matchesType && 
             matchesAdvancedName && matchesAdvancedDepartment && matchesAdvancedRisk;
    });
  }, [activeTab, searchTerm, selectedStatus, selectedType, filterName, filterDepartment, filterRiskScore]);

  // 获取身份类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="h-4 w-4" />;
      case "device": return <Monitor className="h-4 w-4" />;
      case "service": return <Server className="h-4 w-4" />;
      case "group": return <Users className="h-4 w-4" />;
      case "role": return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // 获取风险等级颜色
  const getRiskColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // 处理选择项目
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 处理全选
  const handleSelectAll = () => {
    if (selectedItems.length === filteredIdentities.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredIdentities.map(identity => identity.id));
    }
  };

  // 批量操作函数
  const simulateBatchOperation = async (operation: string) => {
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStatus(`正在${operation}${selectedItems.length}个身份...`);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProcessProgress(i);
      if (i === 50) {
        setProcessStatus(`${operation}进度：${selectedItems.length}个身份中的${Math.floor(selectedItems.length / 2)}个已完成`);
      }
    }

    setProcessStatus(`${operation}完成！`);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedItems([]);
      toast({
        title: "操作成功",
        description: `已成功${operation}${selectedItems.length}个身份`,
      });
    }, 1000);
  };

  const handleBatchImport = () => {
    setShowImportDialog(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const confirmImport = async () => {
    if (!selectedFile) {
      toast({
        title: "请选择文件",
        description: "请先选择要导入的文件",
        variant: "destructive",
      });
      return;
    }

    setShowImportDialog(false);
    await simulateBatchOperation(`导入文件: ${selectedFile.name}`);
    setSelectedFile(null);
  };
  const handleBatchExport = () => simulateBatchOperation("导出");
  const handleBatchEnable = () => simulateBatchOperation("启用");
  const handleBatchDisable = () => simulateBatchOperation("禁用");
  const handleBatchDelete = () => simulateBatchOperation("删除");

  // 打开详情面板
  const openDetails = (identity: Identity) => {
    setSelectedIdentity(identity);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">大规模身份管理</h1>
        <p className="text-carbon-gray-70">统一管理企业内所有用户、设备、服务身份及其属性、分组、角色和生命周期</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>身份管理中心</CardTitle>
          
          {/* 分类标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 w-full max-w-2xl">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="users">用户</TabsTrigger>
              <TabsTrigger value="devices">设备</TabsTrigger>
              <TabsTrigger value="services">服务</TabsTrigger>
              <TabsTrigger value="groups">用户组</TabsTrigger>
              <TabsTrigger value="roles">角色</TabsTrigger>
            </TabsList>

            {/* 搜索和过滤栏 */}
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索身份、邮箱、IP地址..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                    <SelectItem value="suspended">暂停</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="user">用户</SelectItem>
                    <SelectItem value="device">设备</SelectItem>
                    <SelectItem value="service">服务</SelectItem>
                    <SelectItem value="group">用户组</SelectItem>
                    <SelectItem value="role">角色</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline"
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  高级过滤
                </Button>
              </div>

              {/* 操作按钮栏 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    新增身份
                  </Button>
                  <Button variant="outline" onClick={handleBatchImport} disabled={isProcessing}>
                    <Upload className="h-4 w-4 mr-2" />
                    批量导入
                  </Button>
                  <Button variant="outline" onClick={handleBatchExport} disabled={isProcessing}>
                    <Download className="h-4 w-4 mr-2" />
                    导出数据
                  </Button>
                </div>

                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      已选择 {selectedItems.length} 项
                    </span>
                    <Button size="sm" variant="outline" onClick={handleBatchEnable} disabled={isProcessing}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      批量启用
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleBatchDisable} disabled={isProcessing}>
                      <UserX className="h-4 w-4 mr-2" />
                      批量禁用
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          批量删除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除选中的 {selectedItems.length} 个身份吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleBatchDelete}>
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent>
          {/* 高级过滤展开面板 */}
          {showAdvancedFilter && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">高级过滤条件</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <Input
                    placeholder="搜索姓名..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部部门</SelectItem>
                      <SelectItem value="技术部">技术部</SelectItem>
                      <SelectItem value="财务部">财务部</SelectItem>
                      <SelectItem value="人事部">人事部</SelectItem>
                      <SelectItem value="运营部">运营部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">风险等级</label>
                  <Select value={filterRiskScore} onValueChange={setFilterRiskScore}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择风险等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="high">高风险 (≥90)</SelectItem>
                      <SelectItem value="medium">中风险 (70-89)</SelectItem>
                      <SelectItem value="low">低风险 (小于70)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                  <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择时间" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部时间</SelectItem>
                      <SelectItem value="today">今天</SelectItem>
                      <SelectItem value="week">最近一周</SelectItem>
                      <SelectItem value="month">最近一月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterName("");
                    setFilterDepartment("all");
                    setFilterRiskScore("all");
                    setFilterDateRange("all");
                  }}
                >
                  清除过滤
                </Button>
                <Button onClick={() => setShowAdvancedFilter(false)}>
                  应用过滤
                </Button>
              </div>
            </div>
          )}

          {/* 批量操作进度条 */}
          {isProcessing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{processStatus}</span>
                <span className="text-sm text-gray-600">{processProgress}%</span>
              </div>
              <Progress value={processProgress} className="h-2" />
            </div>
          )}

          {/* 主数据列表 */}
          <div className="space-y-4">
            {/* 表头 */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedItems.length === filteredIdentities.length && filteredIdentities.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div className="col-span-3">身份信息</div>
              <div className="col-span-2">类型/状态</div>
              <div className="col-span-2">部门/位置</div>
              <div className="col-span-2">最后活动</div>
              <div className="col-span-1">风险评分</div>
              <div className="col-span-1">操作</div>
            </div>

            {/* 数据行 */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredIdentities.map((identity) => (
                <div
                  key={identity.id}
                  className="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openDetails(identity)}
                >
                  <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedItems.includes(identity.id)}
                      onCheckedChange={() => handleSelectItem(identity.id)}
                    />
                  </div>
                  
                  <div className="col-span-3 flex items-center space-x-3">
                    {getTypeIcon(identity.type)}
                    <div>
                      <div className="font-medium text-gray-900">{identity.name}</div>
                      <div className="text-sm text-gray-500">
                        {identity.email || identity.ipAddress || identity.serviceEndpoint || identity.id}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {identity.type === "user" ? "用户" : 
                       identity.type === "device" ? "设备" :
                       identity.type === "service" ? "服务" :
                       identity.type === "group" ? "用户组" : "角色"}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(identity.status)}`}>
                      {identity.status === "active" ? "启用" : 
                       identity.status === "inactive" ? "禁用" : "暂停"}
                    </Badge>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600">
                      {identity.department || identity.deviceType || identity.description || "-"}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600">
                      {identity.lastLogin || "-"}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center">
                    <span className={`text-sm font-medium ${getRiskColor(identity.riskScore)}`}>
                      {identity.riskScore}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetails(identity)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="h-4 w-4 mr-2" />
                          重置密码
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {identity.status === "active" ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              禁用
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              启用
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {filteredIdentities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                没有找到匹配的身份数据
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 详情侧滑面板 */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-[600px] sm:w-[600px]">
          {selectedIdentity && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  {getTypeIcon(selectedIdentity.type)}
                  <span>{selectedIdentity.name}</span>
                </SheetTitle>
                <SheetDescription>
                  {selectedIdentity.type === "user" ? "用户身份详细信息" :
                   selectedIdentity.type === "device" ? "设备身份详细信息" :
                   selectedIdentity.type === "service" ? "服务身份详细信息" :
                   selectedIdentity.type === "group" ? "用户组详细信息" : "角色详细信息"}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* 基本信息 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">基本信息</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-mono">{selectedIdentity.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">名称:</span>
                      <span>{selectedIdentity.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">类型:</span>
                      <Badge variant="outline">{selectedIdentity.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态:</span>
                      <Badge className={getStatusColor(selectedIdentity.status)}>
                        {selectedIdentity.status}
                      </Badge>
                    </div>
                    {selectedIdentity.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">邮箱:</span>
                        <span>{selectedIdentity.email}</span>
                      </div>
                    )}
                    {selectedIdentity.department && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">部门:</span>
                        <span>{selectedIdentity.department}</span>
                      </div>
                    )}
                    {selectedIdentity.ipAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IP地址:</span>
                        <span className="font-mono">{selectedIdentity.ipAddress}</span>
                      </div>
                    )}
                    {selectedIdentity.serviceEndpoint && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">服务端点:</span>
                        <span className="font-mono">{selectedIdentity.serviceEndpoint}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">风险评分:</span>
                      <span className={`font-medium ${getRiskColor(selectedIdentity.riskScore)}`}>
                        {selectedIdentity.riskScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">创建时间:</span>
                      <span>{selectedIdentity.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* 分组和角色 */}
                {(selectedIdentity.groups || selectedIdentity.roles) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">权限信息</h4>
                    {selectedIdentity.groups && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600 block mb-2">所属用户组:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedIdentity.groups.map((group) => (
                            <Badge key={group} variant="secondary">{group}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedIdentity.roles && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">分配角色:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedIdentity.roles.map((role) => (
                            <Badge key={role} variant="secondary">{role}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    查看日志
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* 批量导入文件对话框 */}
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>批量导入身份数据</AlertDialogTitle>
            <AlertDialogDescription>
              请选择要导入的CSV或Excel文件，支持的格式：.csv、.xlsx、.xls
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                {selectedFile ? `已选择文件: ${selectedFile.name}` : "拖拽文件到此处，或点击选择文件"}
              </p>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-input')?.click()}
              >
                选择文件
              </Button>
            </div>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">
                    文件已准备就绪：{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFile(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>
              开始导入
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}