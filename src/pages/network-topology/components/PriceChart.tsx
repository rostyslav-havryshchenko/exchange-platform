/**
 * PriceChart.tsx
 *
 * Interactive cryptocurrency price chart using Recharts.
 * Allows selection of cryptocurrency and time period.
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Space, Typography, Spin, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { coinGeckoService } from '../services/coingecko';
import { formatPrice, formatDate, formatPriceShort } from '../utils';
import CustomTooltip from './CustomTooltip';
import type { CryptoData, PriceDataPoint } from '../interfaces';
import type { TimePeriod } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface PriceChartProps {
  height: number;
}

const timePeriodOptions = [
  { value: '1', label: '1 Hour' },
  { value: '24', label: '24 Hours' },
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' }
];

const PriceChart: React.FC<PriceChartProps> = ({ height }) => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7');
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

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

      try {
        const data = await coinGeckoService.getPriceHistory(selectedCrypto, timePeriod);
        setPriceData(data);
      } catch (err) {
        console.error('Error loading price data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPriceData();
  }, [selectedCrypto, timePeriod]);

  const selectedCryptoData = cryptocurrencies.find(crypto => crypto.id === selectedCrypto);

  return (
    <Card title="Cryptocurrency Price Chart" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Cryptocurrency:</Text>
              <Select
                value={selectedCrypto}
                onChange={setSelectedCrypto}
                style={{ width: '100%' }}
                placeholder="Select cryptocurrency"
              >
                {cryptocurrencies.map(crypto => (
                  <Option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Time Period:</Text>
              <Select
                value={timePeriod}
                onChange={setTimePeriod}
                style={{ width: '100%' }}
              >
                {timePeriodOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>

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
                  tickFormatter={(value) => formatDate(value, timePeriod)}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  tickFormatter={(value) => formatPriceShort(value)}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip content={<CustomTooltip timePeriod={timePeriod} />} />
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