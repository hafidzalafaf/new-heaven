import React, { FC, ReactElement, useMemo, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useDepthFetch, useOpenOrdersFetch } from '../../../hooks';
import { Decimal } from '../../../components';
import { localeDate, setTradeColor } from '../../../helpers';
import {
    selectCurrentMarket,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    selectMarkets,
    selectOpenOrdersList,
    userOpenOrdersFetch,
    setCurrentMarket,
    Market,
    Ticker,
    selectDepthAsks,
    selectDepthBids,
    depthFetch,
    depthIncrementSubscribeResetLoading,
    selectDepthLoading,
    selectUserLoggedIn,
    selectMarketTickers,
    selectWallets,
    selectOrderExecuteLoading,
    orderExecuteFetch,
    selectGroupMember,
    selectTradingFee,
    groupFetch,
    withdrawSumFetch,
} from '../../../modules';
import { incrementalOrderBook } from '../../../api';
import { OpenOrders, OrderBook, MarketListTrade, RecentTrades, OrderForm, TradingChart } from '../../containers';
import { OrderCommon, OrderSide } from '../../../modules/types';
import { getTriggerSign } from './helpers';
import { getTotalPrice, getAmount } from '../../../helpers';
import { CloseIconTrade } from '../../../assets/images/CloseIcon';
import { Modal } from '../../../desktop/components';

export const TradingScreen: FC = (): ReactElement => {
    const { currency = '' } = useParams<{ currency?: string }>();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const asks = useSelector(selectDepthAsks);
    const bids = useSelector(selectDepthBids);
    const listOrder = useSelector(selectOpenOrdersList);
    const markets = useSelector(selectMarkets);
    const currentMarket = useSelector(selectCurrentMarket);
    const orderBookLoading = useSelector(selectDepthLoading);
    const isLoggedin = useSelector(selectUserLoggedIn);
    const tickers = useSelector(selectMarketTickers);
    const wallets = useSelector(selectWallets);
    const orderLoading = useSelector(selectOrderExecuteLoading);
    const groupMember = useSelector(selectGroupMember);
    const tradingFee = useSelector(selectTradingFee);

    // State Open Order
    const [hideOtherPairs, setHideOtherPairs] = useState<boolean>(false);
    const [list, setList] = useState([]);
    const [filterSell, setFilterSell] = useState(false);
    const [filterBuy, setFilterBuy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [showModalCancelAll, setShowModalCancelAll] = useState(false);
    const [deleteRow, setDeleteRow] = useState<OrderCommon>();
    // End State Open Order

    // State Order Form
    const [orderPercentageBuy, setOrderPercentageBuy] = React.useState(0);
    const [orderPercentageSell, setOrderPercentageSell] = React.useState(0);
    const [showModalSell, setShowModalSell] = React.useState(false);
    const [showModalBuy, setShowModalBuy] = React.useState(false);
    const [priceBuy, setPriceBuy] = React.useState('');
    const [amountBuy, setAmountBuy] = React.useState('');
    const [totalBuy, setTotalBuy] = React.useState('');
    const [priceSell, setPriceSell] = React.useState('');
    const [amountSell, setAmountSell] = React.useState('');
    const [totalSell, setTotalSell] = React.useState('');
    const [orderType, setOrderType] = React.useState('limit');
    const [side, setSide] = React.useState<OrderSide>('buy');
    // End State Order Form

    useOpenOrdersFetch(currentMarket, hideOtherPairs);
    useDepthFetch();

    React.useEffect(() => {
        dispatch(groupFetch());
        dispatch(withdrawSumFetch());
    }, []);

    const FeeTrading = tradingFee.find((level) => level.group == groupMember.group);
    const willRecive = Number(totalSell) - (Number(FeeTrading?.taker) * 100 * Number(totalSell)) / 100;
    const willPay = Number(totalBuy) + (Number(FeeTrading?.taker) * 100 * Number(totalBuy)) / 100;
    const myTradingFee = Number(FeeTrading?.taker) * 100;

    const ask = [...asks].sort((a, b) => +b[0] - +a[0]);
    const bid = [...bids].sort((a, b) => +b[0] - +a[0]);

    const tickerItem: Ticker = tickers[currency];
    const wallet =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.base_unit?.toLowerCase());
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';

    const usd =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.quote_unit?.toLowerCase());
    const usdt = usd && usd.balance ? usd.balance.toString() : '0';

    const translate = React.useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const current: Market | undefined = markets.find((item) => item.id === currency);
    React.useEffect(() => {
        if (current) {
            dispatch(setCurrentMarket(current));
        }
    }, [current]);

    React.useEffect(() => {
        if (orderBookLoading) {
            setLoading(true);
            setTimeout(() => {
                dispatch(depthIncrementSubscribeResetLoading());
                setLoading(false);
            }, 2000);
        }
    }, [orderBookLoading, currentMarket]);

    React.useEffect(() => {
        if (listOrder) {
            const data =
                listOrder.length && listOrder.filter((item) => item.market.toLowerCase() === currency.toLowerCase());
            setList(data);

            const temp = data;
            if (list && list[0] && filterSell && !filterBuy) {
                const sell = temp.filter((item) => item.side === 'sell');
                setList(sell);
            } else if (list && list[0] && filterBuy && !filterSell) {
                const buy = temp.filter((item) => item.side === 'buy');
                setList(buy);
            }

            if (hideOtherPairs) {
                setList([]);
            }
        }
    }, [listOrder, filterBuy, filterSell, hideOtherPairs]);

    // ======================= Function Market List =======================
    const handleRedirectToTrading = (id: string) => {
        const currentMarket: Market | undefined = markets.find((item) => item.id === id);

        if (currentMarket) {
            dispatch(setCurrentMarket(currentMarket));
            if (!incrementalOrderBook()) {
                dispatch(depthFetch(currentMarket));
            }

            history.push(
                `/markets/${currentMarket.type == 'spot' ? 'trading/' : '/trading-future/'}${currentMarket.id}`
            );
            resetForm();
        }
    };
    // ======================= End Function Market List =======================

    // ======================= Function Order Form =======================
    // buat yang type market
    const totalPrice = getTotalPrice(
        side === 'buy' ? amountBuy : amountSell,
        +tickerItem?.last,
        side === 'buy' ? bids : asks
    );

    // belum kepakai
    const totalAmount = getAmount(
        side === 'buy' ? +usdt : +balance,
        side === 'buy' ? bids : asks,
        side === 'buy' ? orderPercentageBuy : orderPercentageSell
    );

    // buat set amount sell
    React.useEffect(() => {
        const market =
            orderPercentageSell !== 0
                ? Decimal.format((+balance * orderPercentageSell) / 100, currentMarket?.amount_precision)
                : amountSell;

        let limit: string | number;
        if (orderPercentageSell !== 0) {
            if (priceSell === '0' || priceSell === '') {
                limit = '0';
            } else {
                limit = Decimal.format((+balance * orderPercentageSell) / 100, currentMarket?.amount_precision);
            }
        } else {
            limit = amountSell;
        }

        setAmountSell(orderType === 'market' ? market.toString() : limit.toString());
    }, [orderPercentageSell, totalSell, priceSell]);

    // buat ngeset total sel
    React.useEffect(() => {
        const safePrice = totalPrice / +amountSell || tickerItem?.last;
        const market = Decimal.format(+amountSell * +safePrice, currentMarket?.price_precision);

        const limit =
            orderPercentageSell !== 0
                ? Decimal.format(+amountSell * +priceSell, currentMarket?.price_precision)
                : Decimal.format(+priceSell * +amountSell, currentMarket?.price_precision);

        setTotalSell(orderType === 'market' ? market : limit);
    }, [priceSell, amountSell, orderPercentageSell]);

    // buat order amout buy
    React.useEffect(() => {
        const safePrice = +totalPrice / +totalAmount || tickerItem?.last;
        const market =
            orderPercentageBuy !== 0
                ? Decimal.format(+totalBuy / +safePrice, currentMarket?.amount_precision)
                : amountBuy;

        let limit: string | number;
        if (orderPercentageBuy !== 0) {
            if (priceBuy === '0' || priceBuy === '') {
                limit = '0';
            } else {
                limit = Decimal.format(+totalBuy / +priceBuy, currentMarket?.amount_precision);
            }
        } else {
            limit = amountBuy;
        }
        setAmountBuy(orderType === 'market' ? market.toString() : limit.toString());
    }, [orderPercentageBuy, totalBuy, priceBuy]);

    // buat total buy
    React.useEffect(() => {
        const safePrice = totalPrice / +amountBuy || tickerItem?.last;
        const market =
            orderPercentageBuy !== 0
                ? Decimal.format((+usdt * orderPercentageBuy) / 100, currentMarket?.price_precision)
                : Decimal.format(+safePrice * +amountBuy, currentMarket?.price_precision);

        const limit =
            orderPercentageBuy !== 0
                ? Decimal.format((+usdt * +orderPercentageBuy) / 100, currentMarket?.price_precision)
                : Decimal.format(+priceBuy * +amountBuy, currentMarket?.price_precision);

        setTotalBuy(orderType === 'market' ? market : limit);
    }, [priceBuy, amountBuy, orderPercentageBuy]);

    // ketika pindah dari limit dan market dan setelah dispatch
    const resetForm = () => {
        setShowModalSell(false);
        setShowModalBuy(false);
        setAmountBuy('');
        setAmountSell('');
        setPriceBuy('');
        setPriceSell('');
        setTotalBuy('');
        setTotalSell('');
        setOrderPercentageSell(0);
        setOrderPercentageBuy(0);
    };

    // ini ngepush data nya
    const handleSubmit = () => {
        const payloadLimit = {
            market: currentMarket?.id,
            side: side,
            volume: side === 'sell' ? amountSell : amountBuy,
            price: side === 'sell' ? priceSell : priceBuy,
            ord_type: orderType,
        };

        const payloadMarket = {
            market: currentMarket?.id,
            side: side,
            volume: side === 'sell' ? amountSell : amountBuy,
            ord_type: orderType,
        };

        dispatch(orderExecuteFetch(orderType === 'limit' ? payloadLimit : payloadMarket));

        resetForm();
    };

    // buy sell
    const handleSide = (value: OrderSide) => {
        setSide(value);
    };

    // ganti harga buy
    const handleChangePriceBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceBuy(value);
    };

    // ganti harga sell
    const handleChangePriceSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceSell(value);
    };

    // ganti amount buy
    const handleChangeAmountBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountBuy(value);
        setOrderPercentageBuy(0);
    };

    // ganti amout sell
    const handleChangeAmounSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountSell(value);
        setOrderPercentageSell(0);
    };

    // ganti select persenan
    const handleSelectPercentageSell = (e: number) => {
        setOrderPercentageSell(e);
        if (e == 0) {
            setAmountSell('0');
        }
    };

    // ganti select persenan
    const handleSelectPercentageBuy = (e: number) => {
        setOrderPercentageBuy(e);
        if (e == 0) {
            setAmountBuy('0');
        }
    };

    // close modal sell
    const handleCancelModalSell = () => {
        setShowModalSell(false);
    };

    // close modal buy
    const handleCancelModalBuy = () => {
        setShowModalBuy(false);
    };

    // submit sell
    const handleSubmitSell = () => {
        setShowModalSell(true);
    };

    // submit buy
    const handleSubmitBuy = () => {
        setShowModalBuy(true);
    };

    // order type
    const handleSelectOrderType = (e: string) => {
        setOrderType(e);
        resetForm();
    };
    // ======================= End Function Order Form =======================

    // ======================= Function Order Book =======================
    const handleSelectPriceAsks = (e: string) => {
        setPriceSell(e);
        setPriceBuy(e);
    };

    const handleSelectPriceBids = (e: string) => {
        setPriceBuy(e);
        setPriceSell(e);
    };
    // ======================= End Function Order Book =======================

    // ======================= Function Open Orders =======================
    const handleCancel = (order: OrderCommon) => {
        dispatch(openOrdersCancelFetch({ order, list }));
        setShowModalCancel(false);
        setTimeout(() => {
            if (current) {
                dispatch(userOpenOrdersFetch({ market: current }));
            }
        }, 1000);
    };

    const handleCancelAll = () => {
        if (currency) {
            dispatch(ordersCancelAllFetch({ market: currency }));
            setShowModalCancelAll(false);
        }

        setTimeout(() => {
            if (currency) {
                dispatch(userOpenOrdersFetch({ market: current }));
            }
        }, 1000);
    };

    const headersKeys = useMemo(
        () => [
            'Date',
            'Market',
            'Type',
            'Price',
            'Amount',
            'Total',
            'Trigger',
            'Filled',
            'Side',
            <p className="text-sm danger-text font-bold mb-0 ml-2 cursor-pointer" onClick={() => handleCancelAll()}>
                Cancel All{' '}
                <span className="ml-2">
                    <CloseIconTrade />
                </span>
            </p>,
        ],
        []
    );

    const renderHeaders = useMemo(
        () => [
            'Date',
            'Market',
            'Type',
            'Price',
            'Amount',
            'Total',
            'Trigger',
            'Filled',
            'Side',
            <p
                className="text-sm danger-text text-right font-bold mb-0 ml-2 cursor-pointer"
                onClick={() => setShowModalCancelAll(true)}>
                Cancel All{' '}
                <span className="ml-2">
                    <CloseIconTrade />
                </span>
            </p>,
        ],
        []
    );

    const renderData = useCallback(
        (data) => {
            if (!data.length) {
                return [[[''], [''], [''], [''], [''], translate('page.noDataToShow'), [''], [''], [''], ['']]];
            }

            return data.map((item: OrderCommon) => {
                const {
                    id,
                    price,
                    created_at,
                    remaining_volume,
                    origin_volume,
                    side,
                    ord_type,
                    market,
                    trigger_price,
                } = item;
                const executedVolume = Number(origin_volume) - Number(remaining_volume);
                const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
                const curMarket = markets.find((i) => i.id === market);
                const priceFixed = curMarket?.price_precision || 0;
                const amountFixed = curMarket?.amount_precision || 0;

                return [
                    <span key={id} className="split-lines">
                        <span className="secondary">{localeDate(created_at, 'date')}</span>&nbsp;
                        <span>{localeDate(created_at, 'time')}</span>
                    </span>,
                    <span key={id} className="bold">
                        {curMarket?.name.toUpperCase()}
                    </span>,
                    <span key={id}>
                        {ord_type ? translate(`page.body.trade.header.openOrders.content.type.${ord_type}`) : '-'}
                    </span>,
                    <span style={{ color: setTradeColor(side).color }} key={id}>
                        <Decimal fixed={priceFixed} thousSep=",">
                            {price}
                        </Decimal>
                    </span>,
                    <span key={id}>
                        <Decimal fixed={amountFixed} thousSep=",">
                            {+remaining_volume}
                        </Decimal>
                    </span>,
                    <span key={id}>
                        <Decimal fixed={amountFixed} thousSep=",">
                            {+remaining_volume * +price}
                        </Decimal>{' '}
                        <span className="cr-text__opacity">{curMarket?.quote_unit?.toUpperCase()}</span>
                    </span>,
                    <span key={id} className="split-lines">
                        {trigger_price ? (
                            <React.Fragment>
                                <span>{translate('page.body.trade.header.openOrders.lastPrice')}</span>&nbsp;
                                {getTriggerSign(ord_type, side)}&nbsp;&nbsp;
                                <span style={{ color: setTradeColor(side).color }}>
                                    {Decimal.format(trigger_price, priceFixed, ',')}
                                </span>
                            </React.Fragment>
                        ) : (
                            '-'
                        )}
                    </span>,
                    <span style={{ color: setTradeColor(side).color }} key={id}>
                        <Decimal fixed={2} thousSep=",">
                            {+filled}
                        </Decimal>
                        %
                    </span>,
                    <p className={`m-0 p-0 text-sm font-semibold ${side === 'sell' ? 'danger-text' : 'contrast-text'}`}>
                        {side === 'sell' ? 'Sell' : 'Buy'}
                    </p>,
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn-danger"
                            type="button"
                            onClick={() => {
                                setShowModalCancel(true);
                                setDeleteRow(item);
                            }}>
                            Cancel
                        </button>
                    </div>,
                ];
            });
        },
        [markets]
    );

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            event.preventDefault();
            setHideOtherPairs(!hideOtherPairs);
        },
        [hideOtherPairs]
    );

    const handleFilterSell = () => {
        setFilterBuy(false);
        setFilterSell(!filterSell);
    };

    const handleFilterBuy = () => {
        setFilterSell(false);
        setFilterBuy(!filterBuy);
    };

    const renderModalContentCancel = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24  text-center">Are you sure to Cancel Orders?</h6>
            <p className="text-sm grey-text-accent m-0 p-0 mb-24 text-center">
                The order you made for this transaction will be canceled and you will have to repeat the transaction
                again
            </p>
            <div className="d-flex justify-content-center">
                <button className="btn btn-danger sm px-5 mr-3" onClick={() => setShowModalCancel(false)}>
                    Close
                </button>
                <button onClick={() => handleCancel(deleteRow)} type="button" className="btn btn-primary sm px-5">
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );

    const renderModalContentCancelAll = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24">Are you sure to Cancel All your Orders?</h6>
            <p className="text-sm grey-text-accent m-0 p-0 mb-24">
                All order transactions that you make will be cancelled, are you sure to cancel all orders?
            </p>
            <div className="d-flex">
                <button className="btn btn-danger sm px-5 mr-3" onClick={() => setShowModalCancelAll(false)}>
                    Close
                </button>
                <button onClick={() => handleCancelAll()} type="button" className="btn btn-primary sm px-5">
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );
    // ======================= End Function Open Orders =======================

    return (
        <React.Fragment>
            <div className="market-trade-screen">
                <div className="content-wrapper no-sidebar dark-bg-accent pb-5">
                    <div className="px-24 pt-1">
                        <div className="grid-wrapper">
                            <div className="grid-item order-book">
                                <OrderBook
                                    asks={ask}
                                    bids={bid}
                                    loading={loading}
                                    handleSelectPriceAsks={handleSelectPriceAsks}
                                    handleSelectPriceBids={handleSelectPriceBids}
                                    orderType={orderType}
                                />
                            </div>
                            <div className="grid-item chart">
                                <TradingChart />
                            </div>
                            <div className="grid-item market-list">
                                <MarketListTrade handleRedirectToTrading={handleRedirectToTrading} />
                            </div>
                            <div className="grid-item order-form">
                                <OrderForm
                                    amountSell={amountSell}
                                    priceSell={priceSell}
                                    totalSell={totalSell}
                                    orderPercentageSell={orderPercentageSell}
                                    handleChangeAmountSell={handleChangeAmounSell}
                                    totalPriceSell={getTotalPrice(amountSell, +tickerItem?.last, asks)}
                                    handleChangePriceSell={handleChangePriceSell}
                                    handleSelectPercentageSell={handleSelectPercentageSell}
                                    showModalSell={showModalSell}
                                    handleCancelModalSell={handleCancelModalSell}
                                    handleSubmitSell={handleSubmitSell}
                                    amountBuy={amountBuy}
                                    priceBuy={priceBuy}
                                    totalBuy={totalBuy}
                                    orderPercentageBuy={orderPercentageBuy}
                                    handleChangeAmountBuy={handleChangeAmountBuy}
                                    totalPriceBuy={getTotalPrice(amountBuy, +tickerItem?.last, bids)}
                                    handleChangePriceBuy={handleChangePriceBuy}
                                    handleSelectPercentageBuy={handleSelectPercentageBuy}
                                    showModalBuy={showModalBuy}
                                    handleCancelModalBuy={handleCancelModalBuy}
                                    handleSubmitBuy={handleSubmitBuy}
                                    handleSubmit={handleSubmit}
                                    resetForm={resetForm}
                                    orderType={orderType}
                                    orderLoading={orderLoading}
                                    handleSide={handleSide}
                                    handleSelectOrderType={handleSelectOrderType}
                                    balanceCoin={balance}
                                    balanceQuote={usdt}
                                    fee={myTradingFee.toString()}
                                    willRecive={willRecive}
                                    willPay={willPay}
                                />
                            </div>
                            <div className="grid-item recent-trades">
                                <RecentTrades />
                            </div>
                            <div className="grid-item open-orders mt-50">
                                <OpenOrders
                                    headersKeys={headersKeys}
                                    headers={renderHeaders}
                                    data={renderData(list)}
                                    // onCancel={handleCancel}
                                    handleCancelAll={handleCancelAll}
                                    handleToggle={handleToggleCheckbox}
                                    hideOtherPair={hideOtherPairs}
                                    handleFilterBuy={handleFilterBuy}
                                    handleFilterSell={handleFilterSell}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {showModalCancel && <Modal show={showModalCancel} content={renderModalContentCancel()} />}
                {showModalCancelAll && <Modal show={showModalCancelAll} content={renderModalContentCancelAll()} />}
            </div>
        </React.Fragment>
    );
};
