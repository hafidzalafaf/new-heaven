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
    selectP2PCreateReportLoading,
    selectP2PCreateReportSuccess,
    orderReportCreate,
    alertPush,
} from 'src/modules';
import { Modal } from 'src/desktop/components';
import moment from 'moment';
import { copy } from 'src/helpers';
import { ArrowLeft } from 'src/mobile/assets/Arrow';

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
    const createReportLoading = useSelector(selectP2PCreateReportLoading);

    const [showPayment, setShowPayment] = React.useState(false);
    const [showChat, setShowChat] = React.useState(true);
    const [inputFile, setInputFile] = React.useState(null);
    const [fileName, setFileName] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('');
    const [paymentUser, setPaymentUser] = React.useState<any>();
    const [orderNumber, setOrderNumber] = React.useState(order_number);
    const [showModalPaymentConfirm, setShowModalPaymentConfirm] = React.useState(false);
    const [selectConfirmRelease, setSelectConfirmRelease] = React.useState('');
    const [selectConfirmPayment, setSelectConfirmPayment] = React.useState(false);

    const [showModalSellConfirm, setShowModalSellConfrim] = React.useState(false);
    const [showModalBuyOrderCompleted, setShowModalBuyOrderCompleted] = React.useState(false);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [selectCancelReason, setSelectCancelReason] = React.useState('');

    /* ============== FEEDBACK STATE START =============== */
    const [comment, setComment] = React.useState('');
    /* ============== FEEDBACK STATE END =============== */

    /* ============== REPORT STATE START =============== */
    const [showModalReport, setShowModalReport] = React.useState(false);
    const [reason, setReason] = React.useState([]);
    const [text_message, setTextMessage] = React.useState('');
    const [upload_payment, setUplodPayment] = React.useState(null);

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

    //countdown timer
    const Countdown = ({ days, hours, minutes, seconds }) => {
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
                                    <h2 className="m-0 p-0 text-sm gradient-text">
                                        {days >= 10
                                            ? dayArray[0]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2 className="m-0 p-0 text-sm gradient-text">
                                        {days >= 10
                                            ? dayArray[1]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : dayArray[0]}
                                    </h2>
                                </div>

                                <h2 className="m-0 p-0 text-sm gradient-text">:</h2>

                                <div className="d-flex flex-row">
                                    <h2 className="m-0 p-0 text-sm gradient-text">
                                        {hours >= 10
                                            ? hourArray[0]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2 className="m-0 p-0 text-sm gradient-text">
                                        {hours >= 10
                                            ? hourArray[1]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : hourArray[0]}
                                    </h2>
                                </div>

                                <h2 className="m-0 p-0 text-sm gradient-text">:</h2>
                            </>
                        )}
                        <div className="d-flex flex-row">
                            <h2 className="m-0 p-0 text-sm gradient-text">
                                {minutes >= 10
                                    ? minuteArray[0]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className="m-0 p-0 text-sm gradient-text">
                                {minutes >= 10
                                    ? minuteArray[1]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : minuteArray[0]}
                            </h2>
                        </div>

                        <h2 className="m-0 p-0 text-sm gradient-text">:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="m-0 p-0 text-sm gradient-text">
                                {seconds >= 10
                                    ? secondArray[0]
                                    : Number.isNaN(secondArray[0]) || Number.isNaN(secondArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className="m-0 p-0 text-sm gradient-text">
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
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                        </div>

                        <h2 className="m-0 p-0 text-sm gradient-text">:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                        </div>

                        <h2 className="m-0 p-0 text-sm gradient-text">:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                            <h2 className="m-0 p-0 text-sm gradient-text">0</h2>
                        </div>
                    </div>
                )}
            </>
        );
    };

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

    const doCopyNumber = () => {
        copy('kid-code');
        dispatch(alertPush({ message: ['Order Number copied'], type: 'success' }));
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

    /* ============== REPORT FUNCTION START =============== */
    React.useEffect(() => {
        setShowModalReport(false);
        setReason([]);
        setTextMessage('');
        setUplodPayment(null);
    }, [createReportSuccess]);

    const handleChecked = (e) => {
        setReason([
            ...reason,
            {
                key: e.target.name,
                message: e.target.name !== 'payment' ? e.target.value : e.target.files[0].name,
            },
        ]);
        if (!e.target.checked) {
            setReason(reason.filter((item) => item.message !== e.target.id));
        }
    };

    const handleReport = () => {
        const formData = new FormData();
        formData.append('reason', JSON.stringify(reason));
        formData.append('text_message', text_message);
        formData.append('upload_payment', upload_payment);

        dispatch(
            orderReportCreate({
                FormData: formData,
                order_number: order_number,
            })
        );
    };

    /* ============== REPORT FUNCTION END =============== */

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
                        <h1 className="m-0 p-0 mb-8 text-md font-extrabold white-text">Order Created</h1>

                        <div className="d-flex align-items-center gap-4">
                            <p className="m-0 p-0 text-sm grey-text">Your order has been created</p>
                            <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
                        </div>
                    </div>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <p>TEST</p>
                    <div className="bottom-nav-order-step d-flex align-items-center gap-12 w-100">
                        <button type="button" className="btn-secondary w-50 grey-text text-ms font-normal">
                            Cancel
                        </button>
                        <button type="button" className="btn-primary w-50 white-text text-ms font-normal">
                            Make Payment
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
