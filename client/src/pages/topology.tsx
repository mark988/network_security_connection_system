import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Maximize, RefreshCw } from "lucide-react";
import type { NetworkNode } from "@shared/schema";

export default function Topology() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [showServers, setShowServers] = useState(true);
  const [showSwitches, setShowSwitches] = useState(true);
  const [showIoT, setShowIoT] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);

  const { data: networkNodes = [], isLoading } = useQuery({
    queryKey: ["/api/network-nodes"],
  });

  // Mock network topology data for visualization
  const mockNodes = [
    { id: "core-switch", name: "Core Switch", type: "switch", x: 400, y: 50, status: "online", ipAddress: "192.168.1.1" },
    { id: "srv-web-01", name: "srv-web-01", type: "server", x: 200, y: 150, status: "online", ipAddress: "192.168.1.10", cpuUsage: 45, memoryUsage: 68, connectionCount: 24 },
    { id: "srv-db-01", name: "srv-db-01", type: "server", x: 600, y: 150, status: "online", ipAddress: "192.168.1.11", cpuUsage: 32, memoryUsage: 55, connectionCount: 12 },
    { id: "pc-001", name: "PC-001", type: "workstation", x: 100, y: 250, status: "warning", ipAddress: "192.168.1.100" },
    { id: "pc-002", name: "PC-002", type: "workstation", x: 300, y: 250, status: "online", ipAddress: "192.168.1.101" },
    { id: "pc-003", name: "PC-003", type: "workstation", x: 500, y: 250, status: "alert", ipAddress: "192.168.1.102" },
    { id: "pc-004", name: "PC-004", type: "workstation", x: 700, y: 250, status: "online", ipAddress: "192.168.1.103" },
  ];

  const getNodeColor = (status: string) => {
    switch (status) {
      case "online": return "#24A148";
      case "warning": return "#F1C21B";
      case "alert": return "#DA1E28";
      default: return "#525252";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "online": return "正常";
      case "warning": return "警告";
      case "alert": return "故障/威胁";
      default: return "未知";
    }
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">网络拓扑可视化</h1>
        <p className="text-carbon-gray-70">实时、交互式地展示网络结构、连接状态、数据流向和潜在安全风险点</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>网络拓扑图</CardTitle>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Maximize className="w-4 h-4 mr-2" />
                全屏
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Topology Controls */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-medium text-carbon-gray-70 uppercase tracking-wider mb-4">
                图层控制
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="servers" 
                    checked={showServers} 
                    onCheckedChange={setShowServers} 
                  />
                  <label htmlFor="servers" className="text-sm text-gray-700">服务器</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="switches" 
                    checked={showSwitches} 
                    onCheckedChange={setShowSwitches} 
                  />
                  <label htmlFor="switches" className="text-sm text-gray-700">交换机</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="iot" 
                    checked={showIoT} 
                    onCheckedChange={setShowIoT} 
                  />
                  <label htmlFor="iot" className="text-sm text-gray-700">IoT设备</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="alerts" 
                    checked={showAlerts} 
                    onCheckedChange={setShowAlerts} 
                  />
                  <label htmlFor="alerts" className="text-sm text-gray-700">安全警报</label>
                </div>
              </div>

              {selectedNode && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-carbon-gray-70 uppercase tracking-wider mb-4">
                    节点信息
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm space-y-2">
                      <div className="font-medium text-gray-900 mb-2">
                        选中节点: {selectedNode.name}
                      </div>
                      <div className="space-y-1 text-carbon-gray-70">
                        <div>IP: {selectedNode.ipAddress}</div>
                        <div>类型: {selectedNode.type === "server" ? "服务器" : selectedNode.type === "switch" ? "交换机" : "工作站"}</div>
                        <div className="flex items-center">
                          状态: 
                          <Badge 
                            variant="outline" 
                            className="ml-2"
                            style={{ color: getNodeColor(selectedNode.status) }}
                          >
                            {getStatusLabel(selectedNode.status)}
                          </Badge>
                        </div>
                        {selectedNode.connectionCount && (
                          <div>连接数: {selectedNode.connectionCount}</div>
                        )}
                        {selectedNode.cpuUsage && (
                          <div>CPU: {selectedNode.cpuUsage}%</div>
                        )}
                        {selectedNode.memoryUsage && (
                          <div>内存: {selectedNode.memoryUsage}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Network Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg h-96 relative overflow-hidden">
                {/* Network topology visualization */}
                <svg className="w-full h-full" viewBox="0 0 800 400">
                  {/* Connections */}
                  <g id="connections">
                    <line x1="400" y1="65" x2="200" y2="135" stroke="#525252" strokeWidth="2" />
                    <line x1="400" y1="65" x2="600" y2="135" stroke="#525252" strokeWidth="2" />
                    <line x1="200" y1="162" x2="100" y2="238" stroke="#525252" strokeWidth="1" />
                    <line x1="200" y1="162" x2="300" y2="238" stroke="#525252" strokeWidth="1" />
                    <line x1="600" y1="162" x2="500" y2="238" stroke="#525252" strokeWidth="1" />
                    <line x1="600" y1="162" x2="700" y2="238" stroke="#525252" strokeWidth="1" />
                  </g>

                  {/* Network nodes */}
                  <g id="nodes">
                    {mockNodes.map((node) => {
                      const shouldShow = 
                        (node.type === "server" && showServers) ||
                        (node.type === "switch" && showSwitches) ||
                        (node.type === "workstation" && true); // Always show workstations

                      if (!shouldShow) return null;

                      const radius = node.type === "switch" ? 15 : node.type === "server" ? 12 : 10;
                      const color = getNodeColor(node.status);

                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill={color}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => handleNodeClick(node)}
                          />
                          <text
                            x={node.x}
                            y={node.y - radius - 5}
                            textAnchor="middle"
                            fill="white"
                            className="text-xs font-medium"
                          >
                            {node.name}
                          </text>
                          
                          {/* Alert indicator for PC-003 */}
                          {node.status === "alert" && showAlerts && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={20}
                              fill="none"
                              stroke="#DA1E28"
                              strokeWidth="2"
                              opacity="0.7"
                            >
                              <animate 
                                attributeName="r" 
                                values="15;25;15" 
                                dur="2s" 
                                repeatCount="indefinite"
                              />
                              <animate 
                                attributeName="opacity" 
                                values="0.7;0.2;0.7" 
                                dur="2s" 
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 rounded-lg p-3">
                  <div className="flex space-x-4 text-xs text-white">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>正常</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>警告</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>故障/威胁</span>
                    </div>
                  </div>
                </div>

                {/* Minimap */}
                <div className="absolute top-4 right-4 w-24 h-16 bg-black bg-opacity-50 rounded border border-gray-600">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-1 border border-blue-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
