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
} from '../../../modules';
import { FilterIcon } from 'src/mobile/assets/Wallet';
import Tabs from 'react-bootstrap/Tabs';
import { useDocumentTitle } from 'src/hooks';
import { copy, CopyableTextField, Table } from '../../../components';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { BtcIcon } from '../../../assets/images/CoinIcon';
import { NoData } from 'src/desktop/components';
import { PaginationMobile } from 'src/mobile/components';
import { Link } from 'react-router-dom';
import { CopyButton } from 'src/assets/images/CopyButton';





interface TransactionHistoryMobileScreenProps {
    sender_uid: string;
    receiver_uid: string
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
    status: string;
    dataCurrency: {
        id: any;
        currency: string;
        name: string;
        icon_url: string;
    };
}

const HistoryTransactionMobileScreen: React.FC = () => {
    const intl = useIntl();
    const { formatMessage } = useIntl();
    const currencies = useSelector(selectCurrencies);
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const dispatch = useDispatch();

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currency, setCurrency] = React.useState('');
    const [type, setType] = React.useState('deposits');
    const [showDetail, setShowDetail] = React.useState(false);
    const [detailData, setDetailData] = React.useState<TransactionHistoryMobileScreenProps>({} as TransactionHistoryMobileScreenProps);
    const [status, setStatus] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [showFilter, setShowFilter] = React.useState(false);

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, 5));

    useDocumentTitle('History Transaction');
    useHistoryFetch({ type: type, limit: 5, currency, page: currentPage });
    useWalletsFetch();

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
    const getAmmountCode = (code: string) => {
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
                return 'contrast-text';
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
            case 'Pending':
                return 'warning-text';
            case 'Canceled':
                return 'danger-text';
            case 'completed':
                return 'success-text';
            case 'errored':
                return 'danger-text';

            default:
                return 'green-text';
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
                    src={item.dataCurrency && item.dataCurrency.icon_url}
                    alt="icon"
                />
                {/* <p className="m-0 mr-24 white-text font-bold">{item.currency.toUpperCase()}</p> */}
            </div>,
            <div className="text-nowrap">
                <p className="mb-1 font-weight-bold">
                    {item.amount} {getAmmountCode(item.currency)}
                </p>
                <p className="text-secondary text-sm">
                    <small>{moment(item.created_at).format('D MMM YYYY')}</small>
                </p>
            </div>,,
            <p className={`m-0 text-sm ${getStatusClassTransaction(item.status)}`}>
                {getStatusTransaction(item.status)}
            </p>,
            <div className='cursor-pointer' onClick={()=> handleItemDetail(data[index])}>
                <p className={`m-0 text-xs font-bold text-nowrap`}>
                    Detail
                </p>
            </div>
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
                <div className="d-flex justify-content-center align-items-stretch">
                        <img
                            className="icon-history mr-3 rounded-full"
                            src={item.dataCurrency && item.dataCurrency.icon_url}
                            alt="icon"
                        />
                    </div>,
                    <div className="text-nowrap">
                        <p className="mb-1 font-weight-bold">
                            {item.amount} {getAmmountCode(item.currency)}
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
                    //        {item?.txid?.length > 10 ? item.txid.slice(0, 10) + '...' : item.txid} 
                    //     </fieldset>
                    //     <div className='cursor-pointer' onClick={()=> navigator.clipboard.writeText(item.txid)}>
                    //         <CopyButton className="copy-icon" />
                    //     </div>
                    // </div>,
                //     <div>
                //         <p className={`m-0 text-xs font-bold text-nowrap`}>
                //         {item.tid}
                //         </p>
                // </div>,
                    <p className={`m-0 text-sm ${getStatusClassTransaction(item.state)}`}>
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
                    <div className='cursor-pointer' onClick={()=> handleItemDetail(data[index])}>
                    <p className={`m-0 text-xs font-bold text-nowrap`}>
                        Detail
                    </p>
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
                <div className="d-flex justify-content-center align-items-stretch">
                        <img
                            className="icon-history mr-3 rounded-full"
                            src={item.dataCurrency && item.dataCurrency.icon_url}
                            alt="icon"
                        />
                    </div>,
                    <div className="text-nowrap">
                        <p className="mb-1 font-weight-bold">
                            {item.amount} {getAmmountCode(item.currency)}
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
                    <div className='cursor-pointer' onClick={()=> handleItemDetail(data[index])}>
                        <p className={`m-0 text-xs font-bold text-nowrap`}>
                            Detail
                        </p>
                    </div>,
                ]);
        };

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

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Pending</p>, value: 'processing' },
        { label: <p className="m-0 text-sm grey-text-accent">Completed</p>, value: 'collected' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
    ];

    return (
        <section className="mobile-container pg-history-transaction no-header dark-bg-main">
            {/* ===== Header History Transaction ===== */}
            <div className="head-container position-relative">
                <Link to={'/profile'} className="cursor-pointer position-absolute">
                    <ArrowLeft className={'back'} />
                </Link>
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
                    <div className="table-mobile-wrapper mb-24">
                        <Table 
                        data={getTableDataDeposit(transFerlistDataHistory)} 
                        header={getTableHeadersDeposit()} 
                        />
                    </div>
                    {historys[0] && (
                        <PaginationMobile
                            firstElementIndex={firstElementIndex}
                            lastElementIndex={lastElementIndex}
                            page={page}
                            nextPageExists={nextPageExists}
                            onClickPrevPage={onClickPrevPage}
                            onClickNextPage={onClickNextPage}
                        />
                    )}
                    {historys.length < 1 && <NoData text="No Data Yet" />}
                </Tab>
                {/* =================== Tab navigation history transaction WITHDRAWAL =========== */}
                <Tab
                    eventKey="withdraws"
                    title={`${formatMessage({
                        id: 'page.mobile.historyTransaction.internalTransfer.type.withdrawal',
                    })}`}>
                    <div className="table-mobile-wrapper mb-24">
                        <Table data={getTableDataWithdrawal(transFerlistDataHistory)} header={getTableHeadersWithdrawal()} />
                    </div>
                    {historys[0] && (
                        <PaginationMobile
                            firstElementIndex={firstElementIndex}
                            lastElementIndex={lastElementIndex}
                            page={page}
                            nextPageExists={nextPageExists}
                            onClickPrevPage={onClickPrevPage}
                            onClickNextPage={onClickNextPage}
                        />
                    )}
                    {historys.length < 1 && <NoData text="No Data Yet" />}
                </Tab>
                {/* =================== Tab navigation history transaction TRANSFERS =========== */}
                <Tab
                    eventKey="transfers"
                    title={`${formatMessage({
                        id: 'page.mobile.historyTransaction.internalTransfer.type.transfers',
                    })}`}>
                    <div className="table-responsive">
                        <Table
                            className="table table-borderless"
                            header={getTableHeadersInternalTransaction()}
                            data={getTableDataInternalTransaction(transFerlistDataHistory)}
                        />
                    </div>
                    {historys[0] && (
                        <PaginationMobile
                            firstElementIndex={firstElementIndex}
                            lastElementIndex={lastElementIndex}
                            page={page}
                            nextPageExists={nextPageExists}
                            onClickPrevPage={onClickPrevPage}
                            onClickNextPage={onClickNextPage}
                        />
                    )}
                    {historys.length < 1 && <NoData text="No Data Yet" />}
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
                            src={detailData.dataCurrency?.icon_url}
                            alt="icon"
                        />
                            <h3>
                                {detailData?.dataCurrency?.id?.toUpperCase()}
                            </h3>
                        </div>
                        <table className="w-100 table-canvas">
                            <tbody>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Date</td>
                                    <td className="td-value">{moment(detailData.created_at).format('D MMM YYYY')}</td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Status</td>
                                    <td className="td-value">
                                        {type === 'transfers' ? detailData.status?.charAt(0).toUpperCase() + detailData.status?.slice(1) :
                                        detailData.state?.charAt(0).toUpperCase() + detailData.state?.slice(1)}
                                    </td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Type</td>
                                    <td className="td-value">
                                        {
                                        type === 'withdraws' ? 'Withdrawal' 
                                        : type === 'deposits' ? 'Deposit' 
                                        : 'Internal Transfer'
                                        }
                                    </td>
                                </tr>
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Amount</td>
                                    <td className="td-value">
                                    {detailData.amount} {detailData?.dataCurrency?.id?.toUpperCase()}    
                                    </td>
                                </tr>
                                {
                                    type !== 'transfers' ? 
                                    <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">Fee</td>
                                    <td className="td-value">
                                    {detailData.fee} {detailData?.dataCurrency?.id?.toUpperCase()}    
                                    </td>
                                </tr> : null
                                }
                                <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="td-title">{type === 'withdraws' ? 'RID' : type === 'deposits' ? 'TXID' : 'Receiver UID'}</td>
                                </tr>
                                {
                                    type === 'transfers' ?
                                    <>
                                    <tr className="w-100 d-flex justify-content-between align-items0center">
                                        <td className="w-100">
                                            <input
                                            className="p-0 m-0 text-sm grey-text-accent font-bold address w-100 bg-transparent"
                                            id='address'
                                            defaultValue={detailData.receiver_uid}
                                            /></td>
                                        <td>
                                            <button
                                            className="btn-transparent w-10"
                                            type="button"
                                            onClick={() => doCopy('address')}>
                                                <CopyButton />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="w-100 d-flex justify-content-between align-items0center">
                                        <td className="td-title"> Sender UID</td>
                                    </tr>
                                    <tr className="w-100 d-flex justify-content-between align-items0center">
                                        <td className="w-100">
                                            <input
                                            className="p-0 m-0 text-sm grey-text-accent font-bold address w-100 bg-transparent"
                                            id='address'
                                            defaultValue={detailData.sender_uid}
                                            /></td>
                                        <td>
                                            <button
                                            className="btn-transparent w-10"
                                            type="button"
                                            onClick={() => doCopy('address')}>
                                                <CopyButton />
                                            </button>
                                        </td>
                                    </tr>
                                    </>
                                    :
                                    <tr className="w-100 d-flex justify-content-between align-items0center">
                                    <td className="w-100">
                                        <input
                                        className="p-0 m-0 text-sm grey-text-accent font-bold address w-100 bg-transparent"
                                        id='address'
                                        defaultValue={
                                            type === 'deposits' ?
                                            detailData.txid : 
                                            type === 'withdraws' ?
                                            detailData.rid :
                                            detailData.txid
                                        }
                                        /></td>
                                    <td>
                                    <button
                                    className="btn-transparent w-10"
                                    type="button"
                                    onClick={() => doCopy('address')}>
                                    <CopyButton />
                                </button></td>
                                </tr>
                                }
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
                        />
                    </div>

                    <div className="mb-24">
                        <p className="m-0 white-text text-sm mb-8">Status</p>
                        <Select
                            value={optionStatus.filter(function (option) {
                                return option.value === status;
                            })}
                            styles={CustomStylesSelect}
                            options={optionStatus}
                            onChange={(e) => {
                                setStatus(e.value);
                                filterredStatus(e.value);
                            }}
                        />
                    </div>

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
