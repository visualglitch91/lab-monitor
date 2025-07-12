export interface UnifiedProcess {
  id: string;
  name: string;
  status: "running" | "stopped";
  uptime: number;
  cpu: number;
  memory: number;
  stack?: string;
  type: "pm2" | "docker";
}

export interface StackSummary {
  name: string;
  searchIndex: string;
  processes: UnifiedProcess[];
  type: "pm2" | "docker";
  memory: number;
  cpu: number;
  status: "running" | "partial" | "stopped";
}

export interface ServerData {
  hostname: string;
  cpuUsage: number;
  memory: { used: number; free: number; total: number };
  apps: UnifiedProcess[];
}

export interface ClientData {
  server: Omit<ServerData, "apps">;
  stacks: StackSummary[];
}

export type Action = "start" | "restart" | "stop";
