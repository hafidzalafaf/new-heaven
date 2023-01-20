import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P } from 'src/desktop/containers';

export const P2PAddPaymentScreen: React.FC = () => {
    useDocumentTitle('P2P || Add Payment');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-add-payment">
                <div className="container">
                    <HeaderP2P />
                </div>
            </div>
        </React.Fragment>
    );
};
