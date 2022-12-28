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
import { SearchIcon } from '../../assets/Market';
import { Modal } from 'react-bootstrap';
import { TrashIconMobile } from '../../../mobile/assets/TrashIcon';
import CoinTransfer from '../../../mobile/components/CoinTransfer/CoinTransfer';
import { ArrowRight } from '../../assets/Arrow';

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
    const { formatMessage } = useIntl();
    const history = useHistory();
    const [fullscreen, setFullScreen] = React.useState(true);

    const [showModal, setShowModal] = React.useState(false);
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
                    <h3 className="text-md grey-text font-bold  mb-0">Estimated Total Available</h3>
                    <div className="total-value d-flex justify-content-between align-items-center">
                        <h4 className="text-sm grey-text-accent font-bold">
                            0BTC = {formatWithSeparators(estimatedValueSecondary, ',')}{' '}
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

    return (
        <React.Fragment>
            <div className="mobile-container wallet-list no-header dark-bg-main pt-4 ">
                <h1 className="w-100 heading-one mb-5">Balances</h1>
                <div className="estimate-container d-flex flex-column w-100">
                    <div className="total-container w-50 d-flex flex-column">
                        <h3 className="text-md grey-text font-bold  mb-0">Estimated Total Balance</h3>
                        <div className="total-value d-flex justify-content-between align-items-center">
                            <h4 className="text-sm grey-text-accent font-bold">
                                0BTC = {formatWithSeparators(estimatedValue, ',')}{' '}
                                {VALUATION_PRIMARY_CURRENCY.toUpperCase()}
                            </h4>
                        </div>
                    </div>

                    <div>{VALUATION_SECONDARY_CURRENCY && renderSecondaryCurrencyValuation(estimatedValue)}</div>

                    <div className="action-container w-100 d-flex flex-wrap justify-content-center align-items-center">
                        <button className="btn btn-primary btn-sm">
                            <DepositIcon className={'mr-2'} />
                            Deposit
                        </button>
                        <button className="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-withdraw">
                            <WithdrawlIcon className={'mr-2'} />
                            Withdraw
                        </button>
                        <button onClick={() => setShowModal(!showModal)} className="btn btn-primary btn-sm">
                            <TransferIcon className={'mr-2'} />
                            Transfer
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
                            Hide small balances
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

            {showModal && (
                <Modal
                    // className="modal-internal-transfer"
                    dialogClassName="modal-transfer-fullscreen"
                    onHide={() => setShowModal(!showModal)}
                    show={showModal}>
                    <section className="internal-transfer-mobile-screen">
                        <div className="container-fluid w-100 p-0 m-0 position-relative">
                            <div onClick={() => setShowModal(!showModal)} className="white-text text-right mb-3">
                                <span className="text-sm">Cancel</span>
                            </div>
                            <div className="table-mobile-wrapper">
                                <CoinTransfer />
                            </div>
                        </div>
                    </section>
                </Modal>
            )}
        </React.Fragment>
    );
};

export { WalletListMobileScreen };
