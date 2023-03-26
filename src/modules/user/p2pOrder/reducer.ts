import { sliceArray } from 'src/helpers';
import { CommonError } from '../../../modules/types';
import { OrderActions } from './actions';
import {
    ORDER_CREATE,
    ORDER_CREATE_DATA,
    ORDER_CREATE_ERROR,
    ORDER_DETAIL_DATA,
    ORDER_DETAIL_ERROR,
    ORDER_DETAIL_FETCH,
    ORDER_DATA,
    ORDER_ERROR,
    ORDER_FETCH,
    ORDER_CANCEL,
    ORDER_CANCEL_DATA,
    ORDER_CANCEL_ERROR,
    ORDER_CONFIRM_SELL,
    ORDER_CONFIRM_SELL_DATA,
    ORDER_CONFIRM_SELL_ERROR,
    ORDER_CONFIRM_PAYMENT,
    ORDER_CONFIRM_PAYMENT_DATA,
    ORDER_CONFIRM_PAYMENT_ERROR,
    ORDER_CHAT,
    ORDER_CHAT_DATA,
    ORDER_CHAT_ERROR,
    ORDER_CHAT_CREATE,
    ORDER_CHAT_CREATE_DATA,
    ORDER_CHAT_CREATE_ERROR,
    ORDER_REPORT,
    ORDER_REPORT_DATA,
    ORDER_REPORT_ERROR,
    ORDER_REPORT_CREATE,
    ORDER_REPORT_CREATE_DATA,
    ORDER_REPORT_CREATE_ERROR,
} from './constants';
import { Order, Confirm } from './types';

const defaultOrder: Order = {
    offer_number: '',
    price: '',
    amount: '',
    payment_order: '',
};

const defaultConfirm: Confirm = {
    is_confirm: '',
    payment_method: '',
};

export interface P2POrderState {
    create: {
        data: any;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    detail: {
        data: Order[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        timestamp?: number;
    };
    fetch: {
        data: [];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
        page: number;
        limit: number;
        nextPageExists?: boolean;
    };
    cancel: {
        data: Confirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    order_confirm_sell: {
        data: Confirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    payment_confirm: {
        data: Confirm;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    chat: {
        data: Order[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    chat_create: {
        // data: Order;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    report: {
        data: Order[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    report_create: {
        // data: Order;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialOrderState: P2POrderState = {
    create: {
        data: {},
        fetching: false,
        success: false,
    },
    detail: {
        data: [],
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        limit: 5,
        page: 1,
        fetching: false,
        success: false,
        nextPageExists: false,
    },

    cancel: {
        data: defaultConfirm,
        fetching: false,
        success: false,
    },
    order_confirm_sell: {
        data: defaultConfirm,
        fetching: false,
        success: false,
    },
    payment_confirm: {
        data: defaultConfirm,
        fetching: false,
        success: false,
    },
    chat: {
        data: [],
        fetching: false,
        success: false,
    },
    chat_create: {
        // data: defaultOrder,
        fetching: false,
        success: false,
    },
    report: {
        data: [],
        fetching: false,
        success: false,
    },
    report_create: {
        // data: defaultOrder,
        fetching: false,
        success: false,
    },
};

export const orderFetchReducer = (state: P2POrderState['fetch'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_DATA:
            return {
                ...state,
                data: action.payload.data,
                fetching: false,
                success: true,
                error: undefined,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists
            };
        case ORDER_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const orderDetailReducer = (state: P2POrderState['detail'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_DETAIL_FETCH:
            return {
                ...state,
                fetching: true,
                // success: false,
                // error: undefined,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case ORDER_DETAIL_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_DETAIL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderCreateReducer = (state: P2POrderState['create'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderCancelReducer = (state: P2POrderState['cancel'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CANCEL:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CANCEL_DATA:
            return {
                ...state,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CANCEL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderConfirmSellReducer = (state: P2POrderState['order_confirm_sell'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_SELL:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CONFIRM_SELL_DATA:
            return {
                ...state,
                // data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CONFIRM_SELL_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderConfirmPaymentReducer = (state: P2POrderState['payment_confirm'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CONFIRM_PAYMENT:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CONFIRM_PAYMENT_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CONFIRM_PAYMENT_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const orderChatReducer = (state: P2POrderState['chat'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CHAT:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CHAT_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CHAT_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderChatCreateReducer = (state: P2POrderState['chat_create'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_CHAT_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_CHAT_CREATE_DATA:
            return {
                ...state,
                // data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_CHAT_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const orderReportReducer = (state: P2POrderState['report'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_REPORT:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_REPORT_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_REPORT_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderReportCreateReducer = (state: P2POrderState['report_create'], action: OrderActions) => {
    switch (action.type) {
        case ORDER_REPORT_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case ORDER_REPORT_CREATE_DATA:
            return {
                ...state,
                // data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case ORDER_REPORT_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pOrderReducer = (state = initialOrderState, action: OrderActions) => {
    switch (action.type) {
        case ORDER_FETCH:
        case ORDER_DATA:
        case ORDER_ERROR:
            return {
                ...state,
                fetch: orderFetchReducer({ ...state.fetch }, action),
            };

        case ORDER_DETAIL_FETCH:
        case ORDER_DETAIL_DATA:
        case ORDER_DETAIL_ERROR:
            return {
                ...state,
                detail: orderDetailReducer({ ...state.detail }, action),
            };

        case ORDER_CREATE:
        case ORDER_CREATE_DATA:
        case ORDER_CREATE_ERROR:
            const orderCreateState = { ...state.create };
            return {
                ...state,
                create: orderCreateReducer(orderCreateState, action),
            };

        case ORDER_CANCEL:
        case ORDER_CANCEL_DATA:
        case ORDER_CANCEL_ERROR:
            const orderCancel = { ...state.cancel };
            return {
                ...state,
                cancel: orderCancelReducer(orderCancel, action),
            };

        case ORDER_CONFIRM_SELL:
        case ORDER_CONFIRM_SELL_DATA:
        case ORDER_CONFIRM_SELL_ERROR:
            const orderConfirmSell = { ...state.order_confirm_sell };
            return {
                ...state,
                order_confirm_sell: orderConfirmSellReducer(orderConfirmSell, action),
            };

        case ORDER_CONFIRM_PAYMENT:
        case ORDER_CONFIRM_PAYMENT_DATA:
        case ORDER_CONFIRM_PAYMENT_ERROR:
            const orderConfirmPayment = { ...state.payment_confirm };
            return {
                ...state,
                payment_confirm: orderConfirmPaymentReducer(orderConfirmPayment, action),
            };

        case ORDER_CHAT:
        case ORDER_CHAT_DATA:
        case ORDER_CHAT_ERROR:
            return {
                ...state,
                chat: orderChatReducer({ ...state.chat }, action),
            };

        case ORDER_CHAT_CREATE:
        case ORDER_CHAT_CREATE_DATA:
        case ORDER_CHAT_CREATE_ERROR:
            const orderChatCreateState = { ...state.chat_create };
            return {
                ...state,
                chat_create: orderChatCreateReducer(orderChatCreateState, action),
            };

        case ORDER_REPORT:
        case ORDER_REPORT_DATA:
        case ORDER_REPORT_ERROR:
            return {
                ...state,
                report: orderReportReducer({ ...state.report }, action),
            };

        case ORDER_REPORT_CREATE:
        case ORDER_REPORT_CREATE_DATA:
        case ORDER_REPORT_CREATE_ERROR:
            const orderReportCreateState = { ...state.report_create };
            return {
                ...state,
                report_create: orderReportCreateReducer(orderReportCreateState, action),
            };

        default:
            return state;
    }
};
