import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TrafficData } from "@shared/schema";

interface TrafficChartProps {
  data?: TrafficData[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  // Enhanced mock data with more realistic patterns
  const mockData = [
    { time: "00:00", inbound: 32, outbound: 28, packets: 1240, connections: 45 },
    { time: "02:00", inbound: 28, outbound: 22, packets: 980, connections: 38 },
    { time: "04:00", inbound: 25, outbound: 20, packets: 850, connections: 32 },
    { time: "06:00", inbound: 35, outbound: 30, packets: 1180, connections: 55 },
    { time: "08:00", inbound: 65, outbound: 48, packets: 2340, connections: 125 },
    { time: "10:00", inbound: 88, outbound: 72, packets: 3200, connections: 185 },
    { time: "12:00", inbound: 95, outbound: 78, packets: 3650, connections: 220 },
    { time: "14:00", inbound: 92, outbound: 85, packets: 3580, connections: 235 },
    { time: "16:00", inbound: 98, outbound: 88, packets: 3820, connections: 250 },
    { time: "18:00", inbound: 85, outbound: 75, packets: 3200, connections: 195 },
    { time: "20:00", inbound: 72, outbound: 62, packets: 2580, connections: 155 },
    { time: "22:00", inbound: 55, outbound: 45, packets: 1980, connections: 88 },
  ];

  const chartData = data && data.length > 0 ? data.map((item, index) => ({
    time: new Date(item.timestamp!).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    inbound: item.inboundTraffic,
    outbound: item.outboundTraffic,
  })) : mockData;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>网络流量趋势</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
          <Select defaultValue="24h">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">最近24小时</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-lg"></div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0F62FE" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#24A148" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#24A148" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                label={{ 
                  value: 'Mbps', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#0F62FE"
                strokeWidth={3}
                dot={{ fill: "#0F62FE", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#0F62FE", strokeWidth: 2, fill: "white" }}
                name="入站流量 (Mbps)"
                fill="url(#inboundGradient)"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#24A148"
                strokeWidth={3}
                dot={{ fill: "#24A148", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#24A148", strokeWidth: 2, fill: "white" }}
                name="出站流量 (Mbps)"
                fill="url(#outboundGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Additional metrics */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {chartData[chartData.length - 1]?.inbound || 55}
            </div>
            <div className="text-xs text-gray-500">当前入站 (Mbps)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {chartData[chartData.length - 1]?.outbound || 45}
            </div>
            <div className="text-xs text-gray-500">当前出站 (Mbps)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((chartData.reduce((sum, item) => sum + item.inbound + item.outbound, 0) / chartData.length) * 10) / 10}
            </div>
            <div className="text-xs text-gray-500">平均流量 (Mbps)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
