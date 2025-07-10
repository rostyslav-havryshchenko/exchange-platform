/**
 * coingecko.ts
 *
 * Service for interacting with CoinGecko API.
 * Free, no API key required, no CORS restrictions.
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

export interface PriceDataPoint {
  timestamp: number;
  price: number;
  date: string;
}

export interface ApiResponse<T> {
  data: T;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
}

export type TimePeriod = '1' | '24' | '7' | '30' | '90';

class CoinGeckoService {
  async getTopCryptocurrencies(limit: number = 10): Promise<CryptoData[]> {
    try {
      const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: CryptoData[] = await response.json();
      console.log('CoinGecko data loaded:', data);
      return data;
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
      throw error;
    }
  }

  async getCryptocurrencyPrice(id: string): Promise<number> {
    try {
      const url = `${BASE_URL}/simple/price?ids=${id}&vs_currencies=usd`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data[id]?.usd || 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }

  async getPriceHistory(id: string, days: TimePeriod = '7'): Promise<PriceDataPoint[]> {
    try {
      const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the data to our format
      const priceData: PriceDataPoint[] = data.prices.map((point: [number, number]) => ({
        timestamp: point[0],
        price: point[1],
        date: new Date(point[0]).toLocaleDateString()
      }));

      console.log('Price history loaded:', priceData);
      return priceData;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `${BASE_URL}/ping`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('CoinGecko API Test Success:', data);
      return true;
    } catch (error) {
      console.error('API Test Failed:', error);
      return false;
    }
  }
}

export const coinGeckoService = new CoinGeckoService(); 