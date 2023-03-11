import * as React from 'react';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { Tabs, Tab } from 'react-bootstrap';

export interface P2PTransferAssetMobileProps {
    handleShowTransfer: () => void;
    wallet: any;
}

export const P2PTransferAssetMobile: React.FunctionComponent<P2PTransferAssetMobileProps> = (props) => {
    const { handleShowTransfer, wallet } = props;

    console.log(wallet);

    return (
        <div className="w-100 p2p-com-notif-mobile">
            <div className="position-fixed nav-notif-info-top dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                    <div className="d-flex align-items-center gap-8">
                        <p className="m-0 p-0 text-md font-extrabold grey-text-accent">{wallet?.name}</p>

                        <span onClick={handleShowTransfer} className="notif-close position-absolute cursor-pointer">
                            <ArrowLeft className={''} />
                        </span>
                    </div>
                </div>
                AAAAA
            </div>
        </div>
    );
};
