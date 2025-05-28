import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertPolicySchema, insertAlertSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Users routes
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/users', isAuthenticated, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.upsertUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/users/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
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
  app.get('/api/policies', isAuthenticated, async (req, res) => {
    try {
      const policies = await storage.getAllPolicies();
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  app.post('/api/policies', isAuthenticated, async (req, res) => {
    try {
      const policyData = insertPolicySchema.parse(req.body);
      const policy = await storage.createPolicy(policyData);
      res.status(201).json(policy);
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(400).json({ message: "Failed to create policy" });
    }
  });

  app.put('/api/policies/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/policies/:id', isAuthenticated, async (req, res) => {
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
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Failed to create alert" });
    }
  });

  app.put('/api/alerts/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/alerts/:id', isAuthenticated, async (req, res) => {
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
  app.get('/api/network-nodes', isAuthenticated, async (req, res) => {
    try {
      const nodes = await storage.getAllNetworkNodes();
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching network nodes:", error);
      res.status(500).json({ message: "Failed to fetch network nodes" });
    }
  });

  // System metrics routes
  app.get('/api/system-metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getLatestSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  // Traffic data routes
  app.get('/api/traffic-data', isAuthenticated, async (req, res) => {
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
