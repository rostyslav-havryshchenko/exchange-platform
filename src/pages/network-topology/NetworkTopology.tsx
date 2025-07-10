/**
 * NetworkTopology.tsx
 *
 * Network Topology page now only displays the Cryptocurrency Price Chart.
 */

import React from 'react';
import PriceChart from './components/PriceChart';

const NetworkTopology: React.FC = () => {
  return (
    <div>
      <PriceChart height={400} />
    </div>
  );
};

export default NetworkTopology; 