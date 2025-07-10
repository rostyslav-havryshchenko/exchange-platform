/**
 * App.tsx
 *
 * The main application component. Sets up Ant Design layout, header, and content wrappers.
 * Integrates the AppMenu and renders the current route using React Router.
 * All page content is wrapped for consistent max-width and padding.
 */
import { Layout } from 'antd';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import './App.scss';
import AppMenu from './components/AppMenu';
import routes from './routes';

const { Header, Content } = Layout;

const menuItems = [
  { label: 'Network Topology', key: '/' },
  { label: 'Math Models & Signal Engines', key: '/math-models' },
  { label: 'Market Overview', key: '/market-overview' },
  { label: 'Strategy Management', key: '/strategy-management' },
  { label: 'Arbitrage Visualizer', key: '/arbitrage-visualizer' },
  { label: 'Execution Console', key: '/execution-console' },
  { label: 'Offline Analytics', key: '/offline-analytics' },
];

function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
          <div className="page-wrapper">
            <AppMenu items={menuItems} />
          </div>
        </Header>
        <Content style={{ padding: '24px 0', width: '100%' }}>
          <div className="page-wrapper">
            <AppRoutes />
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
