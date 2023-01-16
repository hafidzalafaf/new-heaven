import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P, BannerP2P, TableListP2P } from '../../containers';

export const P2PScreen: React.FC = () => {
    useDocumentTitle('P2P');

    return (
        <React.Fragment>
            <div className="pg-screen-p2p">
                <div className="">
                    <HeaderP2P />
                </div>

                <div>
                    <BannerP2P />
                </div>

                <div>
                    <TableListP2P />
                </div>
            </div>
        </React.Fragment>
    );
};
