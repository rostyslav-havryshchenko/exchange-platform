import React, { useEffect, useState } from 'react';
import { List, Avatar, Typography, Spin } from 'antd';
import { coinGeckoService } from '../services/coingecko';
import type { TrendingCoin } from '../interfaces';

const { Text } = Typography;

export const TrendingCoins: React.FC = () => {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await coinGeckoService.getTrendingCoins();
        setCoins(data);
      } catch (err) {
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <Spin />;

  return (
    <div style={{ height: '500px', overflowY: 'auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={coins}
        header={<Text strong>Trending Coins</Text>}
        renderItem={coin => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={coin.thumb} alt={coin.name} />}
              title={<span>{coin.name} <Text type="secondary">({coin.symbol.toUpperCase()})</Text></span>}
              description={<Text type="secondary">Rank: {coin.market_cap_rank}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}; 