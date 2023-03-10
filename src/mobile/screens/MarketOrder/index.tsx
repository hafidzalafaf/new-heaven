import * as React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Table, Decimal } from '../../../components';
import { CustomStylesSelect } from '../../../mobile/components';
import { Loading } from '../../../components';
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
    selectCurrentPageIndex,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
    Market,
    userOpenOrdersFetch,
    userOrdersHistoryFetch,
    selectOrdersHistoryLoading,
} from '../../../modules';
import Select from 'react-select';
import { PaginationMobile } from 'src/mobile/components';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { OrderCommon } from 'src/modules/types';
import { NoData, Modal } from 'src/desktop/components';

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

const DEFAULT_LIMIT = 10;
const MarketOrderMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [showDetail, setShowDetail] = React.useState(false);

    const [tab, setTab] = React.useState('open');
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('');
    const [market, setMarket] = React.useState('');
    // const [loading, setLoading] = React.useState(false);
    const [asset, setAsset] = React.useState('');
    const [detailData, setDetailData] = React.useState<MarketOrderMobileScreenProps>(
        {} as MarketOrderMobileScreenProps
    );
    // const [deleteRow, setDeleteRow] = React.useState<OrderCommon>();
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [showModalCancelAll, setShowModalCancelAll] = React.useState(false);
    const [deleteRow, setDeleteRow] = React.useState<OrderCommon>();

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectOrdersNextPageExists(state));

    const page = useSelector(selectCurrentPageIndex);
    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 25));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 25));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    const markets = useSelector(selectMarkets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const loading = useSelector(selectOrdersHistoryLoading);

    // useUserOrdersHistoryFetch({ pageIndex: currentPageIndex, type: tab, limit: 5 });
    useDocumentTitle('Market Order');
    useWalletsFetch();
    useMarketsFetch();

    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    React.useEffect(() => {
        const defaultPayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
        };

        const marketPayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            market: market,
        };

        const statePayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            state: status,
        };

        const datePayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
        };

        const dateMarketPayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
            market: market,
        };

        const dateStatePayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
            state: status,
        };

        const marketStatePayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            market: market,
            state: status,
        };

        const allParamPayload = {
            type: tab,
            group: tab,
            pageIndex: currentPageIndex,
            limit: DEFAULT_LIMIT,
            market,
            state: status,
            time_from: time_from,
            time_to: time_to,
        };

        dispatch(
            userOrdersHistoryFetch(
                startDate && endDate && market && status
                    ? allParamPayload
                    : market && status
                    ? marketStatePayload
                    : startDate && endDate && status
                    ? dateStatePayload
                    : startDate && endDate && market
                    ? dateMarketPayload
                    : startDate && endDate
                    ? datePayload
                    : status
                    ? statePayload
                    : market
                    ? marketPayload
                    : defaultPayload
            )
        );
    }, [startDate, endDate, market, currentPageIndex, status, tab]);

    React.useEffect(() => {
        setData(orders);
    }, [orders, tab]);

    const dataListWithIcon = data.map((item) => ({
        ...item,
        dataCurrency: currencies.find(
            ({ id }) => id == item.market.replace('usdt', '') || id == item.market.replace('trx', '')
        ),
    }));

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
            setShowModalCancelAll(false);
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
            setShowModalCancel(false);
        }
    };

    let currentBidUnitMarkets = markets;
    const formattedMarkets = currentBidUnitMarkets.length
        ? currentBidUnitMarkets.map((market) => ({
              ...market,
              currency: currencies.find((cur) => cur.id == market.base_unit),
          }))
        : [];

    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const handleItemDetail = (item) => {
        setShowDetail(true);
        setDetailData(item);
        setDeleteRow(item);
    };
    const renderTableHeader = [
        <p className="mb-0 text-sm grey-text">Coins</p>,
        <p className="mb-0 text-sm grey-text">Amount</p>,
        <p className="mb-0 text-sm grey-text">Price</p>,
        <p className="mb-0 text-sm grey-text">Type</p>,
        <p className="mb-0 text-sm grey-text">Status</p>,
        tab === 'open' && <p className="mb-0 text-sm grey-text">Action</p>,
    ];

    const renderDataTable = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-stretch">
                <img
                    height={30}
                    width={30}
                    className="icon-history mr-3 rounded-full"
                    src={item?.logo_url}
                    alt="icon"
                />
            </div>,
            <div className="d-flex align-items-center text-sm">
                <div className="">
                    <p className="mb-0 grey-text-accent font-bold text-sm">
                        {item.price} {item.market.toUpperCase()}
                    </p>
                    <p className="mb-0 grey-text text-xxs text-nowrap">
                        {moment(item.created_at).format('DD-MM-YYYY HH:mm:ss')}
                    </p>
                </div>
            </div>,
            <p className={`badge grey-text text-sm mb-0`}>
                {item.ord_type === 'market' ? item.avg_price : item.price}
            </p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>
                {item.side.charAt(0).toUpperCase() + item.side.slice(1)}
            </p>,
            <p className={`badge text-sm mb-0 cursor-pointer gradient-text`}>
                {item.state.charAt(0).toUpperCase() + item.state.slice(1)}
            </p>,
            tab === 'open' && (
                <p
                    key={index}
                    className={`badge text-sm mb-0 cursor-pointer danger-text`}
                    onClick={() => handleItemDetail(data[index])}>
                    Cancel
                </p>
            ),
        ]);
    };

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">All</p>, value: '' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'cancel' },
        { label: <p className="m-0 text-sm grey-text-accent">Done</p>, value: 'done' },
    ];

    const optionAssets = formattedMarkets.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center">
                <img src={item?.logo_url} alt="icon" className="mr-12 small-coin-icon" />
                <div>
                    <p className="m-0 text-sm grey-text-accent">{item.name.toUpperCase()}</p>
                    <p className="m-0 text-xs grey-text-accent">{item?.base_unit?.toUpperCase()}</p>
                </div>
            </div>
        );
        return {
            label: customLabel,
            value: item.id,
        };
    });

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
                <button onClick={handleCancelSingleOrder(deleteRow)} type="button" className="btn btn-primary sm px-5">
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
                <button onClick={() => handleCancelAllOrders()} type="button" className="btn btn-primary sm px-5">
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );

    // const renderFilter = () => {
    //     return (
    //         <div className="d-flex align-items-center">
    //             <div className="w-20 mr-24">
    //                 <label className="m-0 white-text text-sm mb-8">Start Date</label>
    //                 <input
    //                     type="date"
    //                     className="form-control mb-24"
    //                     onChange={(e) => {
    //                         setStartDate(e.target.value);
    //                     }}
    //                 />
    //             </div>

    //             <div className="w-20 mr-24">
    //                 <label className="m-0 white-text text-sm mb-8">End Date</label>
    //                 <input
    //                     type="date"
    //                     className="form-control mb-24"
    //                     onChange={(e) => {
    //                         setEndDate(e.target.value);
    //                     }}
    //                 />
    //             </div>

    //             <div className="w-20 mr-24">
    //                 <p className="m-0 white-text text-sm mb-8">Assets</p>
    //                 <Select
    //                     value={optionAssets.filter(function (option) {
    //                         return option.value === asset;
    //                     })}
    //                     onChange={(e) => {
    //                         setAsset(e.value);
    //                         filterredAsset(e.value);
    //                     }}
    //                     styles={CustomStylesSelect}
    //                     options={optionAssets}
    //                 />
    //             </div>

    //             {tab === 'close' && (
    //                 <div className="w-20 mr-24">
    //                     <p className="m-0 white-text text-sm mb-8">Status</p>
    //                     <Select
    //                         value={optionStatus.filter(function (option) {
    //                             return option.value === status;
    //                         })}
    //                         onChange={(e) => {
    //                             setStatus(e.value);
    //                             filterredStatus(e.value);
    //                         }}
    //                         styles={CustomStylesSelect}
    //                         options={optionStatus}
    //                     />
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };

    return (
        <React.Fragment>
            <div className="mobile-container pg-market-order no-header dark-bg-main">
                <div className="d-flex justify-content-between align-items-center head-container">
                    <h1 className="text-md font-extrabold mb-0 grey-text-accent">Market Order</h1>

                    {/* <div className="d-flex justify-content-start align-items-center head-action">
                        <span className="mr-8">
                            <FilterIcon />
                        </span>
                        <span>
                            <EditIcon />
                        </span>
                    </div> */}
                </div>

                <div className="position-relative">
                    <Tabs
                        id="controlled-tab-example"
                        defaultActiveKey={tab}
                        onSelect={(e) => {
                            setTab(e);
                            setStartDate('');
                            setEndDate('');
                            setAsset('');
                            setPageIndex(0);
                        }}
                        className="position-relative">
                        <Tab eventKey="open" title="Open Order">
                            <div className="table-mobile-wrapper mb-3">
                                {loading ? (
                                    <Loading />
                                ) : dataListWithIcon.length < 1 ? (
                                    <NoData text="No Data Yet" />
                                ) : (
                                    <Table data={renderDataTable(dataListWithIcon)} header={renderTableHeader} />
                                )}
                            </div>
                            {dataListWithIcon[0] && (
                                <PaginationMobile
                                    firstElementIndex={firstElementIndex}
                                    lastElementIndex={lastElementIndex}
                                    page={page}
                                    nextPageExists={nextPageExists}
                                    onClickPrevPage={onClickPrevPage}
                                    onClickNextPage={onClickNextPage}
                                />
                            )}
                        </Tab>
                        <Tab eventKey="close" title="Close Order">
                            <div className="table-mobile-wrapper mb-3">
                                {loading ? (
                                    <Loading />
                                ) : dataListWithIcon.length < 1 ? (
                                    <NoData text="No Data Yet" />
                                ) : (
                                    <Table data={renderDataTable(dataListWithIcon)} header={renderTableHeader} />
                                )}
                            </div>
                            {dataListWithIcon[0] && (
                                <PaginationMobile
                                    firstElementIndex={firstElementIndex}
                                    lastElementIndex={lastElementIndex}
                                    page={page}
                                    nextPageExists={nextPageExists}
                                    onClickPrevPage={onClickPrevPage}
                                    onClickNextPage={onClickNextPage}
                                />
                            )}
                        </Tab>
                    </Tabs>

                    {tab === 'open' && data.length > 0 && (
                        <div className="position-absolute cancel-all-container">
                            <span
                                onClick={() => setShowModalCancelAll(true)}
                                className="d-flex justify-content-start align-items-center cancel-all">
                                <p className="p-0 m-0">Cancel All</p>
                                <CloseIcon />
                            </span>
                        </div>
                    )}
                </div>

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

                            <h3>{detailData?.market?.toUpperCase()}</h3>
                        </div>
                        <table className="w-100 table-canvas">
                            <tbody>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Date</td>
                                    <td className="td-value">
                                        {moment(detailData.created_at).format('D MMM YYYY - HH:mm')}
                                    </td>
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
                            type="button"
                            onClick={() => {
                                setShowModalCancel(true);
                                setShowDetail(false);
                            }}>
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
                {showModalCancel && <Modal show={showModalCancel} content={renderModalContentCancel()} />}
                {showModalCancelAll && <Modal show={showModalCancelAll} content={renderModalContentCancelAll()} />}
            </div>
        </React.Fragment>
    );
};

export { MarketOrderMobileScreen };
