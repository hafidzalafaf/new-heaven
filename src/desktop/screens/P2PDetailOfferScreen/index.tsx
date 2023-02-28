import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P, BannerP2P, OrderP2PTable } from 'src/desktop/containers';
import { OfferP2PTable } from 'src/desktop/containers/OfferP2PTable';

export const P2PDetailOfferScreen: React.FC = () => {
    useDocumentTitle('P2P || Detail Offer');

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
                    <OfferP2PTable />
                </div>
            </div>
        </React.Fragment>
    );
};
