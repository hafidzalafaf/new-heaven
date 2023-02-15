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
                    status: cur.status,
                    network: cur.networks,
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);
            setFilteredWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies, isP2PEnabled]);

    /**
     * Render data wallet into table include currency, total balance and estimated value
     * and filtering data wallet by balance
     */
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
                                    Number(totalBalance),
                                    currencies,
                                    markets,
                                    tickers
                                )
                              : Decimal.format(0, fixed);

                      return [
                          <Link
                              to={`/wallets/${currency}/detail`}
                              className="d-flex justify-content-start align-items-center td-coin">
                              <img
                                  alt={currency?.toUpperCase()}
                                  src={
                                      iconUrl !== '-' && iconUrl !== null && iconUrl !== 'null'
                                          ? iconUrl
                                          : '/img/dummycoin.png'
                                  }
                                  style={{ height: '24px', marginRight: '16px' }}
                              />
                          </Link>,
                          <Link
                              to={`/wallets/${currency}/detail`}
                              className="d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">{name}</h3>
                              <h4 className="p-0 m-0 text-two">{currency?.toUpperCase()}</h4>
                          </Link>,
                          <Link
                              to={`/wallets/${currency}/detail`}
                              className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Total Balance</h3>
                              <h4 className="p-0 m-0 text-two">
                                  <Decimal key={index} fixed={fixed} thousSep=",">
                                      {spotBalance ? spotBalance.toString() : '0'}
                                  </Decimal>
                              </h4>
                          </Link>,
                          <Link
                              to={`/wallets/${currency}/detail`}
                              className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Estimated Value</h3>
                              <h4 className="p-0 m-0 text-two">{formatWithSeparators(estimatedValue, ',')}</h4>
                          </Link>,
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
            setNonZeroSelected(!nonZeroSelected);
            event.preventDefault();
        },
        [nonZeroSelected, setNonZeroSelected]
    );

    // const handleClickWithdraw = React.useCallback(() => {
    //     if (!user.otp) {
    //         setShowModalLocked(!showModalLocked);
    //     } else if (user.labels[0].key === 'document' && user.labels[0].value === 'verified') {
    //         console.log('kyc');
    //     } else {
    //         setShowModal(true);
    //     }
    // }, []);

    // const handleClickWithdraw = React.useCallback(() => {
    //     user.otp ? setShowModal(true) : setShowModalLocked(!showModalLocked);
    // }, []);

    const handleClickWithdraw = React.useCallback(() => {
        if (user.level < 3) {
            setShowModalLocked(true);
        } else {
            setShowModal(true);
        }
    }, []);

    return (
        <React.Fragment>
            <div className="mobile-container wallet-list no-header dark-bg-main position-relative">
                <h1 className="w-100 heading-one mb-24 mt-0 white-text">Overview</h1>
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

                    <div className="action-container w-100 d-flex flex-row justify-content-center align-items-center">
                        <button
                            onClick={() => {
                                setShowModal(!showModal);
                                setModalType('deposit');
                            }}
                            className="btn btn-primary btn-sm d-flex">
                            <DepositIcon className={'mr-2'} />
                            {formatMessage({ id: 'page.mobile.wallets.deposit' })}
                        </button>
                        <button
                            onClick={() => {
                                handleClickWithdraw();
                                setModalType('withdraw');
                            }}
                            className="btn btn-primary btn-sm d-flex"
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
                            className="btn btn-primary btn-sm d-flex">
                            <TransferIcon className={'mr-2'} />
                            {formatMessage({ id: 'page.mobile.wallets.transfer' })}
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 mt-3 mb-16">
                    <div onClick={handleToggleCheckbox} className="form-group form-check mb-0">
                        {nonZeroSelected === true ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="form-check-input"
                                fill="#00a7ff"
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        ) : (
                            <svg
                                width="16px"
                                height="16px"
                                fill="#ffffff"
                                className="form-check-input rounded-lg"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                                </g>
                            </svg>
                        )}
                        <label className="form-check-label text-sm font-semibold white-text" htmlFor="nonZeroSelected">
                            {formatMessage({ id: 'page.mobile.wallets.hideSmallBalance' })}
                        </label>
                    </div>
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
                {!filteredWallets.length && !filterValue ? (
                    <div className="w-100 h-100 grey-text-accent">
                        <div className="bg-transparent d-flex justify-content-center align-items-center">
                            <span
                                className="spinner-border spinner-border-sm mr-2"
                                role="status"
                                aria-hidden="true"></span>
                            <span>Loading Data...</span>
                        </div>
                    </div>
                ) : (
                    <Table data={renderTableData(wallets)} />
                )}
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
