import * as React from 'react';
import { NoDataIcon } from '../../../assets/images/P2PIcon';

export const P2PBlockedUser: React.FC = () => {
    const data = [
        { id: 1, name: 'Rimonda Exchanger' },
        { id: 2, name: 'Rimonda Exchanger' },
    ];
    return (
        <React.Fragment>
            <div className="com-p2p-blocked-user">
                {!data[0] ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No Blocked User</p>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-16">
                            <p className="m-0 p-0 text-ms font-bold grey-text">Merchant</p>

                            <div className="d-flex justify-content-between align-items-center gap-8">
                                <p className="m-0 p-0 text-ms font-bold grey-text">Reason</p>
                                <p className="m-0 p-0 text-ms font-bold grey-text">Action</p>
                            </div>
                        </div>

                        {data.map((user, i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center py-16 data-row">
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center gap-16">
                                        <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                            {user.name?.slice(0, 1).toUpperCase()}
                                        </div>
                                        <p className="m-0 p-0 grey-text-accent text-sm">{user.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="reason-block m-0 p-0 text-sm gradient-text cursor-pointer">Unblock</p>
                                    <p className="m-0 p-0 grey-text text-xxs">Harassment</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
