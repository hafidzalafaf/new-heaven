import React from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useWalletsFetch } from 'src/hooks';
import { useSelector } from 'react-redux';
import { selectWallets, Currency, selectCurrencies } from 'src/modules';
import { Table } from '../../../components';
import { FilterInput } from 'src/desktop/components';
import { CircleCloseModalNetworkIcon } from '../../../assets/images/CircleCloseIcon';
import { InfoModalNetworkIcon } from '../../../assets/images/InfoIcon';

interface CoinTransferProps {
    type: string;
}

export const CoinTransfer: React.FC<CoinTransferProps> = (props) => {
    const wallets = useSelector(selectWallets);
    const history = useHistory();
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState([]);
    const [showModalDeposit, setShowModalDeposit] = React.useState(false);
    const [modalCurrency, setModalCurrency] = React.useState('');

    const { currency = '' } = useParams<{ currency?: string }>();
    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency = currencies.find((item) => item.id === modalCurrency);

    useWalletsFetch();

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

    const handleFilter = (result: object[]) => {
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

            console.log(filteredList);

            return !filteredList.length
                ? [[]]
                : filteredList.map((item, index) => {
                      return [
                          <div
                              onClick={
                                  props.type == 'deposit'
                                      ? () => handleClickDeposit(item.currency)
                                      : props.type == 'withdraw'
                                      ? () => handleClickWithdraw(item.currency)
                                      : () => handleClickTransfer(item.currency)
                              }
                              key={index}
                              className="d-flex justify-content-between align-items-center w-100 cursor-pointer">
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
                                      <div className="d-flex flex-column justify-content-start align-items-start">
                                          <h3 className="p-0 m-0 text-one">{item.name}</h3>
                                          <h4 className="p-0 m-0 text-two">{item.currency.toUpperCase()}</h4>
                                      </div>
                                  </div>
                              </div>
                          </div>,
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
                <Table data={renderWallet(wallets)} />
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

                        {currencyItem &&
                            currencyItem.networks.map((item, i) => (
                                <div
                                    onClick={() =>
                                        handleSelectNetwork(item && item.blockchain_key, item && item.protocol)
                                    }
                                    key={i}
                                    className="cursor-pointer mb-8">
                                    <h3 className="p-0 m-0 text-ms grey-text-accent">{item && item.protocol}</h3>
                                    {/* <p className="m-0 p-0 grey-text text-xxs">{item && item.blockchain_key}</p> */}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
