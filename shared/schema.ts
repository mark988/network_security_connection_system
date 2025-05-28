import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"),
  status: varchar("status").notNull().default("active"),
  lastLoginAt: timestamp("last_login_at"),
  riskScore: integer("risk_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  subject: varchar("subject").notNull(),
  object: varchar("object").notNull(),
  conditions: jsonb("conditions").notNull(),
  action: varchar("action").notNull(),
  priority: integer("priority").default(0),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  severity: varchar("severity").notNull(),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  sourceIp: varchar("source_ip"),
  targetIp: varchar("target_ip"),
  sourceUser: varchar("source_user"),
  targetService: varchar("target_service"),
  status: varchar("status").notNull().default("new"),
  assignee: varchar("assignee"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const networkNodes = pgTable("network_nodes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  ipAddress: varchar("ip_address"),
  status: varchar("status").notNull().default("online"),
  cpuUsage: integer("cpu_usage").default(0),
  memoryUsage: integer("memory_usage").default(0),
  connectionCount: integer("connection_count").default(0),
  x: integer("x").default(0),
  y: integer("y").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  activeConnections: integer("active_connections").notNull(),
  authenticatedUsers: integer("authenticated_users").notNull(),
  threatsBlocked: integer("threats_blocked").notNull(),
  policyViolations: integer("policy_violations").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const trafficData = pgTable("traffic_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  inboundTraffic: integer("inbound_traffic").notNull(),
  outboundTraffic: integer("outbound_traffic").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNetworkNodeSchema = createInsertSchema(networkNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type NetworkNode = typeof networkNodes.$inferSelect;
export type InsertNetworkNode = z.infer<typeof insertNetworkNodeSchema>;

export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type TrafficData = typeof trafficData.$inferSelect;
