/**
 * coingecko.ts
 *
 * Service for interacting with CoinGecko API.
 * Free, no API key required, no CORS restrictions.
 */

import { showNotification } from "../../../common/utils";
import type { CryptoData, PriceDataPoint } from "../interfaces";
import type { TimePeriod } from "../types";

const BASE_URL = 'https://api.coingecko.com/api/v3';

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