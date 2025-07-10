/**
 * coingecko.ts
 *
 * Service for interacting with CoinGecko API.
 * Free, no API key required, no CORS restrictions.
 */

import { showNotification } from "../../../common/utils";

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

      return data;
    } catch (error) {
      this._handleApiError('cryptocurrencies');
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
      this._handleApiError('cryptocurrencies price');
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

      return priceData;
    } catch (error) {
      this._handleApiError('cryptocurrencies history');
    }
  }

  private _handleApiError(context: string): never {
    showNotification({
      type: 'error',
      message: `Failed to load ${context}`,
      description: `Unable to fetch ${context}. Please try again later.`,
    });
    throw new Error(`API request failed ${context}`);
}
}

export const coinGeckoService = new CoinGeckoService(); 