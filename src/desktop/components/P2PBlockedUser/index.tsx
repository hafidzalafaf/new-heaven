import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    p2pProfileListBlockMerchant,
    selectP2PProfileListBlockMerchant,
    p2pProfileBlockMerchant,
    selectP2PProfileBlockMerchantLoading,
    selectP2PProfileBlockMerchantSuccess,
} from 'src/modules';
import { NoDataIcon } from '../../../assets/images/P2PIcon';
import { Modal } from '../Modal';

export const P2PBlockedUser: React.FC = () => {
    const dispatch = useDispatch();
    const blocks = useSelector(selectP2PProfileListBlockMerchant);

    const [showModalUnblock, setShowModalUnblock] = React.useState(false);

    React.useEffect(() => {
        dispatch(p2pProfileListBlockMerchant());
    }, [dispatch]);

    const handleUnblocklockMerchant = () => {
        const payload = {
            uid: '',
            state: 'unblocked',
            reason: 'aku labil kak',
        };

        dispatch(p2pProfileBlockMerchant(payload));
    };

    const renderModalBlockAlert = () => {
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center mb-24">
                    <img src="/img/modal-alert.png" alt="alert" width={116} height={116} />
                </div>
                <p className="m-0 p-0 mb-24 grey-text text-sm text-center">
                    Are you sure want to unblock this user? You will be able to trade with the user after unblocking.
                </p>

                <button
                    onClick={handleUnblocklockMerchant}
                    type="button"
                    className="btn-primary w-100 white-text text-ms mb-16">
                    Unblock
                </button>
                <button
                    onClick={() => setShowModalUnblock(!showModalUnblock)}
                    type="button"
                    className="btn-success btn-outline w-100 contrast-text text-ms">
                    Cancel
                </button>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="com-p2p-blocked-user">
                {!blocks ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No Blocked User</p>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-16">
                            <p className="m-0 p-0 text-ms font-bold grey-text">Merchant</p>
                            <p className="m-0 p-0 text-ms font-bold grey-text">Reason</p>
                            <p className="m-0 p-0 text-ms font-bold grey-text">Action</p>
                        </div>

                        {blocks?.map((block, i) => (
                            <div key={i} className="d-flex justify-content-between align-items-center py-16 data-row">
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center gap-16">
                                        <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                            {block?.state?.slice(0, 1).toUpperCase()}
                                        </div>
                                        <p className="m-0 p-0 grey-text-accent text-sm">{block.state}</p>
                                    </div>
                                </div>
                                <p className="m-0 p-0 grey-text text-xxs">{block?.reason}</p>
                                <p
                                    onClick={() => setShowModalUnblock(!showModalUnblock)}
                                    className="reason-block m-0 p-0 text-sm gradient-text cursor-pointer">
                                    Unblock
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <Modal show={showModalUnblock} content={renderModalBlockAlert()} />
            </div>
        </React.Fragment>
    );
};
