import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P } from 'src/desktop/containers';

export const P2PAddPayment: React.FC = () => {
    useDocumentTitle('P2P || Profile');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-profile">
                <div className="header-container">
                    <HeaderP2P />
                </div>
            </div>
        </React.Fragment>
    );
};
