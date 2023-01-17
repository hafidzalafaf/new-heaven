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
    selectUserLoggedIn,
    selectDepthAsks,
    selectDepthBids,
    selectMobileDeviceState,
} from '../../../modules';
import { Decimal } from '../../../components';
import { ModalFullScreenMobile } from 'src/mobile/components';
import { RecentTrades, OpenOrders } from '../../../desktop/containers';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ArrowDownIcon, MinusIcon, PlusIcon, SidebarMenuIcon } from '../../assets/Trading';
import Select from 'react-select';
import { CustomStylesSelect } from 'src/desktop/components';
import { Table } from '../../../components';
import { TradingChart } from '../../containers';
import { OrderBook } from '../../../desktop/containers';
import { CloseIconTrade } from 'src/assets/images/CloseIcon';
import { localeDate, setTradeColor } from '../../../helpers';
import { getTriggerSign } from './helpers';

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
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const [loading, setLoading] = React.useState(false);
    const [marketType, setMerketType] = React.useState('buy');
    const [filterSell, setFilterSell] = React.useState(false);
    const [filterBuy, setFilterBuy] = React.useState(false);
    const [hideOtherPairs, setHideOtherPairs] = React.useState<boolean>(false);
    const [showTrading, setShowTrading] = React.useState(false);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [priceSell, setPriceSell] = React.useState(Decimal.format(0, currentMarket?.price_precision));
    const [priceBuy, setPriceBuy] = React.useState(Decimal.format(0, currentMarket?.price_precision));
    const [key, setKey] = React.useState('USDT');
    const isLoggedin = useSelector(selectUserLoggedIn);

    useDocumentTitle('Trading');
    useOpenOrdersFetch(currentMarket, hideOtherPairs);
    useMarketsFetch();

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
        last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
        open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
        price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
        high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.amount_precision),
        volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.price_precision),
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
                className="d-flex justify-content-between"
                onClick={() => {
                    history.push(`/trading/${item.id}`);
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
                    <h5 className={`mb-0 ${item.price_change_percent.includes('+') ? 'green-text' : 'danger-text'}`}>
                        {item.price_change_percent}
                    </h5>
                </div>
            </div>,
        ]);
    };

    // Function Open Orders
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

    const handleCancel = (order: OrderCommon) => {
        dispatch(openOrdersCancelFetch({ order, list }));
        setTimeout(() => {
            if (current) {
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
                console.log(side);

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
                        <Decimal fixed={2} thousSep=",">
                            {volume}
                        </Decimal>
                    </span>,
                    <span className={`${side == 'sell' ? 'danger-text' : 'green-text'}`}>{side}</span>,
                    <button className="btn btn-danger" type="button" onClick={() => handleCancel(item)}>
                        Cancel
                    </button>,
                ];
            });
        },
        [markets]
    );

    return (
        <React.Fragment>
            <div className="mobile-container trading-screen no-header position-relative dark-bg-main">
                {/* TOP TRADING SCREEN */}
                <div className="d-flex justify-content-between align-items-center mb-3 ">
                    <div className="d-flex align-items-center menu-title">
                        <div className="cursor-pointer d-flex align-items-center" onClick={() => setShowSidebar(true)}>
                            <SidebarMenuIcon />
                            <h1 className="mb-0">{currentMarket && currentMarket.name}</h1>
                        </div>
                        <div
                            className={`${
                                priceChange && priceChange.price_change_percent.includes('+')
                                    ? 'badge-success'
                                    : 'badge-danger'
                            }`}>
                            {priceChange && priceChange.price_change_percent}
                        </div>
                    </div>
                    <div className="d-flex align-items-center menu-expand">
                        {/* <div className="cursor-pointer more">
                            <DotsIcon />
                        </div> */}
                        <div
                            id="expand-trade-view"
                            className="d-flex expand-container align-items-center cursor-pointer"
                            onClick={() => setShowTrading(!showTrading)}>
                            <p className="m-0 text-sm mr-1">Expand</p>
                            <ArrowDownIcon />
                        </div>
                    </div>
                </div>
                {/* TRADING */}
                {showTrading && (
                    <div className="mb-3" style={{ height: 400 }}>
                        {<TradingChart />}
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-start trade-container w-100 ">
                    {/* ORDER FORM */}
                    <div className={`buy-sell-container  w-60 ${isLoggedin ? '' : 'blur-effect blur-mobile'}`}>
                        <ul className="nav nav-pills w-100" id="pills-tab" role="tablist">
                            <li
                                className={`nav-item buy ${marketType == 'buy' && 'active'}`}
                                id="buy-tab"
                                onClick={() => setMerketType('buy')}>
                                <a className={`nav-link buy ${marketType == 'buy' && 'active'}`}>Buy</a>
                            </li>
                            <li
                                className={`nav-item sell ${marketType == 'sell' && 'active'}`}
                                id="sell-tab"
                                onClick={() => setMerketType('sell')}>
                                <a className={`nav-link sell ${marketType == 'sell' && 'active'}`}>Sell</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <form
                                className="tab-pane fade show active"
                                id="pills-buy"
                                role="tabpanel"
                                aria-labelledby="pills-buy-tab">
                                <div className="dropdown w-100 mb-8">
                                    <Select
                                        value={optionStatus.filter(function (option) {
                                            return option.value === 'limit-order';
                                        })}
                                        styles={CustomStylesSelect}
                                        options={optionStatus}
                                    />
                                </div>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="1518.72" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                <p className="m-0 mb-8 amount">= Rp 234,009,833</p>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Amount BTC" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                <div className="badge-container d-flex justify-content-between align-items-center flex-wrap mb-8">
                                    <div className="badge">25%</div>
                                    <div className="badge">50%</div>
                                    <div className="badge">75%</div>
                                    <div className="badge">100%</div>
                                </div>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Total BIDR" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                {marketType == 'buy' ? (
                                    <button
                                        type="button"
                                        className="btn-primary btn-buy btn-block"
                                        data-toggle="modal"
                                        disabled={!isLoggedin}
                                        data-target="#modal-confirm-buy">
                                        Buy
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-danger btn-sell btn-block"
                                        data-toggle="modal"
                                        disabled={!isLoggedin}
                                        data-target="#modal-confirm-buy">
                                        Buy
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* ORDER BOOK */}
                    <div className={`w-40 ${isMobileDevice && 'mobile-device'}`}>
                        <OrderBook
                            asks={asks}
                            bids={bids}
                            loading={loading}
                            handleSelectPriceAsks={handleSelectPriceAsks}
                            handleSelectPriceBids={handleSelectPriceBids}
                        />
                    </div>
                </div>
                {/* OPEN ORDER */}
                <div className="trading-tabs mt-2">
                    <Tabs defaultActiveKey="open-order" id="justify-tab-example" className="" justify>
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
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="recent-trade" title="Recent Trade">
                            <div className="mobile-trades">
                                <RecentTrades />
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                {/* OFF CANVAS SIDEBAR */}
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                    />
                                    <div className="input-group-append">
                                        {/* <FilterInput
                                                data={wallets}
                                                onFilter={handleFilter}
                                                filter={searchFilter}
                                                placeholder={formatMessage({ id: 'page.body.wallets.overview.seach' })}
                                                className="search-wallet"
                                            /> */}
                                    </div>
                                </div>
                            </div>
                            <Table data={renderSidebarData(marketList)} header={renderHeaderData} />
                            {/* <Tabs
                                id="controlled-tab-example"
                                defaultActiveKey="all-crypto"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="">
                                <Tab eventKey="USDT" title="USDT">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="FIAT" title="FIAT">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="BNB" title="BNB">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="BTC" title="BTC">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="ALTS" title="ALTS">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                            </Tabs> */}
                        </div>
                        <div
                            id="close-sidebar"
                            className="sidebar-close cursor-pointer"
                            onClick={() => setShowSidebar(false)}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
