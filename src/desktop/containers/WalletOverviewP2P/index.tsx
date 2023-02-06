import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Select from 'react-select';
import { CustomStylesSelect } from '../../../desktop/components';

import { PercentageTransferP2P } from '../../components';
import { Decimal, formatWithSeparators, Loading, Table } from 'src/components';
import { Modal as ModalTransfer } from 'react-bootstrap';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch, useP2PWalletsFetch } from 'src/hooks';
import {
    selectAbilities,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    selectP2PWallets,
    Wallet,
    User,
    selectUserInfo,
    Currency,
    selectWalletsLoading,
} from 'src/modules';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { WalletsHeader, Modal, NoData } from '../../components';
import { CircleCloseDangerLargeIcon } from '../../../assets/images/CircleCloseIcon';

interface Props {
    isP2PEnabled?: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
    status?: string;
    network?: any;
    last: any;
    marketId: string;
}

const WalletOverviewP2P: FC<Props> = (props: Props): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showModalP2PTransfer, setShowModalP2PTransfer] = React.useState<boolean>(true);

    const { formatMessage } = useIntl();
    const { isP2PEnabled } = props;
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [
        formatMessage,
    ]);
    const wallets = useSelector(selectWallets);
    const walletsLoading = useSelector(selectWalletsLoading);
    const p2pWallets = useSelector(selectP2PWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const user: User = useSelector(selectUserInfo);

    useWalletsFetch();
    useP2PWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && (isP2PEnabled ? p2pWallets.length : true) && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map((cur) => {
                if (cur.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
                    return null;
                }

                const spotWallet = wallets.find((i) => i.currency === cur.id);
                const p2pWallet = isP2PEnabled ? p2pWallets.find((i) => i.currency === cur.id) : null;
                const market = markets.find((item) => item.base_unit == cur.id);
                const ticker = tickers[market?.id];

                return {
                    ...(spotWallet || p2pWallet),
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                    status: cur.status,
                    network: cur.networks,
                    marketId: market ? market.id : null,
                    last: ticker ? ticker.last : null,
                    p2pBalance: p2pWallet ? p2pWallet.balance : '0',
                    p2pLocked: p2pWallet ? p2pWallet.locked : '0',
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);

            setFilteredWallets(extendedWalletsFilter);
            setMergedWallets(extendedWalletsFilter);
        }
    }, [wallets, p2pWallets, currencies, isP2PEnabled, markets, tickers]);

    React.useEffect(() => {
        setLoading(true);
        if (walletsLoading) {
            setLoading(false);
        }
    }, [wallets]);

    const headerTitles = useCallback(
        () => [
            'Assets',
            translate('page.body.wallets.overview.header.total'),
            'Estimated Value',
            'Spot Balance',
            'Locked Balance',
            '',
        ],
        [isP2PEnabled]
    );

    const handleClickDeposit = useCallback(
        (currency) => {
            history.push(`/wallets/${currency}/deposit`);
        },
        [history]
    );

    const handleClickWithdraw = useCallback(
        (currency) => {
            user.otp ? history.push(`/wallets/${currency}/withdraw`) : setShowModalLocked(!showModalLocked);
        },
        [history]
    );

    const retrieveData = useCallback(() => {
        const list = nonZeroSelected
            ? filteredWallets.filter((i) => i.balance && Number(i.balance) > 0)
            : filteredWallets;
        const filteredList = list.filter(
            (i) =>
                !filterValue ||
                i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
                i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase())
        );

        return !filteredList.length && !filterValue
            ? [[[''], [''], <Loading />, [''], [''], ['']]]
            : !filteredList.length && !loading
            ? [[]]
            : filteredList.map((item, index) => {
                  const { currency, iconUrl, name, fixed, spotBalance, spotLocked, p2pBalance, p2pLocked } = item;
                  const totalBalance =
                      Number(spotBalance) + Number(spotLocked) + Number(p2pBalance) + Number(p2pLocked);
                  const estimatedValue = item?.last !== null ? item.last * totalBalance : '0';
                  //   Number(totalBalance) && currency
                  //       ? estimateUnitValue(
                  //             currency.toUpperCase(),
                  //             VALUATION_PRIMARY_CURRENCY,
                  //             +totalBalance,
                  //             currencies,
                  //             markets,
                  //             tickers
                  //         )
                  //       : Decimal.format(0, fixed);

                  return [
                      <div key={index} className="d-flex">
                          <img
                              alt={currency?.toUpperCase()}
                              src={iconUrl}
                              style={{ height: '24px', marginRight: '16px' }}
                          />
                          <p className="text-sm white-text">{currency.toUpperCase()}</p>
                          <p className="ml-1 text-sm grey-text-accent">{name}</p>
                      </div>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {totalBalance ? totalBalance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {estimatedValue ? estimatedValue.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {spotBalance ? spotBalance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {spotLocked ? spotLocked.toString() : '0'}
                      </Decimal>,
                      <div key={index} className="ml-auto">
                          <button
                              onClick={() => {
                                  item && item.network && item.network[0] ? handleClickDeposit(currency) : null;
                              }}
                              className={`bg-transparent border-none mr-24 ${
                                  item && item.network && item.network[0] ? 'blue-text' : 'grey-text'
                              }`}>
                              {item && item.network && item.network[0] ? 'P2P Trade' : 'Disabled'}
                          </button>
                          <button
                              onClick={() => {
                                  item &&
                                      item.network &&
                                      item.network[0] &&
                                      item.network[0].withdrawal_enabled &&
                                      handleClickWithdraw(currency);
                              }}
                              className={`bg-transparent border-none ${
                                  item && item.network && item.network[0] && item.network[0].withdrawal_enabled
                                      ? 'warning-text'
                                      : 'grey-text'
                              }`}>
                              {item && item.network && item.network[0] && item.network[0].withdrawal_enabled
                                  ? 'Transfer'
                                  : 'Disabled'}
                          </button>
                      </div>,
                  ];
              });
    }, [filteredWallets, nonZeroSelected, abilities, currencies, markets, tickers]);

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
                <h1 className="white-text text-lg mb-24 text-center ">Withdraw Locked</h1>
                <p className="grey-text text-ms font-extrabold mb-24 text-center">To withdraw you have to enable 2FA</p>
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

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const [fromDate, setFromDate] = React.useState(null);
    const [percentageValue, setPercentage] = React.useState(0);

    //const [toDate, setToDate] = useState(null);
    //const [isSwitch, setIsSwitch] = useState(false);

    return (
        <React.Fragment>
            <WalletsHeader
                wallets={wallets}
                nonZeroSelected={nonZeroSelected}
                setFilterValue={setFilterValue}
                setFilteredWallets={setFilteredWallets}
                handleClickCheckBox={setNonZeroSelected}
            />
            <p className="text-sm grey-text-accent mb-8">Asset balance</p>
            <Table header={headerTitles()} data={retrieveData()} />

            <button onClick={() => setShowModalP2PTransfer(!showModalP2PTransfer)}>Click me</button>

            {retrieveData().length < 1 && <NoData text="No Data Yet" />}

            {showModalLocked && (
                <Modal show={showModalLocked} header={renderHeaderModalLocked()} content={renderContentModalLocked()} />
            )}

            {showModalP2PTransfer && (
                <ModalTransfer
                    size="lg"
                    onHide={() => setShowModalP2PTransfer(!showModalP2PTransfer)}
                    show={showModalP2PTransfer}>
                    <ModalTransfer.Header className="border-0">
                        <div>
                            <h5 className="text-white">Transfer Assets</h5>
                        </div>
                    </ModalTransfer.Header>
                    <ModalTransfer.Body>
                        <div className="modal-body-transfer-p2p">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-group w-100 mr-3">
                                    <label className="text-white">From</label>
                                    <Select
                                        styles={CustomStylesSelect}
                                        value={options.filter(function (option) {
                                            return option.value === fromDate;
                                        })}
                                        onChange={(e) => setFromDate(e.value)}
                                        options={options}
                                    />
                                </div>
                                <div className="mr-3">
                                    <svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 24 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        {...props}>
                                        <path
                                            d="M.619 16.67c-.888-.886-.32-2.378.882-2.496l.154-.008h21.012a1.333 1.333 0 01.156 2.658l-.156.01H4.552l3.057 3.056a1.333 1.333 0 01-1.76 1.997l-.125-.111-5.107-5.107.002.002zM0 7.5a1.333 1.333 0 011.177-1.324l.156-.01h18.115L16.391 3.11a1.333 1.333 0 011.76-1.996l.125.11 5.107 5.107c.886.886.318 2.378-.884 2.495l-.154.008H1.333A1.333 1.333 0 010 7.5z"
                                            fill="#F2F0FF"
                                        />
                                    </svg>
                                </div>
                                <div className="form-group w-100">
                                    <label className="text-white">To</label>
                                    <Select
                                        styles={CustomStylesSelect}
                                        value={options.filter(function (option) {
                                            return option.value === fromDate;
                                        })}
                                        onChange={(e) => setFromDate(e.value)}
                                        options={options}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="form-group w-100 mr-3">
                                    <label className="text-white">Coin Assets</label>
                                    <Select
                                        styles={CustomStylesSelect}
                                        value={options.filter(function (option) {
                                            return option.value === fromDate;
                                        })}
                                        onChange={(e) => setFromDate(e.value)}
                                        options={options}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label className="text-white">Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="Input Amount"
                                    />
                                </div>
                            </div>
                            <div>
                                <PercentageTransferP2P
                                    orderPercentage={percentageValue}
                                    handleSelectPercentage={(e) => setPercentage(e)}
                                    label0="0"
                                    label25="25"
                                    label50="50"
                                    label75="75"
                                    label100="100"
                                    handleSide={() => ''}
                                    side={''}
                                    amount={''}
                                />
                            </div>
                            <div className="mt-5">
                                <div className="d-flex justify-content-between mb-2">
                                    <div>
                                        <h6 className="text-light">Available Amount :</h6>
                                    </div>
                                    <div>
                                        <h6 className="green-text">00,00</h6>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h6 className="text-light">Total Transfer : </h6>
                                    </div>
                                    <div>
                                        <h6 className="green-text">00,00</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalTransfer.Body>
                    <ModalTransfer.Footer className="border-0">
                        <button className="btn btn-block btn-primary">Transfer Assets</button>
                    </ModalTransfer.Footer>
                </ModalTransfer>
            )}
        </React.Fragment>
    );
};

export { WalletOverviewP2P };
