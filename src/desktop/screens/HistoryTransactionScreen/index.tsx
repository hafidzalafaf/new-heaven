import React, { FC, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDocumentTitle, useWalletsFetch, useHistoryFetch } from '../../../hooks';
import {
    selectCurrencies,
    Currency,
    selectHistory,
    selectFirstElemIndex,
    selectCurrentPage,
    selectLastElemIndex,
    selectNextPageExists,
    RootState,
    alertPush,
    selectHistoryLoading,
} from '../../../modules';
import { Table } from '../../../components';
import { Pagination } from '../../../desktop/components';
import { CustomStylesSelect } from '../../../desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import { NoData } from '../../components';
import { copy, Loading } from '../../../components';
import { CopyableTextField } from '../../../components';
import './HistoryTransactionScreen.pcss';

const DEFAULT_LIMIT = 5;
export const HistoryTransactionScreen: FC = (): ReactElement => {
    const currencies: Currency[] = useSelector(selectCurrencies);
    const dispatch = useDispatch();
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const historyLoading = useSelector(selectHistoryLoading);

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currency, setCurrency] = React.useState('');
    const [type, setType] = React.useState('withdraws');
    const [status, setStatus] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));

    useHistoryFetch({ type: type, limit: DEFAULT_LIMIT, currency, page: currentPage });

    useDocumentTitle('Transaction History');
    useWalletsFetch();

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    const handleChangeType = (e) => {
        setType(e);
        setCurrency('');
    };

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    const getTableHeaders = (data) => {
        if (type == 'withdraws') {
            return ['Date', 'Type', 'Asset', 'Amount', `TXID`, `Address`, 'Status'];
        } else if (type == 'deposits') {
            return ['Date', 'Type', 'Asset', 'Amount', `TXID`, 'TID', 'Status'];
        } else {
            return ['Date', 'Type', 'Asset', 'Amount', `Receiver ID`, 'Sender ID', 'Status'];
        }
    };

    React.useEffect(() => {
        setLoading(true);
        if (!historyLoading) {
            setLoading(false);
        }
    }, [historyLoading, list]);

    React.useEffect(() => {
        setHistorys(list);
    }, [list]);

    React.useEffect(() => {
        if (startDate != '' && endDate != '') {
            const filterredList = list.filter(
                (item) =>
                    moment(item.created_at).format() >= moment(startDate).format() &&
                    moment(item.created_at).format() <= moment(endDate).format()
            );
            setHistorys(filterredList);
        }
    }, [startDate, endDate]);

    const filterredStatus = (id) => {
        let filterredList;
        let temp;
        temp = list;

        filterredList = temp.filter((item) => item.state === id || item.status == id);
        setHistorys(filterredList);
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">{moment(item.created_at).format('D MMM YYYY - HH:mm')}</p>,
            <p
                className={`m-0 text-sm font-bold ${
                    type === 'deposits' ? 'contrast-text' : type === 'withdraws' ? 'danger-text' : 'blue-text'
                }`}>
                {type === 'deposits'
                    ? 'Deposit'
                    : type === 'withdraws'
                    ? 'Withdrawal'
                    : type === 'transfers'
                    ? 'Internal Transfer'
                    : ''}
            </p>,
            <div className="d-flex align-items-center text-sm">
                {/* <span className="mr-12">{item.icon}</span> */}
                <p className="m-0 mr-12 white-text font-bold">{item?.currency?.toUpperCase()}</p>
            </div>,
            <p className="m-0 text-sm white-text">{item.amount}</p>,
            <p className="m-0 text-sm white-text text-italic">
                {/* {type == 'deposits' && `${item.txid?.slice(0, 15)}...`} */}
                {type == 'deposits' &&
                    (item.txid ? (
                        <fieldset onClick={() => navigator.clipboard.writeText(item.txid)}>
                            <CopyableTextField value={item.txid} fieldId={'item' + item.id} className="white-text" />
                        </fieldset>
                    ) : (
                        '-'
                    ))}
                {type == 'transfers' && item.receiver_uid}
                {type == 'withdraws' &&
                    (item.blockchain_txid ? (
                        <fieldset onClick={() => doCopy('item' + item.id)}>
                            <CopyableTextField
                                value={item.blockchain_txid}
                                fieldId={'item' + item.id}
                                className="white-text"
                            />
                        </fieldset>
                    ) : (
                        '-'
                    ))}
            </p>,
            <React.Fragment>
                {type == 'withdraws' && <p className="m-0 text-sm white-text">{item.rid?.slice(0, 15)}...</p>}
                {type == 'deposits' && <p className="m-0 text-sm white-text">{item.tid}</p>}
                {type == 'transfers' && <p className="m-0 text-sm white-text">{item.sender_uid}</p>}
            </React.Fragment>,
            <p
                className={`m-0 text-sm ${
                    item.status === 'Pending' || item.state === 'processing'
                        ? 'warning-text'
                        : item.status === 'Canceled' || item.state === 'errored' || item.state == 'failed'
                        ? 'danger-text'
                        : 'green-text'
                }`}>
                {item.status === 'pending'
                    ? 'Pending'
                    : item.status === 'canceled'
                    ? 'Canceled'
                    : item.status === 'completed'
                    ? 'Completed'
                    : item.state === 'collected'
                    ? 'Collected'
                    : item.state === 'processing'
                    ? 'Processing'
                    : item.state === 'confirming'
                    ? 'Success'
                    : item.state === 'errored'
                    ? 'Error'
                    : item.state == 'succeed'
                    ? 'Success'
                    : item.state == 'failed'
                    ? 'Failed'
                    : ''}
            </p>,
        ]);
    };

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Pending</p>, value: 'pending' },
        { label: <p className="m-0 text-sm grey-text-accent">Completed</p>, value: 'completed' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
    ];

    const optionStatusWithdraw = [
        { label: <p className="m-0 text-sm grey-text-accent">Pending</p>, value: 'pending' },
        { label: <p className="m-0 text-sm grey-text-accent">Success</p>, value: 'succeed' },
        { label: <p className="m-0 text-sm grey-text-accent">Error</p>, value: 'errored' },
        { label: <p className="m-0 text-sm grey-text-accent">Failed</p>, value: 'failed' },
    ];

    const optionStatusDeposit = [
        { label: <p className="m-0 text-sm grey-text-accent">Pending</p>, value: 'pending' },
        { label: <p className="m-0 text-sm grey-text-accent">Collected</p>, value: 'collected' },
        { label: <p className="m-0 text-sm grey-text-accent">Error</p>, value: 'errored' },
    ];

    const optionAssets = currencies.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center">
                <img src={item.icon_url} alt="icon" className="mr-12 small-coin-icon" />
                <div>
                    <p className="m-0 text-sm grey-text-accent">{item.id.toUpperCase()}</p>
                    <p className="m-0 text-xs grey-text-accent">{item.name}</p>
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
                            return option.value === currency;
                        })}
                        styles={CustomStylesSelect}
                        options={optionAssets}
                        onChange={(e) => {
                            setCurrency(e.value);
                        }}
                    />
                </div>

                <div className="w-20 mr-24">
                    <p className="m-0 white-text text-sm mb-8">Status</p>
                    <Select
                        value={
                            type == 'transfers'
                                ? optionStatus.filter(function (option) {
                                      return option.value === status;
                                  })
                                : type == 'withdraws'
                                ? optionStatusWithdraw.filter(function (option) {
                                      return option.value === status;
                                  })
                                : optionStatusDeposit.filter(function (option) {
                                      return option.value === status;
                                  })
                        }
                        styles={CustomStylesSelect}
                        options={
                            type == 'transfers'
                                ? optionStatus
                                : type == 'withdraws'
                                ? optionStatusWithdraw
                                : optionStatusDeposit
                        }
                        onChange={(e) => {
                            setStatus(e.value);
                            filterredStatus(e.value);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-history-transaction-screen dark-bg-main">
                <div className="pg-history-transaction-screen__title dark-bg-main px-24 pb-4 pt-4">
                    <h1 className="m-0 white-text text-xl">Transaction History</h1>
                </div>
                <div className="pg-history-transaction-screen__content-wrapper dark-bg-accent">
                    <div className="transaction-history-tabs">
                        <Tabs
                            defaultActiveKey="withdraws"
                            onSelect={(e) => handleChangeType(e)}
                            id="uncontrolled-tab-example"
                            className="mb-3">
                            <Tab eventKey="withdraws" title="Withdrawal" className="mb-24">
                                <div className="mt-24">
                                    {renderFilter()}
                                    <Table header={getTableHeaders(historys)} data={getTableData(historys)} />
                                    {historys[0] && (
                                        <Pagination
                                            firstElemIndex={firstElemIndex}
                                            lastElemIndex={lastElemIndex}
                                            page={page}
                                            nextPageExists={nextPageExists}
                                            onClickPrevPage={onClickPrevPage}
                                            onClickNextPage={onClickNextPage}
                                        />
                                    )}
                                    {loading && <Loading />}
                                    {historys.length < 1 && !loading && <NoData text="No Data Yet" />}
                                </div>
                            </Tab>
                            <Tab eventKey="deposits" title="Deposit" className="mb-24">
                                <div className="mt-24">
                                    {renderFilter()}
                                    <Table header={getTableHeaders(historys)} data={getTableData(historys)} />
                                    {historys[0] && (
                                        <Pagination
                                            firstElemIndex={firstElemIndex}
                                            lastElemIndex={lastElemIndex}
                                            page={page}
                                            nextPageExists={nextPageExists}
                                            onClickPrevPage={onClickPrevPage}
                                            onClickNextPage={onClickNextPage}
                                        />
                                    )}
                                    {loading && <Loading />}
                                    {historys.length < 1 && !loading && <NoData text="No Data Yet" />}
                                </div>
                            </Tab>
                            <Tab eventKey="transfers" title="Internal Transfer" className="mb-24">
                                <div className="mt-24">
                                    {renderFilter()}
                                    <Table header={getTableHeaders(historys)} data={getTableData(historys)} />
                                    {historys[0] && (
                                        <Pagination
                                            firstElemIndex={firstElemIndex}
                                            lastElemIndex={lastElemIndex}
                                            page={page}
                                            nextPageExists={nextPageExists}
                                            onClickPrevPage={onClickPrevPage}
                                            onClickNextPage={onClickNextPage}
                                        />
                                    )}
                                    {loading && <Loading />}
                                    {historys.length < 1 && !loading && <NoData text="No Data Yet" />}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
