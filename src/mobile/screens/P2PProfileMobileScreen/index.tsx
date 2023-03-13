import moment from 'moment';
import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    RenameIcon,
    VerificationIcon,
    ShareIcon,
    CheckFillIcon,
    MobileFeedback,
    MobileCompletionRate,
    MobileLastMonthTrade,
    MobileMoreArrow,
    MobileThumbsUp,
    MobileCreditCard,
    MobileNotification,
    MobileUserIcon,
    LikeSuccessIcon,
    UnLikeDangerIcon,
    NoDataIcon,
} from 'src/assets/images/P2PIcon';
import { FormControl } from 'react-bootstrap';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { InfoWarningIcon } from 'src/assets/images/P2PIcon';
import { useDocumentTitle } from 'src/hooks';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { ModalFullScreenMobile, ModalMobile } from 'src/mobile/components';
import { P2PFeedbackTab } from 'src/mobile/components/P2PFeedbackTab';
import { P2PNotificationMobile } from 'src/mobile/containers';
import {
    selectUserLoggedIn,
    selectP2PMerchantDetail,
    selectP2PPaymentUser,
    P2PProfileFetchInterface,
    selectP2PProfile,
    selectP2PProfileBlockMerchantLoading,
    selectP2PProfileBlockMerchantSuccess,
    selectP2PProfileChangeUsernameSuccess,
    selectUserInfo,
    p2pPaymentUserFetch,
    p2pProfileFetch,
    selectP2PFeedbackUser,
    p2pMerchantDetailFetch,
    selectP2PProfileListBlockMerchant,
    p2pProfileBlockMerchant,
    p2pProfileListBlockMerchant,
    p2pProfileChangeUsername,
} from 'src/modules';
import { ModalUserLevel } from 'src/desktop/components';

const P2PProfileMobileScreen: React.FC = () => {
    useDocumentTitle('P2P || Profile');
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
    const blocks = useSelector(selectP2PProfileListBlockMerchant);

    const [data, setData] = React.useState<any>();
    const [showModalMoreUserInfo, setShowModalMoreUserInfo] = React.useState(false);
    const [showModalUserFeedbackInfo, setShowModalUserFeedbackInfo] = React.useState(false);
    const [showModalBlockedUserInfo, setShowModalBlockedUserInfo] = React.useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [showModalUserLevel, setShowModalUserLevel] = React.useState(false);

    // ======== STATE USERNAME =======
    const [username, setUsername] = React.useState(userP2P?.trader_name);
    const [showChangeUsernameModal, setShowChangeUsernameModal] = React.useState(false);

    // ======== STATE BLOCK ========
    const [type, setType] = React.useState('blocked');
    const [uidBlock, setUidBlock] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [showModalBlock, setShowModalBlock] = React.useState(false);
    const [showModalBlockReason, setShowModalBlockReason] = React.useState(false);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(p2pPaymentUserFetch({}));
        dispatch(p2pMerchantDetailFetch({ uid }));
        dispatch(p2pProfileListBlockMerchant());

        if (changeUsernameSuccess) {
            setShowChangeUsernameModal(false);
        }
    }, [dispatch, uid, changeUsernameSuccess]);

    React.useEffect(() => {
        if (uid === myProfile?.uid) {
            setData(userP2P);
        } else {
            setData(merchants);
        }
    }, [myProfile, merchants, uid, userP2P]);

    React.useEffect(() => {
        if (blockMerchantSuccess) {
            if (type == 'blocked') {
                setShowModalBlockReason(false);
                history.push(`/p2p/profile/${myProfile?.uid}`, { types: 'block' });
            } else {
                setShowModalBlock(false);
                dispatch(p2pProfileListBlockMerchant());
            }
        }
    }, [blockMerchantSuccess, type, uid, dispatch]);

    const changeUsername = () => {
        const payload = {
            username,
        };
        dispatch(p2pProfileChangeUsername(payload));
    };

    const reasonData = [
        { name: 'Harrasment' },
        { name: 'Bad credibility' },
        { name: 'Malicious feedback' },
        { name: 'Scam suspicion' },
        { name: 'Other' },
    ];

    const handleBlockMerchant = () => {
        const payload = {
            uid: type == 'blocked' ? uid : uidBlock,
            state: type,
            reason,
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
                    {type == 'blocked'
                        ? 'Are you sure want to block this user? You will not be able to trade with the user after blocking.'
                        : ' Are you sure want to unblock this user? You will be able to trade with the user after unblocking.'}
                </p>

                <button
                    onClick={() => {
                        if (type == 'blocked') {
                            setShowModalBlock(!showModalBlock);
                            setShowModalBlockReason(!showModalBlockReason);
                        } else {
                            handleBlockMerchant();
                        }
                    }}
                    disabled={blockMerchantLoading}
                    type="button"
                    className="btn-primary w-100 white-text text-ms mb-16">
                    {type == 'blocked' ? ' Block' : 'Unblock'}
                </button>
                <button
                    onClick={() => setShowModalBlock(!showModalBlock)}
                    disabled={blockMerchantLoading}
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
                        {type == 'blocked' ? ' Block' : 'Unblock'}
                    </button>
                </ul>
            </div>
        );
    };

    const ModalUserInfo = () => {
        return (
            <React.Fragment>
                <div className="grey-text d-flex flex-row">
                    <div onClick={() => setShowModalMoreUserInfo(false)} className="cursor-pointer mr-2">
                        <ArrowLeft className={'back'} />
                    </div>
                    <div className="font-semibold text-md mx-auto">Nusatech Exchange</div>
                </div>
                <section className="grey-text p-3">
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">Received Feedbacks</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid
                                ? `${
                                      data?.feedback?.total !== 0
                                          ? Math.floor((data?.feedback?.total / data?.feedback?.total) * 100)
                                          : '0'
                                  }%`
                                : `${
                                      data?.merchant?.feedback?.total !== 0
                                          ? Math.floor(
                                                (data?.merchant?.feedback?.total / data?.merchant?.feedback?.total) *
                                                    100
                                            )
                                          : '0'
                                  }%`}{' '}
                            ({uid === myProfile?.uid ? data?.feedback?.total : data?.merchant?.feedback?.total})
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">All Trade</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid ? `${data?.trade?.total}` : `${data?.merchant?.trade?.total}`}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">30d Trade</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.mount_trade}`
                                : `${data?.merchant?.trade?.mount_trade}`}{' '}
                            Time(s)
                        </p>
                    </div>
                    <hr className="bg-grey my-2" />
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">30d Completion Rate</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.completed_rate ? data?.trade?.completed_rate + '%' : '-'} `
                                : `${
                                      data?.merchant?.trade?.completed_rate
                                          ? data?.merchant?.trade?.completed_rate + '%'
                                          : '-'
                                  } `}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">Avg. Release Time</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.release_time ? data?.trade?.release_time : '0'} Minute(s)`
                                : `${
                                      data?.merchant?.trade?.release_time ? data?.merchant?.trade?.release_time : '0'
                                  } Minute(s)`}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-2">
                        <p className="text-sm grey-text-accent m-0 p-0">30d Pay Time</p>
                        <p className="text-sm grey-text-accent m-0 p-0">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.pay_time ? data?.trade?.pay_time : '0'} Minute(s)`
                                : `${
                                      data?.merchant?.trade?.pay_time ? data?.merchant?.trade?.pay_time : '0'
                                  } Minute(s)`}
                        </p>
                    </div>
                </section>
            </React.Fragment>
        );
    };

    const ModalUserFeedbackInfo = () => {
        return (
            <section className="container-p2p-user-info px-2">
                <div className="grey-text d-flex flex-row">
                    <div
                        onClick={() => setShowModalUserFeedbackInfo(!showModalUserFeedbackInfo)}
                        className="cursor-pointer mr-2">
                        <ArrowLeft className={'back'} />
                    </div>
                    <div className="font-semibold grey-text-accent text-md mx-auto">Received Feedbacks</div>
                </div>
                <section className="mt-3 grey-text d-flex flex-row items-center justify-content-between">
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
                        <div className="">
                            {uid === myProfile?.uid
                                ? data?.trader_name
                                    ? data?.trader_name
                                    : data?.member?.email
                                : data?.merchant?.username
                                ? data?.merchant?.username
                                : data?.merchant?.member?.email}
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-3 gap-4">
                        <MobileThumbsUp className="" />
                        <div>
                            {uid === myProfile?.uid
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
                                  }%`}{' '}
                            ({uid === myProfile?.uid ? data?.feedback?.total : data?.merchant?.feedback?.total})
                        </div>
                    </div>
                </section>
                <P2PFeedbackTab myProfile={myProfile} />
            </section>
        );
    };

    const ModalBlockedUserInfo = () => {
        return (
            <section>
                <div className="grey-text d-flex flex-row mb-32">
                    <div
                        onClick={() => setShowModalBlockedUserInfo(!showModalBlockedUserInfo)}
                        className="cursor-pointer mr-2">
                        <ArrowLeft className={'back'} />
                    </div>
                    <div className="font-semibold grey-text-accent text-md mx-auto">Blocked Users</div>
                </div>

                <div className="com-p2p-blocked-user">
                    {!blocks || !blocks[0] ? (
                        <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                            <NoDataIcon />
                            <p className="m-0 p-0 grey-text text-sm font-bold">No Blocked User</p>
                        </div>
                    ) : (
                        <>
                            <div className="data-row-container w-100 mb-16">
                                {blocks?.map((block, i) => (
                                    <div
                                        key={i}
                                        className="d-flex justify-content-between align-items-center py-16 data-row w-100">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center gap-16">
                                                <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                                    {block?.target_user?.trader_name
                                                        ? block?.target_user?.trader_name.slice(0, 1).toUpperCase()
                                                        : block?.target_user?.member?.email.slice(0, 1).toUpperCase()}
                                                </div>
                                                <p className="m-0 p-0 grey-text-accent text-sm">
                                                    {block?.target_user?.trader_name
                                                        ? block?.target_user?.trader_name
                                                        : block?.target_user?.member?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                onClick={() => {
                                                    setType('unblocked');
                                                    setShowModalBlock(!showModalBlock);
                                                    setReason(block?.reason);
                                                    setUidBlock(block?.target_user?.member?.uid);
                                                }}
                                                className="reason-block m-0 p-0 text-sm gradient-text cursor-pointer text-right">
                                                Unblock
                                            </p>
                                            <p className="m-0 p-0 grey-text text-xxs text-right">{block?.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="m-0 p-0 grey-text text-xxs font-bold text-center">No more data</p>
                        </>
                    )}
                </div>
            </section>
        );
    };

    const ModalChangeName = () => {
        return (
            <section>
                <div className="grey-text d-flex flex-row mb-32">
                    <div
                        onClick={() => setShowChangeUsernameModal(!showChangeUsernameModal)}
                        className="cursor-pointer mr-2">
                        <ArrowLeft className={'back'} />
                    </div>
                </div>
                <form onSubmit={changeUsername} className="dark-bg-main p-10" hidden={!showChangeUsernameModal}>
                    <div className="d-flex justify-content-between">
                        <h6 className="grey-text-accent text-md font-extrabold my-20">Set Nickname</h6>
                    </div>
                    <p className="grey-text text-xs m-0 p-0 mb-24">
                        It is recommended not to use your real name. <br /> Nickname can only be modified after KYC
                        level 3.
                    </p>
                    <label className="grey-text-accent text-ms mb-16">Nickname</label>
                    <div className="d-flex flex-row justify-content-between modal-input  rounded-lg">
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
                        <label className="text-char grey-text text-sm">{username?.length}/20</label>
                    </div>

                    <div className="w-100 bottom-nav-change-username">
                        <button
                            disabled={!username || username == userP2P?.trader_name}
                            type="button"
                            className="text-center cursor-pointer btn-secondary w-100"
                            onClick={changeUsername}>
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        );
    };

    return (
        <div className="mobile-container no-header dark-bg-main p2p-profile-mobile-screen">
            <ModalFullScreenMobile show={showModalUserFeedbackInfo} content={ModalUserFeedbackInfo()} />
            <ModalFullScreenMobile show={showModalMoreUserInfo} content={ModalUserInfo()} />
            <ModalFullScreenMobile show={showModalBlockedUserInfo} content={ModalBlockedUserInfo()} />
            <ModalFullScreenMobile
                show={showNotification}
                content={<P2PNotificationMobile handleShowNotif={() => setShowNotification(!showNotification)} />}
            />
            <ModalFullScreenMobile show={showChangeUsernameModal} content={ModalChangeName()} />
            <ModalMobile show={showModalBlock} content={renderModalBlockAlert()} />
            <ModalMobile show={showModalBlockReason} content={renderModalBlockReason()} />
            {showModalUserLevel && (
                <ModalUserLevel
                    show={showModalUserLevel}
                    onClose={() => setShowModalUserLevel(!showModalUserLevel)}
                    title={'Change Username'}
                />
            )}
            <div onClick={() => history.goBack()} className="cursor-pointer">
                <ArrowLeft className={'back'} />
            </div>
            <section className="mt-3 p-3 container-p2p-user-info">
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
                                className={`cursor-pointer`}
                                onClick={() => {
                                    if (myProfile?.level >= 3) {
                                        setShowChangeUsernameModal(!showChangeUsernameModal);
                                    } else {
                                        setShowModalUserLevel(!showModalUserLevel);
                                    }
                                }}
                            />
                        )}

                        <div className="cursor-pointer">
                            <ShareIcon />
                        </div>
                    </div>

                    {isLoggedIn && uid !== userP2P?.member?.uid && (
                        <button
                            onClick={() => {
                                setShowModalBlock(!showModalBlock);
                                setType('blocked');
                            }}
                            type="button"
                            className="btn btn-secondary">
                            Block
                        </button>
                    )}
                </div>
                <div className="d-flex align-items-center gap-4 mr-12 my-2">
                    <VerificationIcon />

                    <p className="m-0 p-0 grey-text text-xxs font-semibold">Verified Merchant</p>
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
            </section>
            <section className="mt-2 p-3">
                <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-column items-center justify-content-between">
                        <MobileFeedback />
                        <p className="text-xxs mt-2 grey-text">Received Feedbacks</p>
                        <p className="text-xs text-center text-light">
                            {uid === myProfile?.uid
                                ? `${
                                      data?.feedback?.total !== 0
                                          ? Math.floor((data?.feedback?.total / data?.feedback?.total) * 100)
                                          : '0'
                                  }%`
                                : `${
                                      data?.merchant?.feedback?.total !== 0
                                          ? Math.floor(
                                                (data?.merchant?.feedback?.total / data?.merchant?.feedback?.total) *
                                                    100
                                            )
                                          : '0'
                                  }%`}{' '}
                            ({uid === myProfile?.uid ? data?.feedback?.total : data?.merchant?.feedback?.total})
                        </p>
                    </div>
                    <div className="d-flex flex-column items-center justify-content-between">
                        <MobileCompletionRate />
                        <p className="text-xxs mt-2 grey-text">30d Completion Rate</p>
                        <p className="text-xs text-center text-light">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.completed_rate ? data?.trade?.completed_rate + '%' : '-'} `
                                : `${
                                      data?.merchant?.trade?.completed_rate
                                          ? data?.merchant?.trade?.completed_rate + '%'
                                          : '-'
                                  } `}{' '}
                            (
                            {uid === myProfile?.uid
                                ? data?.trade?.completed_rate
                                : data?.merchant?.trade?.completed_rate}
                            )
                        </p>
                    </div>
                    <div className="d-flex flex-column items-center justify-content-between">
                        <MobileLastMonthTrade />
                        <p className="text-xxs mt-2 grey-text">30d Trade</p>
                        <p className="text-xs text-center text-light">
                            {uid === myProfile?.uid
                                ? `${data?.trade?.mount_trade}`
                                : `${data?.merchant?.trade?.mount_trade}`}{' '}
                            Time(s)
                        </p>
                    </div>
                </div>
                <div
                    onClick={() => setShowModalMoreUserInfo(!showModalMoreUserInfo)}
                    className="mx-auto w-25 d-flex flex-row items-center justify-content-center cursor-pointer">
                    <div className="grey-text">More</div>
                    <MobileMoreArrow className="mt-1 ml-1" />
                </div>
            </section>
            <section className="p-3 grey-text">
                <div
                    onClick={() => setShowModalUserFeedbackInfo(!showModalUserFeedbackInfo)}
                    className="d-flex flex-row justify-content-between my-1 cursor-pointer grey-text-accent text-sm">
                    <div className="d-flex flex-row">
                        <MobileThumbsUp className="mt-1" />
                        <p className="ml-3">Received Feedback</p>
                    </div>
                    <MobileMoreArrow className="mt-1 ml-1" />
                </div>

                {uid == myProfile?.uid && (
                    <>
                        <Link
                            to={`/p2p/payment-method`}
                            className="d-flex flex-row justify-content-between my-1 cursor-pointer grey-text-accent text-sm">
                            <div className="d-flex flex-row">
                                <MobileCreditCard className="mt-1" />
                                <p className="ml-3">Payment Methods</p>
                            </div>
                            <MobileMoreArrow className="mt-1 ml-1" />
                        </Link>
                        <div className="d-flex flex-row justify-content-between my-1 cursor-pointer grey-text-accent text-sm">
                            <div onClick={() => setShowNotification(!showNotification)} className="d-flex flex-row">
                                <MobileNotification className="mt-1" />
                                <p className="ml-3">P2P Notification</p>
                            </div>
                            <MobileMoreArrow className="mt-1 ml-1" />
                        </div>
                        <div
                            onClick={() => setShowModalBlockedUserInfo(!showModalBlockedUserInfo)}
                            className="d-flex flex-row justify-content-between my-1 cursor-pointer grey-text-accent text-sm">
                            <div className="d-flex flex-row">
                                <MobileUserIcon className="mt-1" />
                                <p className="ml-3">Blocked Users</p>
                            </div>
                            <MobileMoreArrow className="mt-1 ml-1" />
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export { P2PProfileMobileScreen };
