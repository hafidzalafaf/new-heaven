import React from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { useSelector } from 'react-redux';
import {
    selectWallets,
    Currency,
    selectCurrencies,
    selectAbilities,
    selectMarkets,
    selectMarketTickers,
    Wallet,
    User,
    selectUserInfo,
    selectWalletsLoading,
    selectP2PWallets,
} from 'src/modules';
import { Table } from '../../../components';
import { FilterInput } from 'src/desktop/components';
import { CircleCloseModalNetworkIcon } from '../../../assets/images/CircleCloseIcon';
import { InfoModalNetworkIcon } from '../../../assets/images/InfoIcon';

interface CoinTransferProps {
    type: string;
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

export const CoinTransfer: React.FC<CoinTransferProps> = (props) => {
    const wallets = useSelector(selectWallets);
    const walletsLoading = useSelector(selectWalletsLoading);
    const p2pWallets = useSelector(selectP2PWallets);
    const abilities = useSelector(selectAbilities);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const user: User = useSelector(selectUserInfo);

    const history = useHistory();
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [showModalDeposit, setShowModalDeposit] = React.useState(false);
    const [modalCurrency, setModalCurrency] = React.useState('');

    const { currency = '' } = useParams<{ currency?: string }>();
    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency = currencies.find((item) => item.id === modalCurrency);
    const enableDesposit = currencyItem?.networks?.filter((item) => item.deposit_enabled == true);

    useWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    React.useEffect(() => {
        if (wallets.length && (props.isP2PEnabled ? p2pWallets.length : true) && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map((cur) => {
                if (cur.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
                    return null;
                }

                const spotWallet = wallets.find((i) => i.currency === cur.id);
                const p2pWallet = props.isP2PEnabled ? p2pWallets.find((i) => i.currency === cur.id) : null;
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
    }, [wallets, p2pWallets, currencies, props.isP2PEnabled, markets, tickers]);

    const handleClickTransfer = React.useCallback(
        (currency) => {
            history.push(`/wallets/${currency}/transfer`);
        },
        [history]
    );

    const handleClickWithdraw = React.useCallback(
        (currency) => {
            history.push(`/wallets/${currency}/withdraw`);
        },
        [history]
    );

    const handleClickDeposit = React.useCallback((currency: string) => {
        setShowModalDeposit(true);
        setModalCurrency(currency);
    }, []);

    const searchFilter = (row, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.currency?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: ExtendedWallet[]) => {
        setFilteredWallets(result);
    };

    const handleSelectNetwork = (blockchain_key, protocol) => {
        history.push(`/wallets/${modalCurrency}/deposit`, { blockchain_key: blockchain_key, protocol: protocol });
    };

    const renderWallet = React.useCallback(
        (data) => {
            const filteredList = data.filter(
                (i) =>
                    !filterValue ||
                    i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
                    i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase())
            );

            return !filteredList.length
                ? [[]]
                : filteredList.map((item, index) => {
                      const disableDeposit = item?.network?.filter((net) => net.deposit_enabled == true);
                      const disableWithdrawal = item?.network?.filter((net) => net.withdrawal_enabled == true);

                      return [
                          <button
                              onClick={() => {
                                  if (props.type == 'deposit') {
                                      handleClickDeposit(item?.currency);
                                  } else if (props.type == 'withdraw') {
                                      handleClickWithdraw(item?.currency);
                                  } else {
                                      handleClickTransfer(item?.currency);
                                  }
                              }}
                              type="button"
                              disabled={
                                  props.type == 'deposit' && disableDeposit?.length <= 0
                                      ? true
                                      : props.type == 'withdraw' && disableWithdrawal?.length <= 0
                                      ? true
                                      : false
                              }
                              key={index}
                              className="d-flex justify-content-between align-items-center w-100 cursor-pointer btn-transparent">
                              <div>
                                  <div className="d-flex justify-content-start align-items-center div-coin">
                                      <img
                                          src={
                                              item?.iconUrl !== '-' &&
                                              item?.iconUrl !== null &&
                                              item?.iconUrl !== 'null'
                                                  ? item?.iconUrl
                                                  : '/img/dummycoin.png'
                                          }
                                          alt="logo"
                                          className="rounded-full icon-coin-transfer mr-3"
                                      />
                                      <div className="d-flex flex-column justify-content-start align-items-start white-text">
                                          <h3 className="p-0 m-0 text-one">{item.name}</h3>
                                          <h4 className="p-0 m-0 text-two">{item.currency.toUpperCase()}</h4>
                                      </div>
                                  </div>
                              </div>
                          </button>,
                      ];
                  });
        },
        [filteredWallets]
    );

    const getWalletData = (data) => {
        return data.map((item, i) => [
            <div
                onClick={() => handleClickTransfer(item.currency)}
                key={i}
                className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
                <div>
                    <div className="d-flex justify-content-start align-items-center div-coin">
                        <img src={item.iconUrl} alt="logo" className="rounded-full icon-coin-transfer mr-3" />
                        <div className="d-flex flex-column justify-content-start align-items-start">
                            <h3 className="p-0 m-0 text-one">{item.name}</h3>
                            <h4 className="p-0 m-0 text-two">{item.currency.toUpperCase()}</h4>
                        </div>
                    </div>
                </div>
            </div>,
        ]);
    };

    return (
        <React.Fragment>
            <div className="form-search">
                <div className="d-flex align-items-center justify-space-between">
                    <FilterInput
                        data={wallets}
                        onFilter={handleFilter}
                        filter={searchFilter}
                        placeholder={''}
                        className="search-wallet placeholder-search"
                    />
                </div>
                <Table data={renderWallet(filteredWallets)} />
            </div>
            <div className={`position-relative dark-bg-main`}>
                <div className={`modal-deposit-wallet ${showModalDeposit ? ' show ' : ''}`}>
                    <div className="modal-deposit-wallet__content fixed-bottom off-canvas-content-container overflow-auto">
                        <div className="d-flex justify-content-between align-items-center mb-12">
                            <h3 className="p-0 m-0 text-ms grey-text-accent">Select Network</h3>
                            <span onClick={() => setShowModalDeposit(false)} className="cursor-pointer">
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

                        {!enableDesposit || !enableDesposit[0] ? (
                            <div className="d-flex align-items-center">
                                <p className="m-0 p-0 grey-text text-xxs italic">No network enabled</p>
                            </div>
                        ) : (
                            enableDesposit?.map((item, i) => (
                                <div
                                    onClick={() =>
                                        handleSelectNetwork(item && item.blockchain_key, item && item.protocol)
                                    }
                                    key={i}
                                    className="cursor-pointer mb-8">
                                    <h3 className="p-0 m-0 text-ms grey-text-accent">{item && item.protocol}</h3>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
