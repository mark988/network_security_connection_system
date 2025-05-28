import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TrafficData } from "@shared/schema";

interface TrafficChartProps {
  data?: TrafficData[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  // Mock data for demonstration
  const mockData = [
    { time: "00:00", inbound: 30, outbound: 25 },
    { time: "04:00", inbound: 25, outbound: 20 },
    { time: "08:00", inbound: 45, outbound: 35 },
    { time: "12:00", inbound: 85, outbound: 70 },
    { time: "16:00", inbound: 92, outbound: 80 },
    { time: "20:00", inbound: 78, outbound: 65 },
    { time: "24:00", inbound: 45, outbound: 35 },
  ];

  const chartData = data ? data.map((item, index) => ({
    time: new Date(item.timestamp!).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    inbound: item.inboundTraffic,
    outbound: item.outboundTraffic,
  })) : mockData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>网络流量趋势</CardTitle>
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                label={{ 
                  value: 'Mbps', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#0F62FE"
                strokeWidth={2}
                dot={{ fill: "#0F62FE", strokeWidth: 2, r: 4 }}
                name="入站流量 (Mbps)"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#24A148"
                strokeWidth={2}
                dot={{ fill: "#24A148", strokeWidth: 2, r: 4 }}
                name="出站流量 (Mbps)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
