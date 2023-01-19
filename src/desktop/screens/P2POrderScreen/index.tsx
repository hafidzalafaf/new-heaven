import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P, BannerP2P, OrderP2PTable } from 'src/desktop/containers';

export const P2POrderScreen: React.FC = () => {
    useDocumentTitle('P2P || Order');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p">
                <div>
                    <BannerP2P />
                </div>

                <div className="com-content-order-p2p-container">
                    <div className="mb-24">
                        <HeaderP2P />
                    </div>
                    <OrderP2PTable />
                </div>
            </div>
        </React.Fragment>
    );
};
