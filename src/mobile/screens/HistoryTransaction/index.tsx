import * as React from 'react';
import { injectIntl, useIntl } from 'react-intl';
import Tab from 'react-bootstrap/Tab';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistoryFetch, useWalletsFetch } from '../../../hooks';
import { CustomStylesSelect } from 'src/desktop/components';
import Select from 'react-select';
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
    fetchHistory,
    selectHistoryLoading,
} from '../../../modules';
import { FilterIcon } from 'src/mobile/assets/Wallet';
import Tabs from 'react-bootstrap/Tabs';
import { useDocumentTitle } from 'src/hooks';
import { copy, CopyableTextField, Table, Loading } from '../../../components';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { NoData } from 'src/desktop/components';
import { PaginationMobile } from 'src/mobile/components';
import { useHistory } from 'react-router-dom';
import { CopyButton } from 'src/assets/images/CopyButton';
import { capitalizeFirstLetter } from 'src/helpers';

interface TransactionHistoryMobileScreenProps {
    sender_uid: string;
    receiver_uid: string;
    market: string;
    created_at: string;
    type: string;
    price: string;
    amount: string;
    total: string;
    market_type: string;
    fee: string;
    state: string;
    rid: string;
    txid: string;
    tid: string;
    status: string;
    blockchain_txid: string;
    currency: string;
    logo_url: string;
    dataCurrency: {
        id: any;
        currency: string;
        name: string;
        icon_url: string;
    };
}
const DEFAULT_LIMIT = 5;
const HistoryTransactionMobileScreen: React.FC = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const currencies = useSelector(selectCurrencies);
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const historyLoading = useSelector(selectHistoryLoading);

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currency, setCurrency] = React.useState('');
    const [type, setType] = React.useState('deposits');
    const [showDetail, setShowDetail] = React.useState(false);
    const [detailData, setDetailData] = React.useState<TransactionHistoryMobileScreenProps>(
        {} as TransactionHistoryMobileScreenProps
    );
    const [status, setStatus] = React.useState('');
    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [showFilter, setShowFilter] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, 5));

    useDocumentTitle('History Transaction');
    // useHistoryFetch({ type: type, limit: 5, currency, page: currentPage });
    useWalletsFetch();

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

    // ====== Handle type navigation
    const handleChangeType = (e) => {
        setType(e);
        setCurrency('');
        handleReset();
    };

    // Handle click next page table
    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    // Add code coin into amount history
    const getAmountCode = (code: string) => {
        switch (code) {
            case 'trx':
                return 'TRX';
            case 'eth':
                return 'ETH';
            case 'btc':
                return 'BTC';
            case 'bnb':
                return 'BNB';
            default:
                return;
        }
    };

    // Handle className for type History Transaction
    const getTypeClassnameHistoryTransaction = (typeClassTransaction: string) => {
        switch (typeClassTransaction) {
            case 'deposits':
                return 'gradient-text';
            case 'withdraws':
                return 'danger-text';
            default:
                return 'blue-text';
        }
    };

    // Handle type of history transaction
    const getTypeHistoryTransaction = (typeHistoryTransaction: string) => {
        switch (typeHistoryTransaction) {
            case 'deposits':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.type.deposits' })}`;
            case 'withdraws':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.type.withdrawal' })}`;
            case 'transfers':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.type.transfers' })}`;
            default:
                return;
        }
    };

    // Handle status class history transaction
    const getStatusClassTransaction = (statusCode: string) => {
        switch (statusCode) {
            case 'accepted':
                return 'green-text';
            case 'collected':
                return 'green-text';
            case 'succeed':
                return 'green-text';
            case 'confirming':
                return 'green-text';
            case 'completed':
                return 'green-text';
            case 'canceled':
                return 'danger-text';
            case 'skipped':
                return 'danger-text';
            case 'errored':
                return 'danger-text';
            case 'failed':
                return 'danger-text';
            case 'rejected':
                return 'danger-text';

            default:
                return 'warning-text';
        }
    };

    // Handle status history transaction
    const getStatusTransaction = (statusCode: string) => {
        switch (statusCode) {
            case 'Pending':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.status.pending' })}`;
            case 'Canceled':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.status.canceled' })}`;
            case 'completed':
                return `${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.status.completed' })}`;
            default:
                return;
        }
    };

    // Get icon url from currency and wrap to history list
    const transFerlistDataHistory = historys.map((history) => ({
        ...history,
        dataCurrency: currencies.find(({ id }) => id == history.currency),
    }));

    const handleItemDetail = (item) => {
        setShowDetail(true);
        setDetailData(item);
    };

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Address has been copied'], type: 'success' }));
    };

    /**
     *
     * Internal history transaction
     *
     */

    // Render header table for internal history transaction
    const getTableHeadersInternalTransaction = () => [
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.header.coins' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.header.amount' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.header.status' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.header.action' })}
        </p>,
    ];

    // Render data table for internal transaction history
    const getTableDataInternalTransaction = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-stretch">
                <img
                    className="icon-history mr-3 rounded-full"
                    src={item?.logo_url ? item?.logo_url : '/img/dummycoin.png'}
                    alt="icon"
                />
                {/* <p className="m-0 mr-24 white-text font-bold">{item.currency.toUpperCase()}</p> */}
            </div>,
            <div className="text-nowrap">
                <p className="mb-1 font-weight-bold">
                    {item.amount} {getAmountCode(item.currency)}
                </p>
                <p className="text-secondary text-sm">
                    <small>{moment(item.created_at).format('D MMM YYYY')}</small>
                </p>
            </div>,
            ,
            <p className={`m-0 text-sm ${getStatusClassTransaction(item.status)}`}>
                {item?.status == 'under_review'
                    ? 'Under Review'
                    : item?.status == 'fee_processing'
                    ? 'Fee Processing'
                    : capitalizeFirstLetter(item?.status)}
            </p>,
            <div className="cursor-pointer" onClick={() => handleItemDetail(data[index])}>
                <p className={`m-0 text-xs font-bold text-nowrap`}>Detail</p>
            </div>,
        ]);
    };

    // ======= End Internal history transaction ============

    const getTableHeadersDeposit = () => [
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.deposit.header.asset' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.deposit.header.amount' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.deposit.header.type' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.deposit.header.status' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.deposit.header.action' })}
        </p>,
    ];
    // Render data table for DEPOSIT history
    const getTableDataDeposit = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-center">
                <img
                    className="icon-history mr-3 rounded-full"
                    src={item?.logo_url ? item?.logo_url : '/img/dummycoin.png'}
                    alt="icon"
                />
            </div>,
            <div className="text-nowrap">
                <p className="mb-1 font-weight-bold">
                    {item.amount} {getAmountCode(item.currency)}
                </p>
                <p className="text-secondary text-sm">
                    <small>{moment(item.created_at).format('D MMM YYYY')}</small>
                </p>
            </div>,
            <div>
                <p className={`m-0 text-xs font-bold text-nowrap ${getTypeClassnameHistoryTransaction(type)}`}>
                    {getTypeHistoryTransaction(type)}
                </p>
            </div>,
            <p className={`m-0 text-sm ${getStatusClassTransaction(item.state)}`}>
                {item?.state == 'under_review'
                    ? 'Under Review'
                    : item?.state == 'fee_processing'
                    ? 'Fee Processing'
                    : capitalizeFirstLetter(item?.state)}
            </p>,
            <div className="cursor-pointer" onClick={() => handleItemDetail(data[index])}>
                <p className={`m-0 text-xs font-bold text-nowrap`}>Detail</p>
            </div>,
        ]);
    };

    // ======= End DEPOSIT history transaction ============

    const getTableHeadersWithdrawal = () => [
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.withdraw.header.asset' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.withdraw.header.amount' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.withdraw.header.type' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.withdraw.header.status' })}
        </p>,
        <p className="mb-0 text-sm grey-text">
            {formatMessage({ id: 'page.mobile.historyTransaction.withdraw.header.status' })}
        </p>,
    ];

    // Render data table for WITHDRAWAL history
    const getTableDataWithdrawal = (data) => {
        return data.map((item, index) => [
            <div className="d-flex justify-content-center align-items-center">
                <img
                    className="icon-history mr-3 rounded-full"
                    src={item?.logo_url ? item?.logo_url : '/img/dummycoin.png'}
                    alt="icon"
                />
            </div>,
            <div className="text-nowrap">
                <p className="mb-1 font-weight-bold">
                    {item.amount} {getAmountCode(item.currency)}
                </p>
                <p className="text-secondary text-sm">
                    <small>{moment(item.created_at).format('D MMM YYYY')}</small>
                </p>
            </div>,
            <div>
                <p className={`m-0 text-xs font-bold text-nowrap ${getTypeClassnameHistoryTransaction(type)}`}>
                    {getTypeHistoryTransaction(type)}
                </p>
            </div>,
            // <div className='d-flex flex-row w-1/2'>
            //     <fieldset className={`m-0 text-xs font-bold text-nowrap text-truncate ${getTypeClassnameHistoryTransaction(type)}`}>
            //        {item?.rid?.length > 10 ? item.rid.slice(0, 10) + '...' : item.rid}
            //     </fieldset>
            //     <div className='cursor-pointer' onClick={()=> navigator.clipboard.writeText(item.rid)}>
            //         <CopyButton className="copy-icon" />
            //     </div>
            // </div>,
            <p className={`m-0 text-sm ${getStatusClassTransaction(item.state)}`}>
                {item?.state == 'under_review'
                    ? 'Under Review'
                    : item?.state == 'fee_processing'
                    ? 'Fee Processing'
                    : capitalizeFirstLetter(item?.state)}
            </p>,
            <div className="cursor-pointer" onClick={() => handleItemDetail(data[index])}>
                <p className={`m-0 text-xs font-bold text-nowrap`}>Detail</p>
            </div>,
        ]);
    };

    React.useEffect(() => {
        setHistorys(list);
    }, [list]);

    const filterredStatus = (status) => {
        let filterredList;
        let temp;
        temp = list;
        filterredList = temp.filter((item) => item.state === status);
        setHistorys(filterredList);
    };

    const handleReset = () => {
        setStatus('');
        setStartDate('');
        setEndDate('');
        setShowFilter(false);
        setHistorys(list);
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

    return (
        <section className="mobile-container pg-history-transaction no-header dark-bg-main">
            {/* ===== Header History Transaction ===== */}
            <div className="head-container position-relative">
                <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
                    <ArrowLeft className={'back'} />
                </div>
                <h1 className="text-center text-md grey-text-accent font-bold">
                    {formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.header' })}
                </h1>
                <div className="handle-filter text-right index-0 test-class">
                    <span className="cursor-pointer" onClick={() => setShowFilter(true)}>
                        <FilterIcon className="filter-icon" />
                    </span>
                </div>
            </div>
            {/* ===== End Header History Transaction ===== */}

            {/* =================== Tab navigation history transaction =========== */}
            <Tabs
                id="controlled-tab-example"
                defaultActiveKey="deposits"
                onSelect={(e) => handleChangeType(e)}
                className="justify-content-between">
                {/* =================== Tab navigation history transaction DEPOSIT =========== */}
                <Tab
                    eventKey="deposits"
                    title={`${formatMessage({ id: 'page.mobile.historyTransaction.internalTransfer.type.deposits' })}`}>
                    {loading ? (
                        <Loading />
                    ) : historys.length < 1 ? (
                        <NoData text="No Data Yet" />
                    ) : (
                        <>
                            <div className="table-mobile-wrapper mb-24">
                                <Table
                                    data={getTableDataDeposit(transFerlistDataHistory)}
                                    header={getTableHeadersDeposit()}
                                />
                            </div>

                            <PaginationMobile
                                firstElementIndex={firstElementIndex}
                                lastElementIndex={lastElementIndex}
                                page={page}
                                nextPageExists={nextPageExists}
                                onClickPrevPage={onClickPrevPage}
                                onClickNextPage={onClickNextPage}
                            />
                        </>
                    )}
                </Tab>
                {/* =================== Tab navigation history transaction WITHDRAWAL =========== */}
                <Tab
                    eventKey="withdraws"
                    title={`${formatMessage({
                        id: 'page.mobile.historyTransaction.internalTransfer.type.withdrawal',
                    })}`}>
                    {loading ? (
                        <Loading />
                    ) : historys.length < 1 ? (
                        <NoData text="No Data Yet" />
                    ) : (
                        <>
                            <div className="table-mobile-wrapper mb-24">
                                <Table
                                    data={getTableDataWithdrawal(transFerlistDataHistory)}
                                    header={getTableHeadersWithdrawal()}
                                />
                            </div>

                            <PaginationMobile
                                firstElementIndex={firstElementIndex}
                                lastElementIndex={lastElementIndex}
                                page={page}
                                nextPageExists={nextPageExists}
                                onClickPrevPage={onClickPrevPage}
                                onClickNextPage={onClickNextPage}
                            />
                        </>
                    )}
                </Tab>
                {/* =================== Tab navigation history transaction TRANSFERS =========== */}
                <Tab
                    eventKey="transfers"
                    title={`${formatMessage({
                        id: 'page.mobile.historyTransaction.internalTransfer.type.transfers',
                    })}`}>
                    {loading ? (
                        <Loading />
                    ) : historys.length < 1 ? (
                        <NoData text="No Data Yet" />
                    ) : (
                        <>
                            <div className="table-mobile-wrapper mb-24">
                                <Table
                                    className="table table-borderless"
                                    header={getTableHeadersInternalTransaction()}
                                    data={getTableDataInternalTransaction(transFerlistDataHistory)}
                                />
                            </div>

                            <PaginationMobile
                                firstElementIndex={firstElementIndex}
                                lastElementIndex={lastElementIndex}
                                page={page}
                                nextPageExists={nextPageExists}
                                onClickPrevPage={onClickPrevPage}
                                onClickNextPage={onClickNextPage}
                            />
                        </>
                    )}
                </Tab>
            </Tabs>
            {/* =================== End Tab navigation history transaction =========== */}
            <div id="off-canvas" className={`position-fixed off-canvas ${showDetail === true ? ' show' : ''}`}>
                <div className="fixed-bottom off-canvas-content-container overflow-auto text-white">
                    <div className="d-flex align-items-center off-canvas-content-head">
                        <img
                            height={30}
                            width={30}
                            className="icon-history mr-3 rounded-full"
                            src={detailData?.logo_url}
                            alt="icon"
                        />
                        <h3 className="m-0 p-0">{detailData?.currency?.toUpperCase()}</h3>
                    </div>
                    <table className="w-100 table-canvas">
                        <tbody>
                            <tr className="w-100 d-flex justify-content-between align-items-center">
                                <td className="td-title">Date</td>
                                <td className="td-value">{moment(detailData.created_at).format('D MMM YYYY')}</td>
                            </tr>
                            <tr className="w-100 d-flex justify-content-between align-items-center">
                                <td className="td-title">Status</td>
                                <td className="td-value">
                                    {type === 'transfers'
                                        ? detailData.status?.charAt(0).toUpperCase() + detailData.status?.slice(1)
                                        : detailData.state?.charAt(0).toUpperCase() + detailData.state?.slice(1)}
                                </td>
                            </tr>
                            <tr className="w-100 d-flex justify-content-between align-items-center">
                                <td className="td-title">Type</td>
                                <td className="td-value">
                                    {type === 'withdraws'
                                        ? 'Withdrawal'
                                        : type === 'deposits'
                                        ? 'Deposit'
                                        : 'Internal Transfer'}
                                </td>
                            </tr>
                            <tr className="w-100 d-flex justify-content-between align-items-center">
                                <td className="td-title">Amount</td>
                                <td className="td-value">
                                    {detailData.amount} {detailData?.dataCurrency?.id?.toUpperCase()}
                                </td>
                            </tr>
                            {type !== 'transfers' ? (
                                <tr className="w-100 d-flex justify-content-between align-items-center">
                                    <td className="td-title">Fee</td>
                                    <td className="td-value">
                                        {detailData.fee} {detailData?.dataCurrency?.id?.toUpperCase()}
                                    </td>
                                </tr>
                            ) : null}
                            <tr className="w-100 d-flex justify-content-between align-items-center">
                                <td className="td-title">
                                    {type === 'withdraws' ? 'RID' : type === 'deposits' ? 'TXID' : 'Receiver UID'}
                                </td>

                                {type === 'transfers' ? (
                                    <td>
                                        <div className="w-100 d-flex justify-content-between align-items-center">
                                            <div className="w-100">
                                                <input
                                                    className="p-0 m-0 td-value address w-100 bg-transparent"
                                                    id="address"
                                                    defaultValue={detailData.receiver_uid}
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    className="btn-transparent w-10"
                                                    type="button"
                                                    onClick={() => doCopy('address')}>
                                                    <CopyButton />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                ) : (
                                    <td className=" d-flex justify-content-between align-items-center">
                                        <div className="">
                                            <input
                                                className="p-0 m-0 td-value address w-100 bg-transparent"
                                                id="address"
                                                defaultValue={
                                                    type === 'deposits'
                                                        ? detailData?.txid
                                                            ? detailData?.txid
                                                            : detailData?.tid
                                                        : type === 'withdraws'
                                                        ? detailData?.rid
                                                        : detailData?.txid
                                                }
                                            />
                                        </div>
                                        <div>
                                            <button
                                                className="btn-transparent w-10"
                                                type="button"
                                                onClick={() => doCopy('address')}>
                                                <CopyButton />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>

                            {type == 'transfers' && (
                                <tr className="w-100 d-flex justify-content-between align-items-center">
                                    <td className="td-title"> Sender UID</td>

                                    <td className="d-flex justify-content-between align-items-center">
                                        <div className="w-100">
                                            <input
                                                className="p-0 m-0 td-value address w-100 bg-transparent"
                                                id="address"
                                                defaultValue={detailData.sender_uid}
                                            />
                                        </div>
                                        <div>
                                            <button
                                                className="btn-transparent w-10"
                                                type="button"
                                                onClick={() => doCopy('address')}>
                                                <CopyButton />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {type === 'withdraws' ? (
                                <>
                                    <tr className="w-100 d-flex justify-content-between align-items-center">
                                        <td className="td-title">TXID</td>
                                    </tr>
                                    <tr className="w-100 d-flex justify-content-between align-items-center">
                                        <td className="w-100">
                                            <input
                                                className="p-0 m-0 td-value address w-100 bg-transparent"
                                                id="address"
                                                defaultValue={detailData?.blockchain_txid}
                                            />
                                        </td>
                                        <td className={`${detailData?.blockchain_txid ? `` : `d-none`}`}>
                                            <button
                                                className="btn-transparent w-10"
                                                type="button"
                                                onClick={() => doCopy('address')}>
                                                <CopyButton />
                                            </button>
                                        </td>
                                    </tr>
                                </>
                            ) : null}
                        </tbody>
                    </table>
                    <button
                        id="close-canvas"
                        className="btn btn-secondary btn-outline btn-mobile btn-block my-5"
                        onClick={() => setShowDetail(false)}>
                        Close
                    </button>
                </div>
            </div>
            <div id="off-canvas-filter" className={`position-fixed off-canvas-filter ${showFilter ? 'show' : ''}`}>
                <div className="fixed-bottom off-canvas-content-container-filter overflow-auto">
                    <div>
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

                    <div>
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

                    {type !== 'transfers' && (
                        <div className="mb-24">
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

                    <div className="d-flex justify-content-center align-items-center">
                        <button
                            onClick={handleReset}
                            type="button"
                            className="btn btn-reset grey-text-accent dark-bg-accent text-sm w-40 mr-8">
                            Reset
                        </button>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            type="button"
                            className="btn-primary grey-text-accent text-sm font-normal w-40">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { HistoryTransactionMobileScreen };
