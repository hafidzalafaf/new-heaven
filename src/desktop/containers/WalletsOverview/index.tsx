import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Decimal, formatWithSeparators, Loading, Table } from 'src/components';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
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
    currencyItem: any;
}

const WalletsOverview: FC<Props> = (props: Props): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const { isP2PEnabled } = props;
    const history = useHistory();
    const dispatch = useDispatch();
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

        return !filteredList.length && !filterValue && !nonZeroSelected
            ? [[[''], [''], <Loading />, [''], [''], ['']]]
            : !filteredList.length && !loading
            ? [['no data found']]
            : filteredList.map((item, index) => {
                  const { currency, iconUrl, name, fixed, spotBalance, spotLocked, p2pBalance, p2pLocked } = item;

                  //   const totalBalance =
                  //       Number(spotBalance) + Number(spotLocked) + Number(p2pBalance) + Number(p2pLocked);
                  const totalBalance = Number(spotBalance) + Number(spotLocked);
                  const estimatedValue =
                      item?.currencyItem?.price !== null ? item?.currencyItem?.price * totalBalance : '0';
                  const disableDeposit = item?.network?.filter((net) => net.deposit_enabled == true);
                  const disableWithdrawal = item?.network?.filter((net) => net.withdrawal_enabled == true);

                  return [
                      <div key={index} className="d-flex align-items-center">
                          <img
                              alt={currency?.toUpperCase()}
                              src={
                                  iconUrl !== '-' && iconUrl !== null && iconUrl !== 'null'
                                      ? iconUrl
                                      : '/img/dummycoin.png'
                              }
                              style={{ height: '24px', marginRight: '16px' }}
                          />
                          <p className="text-sm white-text m-0">{currency.toUpperCase()}</p>
                          <p className="ml-1 text-sm grey-text-accent m-0">{name}</p>
                      </div>,
                      <Decimal key={index} fixed={fixed}>
                          {totalBalance ? totalBalance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {estimatedValue ? estimatedValue.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {spotBalance ? spotBalance.toString() : '0'}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed}>
                          {spotLocked ? spotLocked.toString() : '0'}
                      </Decimal>,
                      <div key={index} className="ml-auto">
                          <button
                              onClick={() => {
                                  item.network && item.network[0] && disableDeposit?.length > 0
                                      ? handleClickDeposit(currency)
                                      : null;
                              }}
                              className={`bg-transparent border-none mr-24 ${
                                  item.network && item.network[0] && disableDeposit?.length > 0
                                      ? 'blue-text'
                                      : 'grey-text'
                              }`}>
                              {item.network && item.network[0] && disableDeposit?.length > 0
                                  ? translate('page.body.wallets.overview.action.deposit')
                                  : 'Disabled'}
                          </button>
                          <button
                              onClick={() => {
                                  item.network && item.network[0] && disableWithdrawal?.length > 0
                                      ? handleClickWithdraw(currency)
                                      : null;
                              }}
                              className={`bg-transparent border-none ${
                                  item.network && item.network[0] && disableWithdrawal?.length > 0
                                      ? 'danger-text'
                                      : 'grey-text'
                              }`}>
                              {item.network && item.network[0] && disableWithdrawal?.length > 0
                                  ? translate('page.body.wallets.overview.action.withdraw')
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
        </React.Fragment>
    );
};

export { WalletsOverview };
