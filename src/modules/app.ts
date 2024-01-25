import { combineReducers } from 'redux';
import { configUpdateReducer } from './admin/config';
import { alertReducer } from './public/alert';
import { blockchainsReducer } from './public/blockchains';
import { blocklistAccessReducer } from './public/blocklistAccess';
import { blogsReducer } from './public/blog';
import { configsReducer } from './public/configs';
import { currenciesReducer } from './public/currencies';
import { tradingFeeReducer } from './public/tradingFee';
import { errorHandlerReducer } from './public/errorHandler';
import { changeColorThemeReducer } from './public/globalSettings';
import { gridLayoutReducer } from './public/gridLayout';
import { changeLanguageReducer } from './public/i18n';
import { klineReducer } from './public/kline';
import { marketsReducer } from './public/markets';
import { memberLevelsReducer } from './public/memberLevels';
import { depthReducer, incrementDepthReducer, orderBookReducer } from './public/orderBook';
import { rangerReducer } from './public/ranger/reducer';
import { recentTradesReducer } from './public/recentTrades';
import { withdrawLimitsReducer } from './public/withdrawLimits';
import { maxWithdrawLimitReducer } from './public/maxWithdrawLimit';
import { apiKeysReducer } from './user/apiKeys';
import { abilitiesReducer } from './user/abilities';
import { authReducer } from './user/auth';
import { beneficiariesReducer } from './user/beneficiaries';
import { getGeetestCaptchaReducer } from './user/captcha';
import { documentationReducer } from './user/documentation';
import { sendEmailVerificationReducer } from './user/emailVerification';
import { confirmationCodeReducer } from './user/emailVerificationCode';
import { historyReducer } from './user/history';
import { internalTransfersReducer } from './user/internalTransfers';
import { addressesReducer, documentsReducer, identityReducer, labelReducer, phoneReducer } from './user/kyc';
import { openOrdersReducer } from './user/openOrders';
import { ordersReducer } from './user/orders';
import { ordersHistoryReducer } from './user/ordersHistory';
import { passwordReducer } from './user/password';
import { profileReducer } from './user/profile';
import { userActivityReducer } from './user/userActivity';
import { walletsReducer } from './user/wallets';
import { withdrawLimitReducer } from './user/withdrawLimit';
import { withdrawSumReducer } from './user/withdrawSum';
import { marketsAdminReducer } from './admin/markets';
import { platformCreateReducer } from './admin/platform';
import { p2pReducer } from './public/p2p';
import { p2pTransfersReducer } from './user/p2pTransfers';
import { feeGroupReducer } from './user/feeGroup';
import { p2pFeedbackReducer } from './user/p2pFeedback';
import { p2pOrdersReducer } from './user/p2pOrders';
import { groupMemberReducer } from './user/memberGroup';
import { p2pOffersReducer } from './user/p2pOffers';
import { p2pOfferAvailableReducer } from './user/p2pAvailableOffer';
import { p2pProfileReducer } from './user/p2pProfile';
import { p2pPaymentUserReducer } from './user/p2pPaymentUser/reducer';
import { p2pUserOfferReducer } from './user/p2pUserOffer';
import { p2pUserOfferDetailReducer } from './user/p2pUserOfferDetail';
import { getLatestVersionReducer } from './public/latestVersion';

export const publicReducer = combineReducers({
    alerts: alertReducer,
    blockchains: blockchainsReducer,
    blocklistAccess: blocklistAccessReducer,
    blogs: blogsReducer,
    colorTheme: changeColorThemeReducer,
    configs: configsReducer,
    currencies: currenciesReducer,
    tradingFee: tradingFeeReducer,
    errorHandler: errorHandlerReducer,
    rgl: gridLayoutReducer,
    i18n: changeLanguageReducer,
    kline: klineReducer,
    markets: marketsReducer,
    memberLevels: memberLevelsReducer,
    orderBook: orderBookReducer,
    depth: depthReducer,
    incrementDepth: incrementDepthReducer,
    ranger: rangerReducer,
    recentTrades: recentTradesReducer,
    p2p: p2pReducer,
    withdrawLimits: withdrawLimitsReducer,
    maxWithdrawLimit: maxWithdrawLimitReducer,
    latestVersion: getLatestVersionReducer,
});

export const userReducer = combineReducers({
    addresses: addressesReducer,
    apiKeys: apiKeysReducer,
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    captcha: getGeetestCaptchaReducer,
    documentation: documentationReducer,
    history: historyReducer,
    documents: documentsReducer,
    identity: identityReducer,
    label: labelReducer,
    phone: phoneReducer,
    openOrders: openOrdersReducer,
    orders: ordersReducer,
    ordersHistory: ordersHistoryReducer,
    password: passwordReducer,
    profile: profileReducer,
    sendEmailVerification: sendEmailVerificationReducer,
    userActivity: userActivityReducer,
    wallets: walletsReducer,
    feeGroup: feeGroupReducer,
    withdrawLimit: withdrawLimitReducer,
    withdrawSum: withdrawSumReducer,
    internalTransfers: internalTransfersReducer,
    abilities: abilitiesReducer,
    p2pTransfers: p2pTransfersReducer,
    confirmationCode: confirmationCodeReducer,
    memberGroup: groupMemberReducer,
    p2pFeedback: p2pFeedbackReducer,
    p2pOrders: p2pOrdersReducer,
    p2pOffers: p2pOffersReducer,
    p2pOfferAvailable: p2pOfferAvailableReducer,
    p2pProfile: p2pProfileReducer,
    // p2pPaymentUser: p2pPaymentUserReducer,
    // p2pUserOffer: p2pUserOfferReducer,
    // p2pUserOfferDetail: p2pUserOfferDetailReducer,
});

export const adminReducer = combineReducers({
    configUpdate: configUpdateReducer,
    markets: marketsAdminReducer,
    platform: platformCreateReducer,
});
