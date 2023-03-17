import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import moment from 'moment';

import {
    p2pProfileFetch,
    P2PProfileFetchInterface,
    selectP2PProfile,
    p2pPaymentUserFetch,
    selectP2PPaymentUser,
    p2pProfileChangeUsername,
    selectP2PProfileChangeUsernameSuccess,
    p2pMerchantDetailFetch,
    selectP2PMerchantDetail,
    selectUserLoggedIn,
    p2pProfileBlockMerchant,
    selectP2PProfileBlockMerchantLoading,
    selectP2PProfileBlockMerchantSuccess,
    selectUserInfo,
} from 'src/modules';

import { FormControl, Modal } from 'react-bootstrap';

import { CardP2PUserInfo, Modal as ModalComponent } from '../../../desktop/components';
import {
    VerificationIcon,
    ShareIcon,
    CheckFillIcon,
    LikeIcon,
    UnLikeIcon,
    RenameIcon,
} from '../../../assets/images/P2PIcon';

import { InfoWarningIcon } from 'src/assets/images/InfoIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';

export const P2PUserInfo: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { uid = '' } = useParams<{ uid?: string }>();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const merchants = useSelector(selectP2PMerchantDetail);
    const userP2PPayment = useSelector(selectP2PPaymentUser);
    const userP2P: P2PProfileFetchInterface = useSelector(selectP2PProfile);
    const blockMerchantLoading = useSelector(selectP2PProfileBlockMerchantLoading);
    const blockMerchantSuccess = useSelector(selectP2PProfileBlockMerchantSuccess);
    const changeUsernameSuccess = useSelector(selectP2PProfileChangeUsernameSuccess);
    const myProfile = useSelector(selectUserInfo);

    const [username, setUsername] = React.useState(userP2P?.trader_name);
    const [showChangeUsernameModal, setShowChangeUsernameModal] = React.useState(false);
    const [showModalBlockAlert, setShowModalBlockAlert] = React.useState(false);
    const [showModalBlockReason, setShowModalBlockReason] = React.useState(false);
    const [reason, setReason] = React.useState('');
    const [data, setData] = React.useState<any>();
    const [limit, setLimit] = React.useState(5);
    const [currentPage, setCurrentPage] = React.useState(0);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(p2pPaymentUserFetch({}));
        dispatch(p2pMerchantDetailFetch({ uid }));

        if (changeUsernameSuccess) {
            setShowChangeUsernameModal(false);
        }

        if (blockMerchantSuccess) {
            setShowModalBlockReason(false);
            history.push(`/p2p/profile/${myProfile?.uid}`, { types: 'block' });
        }
    }, [dispatch, changeUsernameSuccess, uid, blockMerchantSuccess]);

    React.useEffect(() => {
        if (uid === myProfile?.uid) {
            setData(userP2P);
        } else {
            setData(merchants);
        }
    }, [myProfile, merchants, uid, userP2P]);

    const changeUsername = () => {
        const payload = {
            username,
        };
        dispatch(p2pProfileChangeUsername(payload));
    };

    const handleBlockMerchant = () => {
        const payload = {
            uid,
            state: 'blocked',
            reason,
        };

        dispatch(p2pProfileBlockMerchant(payload));
    };

    const reasonData = [
        { name: 'Harrasment' },
        { name: 'Bad credibility' },
        { name: 'Malicious feedback' },
        { name: 'Scam suspicion' },
        { name: 'Other' },
    ];

    const convertDurationtoMilliseconds = (duration?: string) => {
        const [hours, minutes, seconds] = duration?.split(':');
        return (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)) * 1000;
    };

    const ModalChangeName = () => {
        return (
            <form onSubmit={changeUsername} className="bg-black p-10 pt-20" hidden={!showChangeUsernameModal}>
                <div className="d-flex justify-content-between">
                    <h6 className="text-white my-20">Set Nickname</h6>
                    <svg
                        onClick={() => setShowChangeUsernameModal(false)}
                        className="cursor-pointer"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="#FFFFFF"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                            fill="#606060"
                        />
                    </svg>
                </div>
                <p className="text-secondary">
                    It is recommended not to use your real name. <br /> Nickname can only be modified after KYC level 3.
                </p>
                <label className="text-white">Nickname</label>
                <div className="d-flex flex-row justify-content-between modal-input border border-white rounded-lg">
                    <FormControl
                        key="username"
                        type="text"
                        placeholder="Enter your nickname"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus={true}
                        maxLength={20}
                        className="bg-transparent border-0 border-bottom border-white text-white w-70"
                    />
                    <label className="text-char">{username?.length}/20</label>
                </div>
                <div className="text-center cursor-pointer btn-primary" onClick={changeUsername}>
                    OK
                </div>
            </form>
        );
    };

    const renderModalBlockAlert = () => {
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center mb-24">
                    <img src="/img/modal-alert.png" alt="alert" width={116} height={116} />
                </div>
                <p className="m-0 p-0 mb-24 grey-text text-sm text-center">
                    Are you sure want to block this user? You will not be able to trade with the user after blocking.
                </p>

                <button
                    onClick={() => {
                        setShowModalBlockAlert(!showModalBlockAlert);
                        setShowModalBlockReason(!showModalBlockReason);
                    }}
                    type="button"
                    className="btn-primary w-100 white-text text-ms mb-16">
                    Block
                </button>
                <button
                    onClick={() => setShowModalBlockAlert(!showModalBlockAlert)}
                    type="button"
                    className="btn-success btn-outline w-100 contrast-text text-ms">
                    Cancel
                </button>
            </div>
        );
    };

    const renderModalBlockReason = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-8">
                    <span onClick={() => setShowModalBlockReason(!showModalBlockReason)} className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <h1 className="m-0 p-0 text-center font-bold text-md grey-text-accent mb-24">Select Reason</h1>
                <div className="alert-warning-container d-flex align-items-center p-16 gap-8 radius-sm mb-24">
                    <InfoWarningIcon />
                    <p className="m-0 p-0 grey-text-accent text-xxs">
                        You will not be able to trade with the user after blocking
                    </p>
                </div>

                <ul className="style-none m-0 p-0 w-100 grey-text text-ms">
                    {reasonData.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => setReason(item?.name)}
                            className={`style-none w-100 cursor-pointer text-center py-10 mb-16 ${
                                reason == item?.name && 'dark-bg-main'
                            }`}>
                            {item?.name}
                        </li>
                    ))}
                    <button
                        onClick={handleBlockMerchant}
                        disabled={!reason || blockMerchantLoading}
                        type="button"
                        className="btn-secondary w-100">
                        Block
                    </button>
                </ul>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="container-p2p-user-info">
                <Modal show={showChangeUsernameModal}>
                    <ModalChangeName />
                </Modal>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-start align-items-center user-info-header-container gap-8 mb-16">
                        <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                            {uid === myProfile?.uid
                                ? data?.trader_name
                                    ? data?.trader_name?.slice(0, 1).toUpperCase()
                                    : data?.member?.email?.slice(0, 1).toUpperCase()
                                : data?.merchant?.username
                                ? data?.merchant?.username?.slice(0, 1).toUpperCase()
                                : data?.merchant?.member?.email?.slice(0, 1).toUpperCase()}
                        </div>
                        <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">
                            {uid === myProfile?.uid
                                ? data?.trader_name
                                    ? data?.trader_name
                                    : data?.member?.email
                                : data?.merchant?.username
                                ? data?.merchant?.username
                                : data?.merchant?.member?.email}
                        </p>
                        {uid == userP2P?.member?.uid && (
                            <RenameIcon
                                onClick={() => setShowChangeUsernameModal(!showChangeUsernameModal)}
                                className="cursor-pointer"
                            />
                        )}
                        <div className="d-flex align-items-center gap-4 mr-12">
                            <VerificationIcon />

                            <p className="m-0 p-0 grey-text text-xxs font-semibold">Verified Merchant</p>
                        </div>
                    </div>

                    {isLoggedIn && uid !== userP2P?.member?.uid && (
                        <button
                            onClick={() => setShowModalBlockAlert(!showModalBlockAlert)}
                            type="button"
                            className="btn btn-secondary">
                            Block
                        </button>
                    )}
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
                    <CardP2PUserInfo
                        title="Positive Feedback"
                        type="feedback"
                        percent={
                            uid === myProfile?.uid
                                ? `${
                                      data?.feedback?.positive !== 0
                                          ? Math.floor((data?.feedback?.positive / data?.feedback?.total) * 100)
                                          : '0'
                                  }%`
                                : `${
                                      data?.merchant?.feedback?.positive !== 0
                                          ? Math.floor(
                                                (data?.merchant?.feedback?.positive / data?.merchant?.feedback?.total) *
                                                    100
                                            )
                                          : '0'
                                  }%`
                        }
                        amount={`${uid === myProfile?.uid ? data?.feedback?.total : data?.merchant?.feedback?.total}`}
                    />

                    <div className="d-flex flex-column justify-content-center gap-8">
                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${
                                            uid === myProfile?.uid
                                                ? data?.feedback?.positive !== 0
                                                    ? Math.floor(
                                                          (data?.feedback?.positive / data?.feedback?.total) * 100
                                                      ).toString()
                                                    : '0'
                                                : data?.merchant?.feedback?.positive !== 0
                                                ? Math.floor(
                                                      (data?.merchant?.feedback?.positive /
                                                          data?.merchant?.feedback?.total) *
                                                          100
                                                  ).toString()
                                                : '0'
                                        }%`,
                                    }}
                                />
                            </div>
                            <LikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">
                                {uid === myProfile?.uid ? data?.feedback?.positive : data?.merchant?.feedback?.positive}
                            </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-4">
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${
                                            uid === myProfile?.uid
                                                ? data?.feedback?.negative !== 0
                                                    ? Math.floor(
                                                          (data?.feedback?.negative / data?.feedback?.total) * 100
                                                      ).toString()
                                                    : '0'
                                                : data?.merchant?.feedback?.negative !== 0
                                                ? Math.floor(
                                                      (data?.merchant?.feedback?.negative /
                                                          data?.merchant?.feedback?.total) *
                                                          100
                                                  ).toString()
                                                : '0'
                                        }%`,
                                    }}
                                />
                            </div>
                            <UnLikeIcon />
                            <p className="m-0 p-0 grey-text text-sm">
                                {uid === myProfile?.uid ? data?.feedback?.negative : data?.merchant?.feedback?.negative}
                            </p>
                        </div>
                    </div>

                    <CardP2PUserInfo
                        title="All Trade"
                        type="all trade"
                        amount={uid === myProfile?.uid ? `${data?.trade?.total}` : `${data?.merchant?.trade?.total}`}
                    />
                    <CardP2PUserInfo
                        title="30d Trade"
                        type="trade"
                        time={
                            uid === myProfile?.uid
                                ? `${data?.trade?.mount_trade} Time(s)`
                                : `${data?.merchant?.trade?.mount_trade} Time(s)`
                        }
                    />
                    <CardP2PUserInfo
                        title="30d Completion Rate"
                        type="completion"
                        percent={
                            uid === myProfile?.uid
                                ? `${data?.trade?.completed_rate ? data?.trade?.completed_rate + '%' : '-'} `
                                : `${
                                      data?.merchant?.trade?.completed_rate
                                          ? data?.merchant?.trade?.completed_rate + '%'
                                          : '-'
                                  } `
                        }
                    />
                    <CardP2PUserInfo
                        title="Avg. Release Time"
                        type="release"
                        minutes={
                            uid === myProfile?.uid
                                ? `${data?.trade?.release_time ? data?.trade?.release_time : '0'} Minute(s)`
                                : `${
                                      data?.merchant?.trade?.release_time ? data?.merchant?.trade?.release_time : '0'
                                  } Minute(s)`
                        }

                        // minutes={
                        //     uid === myProfile?.uid
                        //         ? `${
                        //               data?.trade?.release_time
                        //                   ? moment
                        //                         .utc(convertDurationtoMilliseconds(data?.trade?.release_time))
                        //                         .format('m.ss')
                        //                   : '0'
                        //           } Minute(s)`
                        //         : `${
                        //               data?.merchant?.trade?.release_time
                        //                   ? moment
                        //                         .utc(convertDurationtoMilliseconds(data?.merchant?.trade?.release_time))
                        //                         .format('m.ss')
                        //                   : '0'
                        //           } Minute(s)`
                        // }
                    />
                    <CardP2PUserInfo
                        title="30d Pay Time"
                        type="pay"
                        minutes={
                            uid === myProfile?.uid
                                ? `${data?.trade?.pay_time ? data?.trade?.pay_time : '0'} Minute(s)`
                                : `${data?.merchant?.trade?.pay_time ? data?.merchant?.trade?.pay_time : '0'} Minute(s)`
                        }
                        // minutes="1"
                        // minutes={
                        //     uid === myProfile?.uid
                        //         ? `${
                        //               data?.trade?.pay_time
                        //                   ? moment
                        //                         .utc(convertDurationtoMilliseconds(data?.trade?.pay_time))
                        //                         .format('m.ss')
                        //                   : '0'
                        //           } Minute(s)`
                        //         : `${
                        //               data?.merchant?.trade?.pay_time
                        //                   ? moment
                        //                         .utc(convertDurationtoMilliseconds(data?.merchant?.trade?.pay_time))
                        //                         .format('m.ss')
                        //                   : '0'
                        //           } Minute(s)`
                        // }
                    />
                </div>

                <ModalComponent show={showModalBlockAlert} content={renderModalBlockAlert()} />
                <ModalComponent show={showModalBlockReason} content={renderModalBlockReason()} />
            </div>
        </React.Fragment>
    );
};
