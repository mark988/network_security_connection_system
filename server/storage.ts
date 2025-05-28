import {
  users,
  policies,
  alerts,
  networkNodes,
  systemMetrics,
  trafficData,
  type User,
  type UpsertUser,
  type InsertUser,
  type Policy,
  type InsertPolicy,
  type Alert,
  type InsertAlert,
  type NetworkNode,
  type InsertNetworkNode,
  type SystemMetrics,
  type TrafficData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Additional user operations
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Policy operations
  getAllPolicies(): Promise<Policy[]>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(id: number, policy: Partial<InsertPolicy>): Promise<Policy>;
  deletePolicy(id: number): Promise<void>;
  
  // Alert operations
  getAllAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert>;
  deleteAlert(id: number): Promise<void>;
  
  // Network node operations
  getAllNetworkNodes(): Promise<NetworkNode[]>;
  updateNetworkNode(id: number, node: Partial<InsertNetworkNode>): Promise<NetworkNode>;
  
  // Metrics operations
  getLatestSystemMetrics(): Promise<SystemMetrics | undefined>;
  createSystemMetrics(metrics: Omit<SystemMetrics, 'id' | 'timestamp'>): Promise<SystemMetrics>;
  
  // Traffic data operations
  getTrafficData(hours?: number): Promise<TrafficData[]>;
  createTrafficData(data: Omit<TrafficData, 'id'>): Promise<TrafficData>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Additional user operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Policy operations
  async getAllPolicies(): Promise<Policy[]> {
    return await db.select().from(policies).orderBy(desc(policies.priority));
  }

  async createPolicy(policyData: InsertPolicy): Promise<Policy> {
    const [policy] = await db
      .insert(policies)
      .values(policyData)
      .returning();
    return policy;
  }

  async updatePolicy(id: number, policyData: Partial<InsertPolicy>): Promise<Policy> {
    const [policy] = await db
      .update(policies)
      .set({ ...policyData, updatedAt: new Date() })
      .where(eq(policies.id, id))
      .returning();
    return policy;
  }

  async deletePolicy(id: number): Promise<void> {
    await db.delete(policies).where(eq(policies.id, id));
  }

  // Alert operations
  async getAllAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(alertData)
      .returning();
    return alert;
  }

  async updateAlert(id: number, alertData: Partial<InsertAlert>): Promise<Alert> {
    const [alert] = await db
      .update(alerts)
      .set({ ...alertData, updatedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  async deleteAlert(id: number): Promise<void> {
    await db.delete(alerts).where(eq(alerts.id, id));
  }

  // Network node operations
  async getAllNetworkNodes(): Promise<NetworkNode[]> {
    return await db.select().from(networkNodes);
  }

  async updateNetworkNode(id: number, nodeData: Partial<InsertNetworkNode>): Promise<NetworkNode> {
    const [node] = await db
      .update(networkNodes)
      .set({ ...nodeData, updatedAt: new Date() })
      .where(eq(networkNodes.id, id))
      .returning();
    return node;
  }

  // Metrics operations
  async getLatestSystemMetrics(): Promise<SystemMetrics | undefined> {
    const [metrics] = await db
      .select()
      .from(systemMetrics)
      .orderBy(desc(systemMetrics.timestamp))
      .limit(1);
    return metrics;
  }

  async createSystemMetrics(metricsData: Omit<SystemMetrics, 'id' | 'timestamp'>): Promise<SystemMetrics> {
    const [metrics] = await db
      .insert(systemMetrics)
      .values(metricsData)
      .returning();
    return metrics;
  }

  // Traffic data operations
  async getTrafficData(hours: number = 24): Promise<TrafficData[]> {
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);
    
    return await db
      .select()
      .from(trafficData)
      .where(gte(trafficData.timestamp, hoursAgo))
      .orderBy(trafficData.timestamp);
  }

  async createTrafficData(data: Omit<TrafficData, 'id'>): Promise<TrafficData> {
    const [traffic] = await db
      .insert(trafficData)
      .values(data)
      .returning();
    return traffic;
  }
}

export const storage = new DatabaseStorage();
