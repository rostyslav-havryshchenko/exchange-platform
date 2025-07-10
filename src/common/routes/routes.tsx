/**
 * routes/index.tsx
 *
 * Defines the application's route configuration for React Router.
 * Each route is lazy-loaded. Used by App.tsx to render pages.
 */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const NetworkTopology = lazy(() => import('../../pages/network-topology/NetworkTopology'));
const MathModels = lazy(() => import('../../pages/math-models/MathModels'));
const MarketOverview = lazy(() => import('../../pages/ market-overview/MarketOverview'));
const StrategyManagement = lazy(() => import('../../pages/strategy-management/StrategyManagement'));
const ArbitrageVisualizer = lazy(() => import('../../pages/arbitrage-visualizer/ArbitrageVisualizer'));
const ExecutionConsole = lazy(() => import('../../pages/execution-console/ExecutionConsole'));
const OfflineAnalytics = lazy(() => import('../../pages/offline-analytics/OfflineAnalytics'));

const routes: RouteObject[] = [
  { path: '/', element: <NetworkTopology /> },
  { path: '/math-models', element: <MathModels /> },
  { path: '/market-overview', element: <MarketOverview /> },
  { path: '/strategy-management', element: <StrategyManagement /> },
  { path: '/arbitrage-visualizer', element: <ArbitrageVisualizer /> },
  { path: '/execution-console', element: <ExecutionConsole /> },
  { path: '/offline-analytics', element: <OfflineAnalytics /> },
];

export default routes; 