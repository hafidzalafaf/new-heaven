import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P, P2PUserInfo, P2PUserTable } from 'src/desktop/containers';

export const P2PProfileScreen: React.FC = () => {
    useDocumentTitle('P2P || Profile');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-profile">
                <div className="container">
                    <HeaderP2P />
                </div>

                <div className="container dark-bg-accent radius-lg p-16 mb-16">
                    <P2PUserInfo />
                </div>

                <div className="container dark-bg-accent radius-lg p-16">
                    <P2PUserTable />
                </div>
            </div>
        </React.Fragment>
    );
};
