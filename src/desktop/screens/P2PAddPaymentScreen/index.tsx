import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P } from 'src/desktop/containers';

export const P2PAddPaymentScreen: React.FC = () => {
    useDocumentTitle('P2P || Add Payment');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-add-payment">
                <div className="container mb-16">
                    <HeaderP2P />
                </div>

                <div className="container">
                    <form className="form-container">
                        <div className="tips-add-payment d-flex align-items-center p-16 gap-8"></div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};
