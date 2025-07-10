/**
 * PriceChart.tsx
 *
 * Interactive cryptocurrency price chart using Recharts.
 * Allows selection of cryptocurrency and time period.
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Space, Typography, Spin, Alert } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { coinGeckoService, type CryptoData, type PriceDataPoint, type TimePeriod } from '../services/coingecko';

const { Text } = Typography;
const { Option } = Select;

interface PriceChartProps {
  height?: number;
}

const timePeriodOptions = [
  { value: '1', label: '1 Hour' },
  { value: '24', label: '24 Hours' },
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' }
];

const PriceChart: React.FC<PriceChartProps> = ({ height = 400 }) => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7');
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load available cryptocurrencies
  useEffect(() => {
    const loadCryptocurrencies = async () => {
      try {
        const data = await coinGeckoService.getTopCryptocurrencies(20);
        setCryptocurrencies(data);
        if (data.length > 0) {
          setSelectedCrypto(data[0].id);
        }
      } catch (err) {
        setError('Failed to load cryptocurrencies');
        console.error('Error loading cryptocurrencies:', err);
      }
    };

    loadCryptocurrencies();
  }, []);

  // Load price data when cryptocurrency or time period changes
  useEffect(() => {
    if (!selectedCrypto) return;

    const loadPriceData = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await coinGeckoService.getPriceHistory(selectedCrypto, timePeriod);
        setPriceData(data);
      } catch (err) {
        setError('Failed to load price data');
        console.error('Error loading price data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPriceData();
  }, [selectedCrypto, timePeriod]);

  const selectedCryptoData = cryptocurrencies.find(crypto => crypto.id === selectedCrypto);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timePeriod === '1' || timePeriod === '24') {
      return date.toLocaleTimeString();
    } else if (timePeriod === '7') {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleDateString();
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px'
        }}>
          <p><strong>{formatDate(label)}</strong></p>
          <p>Price: {formatPrice(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Cryptocurrency Price Chart" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Text strong>Cryptocurrency:</Text>
          <Select
            value={selectedCrypto}
            onChange={setSelectedCrypto}
            style={{ width: 200 }}
            placeholder="Select cryptocurrency"
          >
            {cryptocurrencies.map(crypto => (
              <Option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </Option>
            ))}
          </Select>

          <Text strong>Time Period:</Text>
          <Select
            value={timePeriod}
            onChange={setTimePeriod}
            style={{ width: 120 }}
          >
            {timePeriodOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Space>

        {selectedCryptoData && (
          <div style={{ marginBottom: '10px' }}>
            <Text>
              Current Price: <strong>{formatPrice(selectedCryptoData.current_price)}</strong>
              {' | '}
              24h Change: 
              <span style={{ 
                color: selectedCryptoData.price_change_percentage_24h >= 0 ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold'
              }}>
                {selectedCryptoData.price_change_percentage_24h >= 0 ? '+' : ''}
                {selectedCryptoData.price_change_percentage_24h.toFixed(2)}%
              </span>
            </Text>
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        <div style={{ height, position: 'relative' }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <Spin size="large" />
            </div>
          ) : priceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => formatPrice(value)}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={false}
                  name="Price (USD)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              color: '#999'
            }}>
              <Text>No data available</Text>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default PriceChart; 