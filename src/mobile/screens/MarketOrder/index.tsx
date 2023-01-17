import * as React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Table, Decimal } from '../../../components';
import { CustomStylesSelect } from '../../../mobile/components';

import { EditIcon, CloseIcon } from '../../assets/Market';
import { FilterIcon } from 'src/assets/images/FilterIcon';
import { BtcIcon } from '../../../assets/images/CoinIcon';
import { useDocumentTitle, useWalletsFetch, useUserOrdersHistoryFetch, useMarketsFetch } from '../../../hooks';
import {
    selectCurrencies,
    Currency,
    selectMarkets,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    RootState,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
} from '../../../modules';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { OrderCommon } from 'src/modules/types';



interface MarketOrderMobileScreenProps {
    market: string;
    created_at: string;
    type: string;
    price: string;
    amount: string;
    total: string;
    volume: string;
    execute: string;
    unexecute: string;
    market_type: string;
    side: string;
    remaining_volume: string;
    executed_volume: string;
    origin_volume: string;
    dataCurrency: {
        currency: string;
        name: string;
        icon_url: string;
    };
}


const MarketOrderMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [key, setKey] = React.useState('open-order');
    const [showDetail, setShowDetail] = React.useState(false);

    const [tab, setTab] = React.useState('open');
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('');
    const [asset, setAsset] = React.useState('');
    const [detailData, setDetailData] = React.useState<MarketOrderMobileScreenProps>({} as MarketOrderMobileScreenProps);

    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 25));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 25));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    const markets = useSelector(selectMarkets);
    const currencies: Currency[] = useSelector(selectCurrencies);

    useUserOrdersHistoryFetch(currentPageIndex, tab, 20);
    useDocumentTitle('Market Order');
    useWalletsFetch();
    useMarketsFetch();

    console.log(markets, 'markets');

    React.useEffect(() => {
        if (orders) {
            if (tab === 'open') {
                const filter = orders.filter((o) => ['wait', 'pending'].includes(o.state));
                setData(filter);
            } else if (tab === 'close') {
                const filter = orders.filter((o) => ['done', 'cancel', 'completed', 'error'].includes(o.state));
                setData(filter);
            } else {
                setData(orders);
            }
        }
    }, [orders, tab]);

    const dataListWithIcon = data.map((item) => ({
        ...item,
        dataCurrency: currencies.find(({ id }) => id == item.market.replace('usdt','')|| id == item.market.replace('trx', '')),
    }));

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
        }
    };

    const handleCancelSingleOrder = (order: OrderCommon) => () => {
        if (shouldFetchCancelAll && shouldFetchCancelSingle) {
            dispatch(
                openOrdersCancelFetch({
                    order,
                    list: data,
                })
            );
        }
    };

    React.useEffect(() => {
        if (startDate != '' && endDate != '') {
            const filterredList = orders.filter(
                (item) =>
                    moment(item.created_at).format() >= moment(startDate).format() &&
                    moment(item.created_at).format() <= moment(endDate).format()
            );
            setData(filterredList);
        }
    }, [startDate, endDate]);

    const filterredStatus = (status) => {
        let filterredList;
        let temp;
        temp = orders;
        filterredList = temp.filter((item) => item.state === status);
        setData(
            status === ''
                ? orders.filter((o) => ['done', 'cancel', 'completed', 'error'].includes(o.state))
                : filterredList
        );
    };

    let currentBidUnitMarkets = markets;
    const formattedMarkets = currentBidUnitMarkets.length
        ? currentBidUnitMarkets.map((market) => ({
              ...market,
              currency: currencies.find((cur) => cur.id == market.base_unit),
          }))
        : [];

    const filterredAsset = (id) => {
        let filterredList;
        let open;
        open = orders.filter((o) => ['wait', 'pending'].includes(o.state));

        let close;
        close = orders.filter((o) => ['done', 'cancel', 'completed', 'error'].includes(o.state));

        filterredList =
            tab === 'open' ? open.filter((item) => item.market === id) : close.filter((item) => item.market === id);
        setData(id === '' ? data : filterredList);
    };

    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const handleItemDetail = (item) => {
        setShowDetail(true);
        setDetailData(item);
    };
    console.log(dataListWithIcon, 'dataListWithIcon');
    console.log(data, 'data')
    console.log(detailData, 'detailData');
    const renderTableHeader = [
        <p className="mb-0 text-sm grey-text">Coins</p>,
        <p className="mb-0 text-sm grey-text">Amount</p>,
        <p className="mb-0 text-sm grey-text">Price</p>,
        <p className="mb-0 text-sm grey-text">Type</p>,
        <p className="mb-0 text-sm grey-text">Status</p>,
    ];

    const renderDataTable = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-stretch">
            <img
                height={30}
                width={30}
                className="icon-history mr-3 rounded-full"
                src={item.dataCurrency && item.dataCurrency.icon_url}
                alt="icon"
            />
        </div>,
            <div className="d-flex align-items-center text-sm">
                <div className="">
                    <p className="mb-0 grey-text-accent font-bold text-sm">{item.price} {item.market.toUpperCase()}</p>
                    <p className="mb-0 grey-text text-xxs text-nowrap">{moment(item.created_at).format('D MMM YYYY - HH:mm')}</p>
                </div>
            </div>,
            <p className={`badge grey-text text-sm mb-0`}>{item.price}</p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>{item.side.charAt(0).toUpperCase() + item.side.slice(1)}</p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>{item.state.charAt(0).toUpperCase() + item.state.slice(1)}</p>,
            <p key={index} className={`badge text-sm mb-0 cursor-pointer danger-text`} onClick={()=> handleItemDetail(data[index])}>
                Detail
            </p>,
        ]);
    };

    console.log('data', data);
    console.log(data[0])

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">All</p>, value: '' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'cancel' },
        { label: <p className="m-0 text-sm grey-text-accent">Done</p>, value: 'done' },
    ];
    const optionAssets = formattedMarkets.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center">
                <img src={item.currency?.icon_url} alt="icon" className="mr-12 small-coin-icon" />
                <div>
                    <p className="m-0 text-sm grey-text-accent">{item.name.toUpperCase()}</p>
                    <p className="m-0 text-xs grey-text-accent">{item.currency?.name}</p>
                </div>
            </div>
        );
        return {
            label: customLabel,
            value: item.id,
        };
    });

    const renderFilter = () => {
        return (
            <div className="d-flex align-items-center">
                <div className="w-20 mr-24">
                    <label className="m-0 white-text text-sm mb-8">Start Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setStartDate(e.target.value);
                        }}
                    />
                </div>

                <div className="w-20 mr-24">
                    <label className="m-0 white-text text-sm mb-8">End Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setEndDate(e.target.value);
                        }}
                    />
                </div>

                <div className="w-20 mr-24">
                    <p className="m-0 white-text text-sm mb-8">Assets</p>
                    <Select
                        value={optionAssets.filter(function (option) {
                            return option.value === asset;
                        })}
                        onChange={(e) => {
                            setAsset(e.value);
                            filterredAsset(e.value);
                        }}
                        styles={CustomStylesSelect}
                        options={optionAssets}
                    />
                </div>

                {tab === 'close' && (
                    <div className="w-20 mr-24">
                        <p className="m-0 white-text text-sm mb-8">Status</p>
                        <Select
                            value={optionStatus.filter(function (option) {
                                return option.value === status;
                            })}
                            onChange={(e) => {
                                setStatus(e.value);
                                filterredStatus(e.value);
                            }}
                            styles={CustomStylesSelect}
                            options={optionStatus}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="mobile-container pg-market-order no-header dark-bg-main">
                <div className="d-flex justify-content-between align-items-center head-container">
                    <h1 className="text-md font-extrabold mb-0 grey-text-accent">Market Order</h1>
                    <div className="d-flex justify-content-start align-items-center head-action">
                        <span className="mr-8">
                            <FilterIcon />
                        </span>
                        <span>
                            <EditIcon />
                        </span>
                    </div>
                </div>

                <Tabs
                    id="controlled-tab-example"
                    defaultActiveKey={tab}
                    onSelect={(e)=> {
                        setTab(e);
                        setStartDate('');
                        setEndDate('');
                        setAsset('');
                    }}
                    className="">
                    <Tab eventKey="open" title="Open Order">
                        <div className="table-mobile-wrapper">
                            <Table data={renderDataTable(dataListWithIcon)} header={renderTableHeader} />
                        </div>
                    </Tab>
                    <Tab eventKey="close" title="Close Order">
                        <div className="table-mobile-wrapper">
                            <Table data={renderDataTable(dataListWithIcon)} header={renderTableHeader} />
                        </div>
                    </Tab>

                    <div className="ml-auto">
                        <div className="d-flex justify-content-start align-items-center cancel-all-container">
                            <p className="p-0 m-0">Close All</p>
                            <CloseIcon />
                        </div>
                    </div>
                </Tabs>
                <div id="off-canvas" className={`position-fixed off-canvas ${showDetail ? ' show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container overflow-auto">
                        <div className="d-flex align-items-center off-canvas-content-head">
                        <img
                            height={30}
                            width={30}
                            className="icon-history mr-3 rounded-full"
                            src={detailData.dataCurrency?.icon_url}
                            alt="icon"
            />
                            <h3>
                                {detailData?.market?.toUpperCase()}
                            </h3>
                        </div>
                        <table className="w-100 table-canvas">
                            <tbody>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Date</td>
                                    <td className="td-value">{moment(detailData.created_at).format('D MMM YYYY - HH:mm')}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Market</td>
                                    <td className="td-value">{detailData.market_type}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Type</td>
                                    <td className="td-value">{detailData.side}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Price</td>
                                    <td className="td-value">{detailData.price}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Volume</td>
                                    <td className="td-value">{detailData.remaining_volume}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Execute</td>
                                    <td className="td-value">{detailData.executed_volume}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Execute</td>
                                    <td className="td-value">{detailData?.dataCurrency?.name}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Unexecute</td>
                                    <td className="td-value">{detailData.origin_volume}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            id="cancel-canvas"
                            className="btn btn-danger btn-mobile w-100 mb-3 mt-4"
                            onClick={() => setShowDetail(false)}>
                            Cancel
                        </button>
                        <button
                            id="close-canvas"
                            className="btn btn-secondary btn-outline btn-mobile btn-block mb-4"
                            onClick={() => setShowDetail(false)}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { MarketOrderMobileScreen };
