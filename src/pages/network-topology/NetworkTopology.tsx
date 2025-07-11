/**
 * NetworkTopology.tsx
 *
 * Network Topology page now only displays the Cryptocurrency Price Chart.
 */

import React from 'react';
import { Tabs } from 'antd';
import PriceChart from './components/PriceChart';
import { TrendingCoins } from './components/TrendingCoins';

const NetworkTopology: React.FC = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="chart"
        destroyOnHidden
        items={[
          {
            key: 'chart',
            label: 'Price Chart',
            children: <PriceChart height={400} />,
          },
          {
            key: 'trending',
            label: 'Trending Coins',
            children: <TrendingCoins />,
          },
        ]}
      />
    </div>
  );
};

export default NetworkTopology; 