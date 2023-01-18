import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    selectAbilities,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    Wallet,
    User,
    selectUserInfo,
} from '../../../modules';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch, useDocumentTitle } from '../../../hooks';
import { Table, Decimal, formatWithSeparators } from '../../../components';
import { FilterInput } from '../../../desktop/components';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { WithdrawlIcon, DepositIcon, TransferIcon } from '../../assets/Wallet';
import { Modal } from 'react-bootstrap';
import { CoinTransfer } from '../../../mobile/components/CoinTransfer/CoinTransfer';
import { ArrowRight } from '../../assets/Arrow';
import { GearIcon } from 'src/mobile/assets/Gear';

interface Props {
    isP2PEnabled?: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
}

const WalletListMobileScreen: React.FC<Props> = (props: Props) => {
    useWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();
    useDocumentTitle('Wallets');

    const { isP2PEnabled } = props;
    const history = useHistory();
    const { formatMessage } = useIntl();

    const [showModal, setShowModal] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);

    const translate = React.useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [
        formatMessage,
    ]);

    const wallets = useSelector(selectWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const user: User = useSelector(selectUserInfo);

    React.useEffect(() => {
        if (wallets.length && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map((cur) => {
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

    const renderTableData = React.useCallback(
        (data) => {
            const list = nonZeroSelected
                ? filteredWallets.filter((i) => i.balance && Number(i.balance) > 0)
                : filteredWallets;
            const filteredList = list.filter(
                (i) =>
                    !filterValue ||
                    i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
                    i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase())
            );

            return !filteredList.length
                ? [[]]
                : filteredList.map((item, index) => {
                      const { currency, iconUrl, name, fixed, spotBalance, spotLocked } = item;
                      const totalBalance = Number(spotBalance) + Number(spotLocked);
                      const estimatedValue =
                          Number(totalBalance) && currency
                              ? estimateUnitValue(
                                    currency.toUpperCase(),
                                    VALUATION_PRIMARY_CURRENCY,
                                    +totalBalance,
                                    currencies,
                                    markets,
                                    tickers
                                )
                              : Decimal.format(0, fixed);

                      return [
                          <div className="d-flex justify-content-start align-items-center td-coin">
                              <img
                                  alt={currency?.toUpperCase()}
                                  src={iconUrl}
                                  style={{ height: '24px', marginRight: '16px' }}
                              />
                              <div className="d-flex flex-column justify-content-start align-items-start">
                                  <h3 className="p-0 m-0 text-one">{name}</h3>
                                  <h4 className="p-0 m-0 text-two">{currency.toUpperCase()}</h4>
                              </div>
                          </div>,
                          <div className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Total Balance</h3>
                              <h4 className="p-0 m-0 text-two">
                                  <Decimal key={index} fixed={fixed} thousSep=",">
                                      {totalBalance ? totalBalance.toString() : '0'}
                                  </Decimal>
                              </h4>
                          </div>,
                          <div className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Estimated Value</h3>
                              <h4 className="p-0 m-0 text-two">{formatWithSeparators(estimatedValue, ',')}</h4>
                          </div>,
                          <Link to={`/wallets/${currency}/detail`}>
                              <ArrowRight className={''} />
                          </Link>,
                      ];
                  });
        },
        [filteredWallets, nonZeroSelected, abilities, currencies, markets, tickers]
    );

    const estimatedValue = React.useMemo(() => {
        return estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    }, [currencies, wallets, markets, tickers]);

    const renderSecondaryCurrencyValuation = React.useCallback(
        (value: string) => {
            const estimatedValueSecondary = estimateUnitValue(
                VALUATION_SECONDARY_CURRENCY,
                VALUATION_PRIMARY_CURRENCY,
                +value,
                currencies,
                markets,
                tickers
            );

            return (
                <div className="total-container w-50 d-flex flex-column">
                    <h3 className="text-md grey-text font-bold  mb-0">
                        {formatMessage({ id: 'page.mobile.wallets.estimatedAvailable' })}
                    </h3>
                    <div className="total-value d-flex justify-content-between align-items-center">
                        <h4 className="text-sm grey-text-accent font-bold">
                            {formatWithSeparators(estimatedValueSecondary, ',')}{' '}
                            {VALUATION_SECONDARY_CURRENCY.toUpperCase()}
                        </h4>
                    </div>
                </div>
            );
        },
        [currencies, markets, tickers]
    );

    const searchFilter = (row: Wallet, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.currency?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredWallets(result as Wallet[]);
    };

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            event.preventDefault();
            setNonZeroSelected(!nonZeroSelected);
        },
        [nonZeroSelected, setNonZeroSelected]
    );

    const handleClickWithdraw = React.useCallback(() => {
        user.otp ? setShowModal(true) : setShowModalLocked(!showModalLocked);
    }, []);

    return (
        <React.Fragment>
            <div className="mobile-container wallet-list no-header dark-bg-main">
                <h1 className="w-100 heading-one mb-24 mt-0">{formatMessage({ id: 'page.mobile.wallets.balance' })}</h1>
                <div className="estimate-container d-flex flex-column w-100">
                    <div className="total-container w-50 d-flex flex-column">
                        <h3 className="text-md grey-text font-bold  mb-0">
                            {formatMessage({ id: 'page.mobile.wallets.estimatedBalance' })}
                        </h3>
                        <div className="total-value d-flex justify-content-between align-items-center">
                            <h4 className="text-sm grey-text-accent font-bold">
                                {formatWithSeparators(estimatedValue, ',')} {VALUATION_PRIMARY_CURRENCY.toUpperCase()}
                            </h4>
                        </div>
                    </div>

                    {/* <div>{VALUATION_SECONDARY_CURRENCY && renderSecondaryCurrencyValuation(estimatedValue)}</div> */}

                    <div className="action-container w-100 d-flex flex-wrap justify-content-center align-items-center">
                        <button
                            onClick={() => {
                                setShowModal(!showModal);
                                setModalType('deposit');
                            }}
                            className="btn btn-primary btn-sm">
                            <DepositIcon className={'mr-2'} />
                            {formatMessage({ id: 'page.mobile.wallets.deposit' })}
                        </button>
                        <button
                            onClick={() => {
                                handleClickWithdraw();
                                setModalType('withdraw');
                            }}
                            className="btn btn-primary btn-sm"
                            data-toggle="modal"
                            data-target="#modal-withdraw">
                            <WithdrawlIcon className={'mr-2'} />
                            {formatMessage({ id: 'page.mobile.wallets.withdraw' })}
                        </button>
                        <button
                            onClick={() => {
                                handleClickWithdraw();
                                setModalType('transfer');
                            }}
                            className="btn btn-primary btn-sm">
                            <TransferIcon className={'mr-2'} />
                            {formatMessage({ id: 'page.mobile.wallets.transfer' })}
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 mt-3 mb-16">
                    <form onClick={handleToggleCheckbox} className="form-group form-check mb-0">
                        <input
                            type="checkbox"
                            id="nonZeroSelected"
                            checked={nonZeroSelected}
                            // readOnly={true}
                            className="form-check-input"
                        />
                        <label className="form-check-label text-sm font-semibold white-text" htmlFor="nonZeroSelected">
                            {formatMessage({ id: 'page.mobile.wallets.hideSmallBalance' })}
                        </label>
                    </form>
                    {/* <SearchIcon /> */}

                    <div className="text-right">
                        <FilterInput
                            data={wallets}
                            onFilter={handleFilter}
                            filter={searchFilter}
                            placeholder={formatMessage({ id: 'page.body.wallets.overview.seach' })}
                            className="search-wallet"
                        />
                    </div>
                </div>
                <Table data={renderTableData(wallets)} />
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
                                {formatMessage({ id: 'page.mobile.wallets.modal.2FA' })}
                            </p>
                            <p className="text-secondary text-sm">
                                {formatMessage({ id: 'page.mobile.wallets.modal.body.2FA' })}
                            </p>
                        </div>
                        <div className="mb-0">
                            <Link to={`/two-fa-activation`}>
                                <button type="button" className="btn btn-primary btn-block">
                                    {formatMessage({ id: 'page.mobile.wallets.modal.body.2FA.enable' })}
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

            {/* ========= Show modal internal transaction ======== */}
            {showModal && (
                <Modal
                    dialogClassName="modal-transfer-fullscreen"
                    onHide={() => setShowModal(!showModal)}
                    show={showModal}>
                    <section className="internal-transfer-mobile-screen">
                        <div className="container-fluid w-100 p-0 m-0 position-relative">
                            <div onClick={() => setShowModal(!showModal)} className="white-text text-right mb-3">
                                <span className="text-sm cursor-pointer text-secondary">
                                    {formatMessage({ id: 'page.mobile.wallets.modal.body.2FA.cancel' })}
                                </span>
                            </div>
                            <div className="table-mobile-wrapper">
                                <CoinTransfer type={modalType} />
                            </div>
                        </div>
                    </section>
                </Modal>
            )}
        </React.Fragment>
    );
};

export { WalletListMobileScreen };
