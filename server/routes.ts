import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Direct authentication middleware
const customAuth = async (req: any, res: any, next: any) => {
  // Debug session info
  console.log("Session check:", {
    hasSession: !!req.session,
    hasUser: !!req.session?.user,
    userId: req.session?.user?.id,
    isAuthenticated: req.isAuthenticated?.(),
    hasReplit: !!req.user?.claims?.sub
  });
  
  // Check custom session first
  if (req.session?.user?.id) {
    return next();
  }
  
  // Check Replit auth session
  if (req.isAuthenticated?.() && req.user?.claims?.sub) {
    return next();
  }
  
  res.status(401).json({ message: "Unauthorized" });
};
import { insertUserSchema, insertPolicySchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Custom login route for direct authentication
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication for demo purposes
    if (username === "admin" && password === "123") {
      // Create or get admin user
      let user = await storage.getUser("admin");
      if (!user) {
        user = await storage.upsertUser({
          id: "admin",
          email: "admin@company.com",
          firstName: "系统",
          lastName: "管理员",
          profileImageUrl: null,
        });
      }
      
      // Set session
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "账号或密码错误" });
    }
  });

  // Modified auth user route to support both session types
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for custom session first
      if (req.session?.user) {
        const user = await storage.getUser(req.session.user.id);
        if (user) {
          return res.json(user);
        }
      }
      
      // Fallback to Replit auth only if no custom session exists
      if (!req.session?.user && req.customAuth?.() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Custom logout route
  app.post('/api/auth/logout', (req: any, res) => {
    // Clear custom session data
    if (req.session) {
      req.session.user = null;
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
    }
    
    // Also logout from passport if exists
    if (req.logout) {
      req.logout(() => {});
    }
    
    // Clear all cookies
    res.clearCookie('connect.sid');
    res.clearCookie('session');
    
    res.json({ success: true });
  });

  // Forgot password route (模拟邮件发送)
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: "请提供有效的邮箱地址" 
        });
      }

      // 模拟检查用户是否存在（这里简化处理，实际项目中需要检查数据库）
      console.log(`模拟发送密码重置邮件到: ${email}`);
      
      // 模拟发送邮件延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 返回成功响应
      res.json({ 
        success: true, 
        message: "密码重置链接已发送到您的邮箱" 
      });
      
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ 
        success: false, 
        message: "服务器错误，请稍后重试" 
      });
    }
  });

  // Users routes  
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.upsertUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Policies routes
  app.get('/api/policies', async (req, res) => {
    try {
      const policies = await storage.getAllPolicies();
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  app.post('/api/policies', async (req, res) => {
    try {
      const policyData = insertPolicySchema.parse(req.body);
      const policy = await storage.createPolicy(policyData);
      res.status(201).json(policy);
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(400).json({ message: "Failed to create policy" });
    }
  });

  app.put('/api/policies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const policyData = insertPolicySchema.partial().parse(req.body);
      const policy = await storage.updatePolicy(parseInt(id), policyData);
      res.json(policy);
    } catch (error) {
      console.error("Error updating policy:", error);
      res.status(400).json({ message: "Failed to update policy" });
    }
  });

  app.delete('/api/policies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePolicy(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting policy:", error);
      res.status(500).json({ message: "Failed to delete policy" });
    }
  });

  // Alerts routes
  app.get('/api/alerts', async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Failed to create alert" });
    }
  });

  app.put('/api/alerts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const alertData = insertAlertSchema.partial().parse(req.body);
      const alert = await storage.updateAlert(parseInt(id), alertData);
      res.json(alert);
    } catch (error) {
      console.error("Error updating alert:", error);
      res.status(400).json({ message: "Failed to update alert" });
    }
  });

  app.delete('/api/alerts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAlert(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Network nodes routes
  app.get('/api/network-nodes', async (req, res) => {
    try {
      const nodes = await storage.getAllNetworkNodes();
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching network nodes:", error);
      res.status(500).json({ message: "Failed to fetch network nodes" });
    }
  });

  // System metrics routes
  app.get('/api/system-metrics', async (req, res) => {
    try {
      const metrics = await storage.getLatestSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  // Traffic data routes
  app.get('/api/traffic-data', async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const trafficData = await storage.getTrafficData(hours);
      res.json(trafficData);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
