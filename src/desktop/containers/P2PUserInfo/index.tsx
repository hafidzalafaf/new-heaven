import * as React from 'react';
import { VerificationIcon, ShareIcon, CheckFillIcon, LikeIcon, UnLikeIcon } from '../../../assets/images/P2PIcon';
import { CardP2PUserInfo } from '../../../desktop/components';

export const P2PUserInfo: React.FC = () => {
    const username = 'Nusatech Exchange';
    return (
        <React.Fragment>
            <div className="container-p2p-user-info">
                <div className="d-flex justify-content-start align-items-center user-info-header-container gap-8 mb-16">
                    <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                        {username.slice(0, 1).toUpperCase()}
                    </div>
                    <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">{username}</p>
                    <div className="d-flex align-items-center gap-4 mr-12">
                        <VerificationIcon />

                        <p className="m-0 p-0 grey-text text-xxs font-semibold">Verified Merchant</p>
                    </div>

                    <div className="cursor-pointer">
                        <ShareIcon />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-16 mb-16">
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Email</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">SMS</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">KYC</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Address</p>
                    </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-16 mb-16">
                    <CardP2PUserInfo title="Positive Feedback" type="feedback" percent="90%" amount="1,419" />

                    <div className="d-flex flex-column justify-content-center gap-8">
                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div className="progress" style={{ width: '80%' }} />
                            </div>
                            <LikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">1299</p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div className="progress" style={{ width: '80%' }} />
                            </div>
                            <UnLikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">120</p>
                        </div>
                    </div>

                    <CardP2PUserInfo title="All Trade" type="all trade" amount="1,419" />
                    <CardP2PUserInfo title="30d Trade" type="trade" time="713 Time(s)" />
                    <CardP2PUserInfo title="30d Completion Rate" type="completion" percent="90%" />
                    <CardP2PUserInfo title="Avg. Release Time" type="release" minutes="4.50 Minute(s)" />
                    <CardP2PUserInfo title="30d Pay Time" type="pay" minutes="4.50 Minute(s)" />
                </div>
            </div>
        </React.Fragment>
    );
};
