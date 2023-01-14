import classnames from 'classnames';
import React, { FC, ReactElement, useMemo, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useDepthFetch, useOpenOrdersFetch } from 'src/hooks';
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
} from 'src/modules';
import { incrementalOrderBook } from 'src/api';
import { OpenOrders, OrderBook, MarketListTrade, RecentTrades, OrderForm, TradingChart } from '../../containers';
import { OrderCommon, OrderSide } from '../../../modules/types';
import { getTriggerSign } from './helpers';
import { getTotalPrice, getAmount } from '../../../helpers';
import { CloseIconTrade } from 'src/assets/images/CloseIcon';

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

    const [hideOtherPairs, setHideOtherPairs] = useState<boolean>(false);
    const [list, setList] = useState([]);
    const [filterSell, setFilterSell] = useState(false);
    const [filterBuy, setFilterBuy] = useState(false);
    const [loading, setLoading] = useState(false);

    // State Order Form
    const [orderPercentageBuy, setOrderPercentageBuy] = React.useState(0);
    const [orderPercentageSell, setOrderPercentageSell] = React.useState(0);
    const [showModalSell, setShowModalSell] = React.useState(false);
    const [showModalBuy, setShowModalBuy] = React.useState(false);
    const [priceBuy, setPriceBuy] = React.useState(Decimal.format(0, currentMarket?.price_precision));
    const [amountBuy, setAmountBuy] = React.useState('');
    const [totalBuy, setTotalBuy] = React.useState('');
    const [priceSell, setPriceSell] = React.useState(Decimal.format(0, currentMarket?.price_precision));
    const [amountSell, setAmountSell] = React.useState('');
    const [totalSell, setTotalSell] = React.useState('');
    const [orderType, setOrderType] = React.useState('limit');
    const [side, setSide] = React.useState<OrderSide>('buy');
    // End Order Form

    useOpenOrdersFetch(currentMarket, hideOtherPairs);
    useDepthFetch();

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
    }, [currentMarket, orderBookLoading]);

    React.useEffect(() => {
        if (listOrder) {
            const data =
                listOrder.length && listOrder.filter((item) => item.market.toLowerCase() === currency.toLowerCase());
            setList(data);
        }
        if (list && list[0] && filterSell) {
            const sell = list.filter((item) => item.side === 'sell');
            setList(sell);
        }

        if (list && list[0] && filterBuy) {
            const buy = list.filter((item) => item.side === 'buy');
            setList(buy);
        }

        if (hideOtherPairs) {
            setList([]);
        }
    }, [listOrder, filterBuy, filterSell, hideOtherPairs]);

    // Function Market List
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
        }
    };
    // End Function Market List

    // Function Order Form
    const totalPrice = getTotalPrice(
        side === 'buy' ? amountBuy : amountSell,
        +tickerItem?.last,
        side === 'buy' ? bids : asks
    );

    const totalAmount = getAmount(
        side === 'buy' ? +usdt : +balance,
        side === 'buy' ? bids : asks,
        side === 'buy' ? orderPercentageBuy : orderPercentageSell
    );

    React.useEffect(() => {
        const safePrice = +totalPrice / +totalAmount || priceSell;

        const market =
            orderPercentageSell !== 0
                ? Decimal.format((+balance * orderPercentageSell) / 100, currentMarket?.amount_precision)
                : Decimal.format(amountSell, currentMarket?.amount_precision);

        const limit =
            orderPercentageSell !== 0
                ? Decimal.format(+totalSell / +priceSell, currentMarket?.amount_precision)
                : Decimal.format(amountSell, currentMarket?.amount_precision);

        setAmountSell(orderType === 'market' ? market : limit);
    }, [orderPercentageSell, totalSell, priceSell]);

    React.useEffect(() => {
        const safePrice = totalPrice / +amountSell || priceSell;
        // const market =
        //     orderPercentageSell !== 0
        //         ? Decimal.format((+balance * +orderPercentageSell) / 100, currentMarket?.price_precision)
        //         : Decimal.format(+amountSell * +safePrice, currentMarket?.price_precision);

        const market = Decimal.format(+amountSell * +safePrice, currentMarket?.price_precision);

        const limit =
            orderPercentageSell !== 0
                ? Decimal.format((+balance * +orderPercentageSell) / 100, currentMarket?.price_precision)
                : Decimal.format(+priceSell * +amountSell, currentMarket?.price_precision);

        setTotalSell(orderType === 'market' ? market : limit);
    }, [priceSell, amountSell, orderPercentageSell]);

    React.useEffect(() => {
        // const safePrice = +totalPrice / +totalAmount || priceBuy;
        const market =
            orderPercentageBuy !== 0
                ? Decimal.format((+usdt * orderPercentageBuy) / 100, currentMarket?.amount_precision)
                : Decimal.format(amountBuy, currentMarket?.amount_precision);

        const limit =
            orderPercentageBuy !== 0
                ? Decimal.format(+totalBuy / +priceBuy, currentMarket?.amount_precision)
                : Decimal.format(amountBuy, currentMarket?.amount_precision);

        setAmountBuy(orderType === 'market' ? market : limit);
    }, [orderPercentageBuy, totalBuy, priceBuy]);

    React.useEffect(() => {
        const safePrice = totalPrice / +amountBuy || priceBuy;
        // const market =
        //     orderPercentageBuy !== 0
        //         ? Decimal.format((+usdt * +orderPercentageBuy) / 100, currentMarket?.price_precision)
        //         : Decimal.format(+amountBuy * +safePrice, currentMarket?.price_precision);

        const market = Decimal.format(+amountBuy * +safePrice, currentMarket?.price_precision);

        const limit =
            orderPercentageBuy !== 0
                ? Decimal.format((+usdt * +orderPercentageBuy) / 100, currentMarket?.price_precision)
                : Decimal.format(+priceBuy * +amountBuy, currentMarket?.price_precision);

        setTotalBuy(orderType === 'market' ? market : limit);
    }, [priceBuy, amountBuy, orderPercentageBuy]);

    const resetForm = () => {
        setShowModalSell(false);
        setShowModalBuy(false);
        setAmountBuy('');
        setAmountSell('');
        setPriceBuy(Decimal.format('0', currentMarket?.price_precision));
        setPriceSell(Decimal.format('0', currentMarket?.price_precision));
        setTotalBuy('');
        setTotalSell('');
        setOrderPercentageSell(0);
        setOrderPercentageBuy(0);
    };

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

    const handleSide = (value: OrderSide) => {
        setSide(value);
    };

    const handleChangePriceBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceBuy(value);
    };

    const handleChangePriceSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceSell(value);
    };

    const handleChangeAmountBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountBuy(value);
        setOrderPercentageBuy(0);
    };

    const handleChangeAmounSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountSell(value);
        setOrderPercentageSell(0);
    };

    const handleSelectPercentageSell = (e: number) => {
        setOrderPercentageSell(e);
    };

    const handleSelectPercentageBuy = (e: number) => {
        setOrderPercentageBuy(e);
    };

    const handleCancelModalSell = () => {
        setShowModalSell(false);
    };

    const handleCancelModalBuy = () => {
        setShowModalBuy(false);
    };

    const handleSubmitSell = () => {
        setShowModalSell(true);
    };

    const handleSubmitBuy = () => {
        setShowModalBuy(true);
    };

    const handleSelectOrderType = (e: string) => {
        setOrderType(e);
        resetForm();
    };
    // End Order Form

    // Function Order Book
    const handleSelectPriceAsks = (e: string) => {
        setPriceSell(e);
        setPriceBuy(e);
    };

    const handleSelectPriceBids = (e: string) => {
        setPriceBuy(e);
        setPriceSell(e);
    };
    // End Function Order Book

    // Function Open Orders
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
            <p className="text-sm danger-text font-bold mb-0 ml-2 cursor-pointer" onClick={() => handleCancelAll()}>
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
                    side,
                    <button className="btn-danger" type="button" onClick={() => handleCancel(item)}>
                        Cancel
                    </button>,
                ];
            });
        },
        [markets]
    );

    const handleCancel = (order: OrderCommon) => {
        dispatch(openOrdersCancelFetch({ order, list }));
        setTimeout(() => {
            if (current) {
                dispatch(userOpenOrdersFetch({ market: current }));
            }
        }, 1000);
    };

    const handleCancelAll = () => {
        if (currency) {
            dispatch(ordersCancelAllFetch({ market: currency }));
        }

        setTimeout(() => {
            if (currency) {
                dispatch(userOpenOrdersFetch({ market: current }));
            }
        }, 1000);
    };

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            event.preventDefault();
            setHideOtherPairs(!hideOtherPairs);
        },
        [hideOtherPairs]
    );

    const handleFilterSell = () => {
        setFilterSell(!filterSell);
    };

    const handleFilterBuy = () => {
        setFilterBuy(!filterBuy);
    };
    // End Function Open Orders

    return (
        <React.Fragment>
            <div className="market-trade-screen">
                <div className="content-wrapper no-sidebar dark-bg-accent pb-5">
                    <div className="px-24 pt-1">
                        <div className="grid-wrapper">
                            <div className="grid-item order-book">
                                <OrderBook
                                    asks={asks}
                                    bids={bids}
                                    loading={loading}
                                    handleSelectPriceAsks={handleSelectPriceAsks}
                                    handleSelectPriceBids={handleSelectPriceBids}
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
            </div>
        </React.Fragment>
    );
};
