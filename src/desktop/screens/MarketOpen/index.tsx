import React, { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
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
} from '../../../modules';
import { Table, Loading } from '../../../components';
import { CustomStylesSelect } from '../../../desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import Select from 'react-select';
import { NoData, Pagination } from '../../components';
import moment from 'moment';
import { OrderCommon } from 'src/modules/types';

export const MarketOpen: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const intl = useIntl();

    const [tab, setTab] = React.useState('open');
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [data, setData] = React.useState([]);
    const [status, setStatus] = React.useState('');
    const [asset, setAsset] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 25));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 25));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    const markets = useSelector(selectMarkets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const historyLoading = useSelector(selectOrdersHistoryLoading);

    useUserOrdersHistoryFetch({ pageIndex: currentPageIndex, type: tab, limit: 20 });
    useDocumentTitle('Market Order');
    useWalletsFetch();
    useMarketsFetch();

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

    React.useEffect(() => {
        setLoading(true);
        if (!historyLoading) {
            setLoading(false);
        }
    }, [historyLoading]);

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

    const getTableHeaders = () => {
        return ['Date', 'Market', 'Type', 'Price', 'Volume', 'Executed', 'Unexecuted', 'Status'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">{moment(item.created_at).format('D MMM YYYY - HH:mm')}</p>,
            <p className="m-0 text-sm white-text">{item.market.toUpperCase()}</p>,
            <p className={`m-0 text-sm ${item.side == 'buy' ? 'green-text' : 'danger-text'}`}>
                {item.side === 'buy' ? 'Buy' : 'Sell'}
            </p>,
            <p className="m-0 text-sm white-text">{item.price}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.origin_volume}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.executed_volume}</p>,
            <p className="m-0 text-sm white-text text-italic">{item.remaining_volume}</p>,
            <>
                {tab === 'open' ? (
                    <button
                        onClick={handleCancelSingleOrder(item)}
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
            <div className="market-order-screen content-wrapper dark-bg-main">
                <div className="px-24 pt-4 pb-4 dark-bg-main">
                    <h1 className="m-0 white-text text-xl">Market Orders</h1>
                </div>
                <div className="pg-history-transaction-screen__content-wrapper dark-bg-accent">
                    <div className="position-relative">
                        {renderFilter()}
                        {tab === 'open' && data && data[0] && (
                            <div className="ml-3 cancel-all-order">
                                <button type="button" onClick={handleCancelAllOrders} className="btn btn-secondary">
                                    Cancel All Orders <ModalCloseIcon className="small-icon" />
                                </button>
                            </div>
                        )}
                    </div>
                    <Tabs
                        defaultActiveKey={tab}
                        onSelect={(e) => {
                            setTab(e);
                            setStartDate('');
                            setEndDate('');
                            setAsset('');
                        }}
                        id="uncontrolled-tab-example"
                        className="mb-3">
                        <Tab eventKey="open" title="Open Order" className="mb-24">
                            <div className="mt-24">
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                                {data.length < 1 && !loading && <NoData text="No Data Yet" />}
                                {loading && <Loading />}
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
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                                {data.length < 1 && !loading && <NoData text="No Data Yet" />}
                                {loading && <Loading />}
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
            </div>
        </React.Fragment>
    );
};
