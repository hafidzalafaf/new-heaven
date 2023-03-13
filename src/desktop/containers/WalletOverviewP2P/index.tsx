import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Select from 'react-select';
import { CustomStylesSelect } from '../../../desktop/components';
import { PercentageTransferP2P } from '../../components';
import { Decimal, Loading, Table } from 'src/components';
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
    selectWalletsLoading,
    createP2PTransfersFetch,
    selectP2PTransfersCreateSuccess,
    selectP2PTransfersCreateLoading,
} from 'src/modules';
import { WalletsHeader, Modal, NoData } from '../../components';
import { CircleCloseDangerLargeIcon } from '../../../assets/images/CircleCloseIcon';
import { SpotWalletIcon } from 'src/assets/images/SpotWalletIcon';
import { P2PWalletIcon } from 'src/assets/images/P2PWalletIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';

interface Props {
    isP2PEnabled?: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
    status?: string;
    // network?: any;
    last: any;
    marketId: string;
    p2p_balance?: string;
    p2p_locked?: string;
    currencyItem: any;
}

const WalletOverviewP2P: FC<Props> = (props: Props): ReactElement => {
    const dispatch = useDispatch();

    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showModalP2PTransfer, setShowModalP2PTransfer] = React.useState<boolean>(false);
    const [selectedCurrency, setSelectedCurrency] = React.useState<any>();
    //const [currenciesObj, setCurrencyObj] = React.useState<CoinDetailProps>({} as CoinDetailProps);

    // State Transfer
    const [amount, setAmount] = React.useState('');
    const [currency, setCurrency] = React.useState('');
    const [base_wallet, setBaseWallet] = React.useState('p2p');
    const [target_wallet, setTargetWallet] = React.useState('spot');
    const [percentageValue, setPercentage] = React.useState(0);
    const [isSwitch, setIsSwitch] = React.useState(false);
    const [otp, setOtp] = React.useState('');

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
    const transferSuccess = useSelector(selectP2PTransfersCreateSuccess);
    const transferLoading = useSelector(selectP2PTransfersCreateLoading);

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
                const currencyItem = currencies.find((item) => item.id == cur.id);

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
                    currencyItem: currencyItem ? currencyItem : null,
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);

            setFilteredWallets(extendedWalletsFilter);
            setMergedWallets(extendedWalletsFilter);
        }
    }, [wallets, p2pWallets, currencies, isP2PEnabled, markets, tickers, transferSuccess]);

    React.useEffect(() => {
        if (transferSuccess) {
            setShowModalP2PTransfer(false);
            setAmount('');
            setCurrency('');
            setBaseWallet('p2p');
            setTargetWallet('spot');
        }
    }, [transferSuccess]);

    React.useEffect(() => {
        setLoading(true);
        if (walletsLoading) {
            setLoading(false);
        }
    }, [wallets]);

    const headerTitles = useCallback(
        () => ['Assets', 'P2P Total Balance', 'P2P Estimated Value', 'P2P Balance', 'P2P Locked Balance', ''],
        [isP2PEnabled]
    );

    const handleTransferP2P = (curr) => {
        setSelectedCurrency(curr);
        setShowModalP2PTransfer((prevState) => !prevState);
    };

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
                  const {
                      currency,
                      iconUrl,
                      name,
                      fixed,
                      spotBalance,
                      spotLocked,
                      p2pBalance,
                      p2pLocked,
                      p2p_locked,
                      p2p_balance,
                  } = item;
                  const totalBalance = Number(p2p_balance) + Number(p2p_locked);
                  const estimatedValue =
                      item?.currencyItem?.price !== null ? item?.currencyItem?.price * totalBalance : '0';

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
                      <Decimal key={index} fixed={fixed}>
                          {totalBalance ? totalBalance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {estimatedValue ? estimatedValue.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {p2p_balance ? p2p_balance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {p2p_locked ? p2p_locked.toString() : '0'}
                      </Decimal>,
                      <div key={index} className="ml-auto">
                          <Link to={`/p2p`} className={`bg-transparent border-none mr-24 blue-text`}>
                              P2P Trade
                          </Link>
                          <button
                              onClick={() => {
                                  if (!user?.otp) {
                                      setShowModalLocked(!showModalLocked);
                                  } else {
                                      handleTransferP2P(filteredList[index]);
                                  }
                              }}
                              className={`bg-transparent border-none warning-text`}>
                              Transfer
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

    const optionsAssets = [
        {
            value: 'spot',
            label: (
                <div className="w-full d-flex align-items-center">
                    <div className="mr-2">
                        <SpotWalletIcon />
                    </div>
                    <div>
                        <p className="m-0 text-sm grey-text-accent">Spot Wallet</p>
                    </div>
                </div>
            ),
        },
        {
            value: 'p2p',
            label: (
                <div className="w-full d-flex align-items-center">
                    <div className="mr-2">
                        <P2PWalletIcon />
                    </div>
                    <div>
                        <p className="m-0 text-sm grey-text-accent">P2P Wallet</p>
                    </div>
                </div>
            ),
        },
    ];

    const switchAddress = () => {
        setBaseWallet(target_wallet);
        setTargetWallet(base_wallet);
        setIsSwitch((prevState) => !prevState);
    };

    const handleChangeAmount = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmount(value);
        setPercentage(0);
    };

    const handleTransferAsset = () => {
        const payload = {
            base_wallet,
            target_wallet,
            currency: selectedCurrency?.currency,
            amount: +amount,
            otp,
        };

        dispatch(createP2PTransfersFetch(payload));
    };

    React.useEffect(() => {
        if (percentageValue != 0) {
            const p2pAmount = (+selectedCurrency?.p2p_balance * percentageValue) / 100;
            const spotAmount = (+selectedCurrency?.spotBalance * percentageValue) / 100;
            setAmount(base_wallet === 'p2p' ? p2pAmount.toString() : spotAmount.toString());
        }
    }, [percentageValue, switchAddress]);

    const disabledButton = () => {
        if (transferLoading || otp?.length < 6) {
            return true;
        }

        if (base_wallet == 'p2p') {
            if (+amount < 0 || +amount > +selectedCurrency?.p2p_balance) {
                return true;
            }
        }

        if (base_wallet == 'spot') {
            if (+amount < 0 || +amount > +selectedCurrency?.balance) {
                return true;
            }
        }

        if (base_wallet === target_wallet) {
            return true;
        }
    };

    const renderModalTransfer = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-end mb-8">
                    <span
                        onClick={() => {
                            setShowModalP2PTransfer(!showModalP2PTransfer);
                            setAmount('');
                            setOtp('');
                        }}
                        className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <h5 className="white-text mb-16">Transfer Assets</h5>

                <div className="modal-body-transfer-p2p">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-group w-100 mr-3">
                            <label className="white-text">From</label>
                            <Select
                                isSearchable={false}
                                styles={CustomStylesSelect}
                                value={optionsAssets.filter(function (option) {
                                    return option.value === base_wallet;
                                })}
                                onChange={(e) => setBaseWallet(e.value)}
                                options={optionsAssets}
                            />
                        </div>
                        <div className="mr-3 cursor-pointer" onClick={switchAddress}>
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
                            <label className="white-text">To</label>
                            <Select
                                isSearchable={false}
                                styles={CustomStylesSelect}
                                value={optionsAssets.filter(function (option) {
                                    return option.value === target_wallet;
                                })}
                                onChange={(e) => setTargetWallet(e.value)}
                                options={optionsAssets}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="w-full d-flex align-items-center coin-selected">
                            <img src={selectedCurrency?.iconUrl} alt="icon" className="mr-12 small-coin-icon" />
                            <div>
                                <p className="m-0 text-sm grey-text-accent">
                                    {selectedCurrency?.currency.toUpperCase()}
                                </p>
                                <p className="m-0 text-xs grey-text-accent">{selectedCurrency?.name}</p>
                            </div>
                            {/* <h4 className="white-text">{selectedCurrency}</h4> */}
                        </div>
                    </div>
                    <div>
                        <div className="form-group">
                            <label className="white-text">Amount</label>
                            <input
                                value={amount}
                                onChange={(e) => handleChangeAmount(e.target.value)}
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
                            handleSelectPercentage={(e) => {
                                setPercentage(e);
                                if (e == 0) {
                                    setAmount('0');
                                }
                            }}
                            label0="0"
                            label25="25"
                            label50="50"
                            label75="75"
                            label100="100"
                        />
                    </div>
                    <div className="mt-5 mb-24">
                        <div className="d-flex justify-content-between mb-2">
                            <div>
                                <h6 className="text-light">Available Amount :</h6>
                            </div>
                            <div>
                                <h6 className="green-text">
                                    {base_wallet == 'p2p'
                                        ? selectedCurrency?.p2p_balance
                                        : selectedCurrency?.spotBalance}{' '}
                                    {selectedCurrency?.currency?.toUpperCase()}
                                </h6>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h6 className="text-light">Total Transfer : </h6>
                            </div>
                            <div>
                                <h6 className="green-text">
                                    {amount ? amount : '0'} {selectedCurrency?.currency?.toUpperCase()}
                                </h6>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="white-text">2FA Code</label>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="number"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Input 2FA"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    disabled={disabledButton()}
                    onClick={handleTransferAsset}
                    className="btn btn-block btn-primary">
                    Transfer Assets
                </button>
            </React.Fragment>
        );
    };

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

            {retrieveData().length < 1 && <NoData text="No Data Yet" />}

            {showModalLocked && (
                <Modal show={showModalLocked} header={renderHeaderModalLocked()} content={renderContentModalLocked()} />
            )}

            <Modal show={showModalP2PTransfer} content={renderModalTransfer()} className="modal-p2p-transfer" />
        </React.Fragment>
    );
};

export { WalletOverviewP2P };
