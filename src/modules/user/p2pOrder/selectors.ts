import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Order } from './types';

export const selectP2POrder = (state: RootState): any[] => state.user.p2pOrder.fetch.data;

export const selectP2POrderDetail = (state: RootState): any => state.user.p2pOrder.detail.data;

export const selectP2PConfirmPaymentSuccess = (state: RootState): boolean =>
    state.user.p2pOrder.payment_confirm.success;
