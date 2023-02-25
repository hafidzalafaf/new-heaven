import * as React from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import {
    orderDetailFetch,
    selectP2POrderDetail,
    orderConfirmPayment,
    orderConfirmSell,
    orderCancel,
    selectP2PConfirmPaymentSuccess,
    selectP2PConfirmSellSuccess,
    selectP2PCancelSuccess,
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
import ReactMomentCountDown from 'react-moment-countdown';
import moment from 'moment';

export const P2PWalletOrderScreen: React.FC = () => {
    useDocumentTitle('P2P || Order');
    const dispatch = useDispatch();
    const { order_number = '' } = useParams<{ order_number?: string }>();
    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;
    const history = useHistory();

    const detail = useSelector(selectP2POrderDetail);
    const paymentConfirmSuccess = useSelector(selectP2PConfirmPaymentSuccess);
    const confirmSellSuccess = useSelector(selectP2PConfirmSellSuccess);
    const cancelSuccess = useSelector(selectP2PCancelSuccess);
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
    const [checkModalOne, setcheckModalOne] = React.useState(false);
    const [checkModalTwo, setcheckModalTwo] = React.useState(false);
    const [orderNumber, setOrderNumber] = React.useState(order_number);

    const [comment, setComment] = React.useState('');
    const [showModalSellConfirm, setShowModalSellConfrim] = React.useState(false);
    const [showModalBuyOrderCompleted, setShowModalBuyOrderCompleted] = React.useState(false);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [active, setActive] = React.useState('');

    /* ============== REPORT STATE START =============== */
    const [showModalReport, setShowModalReport] = React.useState(true);
    const [reason, setReason] = React.useState([]);
    const [upload_payment, setUplodPayment] = React.useState<any>();
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

    if (window.location.pathname === '/p2p/wallet/order/undefined') {
        window.location.replace('/p2p');
    }

    if (window.location.pathname === '/p2p/wallet/order/undefined') {
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
        const fetchInterval = setInterval(() => {
            dispatch(orderDetailFetch({ offer_number: order_number }));
        }, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dispatch, order_number]);

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
            payment_method: paymentMethod,
        };

        dispatch(orderConfirmPayment(payload));
    };

    const handleConfirmSell = () => {
        const payload = {
            order_number: order_number,
        };

        dispatch(orderConfirmSell(payload));
        setShowModalSellConfrim(false);
    };

    const handleConfirmBuy = () => {
        // const payload = {
        //     order_number: order_number,
        // };

        // dispatch(orderConfirmSell(payload));
        setShowModalBuyOrderCompleted(false);
    };

    const handleCancelOrder = () => {
        const payload = {
            order_number: order_number,
        };

        dispatch(orderCancel(payload));
        setShowModalCancel(false);
    };

    const doCopyNumber = () => {
        copy('kid-code');
        dispatch(alertPush({ message: ['Order Number copied'], type: 'success' }));
    };

    const disableButton = !checkModalOne || !checkModalTwo;

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
    }, [createReportSuccess]);

    React.useEffect(() => {
        //Print data each time the checkbox is "checked" or "unchecked"
        console.log(reason);
    }, [reason]);

    const handleChecked = (e) => {
        let newArray = [...reason, { key: e.target.name, message: e.target.value }];
        if (reason?.includes(e.target.value)) {
            newArray = newArray.filter((value) => value !== e.target.value);
        }
        setReason(newArray);
    };

    /* ============== REPORT FUNCTION END =============== */

    const renderModalReport = () => {
        return (
            <div>
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
                            id="custom-input-file"
                            type="file"
                            // value={inputFile}
                            onChange={(e) => {
                                setInputFile(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                            }}
                            placeholder="Enter Full Name"
                            className="custom-input-add-payment w-100 white-text d-none"
                        />
                        <label
                            htmlFor="custom-input-file"
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
                            onFocus={(e) =>
                                reason?.map((el) =>
                                    el?.key == 'message' ? (el['message'].message = e.target.value) : e.target.value
                                )
                            }
                            onBlur={handleChecked}
                            className="form-message border-1 radius-lg p-16 white-text w-100"></textarea>
                    </div>

                    <button className="btn-primary w-100" type="button">
                        Submit The Sidepute
                    </button>
                </div>
            </div>
        );
    };

    const renderModalConfirmRelease = () => {
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center mb-24">
                    <CommentIcon />
                </div>
                <div
                    className="d-flex align-items-center mb-24 cursor-pointer"
                    onClick={() => setcheckModalOne(!checkModalOne)}>
                    <div className="icon-sm">{checkModalOne ? <ActiveCheck /> : <GreyCheck />}</div>
                    <p className="mb-0 text-sm grey-text-accent ml-3">I have not receive payment from the buyer</p>
                </div>
                <div className="d-flex align-items-center mb-24" onClick={() => setcheckModalTwo(!checkModalTwo)}>
                    <div className="icon-sm">{checkModalTwo ? <ActiveCheck /> : <GreyCheck />}</div>
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
                    className={`${
                        disableButton ? 'button-grey white-text ' : 'btn-primary'
                    } text-sm py-3 btn btn-block`}
                    disabled={disableButton}
                    onClick={handleConfirmSell}>
                    Confirm
                </button>
            </div>
        );
    };

    const renderModalBuyOrderCompleted = () => {
        return (
            <React.Fragment>
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

                <button onClick={() => handleConfirmBuy()} className="btn-primary w-100">
                    Continue
                </button>
            </React.Fragment>
        );
    };

    const renderModalCancel = () => {
        return (
            <div>
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
                            {active == 'I dont want to trade anymore' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('I dont want to trade anymore')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">I dont want to trade anymore</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active ==
                            'I did not comply with the obligations related to the advertising trade terms and conditions' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setActive(
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
                            {active == 'The seller asked for additional fees' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('The seller asked for additional fees')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">The seller asked for additional fees</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active ==
                            'An issue with the sellers payment method resulted in an unsuccessful payment' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setActive(
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
                            {active == 'Another reason' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('Another reason')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">Another reason</p>
                        </div>
                    </div>
                </div>

                <button onClick={handleCancelOrder} className="btn-primary w-100">
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
                <Modal show={showModalBuyOrderCompleted} content={renderModalBuyOrderCompleted()} />
                <Modal show={showModalCancel} content={renderModalCancel()} />
            </div>
        </React.Fragment>
    );
};
