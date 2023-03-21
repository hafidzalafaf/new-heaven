import * as React from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
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
} from 'src/modules';
import { useDocumentTitle } from '../../../hooks';
import { alertPush } from 'src/modules';
import { HeaderP2P, BannerP2P, P2PFAQ, P2PChat, P2POrderStep } from 'src/desktop/containers';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'src/desktop/components';
import {
    CheckFillIcon,
    CheckOutlineIcon,
    UploadIcon,
    CommentIcon,
    GreyCheck,
    ActiveCheck,
} from '../../../assets/images/P2PIcon';
import moment from 'moment';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';

export const P2PWalletOrderScreen: React.FC = () => {
    useDocumentTitle('P2P || Order');
    const dispatch = useDispatch();
    const { order_number = '' } = useParams<{ order_number?: string }>();
    const location: { state: { side: string } } = useLocation();
    const history = useHistory();
    const detail = useSelector(selectP2POrderDetail);
    const side = location.state?.side ? location.state?.side : detail?.offer?.side;

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

    const [comment, setComment] = React.useState('');
    const [showModalSellConfirm, setShowModalSellConfrim] = React.useState(false);
    const [showModalBuyOrderCompleted, setShowModalBuyOrderCompleted] = React.useState(false);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [selectCancelReason, setSelectCancelReason] = React.useState('');

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

    if (window.location.pathname === '/p2p/order/detail/undefined') {
        window.location.replace('/p2p');
    }

    if (window.location.pathname === '/p2p/order/detail/undefined') {
        window.location.replace('/p2p');
    }

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
                                    <h2 className="text-white countdown-number mb-0">
                                        {days >= 10
                                            ? dayArray[0]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2 className="text-white countdown-number mb-0">
                                        {days >= 10
                                            ? dayArray[1]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : dayArray[0]}
                                    </h2>
                                </div>

                                <h2 className="mt-2">:</h2>

                                <div className="d-flex flex-row">
                                    <h2 className="text-white countdown-number mb-0">
                                        {hours >= 10
                                            ? hourArray[0]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2 className="text-white countdown-number mb-0">
                                        {hours >= 10
                                            ? hourArray[1]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : hourArray[0]}
                                    </h2>
                                </div>

                                <h2 className="mt-2">:</h2>
                            </>
                        )}
                        <div className="d-flex flex-row">
                            <h2 className="text-white countdown-number mb-0">
                                {minutes >= 10
                                    ? minuteArray[0]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className="text-white countdown-number mb-0">
                                {minutes >= 10
                                    ? minuteArray[1]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : minuteArray[0]}
                            </h2>
                        </div>

                        <h2 className="mt-2">:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="text-white countdown-number mb-0">
                                {seconds >= 10
                                    ? secondArray[0]
                                    : Number.isNaN(secondArray[0]) || Number.isNaN(secondArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className="text-white countdown-number mb-0">
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
                            <h2 className="text-white countdown-number mb-0">0</h2>
                            <h2 className="text-white countdown-number mb-0">0</h2>
                        </div>

                        <h2>:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="text-white countdown-number mb-0">0</h2>
                            <h2 className="text-white countdown-number mb-0">0</h2>
                        </div>

                        <h2>:</h2>

                        <div className="d-flex flex-row">
                            <h2 className="text-white countdown-number mb-0">0</h2>
                            <h2 className="text-white countdown-number mb-0">0</h2>
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

    const renderModalReport = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-8">
                    <span onClick={() => setShowModalReport(!showModalReport)} className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-24 radius-md border-b-1 dark-bg-accent p-3">
                    <div className="d-flex align-items-center">
                        <img src="/img/coin.png" className="icon-lg" alt="" />
                        <div className="ml-3">
                            <p className="text-ms mb-2 white-text font-normal">
                                {detail?.offer?.fiat} CRYPTO <CheckFillIcon />
                            </p>
                            <p className="mb-1 grey-text-accent text-sm">30D Trades</p>
                            <p className="mb-1 grey-text-accent text-sm">30D Completetition Rate</p>
                        </div>
                    </div>
                    <div className="ml-2">
                        <></>
                        <p className="mb-1 grey-text-accent text-sm text-right">{detail?.order?.stats?.mount_trade}</p>
                        <p className="mb-1 grey-text-accent text-sm text-right">
                            {detail?.order?.stats?.completed_rate} %
                        </p>
                    </div>
                </div>

                <div>
                    <h1 className="m-0 p-0 white-text text-ms font-semibold mb-12">Log Transaction Dispute</h1>
                    <p className="m-0 p-0 grey-text-accent text-sm mb-24">
                        Lorem ipsum dolor sit amet consectetur. Aliquam lectus id pharetra eget placerat suscipit neque
                        ornare. Ultrices commodo morbi duis elementum diam ultrices nulla convallis nibh.
                    </p>

                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">QR Code (Optional)</label>
                        <input
                            id="payment"
                            type="file"
                            name="payment"
                            onChange={(e) => {
                                setUplodPayment(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                            }}
                            placeholder="Enter Full Name"
                            className="custom-input-add-payment w-100 white-text d-none"
                        />
                        <label
                            htmlFor="payment"
                            className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent border-1 p-16 radius-lg mb-16">
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <UploadIcon />
                                <p className="m-0 p-0 text-xxs grey-text">{fileName ? fileName : 'Upload'}</p>
                            </div>
                        </label>
                        <p className="m-0 p-0 text-right grey-text-accent text-xxs font-bold">
                            JPG,SVG,PNG, GIF and PDF, Maximum file size is 20MB.
                        </p>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Didn’t Not Receive My Stable Coin"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) => item.message.includes('Didn’t Not Receive My Stable Coin'))}
                            value={'Didn’t Not Receive My Stable Coin'}
                            className="m-0 p-0 check-with-label"
                        />
                        <label htmlFor="Didn’t Not Receive My Stable Coin" className="m-0 p-0 grey-text-accent text-sm">
                            Didn’t Not Receive My Stable Coin
                        </label>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Transaction Taking To Long"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) => item.message.includes('Transaction Taking To Long'))}
                            value={'Transaction Taking To Long'}
                            className="m-0 p-0"
                        />
                        <label htmlFor="Transaction Taking To Long" className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Taking To Long
                        </label>
                    </div>

                    <div className="mb-24 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="Transaction Ammount Is Different to Order Value"
                            name="selected"
                            onChange={handleChecked}
                            checked={reason.find((item) =>
                                item.message.includes('Transaction Ammount Is Different to Order Value')
                            )}
                            value={'Transaction Ammount Is Different to Order Value'}
                            className="m-0 p-0"
                        />
                        <label
                            htmlFor="Transaction Ammount Is Different to Order Value"
                            className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Ammount Is Different to Order Value
                        </label>
                    </div>

                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">Your Message</label>
                        <textarea
                            placeholder=""
                            name="message"
                            value={text_message}
                            onChange={(e) => setTextMessage(e.target.value)}
                            className="form-message border-1 radius-lg p-16 white-text w-100"></textarea>
                    </div>

                    <button
                        type="button"
                        onClick={handleReport}
                        disabled={(!reason && !reason[0]) || !text_message || createReportLoading}
                        className="btn-primary w-100">
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    const renderModalConfirmRelease = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-8">
                    <span onClick={() => setShowModalSellConfrim(!showModalSellConfirm)} className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-24">
                    <CommentIcon />
                </div>
                <h1 className="m-0 p-0 mb-24 text-center grey-text-accent text-lg font-bold">Confirm release</h1>
                <div
                    className="d-flex align-items-center mb-24 cursor-pointer"
                    onClick={() => setSelectConfirmRelease('no-receive')}>
                    <div className="icon-sm">
                        {selectConfirmRelease == 'no-receive' ? <ActiveCheck /> : <GreyCheck />}
                    </div>
                    <p className="mb-0 text-sm grey-text-accent ml-3">I have not receive payment from the buyer</p>
                </div>
                <div className="d-flex align-items-center mb-24" onClick={() => setSelectConfirmRelease('receive')}>
                    <div className="icon-sm">{selectConfirmRelease == 'receive' ? <ActiveCheck /> : <GreyCheck />}</div>
                    <p className="mb-0 text-sm grey-text-accent cursor-pointer ml-3">
                        I have received the correct amount. Payment sender matches the buyer’s verified name on Heaven
                        Ecchange, and i agree to release mu crypto to the buyer
                    </p>
                </div>
                <p className="mb-2 text-sm grey-text-accent">Tips</p>
                <ul className="ml-0 pl-3 mb-24">
                    <li className="text-sm grey-text-accent">
                        Do not only check th buyer’s payment proof. Make sure to long into your account and verify
                        payment is received!
                    </li>
                    <li className="text-sm grey-text-accent">
                        If the payment is still processing, wait until you have received payment in your account before
                        releasing the crypto!
                    </li>
                    <li className="text-sm grey-text-accent">
                        Do NOT accept payment from a third-party account. Refund the amount immediately if you receive
                        such payment to avoid financial losses caused by bank chargerback after you have released
                        crypto.
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
        );
    };

    const renderModalBuyOrderCompleted = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-end mb-8">
                    <span
                        onClick={() => setShowModalBuyOrderCompleted(!showModalBuyOrderCompleted)}
                        className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="d-flex justify-content-center align-items-center w-100 mb-24">
                    <img src="/img/p2pcalendar.png" alt="completed" width={104} height={106} />
                </div>
                <h1 className="m-0 p-0 white-text text-ms font-bold text-center mb-24">Buy Order Completed</h1>

                <div className="d-flex justify-content-between align-items-center gap-48 mb-24">
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Amount</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">Rp {detail?.order?.amount}</p>
                    </div>
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Price</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">Rp {detail?.offer?.price}</p>
                    </div>
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Quantity</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">9.52 {detail?.offer?.fiat}</p>
                    </div>
                </div>

                <button onClick={handleConfirmBuy} className="btn-primary w-100">
                    Continue
                </button>
            </React.Fragment>
        );
    };

    const renderModalCancel = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-8">
                    <span onClick={() => setShowModalCancel(!showModalCancel)} className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    <img src="/img/warningp2p.png" alt="warning" width={68} height={68} className="mb-16" />
                </div>

                <p className="m-0 p-0 grey-text-accent text-sm">Tips</p>
                <ul className="m-0 p-0 grey-text-accent text-sm mb-16 pl-16">
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
                    <p className="m-0 p-0 grey-text-accent text-sm">Why do you want to cancel the order?</p>
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
                            <p className="m-0 p-0 grey-text text-sm">I dont want to trade anymore</p>
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
                            <p className="m-0 p-0 grey-text text-sm">
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
                            <p className="m-0 p-0 grey-text text-sm">The seller asked for additional fees</p>
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
                            <p className="m-0 p-0 grey-text text-sm">
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
                            <p className="m-0 p-0 grey-text text-sm">Another reason</p>
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

    const renderModalPaymentConfirmation = () => {
        return (
            <div>
                <div className="d-flex justify-content-end mb-8">
                    <span
                        onClick={() => setShowModalPaymentConfirm(!showModalPaymentConfirm)}
                        className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <h1 className="m-0 p-0 mb-24 text-center grey-text-accent text-lg font-bold">Payment Confirmation</h1>
                <p className="m-0 p-0 mb-24 grey-text-accent text-sm">
                    Please confirm that you have successfully transfered the money to the seller throught the following
                    payment method before clicking on the “Transferred, notify seller” button
                </p>

                <div className="modal-bank-info-container mb-24">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center gap-4">
                            <div className="label-payment"></div>
                            <p className="m-0 p-0">Bank Transfer</p>
                        </div>

                        <div className="d-flex align-items-center gap-16">
                            <img
                                src={detail?.order?.payment !== null ? detail.order?.payment?.logo : paymentUser?.logo}
                                alt="logo"
                                width={40}
                                className="h-auto"
                            />

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
                        Tip : I uderstand that I must use the selected payment platform to complete the transfer myself.
                        Heaven will not automatically transfer the payment on my behalf.
                    </p>
                </div>

                <div className="d-flex align-items-center gap-4 mb-24">
                    {selectConfirmPayment ? (
                        <span className="cursor-pointer" onClick={() => setSelectConfirmPayment(!selectConfirmPayment)}>
                            <ActiveCheck />
                        </span>
                    ) : (
                        <span className="cursor-pointer" onClick={() => setSelectConfirmPayment(!selectConfirmPayment)}>
                            <GreyCheck />
                        </span>
                    )}
                    <p className="m-0 p-0 text-xxs grey-text-accent">
                        I have made payment from my real-name verified payment account consistent with my registered
                        name on Heaven.
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
        );
    };

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-order">
                <div className="dark-bg-main mt-3">
                    <BannerP2P />
                </div>

                <div className="container">
                    <HeaderP2P />
                </div>

                <div className="container dark-bg-main d-flex justify-content-between align-items-center p-4">
                    {detail?.order?.state == 'accepted' ? (
                        <div>
                            <div className="d-flex justify-content-start align-items-center gap-8 mb-2">
                                <p className="text-lg white-text font-bold m-0">Order Completed</p>
                                <CheckOutlineIcon />
                            </div>
                            <p className="mb-0 text-sm grey-text">
                                Successfully {side == 'sell' ? 'sold' : 'buy'} {detail?.order?.quantity}{' '}
                                {detail?.offer?.fiat}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-2 text-lg white-text font-bold">
                                {side === 'sell' ? 'Sell' : 'Buy'} {detail?.offer?.fiat}{' '}
                                {side === 'sell' ? 'to' : 'from'} {p2pChat?.target?.member?.email}
                            </p>
                            <p className="mb-0 text-sm grey-text">
                                Order has been made. Please wait for system confirmation.
                            </p>
                        </div>
                    )}
                    <div className="d-flex flex-column align-items-end">
                        {side == 'buy' && detail?.order?.state == 'prepare' && (
                            <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
                        )}

                        {side == 'sell' && detail?.order?.state == 'waiting' && (
                            <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
                        )}

                        <div className="d-flex align-items-center">
                            <span className="grey-text text-sm">Order number</span>
                            <fieldset onClick={doCopyNumber}>
                                <CopyableTextField
                                    value={`${detail?.order?.order_number}`}
                                    className="ml-3 w-100 "
                                    fieldId="kid-code"
                                />
                            </fieldset>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="grey-text text-sm mr-2">Time created</span>
                            <span className="grey-text text-sm">
                                {moment(detail?.order?.created_at).format('YYYY-MM-DD hh:mm:ss')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="d-flex container justify-content-between mt-4 ">
                    <P2POrderStep
                        paymentMethod={paymentMethod}
                        paymentUser={paymentUser}
                        showPayment={showPayment}
                        comment={comment}
                        side={side}
                        detail={detail}
                        order_number={order_number}
                        showModalCancel={showModalCancel}
                        handleChangePaymentMethod={handleChangePaymentMethod}
                        handleChangeComment={handleChangeComment}
                        handleConfirmPaymentBuy={handleConfirmPaymentBuy}
                        handleShowPayment={() => setShowPayment(!showPayment)}
                        handleShowModalBuyOrderCompleted={() =>
                            setShowModalBuyOrderCompleted(!showModalBuyOrderCompleted)
                        }
                        timeLeft={timeLeft}
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        handleShowModalPaymentConfirm={() => setShowModalPaymentConfirm(!showModalPaymentConfirm)}
                        handleShowModalSellConfirm={() => setShowModalSellConfrim(!showModalSellConfirm)}
                        handleShowModalCancel={() => setShowModalCancel(!showModalCancel)}
                        handleShowModalReport={() => setShowModalReport(!showModalReport)}
                        handleSendFeedbackPositive={handleSendFeedbackPositive}
                        handleSendFeedbackNegative={handleSendFeedbackNegative}
                    />

                    <P2PChat
                        detail={detail}
                        order_number={order_number}
                        showChat={showChat}
                        handleExpandChat={() => setShowChat(!showChat)}
                        handleModalReport={() => setShowModalReport(true)}
                    />
                </div>

                <div className="dark-bg-accent">
                    <div className="container">
                        <P2PFAQ />
                    </div>
                </div>

                <Modal show={showModalReport} content={renderModalReport()} />
                <Modal show={showModalSellConfirm} content={renderModalConfirmRelease()} />
                <Modal show={showModalPaymentConfirm} content={renderModalPaymentConfirmation()} />
                <Modal show={showModalBuyOrderCompleted} content={renderModalBuyOrderCompleted()} />
                <Modal show={showModalCancel} content={renderModalCancel()} />
            </div>
        </React.Fragment>
    );
};
