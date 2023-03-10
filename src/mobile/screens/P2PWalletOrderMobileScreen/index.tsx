import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router';
import {
    orderDetailFetch,
    selectP2POrderDetail,
    orderConfirmPayment,
    orderConfirmSell,
    orderCancel,
    selectP2PConfirmPaymentSuccess,
    selectP2PConfirmPaymentLoading,
    selectP2PConfirmSellSuccess,
    selectP2PCancelSuccess,
    selectP2PCancelLoading,
    selectShouldFetchP2POrderDetail,
    feedbackCreate,
    selectP2PCreateFeedbackSuccess,
    selectP2PChat,
    orderChat,
    selectP2PCreateReportSuccess,
} from 'src/modules';
import { ModalMobile, ModalFullScreenMobile } from 'src/mobile/components';
import moment from 'moment';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { CloseMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { ActiveCheck, GreyCheck, LikeSuccessIcon, UnLikeDangerIcon } from 'src/assets/images/P2PIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { P2PChatMobile, P2POrderStepMobile, P2PReportOrderMobile } from 'src/mobile/containers';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { CustomInput } from 'src/desktop/components';

export const P2PWalletOrderMobileScreen: React.FC = () => {
    useDocumentTitle('P2P Wallet Order');
    const dispatch = useDispatch();
    const history = useHistory();
    const { order_number = '' } = useParams<{ order_number?: string }>();
    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;

    const detail = useSelector(selectP2POrderDetail);
    const paymentConfirmSuccess = useSelector(selectP2PConfirmPaymentSuccess);
    const paymentConfimLoading = useSelector(selectP2PConfirmPaymentLoading);
    const confirmSellSuccess = useSelector(selectP2PConfirmSellSuccess);
    const cancelSuccess = useSelector(selectP2PCancelSuccess);
    const cancelLoading = useSelector(selectP2PCancelLoading);
    const shouldFetchP2POrderDetail = useSelector(selectShouldFetchP2POrderDetail);
    const createFeedbackSuccess = useSelector(selectP2PCreateFeedbackSuccess);
    const p2pChat = useSelector(selectP2PChat);
    const createReportSuccess = useSelector(selectP2PCreateReportSuccess);

    const [showPayment, setShowPayment] = React.useState(false);
    const [showChat, setShowChat] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = React.useState('');
    const [paymentUser, setPaymentUser] = React.useState<any>();
    const [showModalPaymentConfirm, setShowModalPaymentConfirm] = React.useState(false);
    const [selectConfirmRelease, setSelectConfirmRelease] = React.useState('');
    const [selectConfirmPayment, setSelectConfirmPayment] = React.useState(false);

    const [showModalSellConfirm, setShowModalSellConfrim] = React.useState(false);
    const [showModalBuyOrderCompleted, setShowModalBuyOrderCompleted] = React.useState(false);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [selectCancelReason, setSelectCancelReason] = React.useState('');
    const [showTerms, setShowTerms] = React.useState(true);

    /* ============== FEEDBACK STATE START =============== */
    const [comment, setComment] = React.useState('');
    /* ============== FEEDBACK STATE END =============== */

    /* ============== REPORT STATE START =============== */
    const [showModalReport, setShowModalReport] = React.useState(false);
    React.useEffect(() => {
        setShowModalReport(false);
    }, [createReportSuccess]);
    /* ============== REPORT STATE END =============== */

    const dateInFuture = moment(
        detail?.order?.state == 'prepare' ? detail?.order?.first_approve : detail?.order?.second_approve
    ).format('YYYY-MM-DD HH:mm:ss');
    const timeLeft = Date.parse(dateInFuture) - new Date().getTime();
    let currentDays = Math.floor(Number(timeLeft) / (24 * 60 * 60 * 1000));
    let currentHours = Math.floor((Number(timeLeft) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let currentMinutes = Math.floor((Number(timeLeft) % (60 * 60 * 1000)) / (60 * 1000));
    let currentSeconds = Math.floor((Number(timeLeft) % (60 * 1000)) / 1000);
    const [days, setDays] = React.useState(currentDays);
    const [hours, setHours] = React.useState(currentHours);
    const [minutes, setMinutes] = React.useState(currentMinutes);
    const [seconds, setSeconds] = React.useState(currentSeconds);

    React.useEffect(() => {
        let timer = null;
        timer = setInterval(() => {
            setDays(currentDays);
            setHours(currentHours);
            setMinutes(currentMinutes);
            setSeconds(currentSeconds);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    });

    React.useEffect(() => {
        dispatch(orderDetailFetch({ offer_number: order_number }));
        dispatch(orderChat({ offer_number: order_number }));
        if (paymentConfirmSuccess) {
            setShowModalPaymentConfirm(false);
            setSelectConfirmPayment(false);
        }

        if (cancelSuccess) {
            setShowModalCancel(false);
            setSelectCancelReason('');
        }

        if (confirmSellSuccess) {
            setShowModalSellConfrim(false);
            setSelectConfirmRelease('');
        }

        const fetchInterval = setInterval(() => {
            dispatch(orderDetailFetch({ offer_number: order_number }));
        }, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dispatch, order_number, paymentConfirmSuccess, cancelSuccess, confirmSellSuccess]);

    React.useEffect(() => {
        setComment('');
    }, [createFeedbackSuccess]);

    const handleConfirmPaymentBuy = () => {
        const payload = {
            order_number: order_number,
            payment_method: detail?.order?.payment !== null ? detail?.order?.payment?.payment_user_uid : paymentMethod,
        };

        dispatch(orderConfirmPayment(payload));
    };

    const handleConfirmSell = () => {
        const payload = {
            order_number: order_number,
        };

        dispatch(orderConfirmSell(payload));
    };

    const handleConfirmBuy = () => {
        const payload = {
            order_number: order_number,
        };

        dispatch(orderConfirmSell(payload));
        setShowModalBuyOrderCompleted(false);
    };

    const handleCancelOrder = () => {
        const payload = {
            order_number: order_number,
        };

        dispatch(orderCancel(payload));
    };

    const handleChangePaymentMethod = (el) => {
        setPaymentMethod(el?.payment_user_uid);
        setPaymentUser(el);
        setShowPayment(!showPayment);
    };

    const handleSendFeedbackPositive = () => {
        const payload = {
            order_number,
            comment,
            assesment: 'positive',
        };

        dispatch(feedbackCreate(payload));
    };

    const handleSendFeedbackNegative = () => {
        const payload = {
            order_number,
            comment,
            assesment: 'negative',
        };

        dispatch(feedbackCreate(payload));
    };

    const handleChangeComment = (e: string) => {
        setComment(e);
    };

    const renderModalCancel = () => {
        return (
            <div className="custom-modal-content-cancel">
                <div className="d-flex justify-content-end mb-8">
                    <span
                        onClick={() => {
                            setShowModalCancel(!showModalCancel);
                            setSelectCancelReason('');
                        }}
                        className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    <img src="/img/warningp2p.png" alt="warning" width={68} height={68} className="mb-16" />
                </div>

                <p className="m-0 p-0 grey-text-accent text-xs">Tips</p>
                <ul className="m-0 p-0 grey-text-accent text-xs mb-16 pl-16">
                    <li>If you have already paid the seller, please do not cancel the order.</li>
                    <li>
                        If the seller cannot reply to the chat within 15 minutes, you will not be responsible for
                        canceling this order. This will not affect your completion rate. You can make up to 5
                        irresponsible cancellations in a day.
                    </li>
                    <li>
                        Your account will be SUSPENDED for the day if you exceed 3 responsible cancellation times in a
                        day.
                    </li>
                </ul>

                <div className="p-16 mb-16">
                    <p className="m-0 p-0 grey-text-accent text-xs">Why do you want to cancel the order?</p>
                    <div className="d-flex flex-column gap-16">
                        <div className="d-flex align-items-center gap-8">
                            {selectCancelReason == 'I dont want to trade anymore' ? (
                                <span onClick={() => setSelectCancelReason('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setSelectCancelReason('I dont want to trade anymore')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-xs">I dont want to trade anymore</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {selectCancelReason ==
                            'I did not comply with the obligations related to the advertising trade terms and conditions' ? (
                                <span onClick={() => setSelectCancelReason('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setSelectCancelReason(
                                            'I did not comply with the obligations related to the advertising trade terms and conditions'
                                        )
                                    }>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-xs">
                                I did not comply with the obligations related to the advertising trade terms and
                                conditions
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {selectCancelReason == 'The seller asked for additional fees' ? (
                                <span onClick={() => setSelectCancelReason('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setSelectCancelReason('The seller asked for additional fees')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-xs">The seller asked for additional fees</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {selectCancelReason ==
                            'An issue with the sellers payment method resulted in an unsuccessful payment' ? (
                                <span onClick={() => setSelectCancelReason('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setSelectCancelReason(
                                            'An issue with the sellers payment method resulted in an unsuccessful payment'
                                        )
                                    }>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-xs">
                                An issue with the sellers payment method resulted in an unsuccessful payment
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {selectCancelReason == 'Another reason' ? (
                                <span onClick={() => setSelectCancelReason('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setSelectCancelReason('Another reason')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-xs">Another reason</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCancelOrder}
                    type="button"
                    disabled={!selectCancelReason || cancelLoading}
                    className="btn-primary w-100">
                    Confirm
                </button>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p-order-step mobile-container px-0 dark-bg-main">
                <div className="position-relative ">
                    <div className="position-sticky px-12 top-nav-order-step pb-2">
                        <div className="d-flex align-items-center position-relative mb-24">
                            <span onClick={() => history.goBack()} className="">
                                <ArrowLeft className={'cursor-pointer'} />
                            </span>
                        </div>
                        <h1 className="m-0 p-0 mb-8 text-md font-extrabold white-text">
                            {detail?.order?.state == 'prepare'
                                ? 'Order Created'
                                : detail?.order?.state == 'waiting'
                                ? 'Release Crypto'
                                : detail?.order?.state == 'rejected'
                                ? 'Order Rejected'
                                : detail?.order?.state == 'canceled'
                                ? 'Order Canceled'
                                : 'Order Completed'}
                        </h1>

                        <div className="d-flex align-items-center gap-4">
                            <p className="m-0 p-0 text-sm grey-text">
                                {side == 'buy'
                                    ? detail?.order?.state == 'prepare'
                                        ? 'Pay the seller within'
                                        : detail?.order?.state == 'waiting'
                                        ? 'Waiting seller release the crypto'
                                        : detail?.order?.state == 'rejected'
                                        ? 'Seller was rejected this order'
                                        : detail?.order?.state == 'canceled'
                                        ? 'Order was canceled'
                                        : 'Your order has  been completed'
                                    : detail?.order?.state == 'prepare'
                                    ? 'Waiting buyer to make a payment'
                                    : detail?.order?.state == 'waiting'
                                    ? 'Waiting seller release the crypto'
                                    : detail?.order?.state == 'rejected'
                                    ? 'You has been rejected this order'
                                    : detail?.order?.state == 'canceled'
                                    ? 'Order was canceled'
                                    : 'Order completed'}
                            </p>
                            {(detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting') && (
                                <Countdown
                                    days={days}
                                    hours={hours}
                                    minutes={minutes}
                                    seconds={seconds}
                                    showChat={showChat}
                                    detail={detail}
                                    timeLeft={timeLeft}
                                    textColor="gradient-text"
                                />
                            )}
                        </div>
                    </div>

                    <P2POrderStepMobile
                        paymentMethod={paymentMethod}
                        paymentUser={paymentUser}
                        showPayment={showPayment}
                        comment={comment}
                        side={side}
                        detail={detail}
                        order_number={order_number}
                        showTerms={showTerms}
                        showModalCancel={showModalCancel}
                        timeLeft={timeLeft}
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        handleChangePaymentMethod={handleChangePaymentMethod}
                        handleChangeComment={handleChangeComment}
                        handleConfirmPaymentBuy={handleConfirmPaymentBuy}
                        handleShowPayment={() => setShowPayment(!showPayment)}
                        handleShowModalBuyOrderCompleted={() =>
                            setShowModalBuyOrderCompleted(!showModalBuyOrderCompleted)
                        }
                        handleShowModalPaymentConfirm={() => setShowModalPaymentConfirm(!showModalPaymentConfirm)}
                        handleShowModalSellConfirm={() => setShowModalSellConfrim(!showModalSellConfirm)}
                        handleShowModalCancel={() => setShowModalCancel(!showModalCancel)}
                        handleSendFeedbackPositive={handleSendFeedbackPositive}
                        handleSendFeedbackNegative={handleSendFeedbackNegative}
                        handleExpandChat={() => setShowChat(!showChat)}
                        handleExpandTerms={() => setShowTerms(!showTerms)}
                    />

                    {side == 'buy' ? (
                        detail?.order?.state == 'prepare' ? (
                            paymentUser === undefined && detail?.order?.payment === null ? (
                                <div className="bottom-nav-order-step d-flex align-items-center gap-12 w-100">
                                    <button
                                        onClick={() => setShowModalCancel(!showModalCancel)}
                                        type="button"
                                        className="btn-secondary w-50 grey-text text-ms font-normal">
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPayment(!showPayment)}
                                        className="btn-primary w-50 white-text text-ms font-normal">
                                        Make Payment
                                    </button>
                                </div>
                            ) : (
                                <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModalPaymentConfirm(!showModalPaymentConfirm)}
                                        className="btn-primary w-100 white-text text-ms font-normal">
                                        Transferred, notify seller
                                    </button>

                                    <button
                                        onClick={() => setShowModalCancel(!showModalCancel)}
                                        type="button"
                                        className="btn-secondary w-100 grey-text text-ms font-normal">
                                        Cancel
                                    </button>
                                </div>
                            )
                        ) : detail?.order?.state == 'waiting' ? (
                            <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                                <button
                                    type="button"
                                    disabled={true}
                                    className="btn-primary w-100 white-text text-ms font-normal">
                                    <div className="d-flex align-items-center justify-content-center gap-4">
                                        <p className="m-0 p-0">Transaction Issue; appeal after</p>
                                        <Countdown
                                            days={days}
                                            hours={hours}
                                            minutes={minutes}
                                            seconds={seconds}
                                            showChat={showChat}
                                            detail={detail}
                                            timeLeft={timeLeft}
                                            textColor="white-text"
                                        />
                                    </div>
                                </button>

                                <button
                                    onClick={() => setShowModalCancel(!showModalCancel)}
                                    type="button"
                                    className="btn-secondary w-100 grey-text text-ms font-normal">
                                    Cancel
                                </button>
                            </div>
                        ) : detail?.order?.state == 'rejected' ? (
                            <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                                <button
                                    type="button"
                                    disabled={true}
                                    className="btn-primary w-100 white-text text-ms font-normal">
                                    Seller was rejected this order
                                </button>

                                <button
                                    onClick={() => setShowModalCancel(!showModalCancel)}
                                    type="button"
                                    className="btn-secondary w-100 grey-text text-ms font-normal">
                                    Cancel
                                </button>
                            </div>
                        ) : detail?.order?.state == 'canceled' ? (
                            <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                                <button
                                    type="button"
                                    disabled={true}
                                    className="btn-secondary w-100 white-text text-ms font-normal">
                                    Order canceled
                                </button>
                            </div>
                        ) : (
                            <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                                <CustomInput
                                    isDisabled={detail?.feedback?.assesment ? true : false}
                                    inputValue={comment}
                                    type="text"
                                    label={side == 'buy' && detail?.feedback?.assesment ? 'Your comment' : 'Comment'}
                                    defaultLabel={
                                        side == 'buy' && detail?.feedback?.assesment ? 'Your comment' : 'Comment'
                                    }
                                    placeholder={
                                        side == 'buy' && detail?.feedback?.assesment && detail?.feedback?.comment
                                            ? detail?.feedback?.comment
                                            : side == 'buy' && detail?.feedback?.assesment && !detail?.feedback?.comment
                                            ? detail?.feedback?.assesment
                                            : 'Send a comment'
                                    }
                                    labelVisible
                                    classNameLabel="grey-text-accent text-sm font-semibold"
                                    classNameGroup="w-100"
                                    handleChangeInput={(e) => handleChangeComment(e)}
                                />
                                <div className="w-100 d-flex align-items-center gap-8">
                                    <button
                                        disabled={detail?.feedback?.assesment ? true : false}
                                        type="button"
                                        onClick={handleSendFeedbackPositive}
                                        className="btn button-grey white-text text-sm font-semibold align-items-center mr-2 py-3 w-50">
                                        Positive <LikeSuccessIcon />{' '}
                                    </button>
                                    <button
                                        disabled={detail?.feedback?.assesment ? true : false}
                                        type="button"
                                        onClick={handleSendFeedbackNegative}
                                        className="btn button-grey white-text text-sm font-semibold align-items-center ml-2 py-3 w-50">
                                        Negative <UnLikeDangerIcon />{' '}
                                    </button>
                                </div>

                                <button type="button" className="btn-primary w-100 white-text text-ms font-normal">
                                    Wallet P2P
                                </button>
                            </div>
                        )
                    ) : detail?.order?.state == 'prepare' ? (
                        <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                            <button
                                type="button"
                                disabled={true}
                                className="btn-primary w-100 white-text text-ms font-normal">
                                <div className="d-flex align-items-center justify-content-center gap-4">
                                    <p className="m-0 p-0">Waiting buyer payment </p>
                                    (
                                    <Countdown
                                        days={days}
                                        hours={hours}
                                        minutes={minutes}
                                        seconds={seconds}
                                        showChat={showChat}
                                        detail={detail}
                                        timeLeft={timeLeft}
                                        textColor="white-text"
                                    />
                                    )
                                </div>
                            </button>
                        </div>
                    ) : detail?.order?.state == 'waiting' ? (
                        <div className="bottom-nav-order-step d-flex align-items-center gap-12 w-100">
                            <button
                                onClick={() => setShowModalSellConfrim(!showModalSellConfirm)}
                                type="button"
                                className="btn-primary w-100 white-text text-ms font-normal">
                                <div className="d-flex align-items-center justify-content-center gap-4">
                                    <p className="m-0 p-0">Release Crypto : </p>

                                    <Countdown
                                        days={days}
                                        hours={hours}
                                        minutes={minutes}
                                        seconds={seconds}
                                        showChat={showChat}
                                        detail={detail}
                                        timeLeft={timeLeft}
                                        textColor="warning-text"
                                    />
                                </div>
                            </button>

                            <button
                                onClick={() => setShowModalReport(!showModalReport)}
                                type="button"
                                className="btn-secondary w-50 grey-text text-ms font-normal">
                                Report
                            </button>
                        </div>
                    ) : detail?.order?.state == 'rejected' ? (
                        <div className="bottom-nav-order-step d-flex align-items-center gap-12 w-100">
                            <button
                                onClick={() => setShowModalSellConfrim(!showModalSellConfirm)}
                                type="button"
                                className="btn-primary w-100 white-text text-ms font-normal">
                                Release Crypto
                            </button>

                            <button
                                disabled={true}
                                type="button"
                                className="btn-secondary w-50 danger-text text-ms font-normal">
                                Order rejected
                            </button>
                        </div>
                    ) : detail?.order?.state == 'canceled' ? (
                        <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                            <button
                                type="button"
                                disabled={true}
                                className="btn-secondary w-100 white-text text-ms font-normal">
                                Order canceled
                            </button>
                        </div>
                    ) : (
                        <div className="bottom-nav-order-step d-flex flex-column align-items-center gap-12 w-100">
                            <CustomInput
                                isDisabled={true}
                                inputValue={comment}
                                type="text"
                                label={
                                    side == 'sell' && !detail?.feedback?.assesment
                                        ? 'Waiting feedback'
                                        : 'Buyer feedback'
                                }
                                defaultLabel={
                                    side == 'sell' && !detail?.feedback?.assesment
                                        ? 'Waiting feedback'
                                        : 'Buyer feedback'
                                }
                                placeholder={
                                    side == 'sell' && !detail?.feedback?.assesment
                                        ? '-'
                                        : side == 'sell' && detail?.feedback?.assesment && detail?.feedback?.comment
                                        ? detail?.feedback?.comment
                                        : side == 'sell' && detail?.feedback?.assesment && !detail?.feedback?.comment
                                        ? detail?.feedback?.assesment
                                        : ''
                                }
                                labelVisible
                                classNameLabel="grey-text-accent text-sm font-semibold"
                                handleChangeInput={(e) => handleChangeComment(e)}
                                classNameGroup="w-100"
                            />
                            <div className="w-100 d-flex align-items-center gap-8">
                                <button
                                    disabled={true}
                                    type="button"
                                    className="btn button-grey white-text text-sm font-semibold align-items-center mr-2 py-3 w-50">
                                    Positive <LikeSuccessIcon />{' '}
                                </button>
                                <button
                                    disabled={true}
                                    type="button"
                                    className="btn button-grey white-text text-sm font-semibold align-items-center ml-2 py-3 w-50">
                                    Negative <UnLikeDangerIcon />{' '}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ModalMobile
                    show={showModalCancel}
                    content={renderModalCancel()}
                    className="custom-modal-content-cancel"
                />
                <ModalFullScreenMobile
                    show={showChat}
                    content={
                        <P2PChatMobile
                            detail={detail}
                            order_number={order_number}
                            showChat={showChat}
                            handleExpandChat={() => setShowChat(!showChat)}
                            handleModalReport={() => setShowModalReport(true)}
                            handleMakePayment={() => {
                                setShowPayment(!showPayment);
                                setShowChat(!showChat);
                            }}
                            timeLeft={timeLeft}
                            days={days}
                            hours={hours}
                            minutes={minutes}
                            seconds={seconds}
                        />
                    }
                />

                <ModalFullScreenMobile
                    show={showModalReport}
                    content={
                        <P2PReportOrderMobile
                            detail={detail}
                            order_number={order_number}
                            showReport={showModalReport}
                            handleShowReport={() => setShowModalReport(true)}
                            handleCloseReport={() => setShowModalReport(false)}
                        />
                    }
                />

                <div
                    id="off-canvas-payment"
                    className={`position-fixed off-canvas-payment ${showPayment ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-payment overflow-auto">
                        <div className="d-flex justify-content-center align-items-center w-100 position-relative mb-24">
                            <h1 className="text-md grey-text-accent font-extrabold">Select payment methods</h1>

                            <span
                                onClick={() => setShowPayment(!showPayment)}
                                className="position-absolute close-canvas cursor-pointer">
                                <CloseMobileIcon />
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-16 mb-64">
                            {detail?.payment_user?.map((bank, i) => (
                                <div
                                    onClick={() => handleChangePaymentMethod(bank)}
                                    key={i}
                                    className="modal-bank-info-container cursor-pointer">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex align-items-center gap-4">
                                            <div className="label-payment"></div>
                                            <p className="m-0 p-0 grey-text-accent text-ms">{bank?.bank}</p>
                                        </div>

                                        <div className="d-flex align-items-center gap-16">
                                            <img src={bank?.logo} alt="logo" width={40} className="h-auto" />

                                            <ArrowRight className={''} />
                                        </div>
                                    </div>

                                    <p className="m-0 p-0 grey-text-accent text-ms">{bank?.account_name}</p>
                                    <p className="m-0 p-0 grey-text-accent text-ms font-bold">{bank?.account_number}</p>
                                    <p className="m-0 p-0 grey-text text-ms">{bank?.symbol}</p>
                                </div>
                            ))}
                        </div>

                        <div className="position-fixed add-new-payment w-100 p-24">
                            <button className="btn-primary w-100 white-text text-ms font-normal">
                                Add new payment method
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    id="off-canvas-payment"
                    className={`position-fixed off-canvas-payment ${showModalPaymentConfirm ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-payment overflow-auto">
                        <div className="d-flex justify-content-center align-items-center w-100 position-relative mb-24">
                            <h1 className="text-md grey-text-accent font-extrabold">Payment Confirmation</h1>

                            <span
                                onClick={() => setShowModalPaymentConfirm(!showModalPaymentConfirm)}
                                className="position-absolute close-canvas cursor-pointer">
                                <CloseMobileIcon />
                            </span>
                        </div>

                        <p className="m-0 p-0 mb-24 grey-text-accent text-sm">
                            Please confirm that you have successfully transfered the money to the seller throught the
                            following payment method before clicking on the “Transferred, notify seller” button
                        </p>

                        <div className="modal-bank-info-container mb-24">
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="label-payment"></div>
                                    <p className="m-0 p-0">Bank Transfer</p>
                                </div>

                                <div className="d-flex align-items-center gap-16">
                                    <img src="/img/logo-bca.png" alt="logo" width={40} className="h-auto" />

                                    <ArrowRight className={''} />
                                </div>
                            </div>

                            <p className="m-0 p-0">
                                {detail?.order?.payment !== null
                                    ? detail.order?.payment?.account_name
                                    : paymentUser?.account_name}
                            </p>
                            <p className="m-0 p-0 font-bold">
                                {detail?.order?.payment !== null
                                    ? detail.order?.payment?.account_number
                                    : paymentUser?.account_number}
                            </p>
                            <p className="m-0 p-0 grey-text">
                                {detail?.order?.payment !== null ? detail.order?.payment?.bank : paymentUser?.bank}
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-4 mb-24">
                            <InfoIcon />
                            <p className="m-0 p-0 text-xxs grey-text-accent">
                                Tip : I uderstand that I must use the selected payment platform to complete the transfer
                                myself. Heaven will not automatically transfer the payment on my behalf.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-4 mb-24">
                            {selectConfirmPayment ? (
                                <span
                                    className="cursor-pointer"
                                    onClick={() => setSelectConfirmPayment(!selectConfirmPayment)}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    className="cursor-pointer"
                                    onClick={() => setSelectConfirmPayment(!selectConfirmPayment)}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 text-xxs grey-text-accent">
                                I have made payment from my real-name verified payment account consistent with my
                                registered name on Heaven.
                            </p>
                        </div>

                        <button
                            onClick={handleConfirmPaymentBuy}
                            type="button"
                            disabled={!selectConfirmPayment || paymentConfimLoading}
                            className="btn-primary w-100">
                            Confirm
                        </button>
                    </div>
                </div>

                <div
                    id="off-canvas-payment"
                    className={`position-fixed off-canvas-payment ${showModalSellConfirm ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-payment overflow-auto">
                        <div className="d-flex justify-content-center align-items-center w-100 position-relative mb-24">
                            <h1 className="text-md grey-text-accent font-extrabold">Confirm release crypto</h1>

                            <span
                                onClick={() => setShowModalSellConfrim(!showModalSellConfirm)}
                                className="position-absolute close-canvas cursor-pointer">
                                <CloseMobileIcon />
                            </span>
                        </div>

                        <div
                            className="d-flex align-items-center mb-24 cursor-pointer"
                            onClick={() => setSelectConfirmRelease('no-receive')}>
                            <div className="icon-sm">
                                {selectConfirmRelease == 'no-receive' ? <ActiveCheck /> : <GreyCheck />}
                            </div>
                            <p className="mb-0 text-sm grey-text-accent ml-3">
                                I have not receive payment from the buyer
                            </p>
                        </div>
                        <div
                            className="d-flex align-items-center mb-24"
                            onClick={() => setSelectConfirmRelease('receive')}>
                            <div className="icon-sm">
                                {selectConfirmRelease == 'receive' ? <ActiveCheck /> : <GreyCheck />}
                            </div>
                            <p className="mb-0 text-sm grey-text-accent cursor-pointer ml-3">
                                I have received the correct amount. Payment sender matches the buyer’s verified name on
                                Heaven Ecchange, and i agree to release mu crypto to the buyer
                            </p>
                        </div>
                        <p className="mb-2 text-sm grey-text-accent">Tips</p>
                        <ul className="ml-0 pl-3 mb-24">
                            <li className="text-sm grey-text-accent">
                                Do not only check th buyer’s payment proof. Make sure to long into your account and
                                verify payment is received!
                            </li>
                            <li className="text-sm grey-text-accent">
                                If the payment is still processing, wait until you have received payment in your account
                                before releasing the crypto!
                            </li>
                            <li className="text-sm grey-text-accent">
                                Do NOT accept payment from a third-party account. Refund the amount immediately if you
                                receive such payment to avoid financial losses caused by bank chargerback after you have
                                released crypto.
                            </li>
                        </ul>
                        <button
                            // className={`${
                            //     selectConfirmRelease ? 'button-grey white-text ' : 'btn-primary'
                            // } text-sm py-3 btn btn-block`}
                            className="btn-primary w-100"
                            disabled={!selectConfirmRelease}
                            onClick={handleConfirmSell}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

//countdown timer
export const Countdown = ({ days, hours, minutes, seconds, showChat, detail, timeLeft, textColor }) => {
    var dayDigit = days.toString().split('');
    var dayArray = dayDigit.map(Number);
    var hourDigit = hours.toString().split('');
    var hourArray = hourDigit.map(Number);
    var minuteDigit = minutes.toString().split('');
    var minuteArray = minuteDigit.map(Number);
    var secondDigit = seconds.toString().split('');
    var secondArray = secondDigit.map(Number);
    return (
        <>
            {timeLeft > 0 ? (
                <div className="d-flex flex-row">
                    {detail?.order?.state === 'waiting' && (
                        <>
                            <div className="d-flex flex-row">
                                <h2
                                    className={`m-0 p-0 ${textColor} ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    {days >= 10
                                        ? dayArray[0]
                                        : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                        ? 0
                                        : 0}
                                </h2>
                                <h2
                                    className={`m-0 p-0 ${textColor} ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    {days >= 10
                                        ? dayArray[1]
                                        : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                        ? 0
                                        : dayArray[0]}
                                </h2>
                            </div>

                            <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                :
                            </h2>

                            <div className="d-flex flex-row">
                                <h2
                                    className={`m-0 p-0 ${textColor} ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    {hours >= 10
                                        ? hourArray[0]
                                        : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                        ? 0
                                        : 0}
                                </h2>
                                <h2
                                    className={`m-0 p-0 ${textColor} ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    {hours >= 10
                                        ? hourArray[1]
                                        : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                        ? 0
                                        : hourArray[0]}
                                </h2>
                            </div>

                            <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                :
                            </h2>
                        </>
                    )}
                    <div className="d-flex flex-row">
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            {minutes >= 10
                                ? minuteArray[0]
                                : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                ? 0
                                : 0}
                        </h2>
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            {minutes >= 10
                                ? minuteArray[1]
                                : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                ? 0
                                : minuteArray[0]}
                        </h2>
                    </div>

                    <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>:</h2>

                    <div className="d-flex flex-row">
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            {seconds >= 10
                                ? secondArray[0]
                                : Number.isNaN(secondArray[0]) || Number.isNaN(secondArray[1])
                                ? 0
                                : 0}
                        </h2>
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            {seconds >= 10
                                ? secondArray[1]
                                : Number.isNaN(secondArray[0]) || Number.isNaN(secondArray[1])
                                ? 0
                                : secondArray[0]}
                        </h2>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-row">
                    <div className="d-flex flex-row">
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                    </div>

                    <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>:</h2>

                    <div className="d-flex flex-row">
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                    </div>

                    <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>:</h2>

                    <div className="d-flex flex-row">
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                        <h2 className={`m-0 p-0 ${textColor} ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>0</h2>
                    </div>
                </div>
            )}
        </>
    );
};
