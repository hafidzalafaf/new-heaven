import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { OrderCommon, OrderSide } from '../../../modules/types';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { TradingViewEmbed, widgetType } from 'react-tradingview-embed';
import { useMarketsFetch, useMarketsTickersFetch, useOpenOrdersFetch, useDocumentTitle } from '../../../hooks';
import {
    ordersCancelAllFetch,
    userOpenOrdersFetch,
    selectMarketTickers,
    openOrdersCancelFetch,
    setCurrentMarket,
    selectCurrentMarket,
    depthIncrementSubscribeResetLoading,
    selectMarkets,
    selectOpenOrdersList,
    selectDepthLoading,
    selectDepthAsks,
    selectDepthBids,
    selectMobileDeviceState,
    selectWallets,
    Ticker,
    Market,
    orderExecuteFetch,
    selectOrderExecuteLoading,
    selectGroupMember,
    selectTradingFee,
    groupFetch,
    withdrawSumFetch,
} from '../../../modules';
import { Decimal } from '../../../components';
import { ModalFullScreenMobile } from 'src/mobile/components';
import { RecentTrades, OpenOrders, OrderBook } from '../../../desktop/containers';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ArrowDownIcon, MinusIcon, PlusIcon, SidebarMenuIcon } from '../../assets/Trading';
import Select from 'react-select';
import { CustomStylesSelect } from 'src/desktop/components';
import { Table } from '../../../components';
import { TradingChart, OrderForm } from '../../containers';
import { CloseIconTrade } from 'src/assets/images/CloseIcon';
import { localeDate, setTradeColor, getTotalPrice, getAmount } from '../../../helpers';
import { getTriggerSign } from './helpers';
import { Modal } from 'src/desktop/components';
import { FilterInput } from 'src/desktop/components';

export const TradingMobileScreen: React.FC = (): React.ReactElement => {
    const { currency } = useParams<{ currency?: string }>();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const markets = useSelector(selectMarkets);
    const [list, setList] = React.useState([]);
    const currentMarket = useSelector(selectCurrentMarket);
    const marketTickers = useSelector(selectMarketTickers);
    const orderBookLoading = useSelector(selectDepthLoading);
    const listOrder = useSelector(selectOpenOrdersList);
    const asks = useSelector(selectDepthAsks);
    const bids = useSelector(selectDepthBids);
    const wallets = useSelector(selectWallets);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const tickers = useSelector(selectMarketTickers);
    const orderLoading = useSelector(selectOrderExecuteLoading);
    const groupMember = useSelector(selectGroupMember);
    const tradingFee = useSelector(selectTradingFee);

    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [showModalCancelAll, setShowModalCancelAll] = React.useState(false);
    const [deleteRow, setDeleteRow] = React.useState<OrderCommon>();

    const [loading, setLoading] = React.useState(false);
    const [filterSell, setFilterSell] = React.useState(false);
    const [filterBuy, setFilterBuy] = React.useState(false);
    const [hideOtherPairs, setHideOtherPairs] = React.useState<boolean>(false);
    const [showTrading, setShowTrading] = React.useState(false);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [changeMarket, setChangeMarket] = React.useState(false);
    const [priceSell, setPriceSell] = React.useState('');
    const [priceBuy, setPriceBuy] = React.useState('');
    const [orderType, setOrderType] = React.useState('limit');

    const [marketType, setMerketType] = React.useState('buy');
    const [orderPercentageBuy, setOrderPercentageBuy] = React.useState(0);
    const [orderPercentageSell, setOrderPercentageSell] = React.useState(0);
    const [showModalSell, setShowModalSell] = React.useState(false);
    const [showModalBuy, setShowModalBuy] = React.useState(false);
    const [amountBuy, setAmountBuy] = React.useState('');
    const [totalBuy, setTotalBuy] = React.useState('');
    const [amountSell, setAmountSell] = React.useState('');
    const [totalSell, setTotalSell] = React.useState('');
    const [side, setSide] = React.useState<OrderSide>('buy');
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredMarket, setFilteredMarket] = React.useState([]);

    useDocumentTitle('Trading');
    useOpenOrdersFetch(currentMarket, hideOtherPairs);
    useMarketsFetch();

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
    const totalPriceBuy = getTotalPrice(amountBuy, +tickerItem?.last, bids);
    const totalPriceSell = getTotalPrice(amountSell, +tickerItem?.last, asks);
    const wallet =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.base_unit?.toLowerCase());
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';

    const usd =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.quote_unit?.toLowerCase());
    const usdt = usd && usd.balance ? usd.balance.toString() : '0';

    // buat yang type market
    const totalPrice = getTotalPrice(
        side === 'buy' ? amountBuy : amountSell,
        +tickerItem?.last,
        side === 'buy' ? bids : asks
    );

    const translate = React.useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const defaultTicker = {
        amount: '0.0',
        last: '0.0',
        high: '0.0',
        open: '0.0',
        low: '0.0',
        price_change_percent: '+0.00%',
        volume: '0.0',
    };

    React.useEffect(() => {
        if (orderBookLoading) {
            setLoading(true);
            setTimeout(() => {
                dispatch(depthIncrementSubscribeResetLoading());
                setLoading(false);
            }, 2000);
        }
    }, [currentMarket, orderBookLoading]);

    // ============== ORDER FORM START ==============

    const handleChangeValueByButton = (increase: boolean, type: string) => {
        let updatedValue: string;
        if (type == 'Buy') {
            updatedValue = priceBuy;
        } else {
            updatedValue = priceSell;
        }
        const increasedValue = (+updatedValue + 10 ** -currentMarket?.price_precision).toFixed(
            currentMarket?.price_precision
        );
        const decreasedValue = (+updatedValue - 10 ** -currentMarket?.price_precision).toFixed(
            currentMarket?.price_precision
        );

        updatedValue = increase ? increasedValue : +decreasedValue >= 0 ? decreasedValue : updatedValue;
        if (type == 'Buy') {
            setPriceBuy(String(updatedValue));
        } else {
            setPriceSell(String(updatedValue));
        }
    };

    const handleChangeValueAmountByButton = (increase: boolean, type: string) => {
        let updatedValue: string;
        if (type == 'Buy') {
            updatedValue = amountBuy;
        } else {
            updatedValue = amountSell;
        }
        const increasedValue = (+updatedValue + 10 ** -currentMarket?.amount_precision).toFixed(
            currentMarket?.amount_precision
        );
        const decreasedValue = (+updatedValue - 10 ** -currentMarket?.amount_precision).toFixed(
            currentMarket?.amount_precision
        );

        updatedValue = increase ? increasedValue : +decreasedValue >= 0 ? decreasedValue : updatedValue;
        if (type == 'Buy') {
            setAmountBuy(String(updatedValue));
        } else {
            setAmountSell(String(updatedValue));
        }
    };

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
        setChangeMarket(false);
    };

    // React.useEffect(() => {
    //     setChangeMarket(props.changeMarket);
    //     if (changeMarket) {
    //         resetForm();
    //     }
    // }, [props.changeMarket, changeMarket]);

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

    // // ganti harga buy
    // const handleChangePriceBuy = (e: string) => {
    //     const value = e.replace(/[^0-9\.]/g, '');
    //     setPriceBuy(value);
    // };

    // // ganti harga sell
    // const handleChangePriceSell = (e: string) => {
    //     const value = e.replace(/[^0-9\.]/g, '');
    //     setPriceSell(value);
    // };

    // ganti amount buy
    const handleChangeAmountBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountBuy(value);
        setOrderPercentageBuy(0);
    };

    // ganti amout sell
    const handleChangeAmountSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountSell(value);
        setOrderPercentageSell(0);
    };

    // ganti select persenan
    const handleSelectPercentageSell = (e: number) => {
        setOrderPercentageSell(e);
    };

    // ganti select persenan
    const handleSelectPercentageBuy = (e: number) => {
        setOrderPercentageBuy(e);
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

    const handleSide = (value: OrderSide) => {
        setSide(value);
    };
    // ============ ORDER FORM END ==========

    // Function Order Book
    const handleSelectPriceAsks = (e: string) => {
        setPriceSell(e);
        setPriceBuy(e);
    };

    const handleSelectPriceBids = (e: string) => {
        setPriceBuy(e);
        setPriceSell(e);
    };

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            event.preventDefault();
            setHideOtherPairs(!hideOtherPairs);
        },
        [hideOtherPairs]
    );

    const current = markets.find((item) => item.id === currency);
    React.useEffect(() => {
        dispatch(setCurrentMarket(current));
    }, [current]);

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Limit Order</p>, value: 'limit-order' },
        { label: <p className="m-0 text-sm grey-text-accent">Market</p>, value: 'market' },
    ];

    const marketList = markets.map((market) => ({
        ...market,
        last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision),
        open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
        price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
        high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.price_precision),
        volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.amount_precision),
    }));

    const priceChange = marketList.find((item) => item.id == currency);

    const renderHeaderData = [
        <div className="d-flex w-100 justify-content-between">
            <p>Pair</p>
            <p className="text-right">Price 24h Change</p>
        </div>,
    ];

    const renderSidebarData = (data) => {
        return data.map((item) => [
            <div
                className="d-flex justify-content-between cursor-pointer"
                onClick={() => {
                    history.push(`/trading/${item.id}`);
                    setChangeMarket(true);
                    setShowSidebar(false);
                }}>
                <div className="td-pair d-flex align-items-center">
                    <p className="mb-0">{item.name}</p>
                    {/* <div className="tag-pair">5X</div> */}
                </div>
                <div className="td-price d-flex flex-column justify-content-end align-items-end w-full">
                    <h4 className="primary-text">
                        {item.last} {item.quote_unit.toUpperCase()}
                    </h4>
                    <h5 className={`mb-0 ${item.price_change_percent?.includes('+') ? 'green-text' : 'danger-text'}`}>
                        {item.price_change_percent}
                    </h5>
                </div>
            </div>,
        ]);
    };

    // Function Open Orders
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

    const handleFilterSell = () => {
        setFilterSell(!filterSell);
    };

    const handleFilterBuy = () => {
        setFilterBuy(!filterBuy);
    };

    const handleShowModalCancelAll = () => {
        setShowModalCancelAll(true);
    };
    const searchFilter = (row: Market, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.id?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredMarket(result as Market[]);
    };

    const filteredList = marketList.filter(
        (i) =>
            !filterValue ||
            i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
            i.id?.toLocaleLowerCase().includes(filterValue.toLowerCase())
    );

    const headersKeys = useMemo(
        () => [
            'Date',
            'Market',
            'Type',
            'Price',
            'Total',
            'Amount',
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

    const renderHeaders = useMemo(() => ['Date', 'Market', 'Type', 'Price', 'Total', 'Amount', 'Side', 'Action'], []);

    const renderData = useCallback(
        (data) => {
            if (!data.length) {
                return [
                    [
                        [''],
                        [''],
                        [''],
                        <span className="text-nowrap">{translate('page.noDataToShow')}</span>,
                        [''],
                        [''],
                        [''],
                        [''],
                    ],
                ];
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
                    volume,
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
                            {+remaining_volume * +price}
                        </Decimal>
                        <span className="cr-text__opacity">{curMarket?.quote_unit?.toUpperCase()}</span>
                    </span>,
                    <span key={id}>
                        <Decimal fixed={amountFixed} thousSep=",">
                            {origin_volume}
                        </Decimal>
                    </span>,
                    <span className={`${side == 'sell' ? 'danger-text' : 'green-text'}`}>{side}</span>,
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                            setShowModalCancel(true);
                            setDeleteRow(item);
                        }}>
                        Cancel
                    </button>,
                ];
            });
        },
        [markets]
    );

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

    return (
        <React.Fragment>
            <div className="mobile-container trading-screen no-header position-relative dark-bg-main">
                <div className="d-flex justify-content-between align-items-center mb-3 ">
                    <div className="d-flex align-items-center menu-title">
                        <div className="cursor-pointer d-flex align-items-center" onClick={() => setShowSidebar(true)}>
                            <SidebarMenuIcon />
                            <h1 className="mb-0">{currentMarket && currentMarket.name}</h1>
                        </div>
                        <div
                            className={`${
                                priceChange && priceChange.price_change_percent?.includes('+')
                                    ? 'badge-success'
                                    : 'badge-danger'
                            }`}>
                            {priceChange && priceChange.price_change_percent}
                        </div>
                    </div>
                    <div className="d-flex align-items-center menu-expand">
                        <div
                            id="expand-trade-view"
                            className="d-flex expand-container align-items-center cursor-pointer"
                            onClick={() => setShowTrading(!showTrading)}>
                            <p className="m-0 text-sm mr-1">Expand</p>
                            <ArrowDownIcon />
                        </div>
                    </div>
                </div>
                {showTrading && (
                    <div className="mb-3" style={{ height: 400 }}>
                        {<TradingChart />}
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-start trade-container w-100 ">
                    <OrderForm
                        changeMarket={changeMarket}
                        // handleChangePriceBuy={handleChangePriceBuy}
                        // handleChangePriceSell={handleChangePriceSell}
                        priceSell={priceSell}
                        amountSell={amountSell}
                        totalSell={totalSell}
                        orderPercentageSell={orderPercentageSell}
                        handleChangeAmountSell={handleChangeAmountSell}
                        totalPriceSell={getTotalPrice(amountSell, +tickerItem?.last, asks)}
                        handleChangePriceSell={handleChangePriceSell}
                        handleSelectPercentageSell={handleSelectPercentageSell}
                        showModalSell={showModalSell}
                        handleCancelModalSell={handleCancelModalSell}
                        handleSubmitSell={handleSubmitSell}
                        priceBuy={priceBuy}
                        amountBuy={amountBuy}
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
                        side={side}
                        handleChangeValueByButton={handleChangeValueByButton}
                        handleChangeValueAmountByButton={handleChangeValueAmountByButton}
                        fee={myTradingFee.toString()}
                        willRecive={willRecive}
                        willPay={willPay}
                    />

                    <div className={`w-40 ${isMobileDevice && 'mobile-device order-book-mobile'}`}>
                        <OrderBook
                            asks={ask}
                            bids={bid}
                            loading={loading}
                            orderType={orderType}
                            handleSelectPriceAsks={handleSelectPriceAsks}
                            handleSelectPriceBids={handleSelectPriceBids}
                        />
                    </div>
                </div>
                <div className="trading-tabs mt-2">
                    <Tabs defaultActiveKey="recent-trade" id="justify-tab-example" className="" justify>
                        <Tab eventKey="recent-trade" title="Recent Trade">
                            <div className="mobile-trades">
                                <RecentTrades />
                            </div>
                        </Tab>
                        <Tab eventKey="open-order" title="Open Order">
                            <div className="mobile-open-order">
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
                                    isMobileDevices={isMobileDevice}
                                    handleShowModalCancelAll={handleShowModalCancelAll}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                <div
                    id="sidebar"
                    className={`position-absolute w-100 overflow-auto sidebar-wrapper ${showSidebar && 'active'}`}>
                    <div className="sidebar d-flex justify-content-between align-items-start w-100">
                        <div className="sidebar-container">
                            <div className="sidebar-head mb-24">
                                <h1>Trade</h1>
                            </div>
                            <div className="search-container w-100 mb-16">
                                <div className="input-group">
                                    {/* <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                    /> */}
                                    <div className="input-group-append">
                                        <FilterInput
                                            data={marketList}
                                            onFilter={handleFilter}
                                            filter={searchFilter}
                                            placeholder={'Search Coin'}
                                            className="filter-market-trade"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Table data={renderSidebarData(filteredList)} header={renderHeaderData} />
                        </div>
                        <div
                            id="close-sidebar"
                            className="sidebar-close cursor-pointer"
                            onClick={() => setShowSidebar(false)}></div>
                    </div>
                </div>
                {showModalCancel && <Modal show={showModalCancel} content={renderModalContentCancel()} />}
                {showModalCancelAll && <Modal show={showModalCancelAll} content={renderModalContentCancelAll()} />}
            </div>
        </React.Fragment>
    );
};
