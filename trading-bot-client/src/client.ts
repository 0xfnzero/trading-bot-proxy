import axios, { AxiosInstance } from 'axios';
import { HealthResponse, TradeResponse, BuyRequest, SellRequest, DexParams } from './types';
import Config from './config';

export class TradingProxyClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    const url = baseURL || Config.HTTP_API_URL;
    const timeout = Config.REQUEST_TIMEOUT;

    this.client = axios.create({
      baseURL: url,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async health(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }

  async buy(dexParams: DexParams, request: BuyRequest): Promise<TradeResponse> {
    console.log('buy params=> ', {
      ...dexParams,
      ...request,
    });
    const response = await this.client.post<TradeResponse>('/api/buy', {
      ...dexParams,
      ...request,
    });
    return response.data;
  }

  async sell(dexParams: DexParams, request: SellRequest): Promise<TradeResponse> {
    console.log('sell params=> ', {
      ...dexParams,
      ...request,
    });
    const response = await this.client.post<TradeResponse>('/api/sell', {
      ...dexParams,
      ...request,
    });
    return response.data;
  }
}
