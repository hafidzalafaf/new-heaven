import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { EstimatedValue, WalletsOverview } from '../../containers';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectCurrencies, selectWallets } from 'src/modules';
import { useHistory } from 'react-router-dom';

export const WalletsScreen: FC = (): ReactElement => {
    const history = useHistory();
    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);

    useDocumentTitle('Wallets');
    useWalletsFetch();

    return (
        <React.Fragment>
            <div className="wallet-screen content-wrapper dark-bg-main">
                <div className="d-flex justify-content-between align-items-center mb-24 px-24">
                    <h1 className="text-xl white-text pt-4 pb-4">Wallet Overview</h1>

                    <div>
                        <button
                            onClick={() => {
                                localStorage.setItem('sidebar', 'Trade History');
                                history.push('/trade-history');
                            }}
                            type="button"
                            className="btn-secondary mr-24 radius-sm text-sm white-text font-bold">
                            Trade History
                        </button>
                        <button
                            onClick={() => {
                                localStorage.setItem('sidebar', 'Transaction History');
                                history.push('/history-transaction');
                            }}
                            type="button"
                            className="btn-secondary radius-sm text-sm white-text font-bold">
                            Transaction History
                        </button>
                    </div>
                </div>
                <div className="px-24">
                    <EstimatedValue wallets={wallets} type="spot" />
                    <WalletsOverview />
                </div>
            </div>
        </React.Fragment>
    );
};
