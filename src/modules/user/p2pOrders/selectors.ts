import { RootState } from '../..';
import { CommonError } from '../../types';
import { Order } from './types';

export const selectP2POrder = (state: RootState): [] => state.user.p2pOrders.fetch.data;

export const selectP2POrderLoading = (state: RootState): boolean => state.user.p2pOrders.fetch.fetching;

export const selectP2POrderCreateData = (state: RootState): any => state.user.p2pOrders.create.data;

export const selectP2POrderCreateSuccess = (state: RootState): boolean => state.user.p2pOrders.create.success;

export const selectP2POrderCreateLoading = (state: RootState): boolean => state.user.p2pOrders.create.fetching;

export const selectP2POrderDetail = (state: RootState): any => state.user.p2pOrders.detail.data;

export const selectP2POrderDetailLoading = (state: RootState): boolean => state.user.p2pOrders.detail.fetching;

export const selectP2POrderDetailTimestamp = (state: RootState): number | undefined =>
    state.user.p2pOrders.detail.timestamp;

export const selectShouldFetchP2POrderDetail = (state: RootState): boolean =>
    !selectP2POrderDetailTimestamp(state) && !selectP2POrderDetailLoading(state);

export const selectP2PConfirmPaymentSuccess = (state: RootState): boolean =>
    state.user.p2pOrders.payment_confirm.success;

export const selectP2PConfirmPaymentLoading = (state: RootState): boolean =>
    state.user.p2pOrders.payment_confirm.fetching;

export const selectP2PConfirmSellSuccess = (state: RootState): boolean =>
    state.user.p2pOrders.order_confirm_sell.success;

export const selectP2PCancelSuccess = (state: RootState): boolean => state.user.p2pOrders.cancel.success;

export const selectP2PCancelLoading = (state: RootState): boolean => state.user.p2pOrders.cancel.fetching;

// CHAT
export const selectP2PChat = (state: RootState): any => state.user.p2pOrders.chat.data;
export const selectP2PChatSuccess = (state: RootState): boolean => state.user.p2pOrders.chat.success;
export const selectP2PChatLoading = (state: RootState): boolean => state.user.p2pOrders.chat.fetching;

export const selectP2PChatCreateSuccess = (state: RootState): boolean => state.user.p2pOrders.chat_create.success;

export const selectP2PChatCreateLoading = (state: RootState): boolean => state.user.p2pOrders.chat_create.fetching;

// REPORT
export const selectP2PCreateReportSuccess = (state: RootState): boolean => state.user.p2pOrders.report_create.success;
export const selectP2PCreateReportLoading = (state: RootState): boolean => state.user.p2pOrders.report_create.fetching;

// PAGINATION
export const selectP2POrderNextPageExists = (state: RootState): boolean => state.user.p2pOrders.fetch.nextPageExists;
export const selectP2pOrderFirstElemIndex = (state: RootState, limit: number): number =>
    state.user.p2pOrders.fetch.page * limit + 1;

export const selectP2pOrderLastElemIndex = (state: RootState, limit: number): number =>
    state.user.p2pOrders.fetch.page * limit + state.user.p2pOrders.fetch.data.length;

export const selectP2pOrderPage = (state: RootState): number => state.user.p2pOrders.fetch.page;
