import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDocumentTitle, useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules';
import { Link } from 'react-router-dom';
import { EstimatedValue, WalletOverviewP2P } from '../../../desktop/containers';
import { HeaderP2P } from '../../../desktop/containers';

export const P2PWalletScreen: React.FC = () => {
    useDocumentTitle('P2P || Wallet');
    useWalletsFetch();

    const wallets = useSelector(selectWallets) || [];

    return (
        <React.Fragment>
            <div className="wallet-screen content-wrapper dark-bg-main">
                <div className="d-flex justify-content-between align-items-center px-24">
                    <h1 className="text-xl white-text pt-4 pb-4">P2P Wallet Overview</h1>

                    <div>
                        <Link
                            to={`/p2p/order`}
                            type="button"
                            className="btn-secondary radius-sm text-sm white-text font-bold">
                            Order History
                        </Link>
                    </div>
                </div>
                <div className="px-24 dark-bg-accent">
                    <HeaderP2P />
                    <EstimatedValue wallets={wallets} type="p2p" />
                    <WalletOverviewP2P />
                </div>
            </div>
        </React.Fragment>
    );
};
