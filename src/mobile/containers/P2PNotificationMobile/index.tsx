import * as React from 'react';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { Tabs, Tab } from 'react-bootstrap';

export interface P2PNotificationMobileProps {
    handleShowNotif: () => void;
}

export const P2PNotificationMobile: React.FunctionComponent<P2PNotificationMobileProps> = (props) => {
    const { handleShowNotif } = props;

    return (
        <div className="w-100 p2p-com-notif-mobile">
            <div className="position-fixed nav-notif-info-top dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                    <div className="d-flex align-items-center gap-8">
                        <p className="m-0 p-0 text-md font-extrabold grey-text-accent">Notification</p>

                        <span onClick={handleShowNotif} className="notif-close position-absolute cursor-pointer">
                            <ArrowLeft className={''} />
                        </span>
                    </div>
                </div>

                <Tabs defaultActiveKey="order" id="fill-tab-example" className="mb-3" fill>
                    <Tab eventKey="order" title="Order">
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="offer" title="Offer">
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                        <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                            <div className="d-flex align-items-start justify-content-start gap-8">
                                <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                <div>
                                    <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">Buy USDT</p>
                                    <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                </div>
                            </div>

                            <div>
                                <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};
