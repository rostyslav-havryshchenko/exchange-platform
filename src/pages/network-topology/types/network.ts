/**
 * network.ts
 *
 * TypeScript types for network topology visualization.
 * Defines interfaces for nodes, links, and network health status.
 */

export type NodeType = 'exchange' | 'strategy' | 'data-feed' | 'market-maker';

export type HealthStatus = 'healthy' | 'warning' | 'error' | 'offline';

export interface NetworkNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  health: HealthStatus;
  data?: any; // Additional data for the node
  lastUpdate: string;
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  health: HealthStatus;
  latency?: number; // in milliseconds
  bandwidth?: number; // in Mbps
  lastUpdate: string;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  links: NetworkLink[];
  lastUpdate: string;
}

export interface ExchangeData {
  name: string;
  volume24h: number;
  pairs: number;
  uptime: number;
  latency: number;
}

export interface StrategyData {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pnl: number;
  trades: number;
  lastTrade: string;
} 