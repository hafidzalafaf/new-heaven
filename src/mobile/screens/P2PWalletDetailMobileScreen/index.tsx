import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
    selectCurrencies,
    Currency,
    selectHistory,
    selectFirstElemIndex,
    selectCurrentPage,
    selectLastElemIndex,
    selectNextPageExists,
    selectWallets,
    selectMarkets,
    selectMarketTickers,
    Wallet,
    User,
    selectUserInfo,
    RootState,
    selectMemberLevels,
    memberLevelsFetch,
    selectP2PWallets,
} from '../../../modules';
import {
    useHistoryFetch,
    useDocumentTitle,
    useMarketsFetch,
    useWalletsFetch,
    useMarketsTickersFetch,
} from '../../../hooks';
import Select from 'react-select';
import moment from 'moment';
import { PaginationMobile, ModalFullScreenMobile } from 'src/mobile/components';
import { Decimal } from '../../../components';
import { CustomStylesSelect } from '../../../desktop/components';
import { Modal as ModalComponent } from '../../../desktop/components';
import { ArrowLeft } from '../../assets/Arrow';
import { FilterIcon, DocIcon } from '../../assets/Wallet';
import { Table } from '../../../components';
import { CircleCloseDangerLargeIcon } from 'src/assets/images/CircleCloseIcon';
import { capitalizeFirstLetter } from 'src/helpers';
import { P2PTransferAssetMobile } from 'src/mobile/containers';

interface Props {
    isP2PEnabled?: boolean;
}
interface ExtendedWalletMobile extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
    status?: string;
    network?: any;
    last: any;
    marketId: string;
    p2p_balance?: string;
    p2p_locked?: string;
    currencyItem: any;
}

const P2PWalletDetailMobileScreen: React.FC<Props> = (props: Props) => {
    useWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(memberLevelsFetch());
    }, [dispatch]);

    const { currency = '' } = useParams<{ currency?: string }>();
    useDocumentTitle(`Detail ${currency.toUpperCase()}`);

    const { isP2PEnabled } = props;

    const DEFAULT_LIMIT = 7;

    const history = useHistory();
    const { formatMessage } = useIntl();
    const user: User = useSelector(selectUserInfo);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const p2pWallets = useSelector(selectP2PWallets);
    const memberLevel = useSelector(selectMemberLevels);

    const currencyItem: Currency = currencies.find((item) => item.id === currency);

    const [filteredWallets, setFilteredWallets] = React.useState([]);
    const wallets = useSelector(selectWallets);

    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [type, setType] = React.useState('deposits');
    const [status, setStatus] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [showTransfer, setShowTransfer] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [estimatedValue, setEstimatedValue] = React.useState<string | number>();
    const [showModal2FA, setShowModal2FA] = React.useState<boolean>(false);
    const [typeModal, setTypeModal] = React.useState('');

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, 5));

    React.useEffect(() => {
        if (wallets.length && (isP2PEnabled ? p2pWallets.length : true) && currencies.length) {
            const extendedWallets: ExtendedWalletMobile[] = currencies.map((cur) => {
                if (cur.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
                    return null;
                }
                const spotWallet = wallets.find((i) => i.currency === cur.id);
                const p2pWallet = isP2PEnabled ? p2pWallets.find((i) => i.currency === cur.id) : null;
                const market = markets.find((item) => item.base_unit == cur.id);
                const ticker = tickers[market?.id];
                const currencyItem = currencies.find((item) => item.id == cur.id);

                return {
                    ...spotWallet,
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                    status: cur.status,
                    network: cur.networks,
                    marketId: market ? market.id : null,
                    last: ticker ? ticker.last : null,
                    p2pBalance: p2pWallet ? p2pWallet.balance : '0',
                    p2pLocked: p2pWallet ? p2pWallet.locked : '0',
                    currencyItem: currencyItem ? currencyItem : null,
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);
            setFilteredWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies, isP2PEnabled]);

    useHistoryFetch({ type: type, limit: DEFAULT_LIMIT, currency: currency, page: currentPage });

    const handleChangeType = (e) => {
        setType(e);
    };

    // ====== Handle paginate hsitory =========
    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    React.useEffect(() => {
        setHistorys(list);
    }, [list]);

    // ====== Filter history by date ================
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

    let filteredList = filteredWallets.filter((i) => i.currency === currencyItem.id);
    let walletCurrency = filteredWallets.find((i) => i.currency === currencyItem.id);

    const filterredStatus = (status) => {
        let filterredList;
        let temp;
        temp = list;
        filterredList = temp.filter((item) => item.status === status);
        setHistorys(filterredList);
    };

    // =========== Render Data history into table ===============
    const getTableData = (data) => {
        return (
            data &&
            data.map((item) => [
                <div className="d-flex justify-content-start align-items-start td-coin">
                    <img
                        src={
                            currencyItem?.icon_url !== '-' &&
                            currencyItem?.icon_url !== null &&
                            currencyItem?.icon_url !== 'null'
                                ? currencyItem?.icon_url
                                : '/img/dummycoin.png'
                        }
                        alt="logo"
                        className="small-coin-icon mr-8"
                    />
                    <div className="d-flex flex-column justify-content-start align-items-start">
                        <h3 className="p-0 m-0 grey-text-accent text-sm font-bold">Amount</h3>
                        <h4 className="p-0 m-0 grey-text text-sm font-bold text-nowrap">
                            {item.amount} {item.currency?.toUpperCase()}
                        </h4>
                    </div>
                </div>,
                <div className="td-id-status-type d-flex flex-column justify-content-start align-items-start">
                    <h3 className="p-0 m-0 grey-text-accent text-sm font-bold">Status</h3>
                    <h4 className="p-0 m-0 grey-text text-sm font-bold">
                        {item.status === 'completed' ? 'Completed' : item.status === 'pending' ? 'Pending' : 'Canceled'}
                    </h4>
                </div>,
                <div className="td-id-status-type d-flex flex-column justify-content-end align-items-end">
                    <h3 className="p-0 m-0 grey-text-accent text-sm font-bold">Type</h3>
                    <h4 className="p-0 m-0 grey-text text-sm font-bold text-nowrap">
                        {type === 'deposits' ? 'Deposit' : type === 'withdraws' ? 'Withdraw' : 'Internal Transfer'}
                    </h4>
                </div>,
            ])
        );
    };

    const renderFilter = () => {
        return (
            <div className="detail-history-action-container d-flex justify-content-between align-items-center mt-3">
                <p className="p-0 m-0 title">Detail History</p>
                <div onClick={() => setShowFilter(true)}>
                    <span className="cursor-pointer">
                        <FilterIcon className={''} />
                    </span>
                </div>
            </div>
        );
    };

    const handleReset = () => {
        setStatus('');
        setStartDate('');
        setEndDate('');
        setShowFilter(false);
        setHistorys(list);
    };

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Pending</p>, value: 'pending' },
        { label: <p className="m-0 text-sm grey-text-accent">Completed</p>, value: 'completed' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
    ];

    const totalBalance = Number(walletCurrency?.p2p_balance) + Number(walletCurrency?.p2p_locked);

    const fixed = Number(walletCurrency?.fixed);

    React.useEffect(() => {
        setEstimatedValue(+walletCurrency?.currencyItem?.price * totalBalance);
    }, [totalBalance, currency, filteredList]);

    const renderHeaderModalLocked = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <CircleCloseDangerLargeIcon />
                </div>
            </React.Fragment>
        );
    };

    const renderContentModalLocked = () => {
        return (
            <React.Fragment>
                <h1 className="white-text text-lg mb-24 text-center ">Transfer Assets Locked</h1>
                <p className="grey-text text-ms font-extrabold mb-24 text-center">To transfer you have to enable 2FA</p>
                <div className="d-flex justify-content-center align-items-center w-100 mb-0">
                    <Link to={`/two-fa-activation`}>
                        <button type="button" className="btn btn-primary sm px-5 mr-3">
                            Enable 2FA
                        </button>
                    </Link>
                </div>
            </React.Fragment>
        );
    };

    return (
        <>
            <div className="mobile-container wallet-detail dark-bg-main position-relative pg-mobile-wallet-detail">
                <div className="head-container position-relative mb-24">
                    <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </div>
                    <p className="text-md font-extrabold grey-text-accent m-0 text-center">
                        {currencyItem && currencyItem.name}
                    </p>
                </div>
                <div className="detail-assets-container w-100 mb-4">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="text-sm grey-text">
                                {formatMessage({ id: 'page.mobile.wallets.banner.available' })}
                            </h3>
                            <h2 className="text-sm grey-text font-extrabold">
                                <Decimal fixed={Number(walletCurrency?.fixed)}>
                                    {Number(walletCurrency?.p2p_balance)}
                                </Decimal>
                            </h2>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="text-sm grey-text">
                                {formatMessage({ id: 'page.mobile.wallets.banner.locked' })}
                            </h3>
                            <h2 className="text-sm grey-text font-extrabold">
                                <Decimal fixed={Number(walletCurrency?.fixed)}>
                                    {Number(walletCurrency?.p2p_locked)}
                                </Decimal>
                            </h2>
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="text-sm grey-text">
                                {formatMessage({ id: 'page.mobile.wallets.banner.estimated' })}
                            </h3>
                            <h2 className="text-sm grey-text estimated-value font-extrabold">
                                <Decimal fixed={fixed}>{estimatedValue ? estimatedValue.toString() : '0'}</Decimal>
                            </h2>
                        </div>
                    </div>
                    ;
                </div>

                <div className="d-flex justify-content-center align-items-center pb-4 w-100 gap-16">
                    <button
                        type="button"
                        onClick={() => history.push(`/p2p`)}
                        className="btn-primary btn-sm font-normal w-50">
                        P2P Trade
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setTypeModal('internal transfer');
                            if (!user?.otp) {
                                setShowModal2FA(true);
                            } else {
                                setShowTransfer(!showTransfer);
                            }
                        }}
                        className="btn-primary btn-sm font-normal w-50">
                        Transfer
                    </button>
                </div>

                <Tabs
                    id="controlled-tab-example"
                    defaultActiveKey="deposits"
                    activeKey={type}
                    onSelect={(e) => handleChangeType(e)}
                    className="tabs-history-detail d-flex justify-content-between">
                    <Tab eventKey="deposits" title="Deposit">
                        <div className="table-mobile-wrapper">
                            {renderFilter()}
                            {!historys[0] || historys === null ? (
                                <div className="empty-data d-flex flex-column align-items-center mb-5 w-100">
                                    <DocIcon className={''} />
                                    <h1>{formatMessage({ id: 'page.mobile.wallet.detail.empty' })}</h1>
                                </div>
                            ) : (
                                <Table data={getTableData(historys)} />
                            )}

                            <div className="mt-3">
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
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="withdraws" title="Withdraw">
                        {renderFilter()}
                        {!historys[0] || historys === null ? (
                            <div className="empty-data d-flex flex-column align-items-center mb-5 w-100">
                                <DocIcon className={''} />
                                <h1>{formatMessage({ id: 'page.mobile.wallet.detail.empty' })}</h1>
                            </div>
                        ) : (
                            <Table data={getTableData(historys)} />
                        )}
                        <div className="mt-3">
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
                        </div>
                    </Tab>
                    <Tab eventKey="transfers" title="Transfer">
                        {renderFilter()}
                        {!historys[0] || historys === null ? (
                            <div className="empty-data d-flex flex-column align-items-center mb-5 w-100">
                                <DocIcon className={''} />
                                <h1>{formatMessage({ id: 'page.mobile.wallet.detail.empty' })}</h1>
                            </div>
                        ) : (
                            <Table data={getTableData(historys)} />
                        )}
                        <div className="mt-3">
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
                        </div>
                    </Tab>
                </Tabs>

                {/* ================== Modal Transfer ============================= */}
                <ModalFullScreenMobile
                    show={showTransfer}
                    content={
                        <P2PTransferAssetMobile
                            handleShowTransfer={() => setShowTransfer(!showTransfer)}
                            wallet={walletCurrency}
                        />
                    }
                />

                <ModalComponent
                    show={showModal2FA}
                    header={renderHeaderModalLocked()}
                    content={renderContentModalLocked()}
                />

                {/* =================================== Modal filter Date ========================= */}

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

                {/* ========= Show Modal Locked 2FA =========== */}

                {/* ========== End Modal ===========*/}
            </div>
        </>
    );
};

export { P2PWalletDetailMobileScreen };
