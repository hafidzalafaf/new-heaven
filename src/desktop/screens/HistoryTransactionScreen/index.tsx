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
    fetchHistory,
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
import { capitalizeFirstLetter } from 'src/helpers/capitalizeFirstLetter.';
import { useLocation } from 'react-router';

const DEFAULT_LIMIT = 5;
export const HistoryTransactionScreen: FC = (): ReactElement => {
    const currencies: Currency[] = useSelector(selectCurrencies);
    const dispatch = useDispatch();
    const location = useLocation<{ types?: string }>();

    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const historyLoading = useSelector(selectHistoryLoading);

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currency, setCurrency] = React.useState('');
    const [type, setType] = React.useState(location?.state?.types ? location?.state?.types : 'withdraws');
    const [status, setStatus] = React.useState('');
    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [loading, setLoading] = React.useState(false);

    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));

    useDocumentTitle('Transaction History');
    useWalletsFetch();

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    const handleChangeType = (e) => {
        setType(e);
        setCurrency('');
        setStatus('');
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
            return ['Date', 'Type', 'Asset', 'Amount', `TXID`, 'Status'];
        } else {
            return ['Date', 'Type', 'Asset', 'Amount', `Receiver ID`, 'Sender ID', 'Status'];
        }
    };

    const getTableHeadersDeposit = (data) => ['Date', 'Type', 'Asset', 'Amount', `TXID`, 'Status'];

    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    React.useEffect(() => {
        const defaultPayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
        };

        const marketPayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            currency: currency,
        };

        const statePayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            state: status,
        };

        const marketStatePayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            state: status,
            currency: currency,
        };
        // JANGAN DIHAPUS
        // var datePayload;
        // if (type == 'transfers') {
        //     datePayload = {
        //         type: type,
        //         page: currentPage,
        //         limit: DEFAULT_LIMIT,
        //         from: time_from,
        //         to: time_to,
        //     };
        // } else {
        //     datePayload = {
        //         type: type,
        //         page: currentPage,
        //         limit: DEFAULT_LIMIT,
        //         time_from: time_from,
        //         time_to: time_to,
        //     };
        // }

        const datePayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
        };

        const dateStatePayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
            state: status,
        };

        const dateAssetPayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            time_from: time_from,
            time_to: time_to,
            currency: currency,
        };

        const marketDateStatusPayload = {
            type: type,
            page: currentPage,
            limit: DEFAULT_LIMIT,
            currency: currency,
            time_from: time_from,
            time_to: time_to,
            state: status,
        };

        dispatch(
            fetchHistory(
                startDate && endDate && status && currency
                    ? marketDateStatusPayload
                    : startDate && endDate && status
                    ? dateStatePayload
                    : startDate && endDate && currency
                    ? dateAssetPayload
                    : currency && status
                    ? marketStatePayload
                    : startDate && endDate
                    ? datePayload
                    : currency
                    ? marketPayload
                    : status
                    ? statePayload
                    : defaultPayload
            )
        );
    }, [startDate, endDate, currency, currentPage, status, type]);

    React.useEffect(() => {
        setLoading(true);
        if (!historyLoading) {
            setLoading(false);
        }
    }, [historyLoading]);

    React.useEffect(() => {
        setHistorys(list);
    }, [list]);

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">{moment(item.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>,
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
                <p className="m-0 mr-12 white-text font-bold">{item?.currency?.toUpperCase()}</p>
            </div>,
            <p className="m-0 text-sm white-text">{item.amount}</p>,
            <p className="m-0 text-sm white-text text-italic">
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

    const getTableDataDeposit = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">{moment(item.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>,
            <p className={`m-0 text-sm font-bold contrast-text`}>Deposit</p>,
            <div className="d-flex align-items-center text-sm">
                <p className="m-0 mr-12 white-text font-bold">{item?.currency?.toUpperCase()}</p>
            </div>,
            <p className="m-0 text-sm white-text">{item.amount}</p>,
            <p className="m-0 text-sm white-text text-italic">
                {item?.txid !== null ? (
                    <fieldset onClick={() => doCopy('depo' + item?.txid)}>
                        <CopyableTextField
                            value={item?.txid}
                            fieldId={'depo' + item?.id?.toString()}
                            className="white-text"
                        />
                    </fieldset>
                ) : (
                    <fieldset onClick={() => doCopy('depos' + type == 'deposits' && item?.tid)}>
                        <CopyableTextField
                            value={type == 'deposits' && item?.tid}
                            fieldId={'depos' + item?.id?.toString()}
                            className="white-text"
                        />
                    </fieldset>
                )}
            </p>,
            <p
                className={`m-0 text-sm ${
                    item?.state === 'processing' || item?.state === 'fee_processing'
                        ? 'warning-text'
                        : item?.state === 'errored' ||
                          item?.state === 'canceled' ||
                          item?.state === 'skipped' ||
                          item?.state === 'rejected'
                        ? 'danger-text'
                        : 'green-text'
                }`}>
                {type === 'deposits' ? capitalizeFirstLetter(item?.state) : '-'}
            </p>,
        ]);
    };

    const optionStatusDeposit = [
        { label: <p className="m-0 text-sm grey-text-accent">Submitted</p>, value: 'submitted' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
        { label: <p className="m-0 text-sm grey-text-accent">Rejected</p>, value: 'rejected' },
        { label: <p className="m-0 text-sm grey-text-accent">Accepted</p>, value: 'accepted' },
        { label: <p className="m-0 text-sm grey-text-accent">Collected</p>, value: 'collected' },
        { label: <p className="m-0 text-sm grey-text-accent">Skipped</p>, value: 'skipped' },
        { label: <p className="m-0 text-sm grey-text-accent">Processing</p>, value: 'processing' },
        { label: <p className="m-0 text-sm grey-text-accent">Fee Processing</p>, value: 'fee_processing' },
    ];

    const optionStatusWithdraw = [
        { label: <p className="m-0 text-sm grey-text-accent">Prepared</p>, value: 'prepared' },
        { label: <p className="m-0 text-sm grey-text-accent">Rejected</p>, value: 'rejected' },
        { label: <p className="m-0 text-sm grey-text-accent">Accepted</p>, value: 'accepted' },
        { label: <p className="m-0 text-sm grey-text-accent">Skipped</p>, value: 'skipped' },
        { label: <p className="m-0 text-sm grey-text-accent">Processing</p>, value: 'processing' },
        { label: <p className="m-0 text-sm grey-text-accent">Succeed</p>, value: 'succeed' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
        { label: <p className="m-0 text-sm grey-text-accent">Failed</p>, value: 'failed' },
        { label: <p className="m-0 text-sm grey-text-accent">Errored</p>, value: 'errored' },
        { label: <p className="m-0 text-sm grey-text-accent">Confirming</p>, value: 'confirming' },
        { label: <p className="m-0 text-sm grey-text-accent">Under Review</p>, value: 'under_review' },
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
                            return option.value === currency;
                        })}
                        styles={CustomStylesSelect}
                        options={optionAssets}
                        onChange={(e) => {
                            setCurrency(e.value);
                        }}
                    />
                </div>

                {type !== 'transfers' && (
                    <div className="w-20 mr-24">
                        <p className="m-0 white-text text-sm mb-8">Status</p>
                        <Select
                            value={
                                type == 'withdraws'
                                    ? optionStatusWithdraw.filter(function (option) {
                                          return option.value === status;
                                      })
                                    : optionStatusDeposit.filter(function (option) {
                                          return option.value === status;
                                      })
                            }
                            styles={CustomStylesSelect}
                            options={type == 'withdraws' ? optionStatusWithdraw : optionStatusDeposit}
                            onChange={(e) => {
                                setStatus(e.value);
                            }}
                        />
                    </div>
                )}
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
                            defaultActiveKey={type}
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
                                    <Table
                                        header={getTableHeadersDeposit(historys)}
                                        data={getTableDataDeposit(historys)}
                                    />
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
