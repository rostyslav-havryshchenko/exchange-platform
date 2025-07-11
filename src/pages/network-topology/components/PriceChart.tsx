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
  const [compareCrypto, setCompareCrypto] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7');
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [comparePriceData, setComparePriceData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

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

  // Load price data for main coin
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

  // Load price data for compare coin
  useEffect(() => {
    if (!compareCrypto) {
      setComparePriceData([]);
      return;
    }
    const loadComparePriceData = async () => {
      setLoadingCompare(true);
      try {
        const data = await coinGeckoService.getPriceHistory(compareCrypto, timePeriod);
        setComparePriceData(data);
      } catch (err) {
        console.error('Error loading compare price data:', err);
      } finally {
        setLoadingCompare(false);
      }
    };
    loadComparePriceData();
  }, [compareCrypto, timePeriod]);

  const selectedCryptoData = cryptocurrencies.find(crypto => crypto.id === selectedCrypto);
  const compareCryptoData = cryptocurrencies.find(crypto => crypto.id === compareCrypto);

  // Merge price data for chart (by timestamp)
  const mergedData = priceData.map((point, idx) => {
    const comparePoint = comparePriceData[idx];
    return {
      timestamp: point.timestamp,
      price: point.price,
      comparePrice: comparePoint ? comparePoint.price : null,
    };
  });

  return (
    <Card title="Cryptocurrency Price Chart" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Cryptocurrency:</Text>
              <Select
                value={selectedCrypto}
                onChange={setSelectedCrypto}
                style={{ width: '100%' }}
                placeholder="Select cryptocurrency"
              >
                {cryptocurrencies.map(crypto => (
                  <Option key={crypto.id} value={crypto.id} disabled={crypto.id === compareCrypto}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Compare with:</Text>
              <Select
                value={compareCrypto}
                onChange={setCompareCrypto}
                style={{ width: '100%' }}
                placeholder="Select coin to compare"
                allowClear
              >
                {cryptocurrencies
                  .filter(crypto => crypto.id !== selectedCrypto)
                  .map(crypto => (
                    <Option key={crypto.id} value={crypto.id} disabled={crypto.id === selectedCrypto}>
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </Option>
                  ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
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
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedCryptoData.image && (
              <img src={selectedCryptoData.image} alt={selectedCryptoData.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            )}
            <Text>
              {selectedCryptoData.name} ({selectedCryptoData.symbol.toUpperCase()}) Price: <strong>{formatPrice(selectedCryptoData.current_price)}</strong>
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
        {compareCryptoData && (
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            {compareCryptoData.image && (
              <img src={compareCryptoData.image} alt={compareCryptoData.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            )}
            <Text>
              {compareCryptoData.name} ({compareCryptoData.symbol.toUpperCase()}) Price: <strong>{formatPrice(compareCryptoData.current_price)}</strong>
              {' | '}
              24h Change: 
              <span style={{ 
                color: compareCryptoData.price_change_percentage_24h >= 0 ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold'
              }}>
                {compareCryptoData.price_change_percentage_24h >= 0 ? '+' : ''}
                {compareCryptoData.price_change_percentage_24h.toFixed(2)}%
              </span>
            </Text>
          </div>
        )}

        <div style={{ height, position: 'relative' }}>
          {(loading || loadingCompare) ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <Spin size="large" />
            </div>
          ) : mergedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mergedData}>
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
                  name={selectedCryptoData ? `${selectedCryptoData.name} (USD)` : 'Price (USD)'}
                />
                {compareCrypto && comparePriceData.length > 0 && (
                  <Line
                    type="monotone"
                    dataKey="comparePrice"
                    stroke="#faad14"
                    strokeWidth={2}
                    dot={false}
                    name={compareCryptoData ? `${compareCryptoData.name} (USD)` : 'Compare Price (USD)'}
                  />
                )}
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