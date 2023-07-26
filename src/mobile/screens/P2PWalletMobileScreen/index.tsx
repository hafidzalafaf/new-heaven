import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAbilities,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    Wallet,
    User,
    selectUserInfo,
    memberLevelsFetch,
    selectMemberLevels,
    selectP2PWallets,
} from '../../../modules';
import { Form, Row, Col } from 'react-bootstrap';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch, useDocumentTitle } from '../../../hooks';
import { Table, Decimal } from '../../../components';
import { FilterInput } from '../../../desktop/components';
import { VALUATION_PRIMARY_CURRENCY } from '../../../constants';
import { Modal } from 'react-bootstrap';
import { Modal as ModalComponent } from '../../../desktop/components';
import { ArrowRight } from '../../assets/Arrow';
import { GearIcon } from 'src/mobile/assets/Gear';
import { CircleCloseDangerLargeIcon } from 'src/assets/images/CircleCloseIcon';
import { DocumentMobileIcon } from 'src/mobile/assets/DocumentMobileIcon';

interface Props {
    isP2PEnabled?: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    lockedBalance?: string;
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

const P2PWalletMobileScreen: React.FC<Props> = (props: Props) => {
    useWalletsFetch();
    useMarketsFetch();
    useMarketsTickersFetch();
    useDocumentTitle('Wallets');

    const { isP2PEnabled } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    React.useEffect(() => {
        dispatch(memberLevelsFetch());
    }, [dispatch]);

    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);
    const [showModal2FA, setShowModal2FA] = React.useState<boolean>(false);

    const translate = React.useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [
        formatMessage,
    ]);

    const wallets = useSelector(selectWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const user: User = useSelector(selectUserInfo);
    const memberLevel = useSelector(selectMemberLevels);
    const p2pWallets = useSelector(selectP2PWallets);

    React.useEffect(() => {
        if (wallets.length && (isP2PEnabled ? p2pWallets.length : true) && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map((cur) => {
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
                      const { currency, iconUrl, name, fixed, p2p_balance, p2p_locked } = item;
                      const totalBalance = Number(p2p_balance) + Number(p2p_locked);
                      const estimatedValue =
                          item?.currencyItem?.price !== null ? item?.currencyItem?.price * totalBalance : '0';
                      return [
                          <Link
                              to={`/p2p/wallets/${currency}/detail`}
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
                              to={`/p2p/wallets/${currency}/detail`}
                              className="d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">{name}</h3>
                              <h4 className="p-0 m-0 text-two">{currency?.toUpperCase()}</h4>
                          </Link>,
                          <Link
                              to={`/p2p/wallets/${currency}/detail`}
                              className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Total Balance</h3>
                              <h4 className="p-0 m-0 text-two">
                                  <Decimal key={index} fixed={fixed}>
                                      {p2p_balance ? p2p_balance.toString() : '0'}
                                  </Decimal>
                              </h4>
                          </Link>,
                          <Link
                              to={`/p2p/wallets/${currency}/detail`}
                              className="td-available-order d-flex flex-column justify-content-start align-items-start">
                              <h3 className="p-0 m-0 text-one">Estimated Value</h3>
                              <h4 className="p-0 m-0 text-two">
                                  <Decimal key={index} fixed={fixed}>
                                      {estimatedValue ? estimatedValue.toString() : '0'}
                                  </Decimal>
                              </h4>
                          </Link>,
                          <Link to={`/p2p/wallets/${currency}/detail`}>
                              <ArrowRight className={''} />
                          </Link>,
                      ];
                  });
        },
        [filteredWallets, nonZeroSelected, abilities, currencies, markets, tickers]
    );

    const dataWallet = wallets.map((item) => ({
        ...item,
        currencyItem: currencies.find((curr) => curr.id == item.currency),
    }));

    const p2pBalance = dataWallet.map(
        (sum) => (Number(sum?.p2p_balance) + Number(sum?.p2p_locked)) * Number(sum?.currencyItem?.price)
    );

    const totalEstimateP2P = p2pBalance?.reduce((accumulator, current) => {
        return accumulator + current;
    }, 0);

    const searchFilter = (row: Wallet, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.currency?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredWallets(result as ExtendedWallet[]);
    };

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            setNonZeroSelected(!nonZeroSelected);
            event.preventDefault();
        },
        [nonZeroSelected, setNonZeroSelected]
    );

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
                <h1 className="white-text text-lg mb-24 text-center ">Transfer Asset Locked</h1>
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
        <React.Fragment>
            <div className="mobile-container wallet-list no-header dark-bg-main position-relative">
                <div className="d-flex justify-content-between align-items-center gap-16 mb-24">
                    <div className="d-flex align-items-center gap-16">
                        <Link to={`/wallets`} className="btn-wallet">
                            <span className="grey-text text-sm font-bold">Spot Wallet</span>
                        </Link>
                        <Link to={`/p2p/wallets`} className="btn-wallet active">
                            <span className="gradient-text text-sm font-bold">P2P Wallet</span>
                        </Link>
                    </div>

                    <Link to={`/history-transaction`}>
                        <DocumentMobileIcon />
                    </Link>
                </div>

                <h1 className="w-100 heading-one mb-24 mt-0 white-text">P2P Wallet</h1>
                <div className="estimate-container d-flex flex-column w-100">
                    <div className="total-container w-50 d-flex flex-column">
                        <h3 className="text-md grey-text font-bold  mb-0">
                            {formatMessage({ id: 'page.mobile.wallets.estimatedBalance' })}
                        </h3>
                        <div className="total-value d-flex justify-content-between align-items-center">
                            <h4 className="text-sm grey-text-accent font-bold">
                                <Decimal fixed={2}>{totalEstimateP2P}</Decimal>{' '}
                                {VALUATION_PRIMARY_CURRENCY.toUpperCase()}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100 mt-3 mb-16">
                    <div onClick={handleToggleCheckbox} className="form-group form-check mb-0">
                        <Form as={Row} controlid="formHorizontalCheck" onClick={handleToggleCheckbox}>
                            <Col sm={{ span: 20, offset: 0 }}>
                                <Form.Check
                                    type="checkbox"
                                    custom
                                    id="nonZeroSelected"
                                    checked={nonZeroSelected}
                                    readOnly={true}
                                    label={formatMessage({ id: 'page.mobile.wallets.hideSmallBalance' })}
                                    className="text-sm font-semibold grey-text m-0 d-flex justify-content-center align-items-center"
                                />
                            </Col>
                        </Form>
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

            {showModal2FA && (
                <ModalComponent
                    show={showModal2FA}
                    header={renderHeaderModalLocked()}
                    content={renderContentModalLocked()}
                />
            )}

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
        </React.Fragment>
    );
};

export { P2PWalletMobileScreen };
