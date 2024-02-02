import { AbilitiesInterface, Wallet } from 'src/modules';
import { API_URL } from '../config';
import { primaryCurrency } from '../api';

export const PG_TITLE_PREFIX = 'PexBank Exchange';

export const pgRoutes = (isLoggedIn: boolean, abilities: AbilitiesInterface, isLight?: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
        ['page.header.navbar.internal.transfer', '/internal-transfer', `internal_transfer${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/docs', `api${isLight ? 'Light' : ''}`],
    ];

    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin', `signin${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/signup', `signup${isLight ? 'Light' : ''}`],
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/docs', `api${isLight ? 'Light' : ''}`],
    ];

    return isLoggedIn ? routes.filter((i) => Boolean(i)) : routesUnloggedIn;
};

export const DEFAULT_WALLET: Wallet = {
    name: '',
    currency: '',
    balance: '',
    type: 'coin',
    fixed: 0,
    networks: [{ blockchain_key: '', fee: 0, protocol: '' }],
    account_type: '',
};

export const GLOBAL_PLATFORM_CURRENCY = 'USDT';

export const DEFAULT_CCY_PRECISION = 4;
export const DEFAULT_FIAT_PRECISION = 2;
export const DEFAULT_TRADING_VIEW_INTERVAL = '15';
export const VALUATION_PRIMARY_CURRENCY = primaryCurrency().toUpperCase();
export const VALUATION_SECONDARY_CURRENCY = 'ETH';

export const PASSWORD_ENTROPY_STEP = 6;

export const DEFAULT_KYC_STEPS = ['email', 'phone', 'profile', 'document', 'address'];

export const DEFAULT_MARKET_HEADERS = ['Pair', 'Price', '24h Change'];

export const TRANSFER_TYPES_LIST = ['Spot', 'P2P'];

export const DEFAULT_ORDER_TYPES = ['Limit', 'Market'];
export const AMOUNT_PERCENTAGE_ARRAY = [0.25, 0.5, 0.75, 1];
export const DEFAULT_TABLE_PAGE_LIMIT = 25;
export const HOST_URL = API_URL;

export const P2P_TIME_LIMIT_LIST = ['15 min', '30 min', '60 min'];
export const ORDER_TYPES_WITH_TRIGGER = ['Stop-loss', 'Take-profit', 'Stop-limit', 'Take-limit'];

export const TRIGGER_BUY_PRICE_MULT = 1.1;
export const TRIGGER_BUY_PRICE_ADJUSTED_TYPES = ['stop-loss', 'take-profit'];

export const DEFAULT_MARKET = {
    id: '',
    name: '',
    base_unit: '',
    quote_unit: '',
    min_price: '',
    max_price: 0,
    min_amount: 0,
    amount_precision: 0,
    price_precision: 0,
};

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            sun: 'var(--icons)',
            moon: 'var(--primary-text-color)',
        },
        orderBook: {
            asks: 'var(--asks-level-4)',
            bids: 'var(--bids-level-4)',
        },
        depth: {
            fillAreaAsk: '#fa5252',
            fillAreaBid: '#12b886',
            gridBackgroundStart: '#1a243b',
            gridBackgroundEnd: '#1a243b',
            strokeAreaAsk: '#fa5252',
            strokeAreaBid: '#12b886',
            strokeGrid: '#B8E9F5',
            strokeAxis: '#cccccc',
        },
    },
    dark: {
        chart: {
            primary: 'var(--rgb-body-background-color)',
            up: 'var(--rgb-text-contrast-color)',
            down: 'var(--rgb-system-red)',
        },
        navbar: {
            sun: 'var(--primary-text-color)',
            moon: 'var(--icons)',
        },
        orderBook: {
            asks: 'var(--rgb-text-contrast-color)',
            bids: 'var(--rgb-system-red)',
        },
        depth: {
            fillAreaAsk: 'var(--rgb-system-red)',
            fillAreaBid: 'var(--rgb-text-contrast-color)',
            gridBackgroundStart: 'var(--rgb-system-red)',
            gridBackgroundEnd: 'var(--rgb-system-red)',
            strokeAreaAsk: 'var(--rgb-system-red)',
            strokeAreaBid: 'var(--rgb-text-contrast-color)',
            strokeGrid: 'var(--rgb-secondary-contrast-cta-color)',
            strokeAxis: 'var(--rgb-primary-text-color)',
        },
    },
};
