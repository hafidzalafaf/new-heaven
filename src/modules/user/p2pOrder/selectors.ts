import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Order } from './types';

export const selectP2POrder = (state: RootState): any[] => state.user.p2pOrder.fetch.data;

export const selectP2POrderLoading = (state: RootState): boolean => state.user.p2pOrder.fetch.fetching;

export const selectP2POrderCreateData = (state: RootState): any => state.user.p2pOrder.create.data;

export const selectP2POrderCreateSuccess = (state: RootState): boolean => state.user.p2pOrder.create.success;

export const selectP2POrderCreateLoading = (state: RootState): boolean => state.user.p2pOrder.create.fetching;

export const selectP2POrderDetail = (state: RootState): any => state.user.p2pOrder.detail.data;

export const selectP2POrderDetailLoading = (state: RootState): boolean => state.user.p2pOrder.detail.fetching;

export const selectP2POrderDetailTimestamp = (state: RootState): number | undefined =>
    state.user.p2pOrder.detail.timestamp;

export const selectShouldFetchP2POrderDetail = (state: RootState): boolean =>
    !selectP2POrderDetailTimestamp(state) && !selectP2POrderDetailLoading(state);

export const selectP2PConfirmPaymentSuccess = (state: RootState): boolean =>
    state.user.p2pOrder.payment_confirm.success;

export const selectP2PConfirmPaymentLoading = (state: RootState): boolean =>
    state.user.p2pOrder.payment_confirm.fetching;

export const selectP2PConfirmSellSuccess = (state: RootState): boolean =>
    state.user.p2pOrder.order_confirm_sell.success;

export const selectP2PCancelSuccess = (state: RootState): boolean => state.user.p2pOrder.cancel.success;

export const selectP2PCancelLoading = (state: RootState): boolean => state.user.p2pOrder.cancel.fetching;

// CHAT
export const selectP2PChat = (state: RootState): any => state.user.p2pOrder.chat.data;
export const selectP2PChatSuccess = (state: RootState): boolean => state.user.p2pOrder.chat.success;
export const selectP2PChatLoading = (state: RootState): boolean => state.user.p2pOrder.chat.fetching;

export const selectP2PChatCreateSuccess = (state: RootState): boolean => state.user.p2pOrder.chat_create.success;

export const selectP2PChatCreateLoading = (state: RootState): boolean => state.user.p2pOrder.chat_create.fetching;

// REPORT
export const selectP2PCreateReportSuccess = (state: RootState): boolean => state.user.p2pOrder.report_create.success;
export const selectP2PCreateReportLoading = (state: RootState): boolean => state.user.p2pOrder.report_create.fetching;
