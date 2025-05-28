import { storage } from "./storage";
import type { 
  InsertUser, 
  InsertPolicy, 
  InsertAlert, 
  InsertNetworkNode,
  SystemMetrics,
  TrafficData 
} from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database with sample data...");

  try {
    // Seed sample users
    const sampleUsers: InsertUser[] = [
      {
        id: "user_admin_001",
        firstName: "张",
        lastName: "三",
        email: "zhang.san@company.com",
        role: "admin",
        status: "active",
        riskScore: 85,
        lastLoginAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: "user_002",
        firstName: "李",
        lastName: "四",
        email: "li.si@company.com",
        role: "user",
        status: "active",
        riskScore: 60,
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "user_003",
        firstName: "王",
        lastName: "五",
        email: "wang.wu@company.com",
        role: "guest",
        status: "inactive",
        riskScore: 25,
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    for (const user of sampleUsers) {
      await storage.upsertUser(user);
    }

    // Seed sample policies
    const samplePolicies: InsertPolicy[] = [
      {
        name: "VPN访问策略",
        description: "允许管理员从指定IP段通过VPN访问内部资源",
        subject: "admin_group",
        object: "internal_network",
        conditions: {
          ip_range: "192.168.1.0/24",
          time_range: "09:00-18:00",
        },
        action: "allow",
        priority: 10,
        enabled: true,
      },
      {
        name: "办公时间策略",
        description: "限制非办公时间的系统访问",
        subject: "user_group",
        object: "business_systems",
        conditions: {
          time_range: "09:00-18:00",
          location: "office",
        },
        action: "allow",
        priority: 5,
        enabled: true,
      },
      {
        name: "高风险设备阻断",
        description: "自动阻断高风险评分设备的访问",
        subject: "all_users",
        object: "critical_systems",
        conditions: {
          risk_score: "< 30",
        },
        action: "deny",
        priority: 20,
        enabled: false,
      },
      {
        name: "财务系统访问控制",
        description: "限制财务系统仅允许财务部门访问",
        subject: "finance_group",
        object: "finance_system",
        conditions: {
          department: "财务部",
          mfa_required: "true",
        },
        action: "allow",
        priority: 15,
        enabled: true,
      },
      {
        name: "VPN外部访问策略",
        description: "限制外部VPN访问的时间和权限",
        subject: "remote_users",
        object: "internal_systems",
        conditions: {
          connection_type: "vpn",
          time_range: "08:00-20:00",
          geo_location: "allowed_countries",
        },
        action: "allow",
        priority: 12,
        enabled: true,
      },
      {
        name: "管理员权限提升",
        description: "管理员账户的特殊权限提升策略",
        subject: "admin_group",
        object: "all_systems",
        conditions: {
          approval_required: "true",
          session_timeout: "30min",
        },
        action: "allow",
        priority: 25,
        enabled: true,
      },
      {
        name: "移动设备访问限制",
        description: "移动设备访问企业资源的安全策略",
        subject: "mobile_users",
        object: "corporate_resources",
        conditions: {
          device_compliance: "required",
          app_protection: "enabled",
        },
        action: "allow",
        priority: 8,
        enabled: true,
      },
      {
        name: "数据库访问审计",
        description: "数据库访问的详细审计和监控策略",
        subject: "database_users",
        object: "database_servers",
        conditions: {
          audit_logging: "enabled",
          privilege_escalation: "monitored",
        },
        action: "allow",
        priority: 18,
        enabled: true,
      },
      {
        name: "临时访客策略",
        description: "临时访客的受限访问权限策略",
        subject: "guest_users",
        object: "guest_network",
        conditions: {
          duration: "24hours",
          sponsor_approval: "required",
        },
        action: "allow",
        priority: 5,
        enabled: false,
      },
    ];

    for (const policy of samplePolicies) {
      await storage.createPolicy(policy);
    }

    // Seed sample alerts
    const sampleAlerts: InsertAlert[] = [
      {
        severity: "critical",
        type: "login_attempt",
        title: "可疑登录尝试",
        description: "检测到来自异常IP的多次登录失败",
        sourceIp: "192.168.1.100",
        targetService: "authentication_service",
        status: "in-progress",
        assignee: "张三",
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        severity: "medium",
        type: "policy_violation",
        title: "策略违规",
        description: "用户尝试在非授权时间访问系统",
        sourceUser: "john.doe",
        targetService: "finance_system",
        status: "new",
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        severity: "critical",
        type: "malware_detection",
        title: "恶意软件检测",
        description: "在设备上发现可疑的恶意软件活动",
        sourceIp: "192.168.1.45",
        targetService: "endpoint_protection",
        status: "resolved",
        assignee: "李四",
        createdAt: new Date(Date.now() - 32 * 60 * 1000),
      },
      {
        severity: "high",
        type: "data_exfiltration",
        title: "数据泄露尝试",
        description: "检测到异常的大量数据传输",
        sourceUser: "suspicious_user",
        targetIp: "external_server",
        status: "new",
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
      },
    ];

    for (const alert of sampleAlerts) {
      await storage.createAlert(alert);
    }

    // Seed network nodes
    const sampleNodes: InsertNetworkNode[] = [
      {
        name: "Core Switch",
        type: "switch",
        ipAddress: "192.168.1.1",
        status: "online",
        x: 400,
        y: 50,
      },
      {
        name: "srv-web-01",
        type: "server",
        ipAddress: "192.168.1.10",
        status: "online",
        cpuUsage: 45,
        memoryUsage: 68,
        connectionCount: 24,
        x: 200,
        y: 150,
      },
      {
        name: "srv-db-01",
        type: "server",
        ipAddress: "192.168.1.11",
        status: "online",
        cpuUsage: 32,
        memoryUsage: 55,
        connectionCount: 12,
        x: 600,
        y: 150,
      },
      {
        name: "PC-001",
        type: "workstation",
        ipAddress: "192.168.1.100",
        status: "warning",
        x: 100,
        y: 250,
      },
      {
        name: "PC-002",
        type: "workstation",
        ipAddress: "192.168.1.101",
        status: "online",
        x: 300,
        y: 250,
      },
      {
        name: "PC-003",
        type: "workstation",
        ipAddress: "192.168.1.102",
        status: "alert",
        x: 500,
        y: 250,
      },
      {
        name: "PC-004",
        type: "workstation",
        ipAddress: "192.168.1.103",
        status: "online",
        x: 700,
        y: 250,
      },
    ];

    for (const node of sampleNodes) {
      // First create and then get the created node to update it
      const createdNode = await storage.updateNetworkNode(0, node);
    }

    // Seed system metrics
    const systemMetrics: Omit<SystemMetrics, 'id' | 'timestamp'> = {
      activeConnections: 12847,
      authenticatedUsers: 8934,
      threatsBlocked: 247,
      policyViolations: 89,
    };

    await storage.createSystemMetrics(systemMetrics);

    // Seed traffic data for the last 24 hours
    const trafficData: Omit<TrafficData, 'id'>[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseInbound = 30 + Math.sin((23 - i) * Math.PI / 12) * 30 + Math.random() * 10;
      const baseOutbound = 25 + Math.sin((23 - i) * Math.PI / 12) * 25 + Math.random() * 8;
      
      trafficData.push({
        timestamp,
        inboundTraffic: Math.round(Math.max(0, baseInbound)),
        outboundTraffic: Math.round(Math.max(0, baseOutbound)),
      });
    }

    for (const traffic of trafficData) {
      await storage.createTrafficData(traffic);
    }

    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Auto-seed if this file is run directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
