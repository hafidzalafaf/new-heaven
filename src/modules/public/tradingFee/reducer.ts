import { CommonState } from '../../types';
import { TradingFeeAction } from './actions';
import { TRADING_FEE_DATA } from './constants';
import { TradingFee } from './types';

export interface TradingFeeState extends CommonState {
    list: TradingFee[];
}

export const initialTradingFeeState: TradingFeeState = {
    list: [],
};

export const tradingFeeReducer = (state = initialTradingFeeState, action: TradingFeeAction) => {
    switch (action.type) {
        case TRADING_FEE_DATA:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
