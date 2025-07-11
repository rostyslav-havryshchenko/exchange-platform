import React from 'react';
import { formatPrice, formatDate } from '../utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
  timePeriod: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = React.memo(({ 
  active, 
  payload, 
  label, 
  timePeriod 
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px'
      }}>
        <p><strong>{formatDate(label!, timePeriod)}</strong></p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color, margin: 0 }}>
            {entry.name}: {formatPrice(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

export default CustomTooltip;