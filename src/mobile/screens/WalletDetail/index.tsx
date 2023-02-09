import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
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
} from '../../../modules';
import { useHistoryFetch, useDocumentTitle, useMarketsFetch } from '../../../hooks';
import Select from 'react-select';
import moment from 'moment';
import { PaginationMobile } from 'src/mobile/components';
import { Decimal } from '../../../components';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { CustomStylesSelect } from '../../../desktop/components';
import { Modal } from 'react-bootstrap';
import { ArrowLeft } from '../../assets/Arrow';
import { WithdrawlIcon, DepositIcon, TransferIcon, FilterIcon, DocIcon } from '../../assets/Wallet';
import { Table } from '../../../components';
import { CircleCloseModalNetworkIcon } from '../../../assets/images/CircleCloseIcon';
import { InfoModalNetworkIcon } from '../../../assets/images/InfoIcon';
import { GearIcon } from 'src/mobile/assets/Gear';

interface Props {
    isP2PEnabled?: boolean;
}
interface ExtendedWalletMobile extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
}

const WalletDetailMobileScreen: React.FC<Props> = (props: Props) => {
    // useWalletsFetch();
    // useMarketsTickersFetch();
    useMarketsFetch();

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
    const [showNetwork, setShowNetwork] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [estimatedValue, setEstimatedValue] = React.useState<string>();
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);

    // Handle get item pagination
    const firstElementIndex = useSelector((state: RootState) => selectFirstElemIndex(state, 5));
    const lastElementIndex = useSelector((state: RootState) => selectLastElemIndex(state, 5));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, 5));

    React.useEffect(() => {
        if (wallets.length && currencies.length) {
            const extendedWallets: ExtendedWalletMobile[] = currencies.map((cur) => {
                if (cur.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
                    return null;
                }
                const spotWallet = wallets.find((i) => i.currency === cur.id);
                return {
                    ...spotWallet,
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);
            setFilteredWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies, isP2PEnabled]);

    useHistoryFetch({ type: type, limit: DEFAULT_LIMIT, currency: currency, page: currentPage });

    const handleSelectNetwork = (blockchain_key, protocol) => {
        history.push(`/wallets/${currency}/deposit`, { blockchain_key: blockchain_key, protocol: protocol });
    };

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
                    <img src={currencyItem && currencyItem.icon_url} alt="logo" className="small-coin-icon mr-8" />
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

    const totalBalance =
        Number(filteredList.map((item) => item.spotBalance)) + Number(filteredList.map((item) => item.spotLocked));

    const fixed = Number(filteredList.map((item) => item.fixed));

    React.useEffect(() => {
        if (Number(totalBalance) && currency) {
            return setEstimatedValue(
                estimateUnitValue(
                    currency.toUpperCase(),
                    VALUATION_PRIMARY_CURRENCY,
                    +totalBalance,
                    currencies,
                    markets,
                    tickers
                )
            );
        } else {
            return setEstimatedValue(Decimal.format(0, fixed));
        }
    }, [totalBalance, currency, currencies, markets, tickers]);

    return (
        <>
            <div className="mobile-container wallet-detail dark-bg-main position-relative pg-mobile-wallet-detail">
                <div className="head-container position-relative mb-24">
                    <Link to={'/wallets'} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </Link>
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
                                <Decimal fixed={Number(filteredList.map((item) => item.fixed))}>
                                    {Number(filteredList.map((item) => item.spotBalance))}
                                </Decimal>
                            </h2>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="text-sm grey-text">
                                {formatMessage({ id: 'page.mobile.wallets.banner.locked' })}
                            </h3>
                            <h2 className="text-sm grey-text font-extrabold">
                                {Number(filteredList.map((item) => item.spotLocked))}
                            </h2>
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3 className="text-sm grey-text">
                                {formatMessage({ id: 'page.mobile.wallets.banner.estimated' })}
                            </h3>
                            <h2 className="text-sm grey-text estimated-value font-extrabold">{estimatedValue}</h2>
                        </div>
                    </div>
                    ;
                </div>

                <div className="btn-action-container d-flex justify-content-center flex-wrap pb-4">
                    <button
                        id="network-canvas"
                        type="button"
                        onClick={() => setShowNetwork(true)}
                        className="btn btn-primary btn-sm font-normal m-1">
                        <DepositIcon className={''} />
                        {formatMessage({ id: 'page.mobile.wallets.deposit' })}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (user.level == 3) {
                                history.push(`/wallets/${currency}/withdraw`);
                            } else {
                                setShowModalLocked(true);
                            }
                        }}
                        className="btn btn-primary btn-sm font-normal m-1">
                        <WithdrawlIcon className={''} />
                        {formatMessage({ id: 'page.mobile.wallets.withdraw' })}
                    </button>
                    <button
                        type="button"
                        onClick={() => history.push(`/wallets/${currency}/transfer`)}
                        className="btn btn-primary btn-sm font-normal m-1">
                        <TransferIcon className={''} />
                        {formatMessage({ id: 'page.mobile.wallets.transfer' })}
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
                    <Tab eventKey="transfers" title="Internal Transfer">
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

                {/* ================== Modal Add Deposit ============================= */}

                <div id="off-canvas" className={`position-fixed off-canvas ${showNetwork ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container overflow-auto">
                        <div className="d-flex justify-content-between align-items-center mb-12">
                            <h3 className="p-0 m-0 text-ms grey-text-accent">Select Network</h3>
                            <span onClick={() => setShowNetwork(false)} className="cursor-pointer">
                                <CircleCloseModalNetworkIcon />
                            </span>
                        </div>

                        <div className="d-flex justify-content-start align-items-start mb-24">
                            <span className="mr-8 curspr-pointer">
                                <InfoModalNetworkIcon />
                            </span>
                            <p className="m-0 p-0 grey-text text-xxs">
                                Ensure that the selected network is consistent with your method of withdrawal, Otherwise
                                you are at risk losing your assets,
                            </p>
                        </div>

                        {currencyItem &&
                            currencyItem.networks.map((item, i) => (
                                <div
                                    onClick={() =>
                                        handleSelectNetwork(item && item.blockchain_key, item && item.protocol)
                                    }
                                    key={i}
                                    className="cursor-pointer mb-8">
                                    <h3 className="p-0 m-0 text-ms grey-text-accent">{item && item.protocol}</h3>
                                    <p className="m-0 p-0 grey-text text-xxs">{item && item.blockchain_key}</p>
                                </div>
                            ))}
                    </div>
                </div>

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

                {showModalLocked && (
                    <Modal show={showModalLocked}>
                        <section className="container p-3 dark-bg-main">
                            <div className="d-flex justify-content-center my-2">
                                <GearIcon />
                            </div>
                            <div className="text-center">
                                <p className="gradient-text mb-3">
                                    {user?.level == 1
                                        ? 'For withdraw you must verified your phone number and document first'
                                        : 'For withdraw you must verified your document first'}
                                </p>
                            </div>
                            <div className="mb-0">
                                <Link to={`${user?.level == 1 ? '/profile' : '/profile/kyc'}`}>
                                    <button type="button" className="btn btn-primary btn-block">
                                        {user?.level == 1 ? 'Verify Phone Number' : 'Verify Document'}
                                    </button>
                                </Link>
                                <div className="mt-3" onClick={() => setShowModalLocked(!showModalLocked)}>
                                    <button type="button" className="btn btn-outline-primary btn-block">
                                        {formatMessage({ id: 'page.mobile.wallets.modal.body.2FA.cancel' })}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </Modal>
                )}

                {/* ========== End Modal ===========*/}
            </div>
        </>
    );
};

export { WalletDetailMobileScreen };
