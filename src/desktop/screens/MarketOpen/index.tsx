import React, { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
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
    selectOrdersHistoryLoading,
    Market,
    userOpenOrdersFetch,
    userOrdersHistoryFetch,
} from '../../../modules';
import { Table, Loading } from '../../../components';
import { CustomStylesSelect, Modal } from '../../../desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import Select from 'react-select';
import { NoData, Pagination } from '../../components';
import moment from 'moment';
import { OrderCommon } from 'src/modules/types';

const DEFAULT_LIMIT = 20;
export const MarketOpen: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();

    const [tab, setTab] = React.useState('open');
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('');
    const [market, setMarket] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [showModalCancelAll, setShowModalCancelAll] = React.useState(false);
    const [deleteRow, setDeleteRow] = React.useState<OrderCommon>();

    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 20));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 20));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    const markets = useSelector(selectMarkets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const historyLoading = useSelector(selectOrdersHistoryLoading);

    const current: Market | undefined = markets.find((item) => item.id === currency);

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

    React.useEffect(() => {
        setLoading(true);
        if (!historyLoading) {
            setLoading(false);
        }
    }, [historyLoading]);

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
            setShowModalCancelAll(false);
        }
    };

    const handleCancelSingleOrder = (order: OrderCommon) => () => {
        dispatch(
            openOrdersCancelFetch({
                order,
                list: data,
            })
        );
        setShowModalCancel(false);
        setTimeout(() => {
            if (current) {
                dispatch(userOpenOrdersFetch({ market: current }));
            }
        }, 1000);
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

    const getTableHeaders = () => {
        return ['Date', 'Market', 'Type', 'Price', 'Volume', 'Executed', 'Unexecuted', 'Status'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">
                {!item.maker_fee
                    ? moment(item.created_at * 1000).format('DD-MM-YYYY HH:mm:ss')
                    : moment(item.created_at).format('DD-MM-YYYY HH:mm:ss')}
            </p>,
            <p className="m-0 text-sm white-text">{item.market.toUpperCase()}</p>,
            <p className={`m-0 text-sm ${item.side == 'buy' ? 'green-text' : 'danger-text'}`}>
                {item.side === 'buy' ? 'Buy' : 'Sell'}
            </p>,
            <p className="m-0 text-sm white-text">{item.ord_type === 'market' ? item.avg_price : item.price}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.origin_volume}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.executed_volume}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.remaining_volume}</p>,
            <>
                {tab === 'open' ? (
                    <button
                        onClick={() => {
                            setShowModalCancel(true);
                            setDeleteRow(item);
                        }}
                        type="button"
                        className="btn btn-sm btn-danger text-sm font-normal cursor-pointer">
                        Cancel Order
                    </button>
                ) : (
                    <p
                        className={`m-0 text-sm text-italic ${
                            item.state === 'cancel'
                                ? 'danger-text'
                                : item.state === 'wait'
                                ? 'warning-text'
                                : 'contrast-text'
                        }`}>
                        {item.state === 'cancel' ? 'Canceled' : item.state === 'wait' ? 'Waiting' : 'Done'}
                    </p>
                )}
            </>,
        ]);
    };

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'cancel' },
        { label: <p className="m-0 text-sm grey-text-accent">Done</p>, value: 'done' },
    ];

    const optionAssets = formattedMarkets.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center">
                <img src={item?.logo_url} alt="icon" className="mr-12 small-coin-icon" />
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

    const renderModalContentCancel = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24  text-center">Are you sure to Cancel Orders?</h6>
            <p className="text-sm grey-text-accent m-0 p-0 mb-24  text-center">
                The order you made for this transaction will be canceled and you will have to repeat the transaction
                again
            </p>
            <div className="d-flex  justify-content-center">
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
                <button onClick={handleCancelAllOrders} type="button" className="btn btn-primary sm px-5">
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );

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
                        value={startDate}
                        defaultValue={new Date().toISOString().slice(0, 10)}
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
                        value={endDate}
                        defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                </div>

                <div className="w-20 mr-24">
                    <p className="m-0 white-text text-sm mb-8">Assets</p>
                    <Select
                        value={optionAssets.filter(function (option) {
                            return option.value === market;
                        })}
                        onChange={(e) => {
                            setMarket(e.value);
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
            <div className="market-order-screen content-wrapper dark-bg-main">
                <div className="px-24 pt-4 pb-4 dark-bg-main">
                    <h1 className="m-0 white-text text-xl">Market Orders</h1>
                </div>
                <div className="pg-history-transaction-screen__content-wrapper dark-bg-accent">
                    <div className="position-relative">
                        {renderFilter()}
                        {tab === 'open' && data && data[0] && (
                            <div className="ml-3 cancel-all-order">
                                <button
                                    type="button"
                                    onClick={() => setShowModalCancelAll(true)}
                                    className="btn btn-danger">
                                    Cancel All Orders <ModalCloseIcon className="small-icon" />
                                </button>
                            </div>
                        )}
                    </div>
                    <Tabs
                        defaultActiveKey={tab}
                        onSelect={(e) => {
                            setTab(e);
                            // setStartDate(0);
                            // setEndDate(0);
                            setMarket('');
                            setStatus('');
                        }}
                        id="uncontrolled-tab-example"
                        className="mb-3">
                        <Tab eventKey="open" title="Open Order" className="mb-24">
                            <div className="mt-24">
                                {loading ? (
                                    <Loading />
                                ) : data?.length < 1 ? (
                                    <NoData text="No Data Yet" />
                                ) : (
                                    <Table data={getTableData(data)} header={getTableHeaders()} />
                                )}
                            </div>

                            {data && data[0] && (
                                <Pagination
                                    firstElemIndex={firstElemIndex}
                                    lastElemIndex={lastElemIndex}
                                    page={currentPageIndex}
                                    nextPageExists={ordersNextPageExists}
                                    onClickPrevPage={onClickPrevPage}
                                    onClickNextPage={onClickNextPage}
                                />
                            )}
                        </Tab>
                        <Tab eventKey="close" title="Close Order" className="mb-24">
                            <div className="mt-24">
                                {loading ? (
                                    <Loading />
                                ) : data?.length < 1 ? (
                                    <NoData text="No Data Yet" />
                                ) : (
                                    <Table data={getTableData(data)} header={getTableHeaders()} />
                                )}
                            </div>

                            {data && data[0] && (
                                <Pagination
                                    firstElemIndex={firstElemIndex}
                                    lastElemIndex={lastElemIndex}
                                    page={currentPageIndex}
                                    nextPageExists={ordersNextPageExists}
                                    onClickPrevPage={onClickPrevPage}
                                    onClickNextPage={onClickNextPage}
                                />
                            )}
                        </Tab>
                    </Tabs>
                </div>
                {<Modal show={showModalCancel} content={renderModalContentCancel()} />}
                {<Modal show={showModalCancelAll} content={renderModalContentCancelAll()} />}
            </div>
        </React.Fragment>
    );
};
