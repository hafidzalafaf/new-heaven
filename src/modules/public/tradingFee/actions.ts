import { TRADING_FEE_DATA } from './constants';
import { TradingFee } from './types';

export interface TradingFeeData {
    type: typeof TRADING_FEE_DATA;
    payload: TradingFee[];
}
export type TradingFeeAction = TradingFeeData;

export const tradingFeeData = (payload: TradingFeeData['payload']): TradingFeeData => ({
    type: TRADING_FEE_DATA,
    payload,
});
