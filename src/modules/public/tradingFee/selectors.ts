import { RootState } from '../../';
import { TradingFeeState } from './reducer';
import { TradingFee } from './types';

const selectTradingFeeState = (state: RootState): TradingFeeState => state.public.tradingFee;

export const selectTradingFee = (state: RootState): TradingFee[] => selectTradingFeeState(state).list;
