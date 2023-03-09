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
    selectP2PProfile,
    selectP2PChatLoading,
    selectP2PChatSuccess,
    selectP2PChatCreateLoading,
    selectP2PChatCreateSuccess,
    orderChatCreate,
    p2pProfileFetch,
} from 'src/modules';
import { ModalMobile, ModalFullScreenMobile } from 'src/mobile/components';
import moment from 'moment';
import { capitalizeFirstLetter, copy } from 'src/helpers';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import {
    DropUpMobileIcon,
    ChatMobileIcon,
    DropdownMobileIcon,
    CloseMobileIcon,
    AddArchiveMobileIcon,
    SendChatMobileIcon,
} from 'src/mobile/assets/P2PMobileIcon';
import { VerificationIcon, ActiveCheck, GreyCheck, ZoomIcon } from 'src/assets/images/P2PIcon';
import { DownloadSecondaryIcon } from 'src/assets/images/DownloadIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { Link } from 'react-router-dom';
import { Loading } from 'src/components';

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

    const profile = useSelector(selectP2PProfile);
    const p2pChatLoading = useSelector(selectP2PChatLoading);
    const p2pChatSuccess = useSelector(selectP2PChatSuccess);
    const p2pChatCreateLoading = useSelector(selectP2PChatCreateLoading);
    const p2pChatCreateSuccess = useSelector(selectP2PChatCreateSuccess);

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
    const [showTerms, setShowTerms] = React.useState(false);

    /* ============== CHAT STATE START =============== */
    const [message, setMessage] = React.useState('');
    const [image, setImage] = React.useState<File[]>();
    const [chats, setChats] = React.useState([]);
    const [showImage, setShowImage] = React.useState(false);
    const [imageView, setImageView] = React.useState('');
    const [imageBlob, setImageBlob] = React.useState('');
    const [chatLoading, setChatLoading] = React.useState(false);
    /* ============== CHAT STATE END =============== */

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
                                    <h2
                                        className={`m-0 p-0 gradient-text ${
                                            showChat ? 'text-ms font-extrabold' : 'text-sm'
                                        }`}>
                                        {days >= 10
                                            ? dayArray[0]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2
                                        className={`m-0 p-0 gradient-text ${
                                            showChat ? 'text-ms font-extrabold' : 'text-sm'
                                        }`}>
                                        {days >= 10
                                            ? dayArray[1]
                                            : Number.isNaN(dayArray[0]) || Number.isNaN(dayArray[1])
                                            ? 0
                                            : dayArray[0]}
                                    </h2>
                                </div>

                                <h2
                                    className={`m-0 p-0 gradient-text ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    :
                                </h2>

                                <div className="d-flex flex-row">
                                    <h2
                                        className={`m-0 p-0 gradient-text ${
                                            showChat ? 'text-ms font-extrabold' : 'text-sm'
                                        }`}>
                                        {hours >= 10
                                            ? hourArray[0]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : 0}
                                    </h2>
                                    <h2
                                        className={`m-0 p-0 gradient-text ${
                                            showChat ? 'text-ms font-extrabold' : 'text-sm'
                                        }`}>
                                        {hours >= 10
                                            ? hourArray[1]
                                            : Number.isNaN(hourArray[0]) || Number.isNaN(hourArray[1])
                                            ? 0
                                            : hourArray[0]}
                                    </h2>
                                </div>

                                <h2
                                    className={`m-0 p-0 gradient-text ${
                                        showChat ? 'text-ms font-extrabold' : 'text-sm'
                                    }`}>
                                    :
                                </h2>
                            </>
                        )}
                        <div className="d-flex flex-row">
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                {minutes >= 10
                                    ? minuteArray[0]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                {minutes >= 10
                                    ? minuteArray[1]
                                    : Number.isNaN(minuteArray[0]) || Number.isNaN(minuteArray[1])
                                    ? 0
                                    : minuteArray[0]}
                            </h2>
                        </div>

                        <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            :
                        </h2>

                        <div className="d-flex flex-row">
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                {seconds >= 10
                                    ? secondArray[0]
                                    : Number.isNaN(secondArray[0]) || Number.isNaN(secondArray[1])
                                    ? 0
                                    : 0}
                            </h2>
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
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
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
                        </div>

                        <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            :
                        </h2>

                        <div className="d-flex flex-row">
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
                        </div>

                        <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                            :
                        </h2>

                        <div className="d-flex flex-row">
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
                            <h2 className={`m-0 p-0 gradient-text ${showChat ? 'text-ms font-extrabold' : 'text-sm'}`}>
                                0
                            </h2>
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

    console.log(detail);

    /* ============== REPORT FUNCTION END =============== */

    /* ============== CHAT FUNCTION START =============== */
    React.useEffect(() => {
        setChatLoading(true);
        setTimeout(() => {
            setChatLoading(false);
        }, 3000);
    }, []);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setChats(p2pChat?.room?.reverse());
    }, [p2pChat]);

    React.useEffect(() => {
        dispatch(orderChat({ offer_number: order_number }));
        if (p2pChatCreateSuccess) {
            setMessage('');
            setImageBlob('');
        }

        const fetchInterval = setInterval(() => {
            dispatch(orderChat({ offer_number: order_number }));
        }, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dispatch, p2pChatCreateSuccess]);

    const handleSubmitChat = (e) => {
        if (message) {
            if (e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                const formData = new FormData();
                formData.append('message', imageBlob ? image[0] : message);
                dispatch(orderChatCreate({ message: formData, offer_number: order_number }));
            }
        }
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('message', imageBlob ? image[0] : message);
        dispatch(orderChatCreate({ message: formData, offer_number: order_number }));
    };

    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setImageBlob(URL.createObjectURL(img));
            setImage(e.target.files);
        }
    };

    const download = (url, filename) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            })
            .catch(console.error);
    };

    /* ============== CHAT FUNCTION END =============== */

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

    const renderModalImageViewer = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-end gap-8 mb-16 w-100">
                    <span
                        onClick={() => download(imageView, `heaven-p2p-transaction-${order_number}.png`)}
                        className="cursor-pointer">
                        <DownloadSecondaryIcon />
                    </span>
                    <span onClick={() => setShowImage(false)} className="cursor-pointer">
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="d-flex justify-content-center align-items-center position-relative px-24">
                    <img src={imageView} alt="chat" width={720} />
                </div>
            </React.Fragment>
        );
    };

    const renderModalChat = () => {
        return (
            <React.Fragment>
                <div className="w-100">
                    <div className="position-fixed nav-chat-info-top dark-bg-main">
                        <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                            <div className="d-flex align-items-center gap-8">
                                <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                    {detail?.order?.trades?.username
                                        ? detail?.order?.trades?.username?.toUpperCase()?.slice(0, 1)
                                        : detail?.order?.trades?.email?.toUpperCase()?.slice(0, 1)}
                                </div>
                                <p className="m-0 p-0 text-ms grey-text-accent">
                                    {detail?.order?.trades?.username
                                        ? detail?.order?.trades?.username
                                        : detail?.order?.trades?.email}
                                </p>

                                <span>
                                    <VerificationIcon />
                                </span>
                            </div>
                            <span
                                onClick={() => setShowChat(!showChat)}
                                className="chat-close position-absolute cursor-pointer">
                                <CloseIconFilter />
                            </span>
                        </div>
                        <div className="order-info-container d-flex flex-column gap-16 p-16 w-100">
                            <div className="d-flex align-items-center gap-4">
                                <p className="m-0 p-0 text-ms white-text font-semibold">Order will be cancelled in</p>
                                <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="w-80">
                                    <p className="m-0 p-0 white-text text-sm">
                                        <span className="grey-text">Amount : </span>
                                        {detail?.order?.amount}
                                    </p>
                                </div>

                                <button className="btn-transparent danger-text text-sm w-20 text-right">Report</button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowPayment(!showPayment);
                                    setShowChat(!showChat);
                                }}
                                className="btn-primary white-text text-ms font-normal">
                                Make Payment
                            </button>

                            <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                <span className="dark-bg-main radius-sm p-8 grey-text-accent text-xxs m-0 text-center">
                                    {side === 'buy' && detail?.order?.state == 'prepare'
                                        ? 'Successfully placed an order, please pay within the time limit.'
                                        : side === 'buy' && detail?.order?.state == 'waiting'
                                        ? 'You have made a payment, please wait for the seller to confirm your payment.'
                                        : side === 'sell' && detail?.order?.state == 'prepare'
                                        ? 'You have a new order, please wait for the buyer to make payment.'
                                        : side === 'sell' && detail?.order?.state == 'waiting'
                                        ? `Buyer has made payment, please check your ${detail?.order?.payment?.symbol} account to confirm`
                                        : detail?.order?.state === 'canceled'
                                        ? 'Order was canceled'
                                        : detail?.order?.state === 'rejected' &&
                                          !chats?.find((chat) => chat?.p2p_user?.member?.role == 'superadmin')
                                        ? 'Waiting for support to join...'
                                        : detail?.order?.state === 'rejected' &&
                                          chats?.find((chat) => chat?.p2p_user?.member?.role == 'superadmin')
                                        ? 'Support has joined.'
                                        : 'Order was completed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="chat-wrap">
                        {chatLoading ? (
                            <div className="chat-loading">
                                <Loading />
                            </div>
                        ) : (
                            <div className="chat">
                                {chats?.map((chat, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className={
                                                chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                    ? 'my-chat'
                                                    : 'sender-chat'
                                            }>
                                            <div
                                                className={`d-flex justify-content-start align-items-end gap-16 bubble-chat-container`}>
                                                {chat?.p2p_user?.member?.uid !== profile?.member?.uid && (
                                                    <div className="ava-container d-flex justify-content-center align-items-center">
                                                        <img
                                                            src={
                                                                chat?.p2p_user?.member?.role == 'superadmin'
                                                                    ? '/img/ava-admin.png'
                                                                    : '/img/ava-sender.png'
                                                            }
                                                            alt="ava"
                                                            width={32}
                                                            height={32}
                                                            className=""
                                                        />
                                                    </div>
                                                )}

                                                <div
                                                    className={`w-100 d-flex flex-column  ${
                                                        chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                            ? 'align-items-end justify-content-end'
                                                            : 'align-items-start justify-content-start'
                                                    }`}>
                                                    <p className="sender-name text-xxs text-white">
                                                        {chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                            ? 'You'
                                                            : chat?.p2p_user?.member?.role == 'superadmin'
                                                            ? 'Admin Support'
                                                            : chat?.p2p_user?.username
                                                            ? chat?.p2p_user?.username
                                                            : chat?.p2p_user?.member?.email}
                                                    </p>

                                                    <div
                                                        className={`buble-chat ${
                                                            chat?.p2p_user?.member?.role == 'superadmin' && 'admin'
                                                        }`}>
                                                        {chat?.chat == null ? (
                                                            <img
                                                                src={chat?.upload?.image?.url}
                                                                onClick={() => {
                                                                    setShowImage(true);
                                                                    setImageView(chat?.upload?.image?.url);
                                                                }}
                                                                alt="chat"
                                                                width={200}
                                                            />
                                                        ) : (
                                                            <span className={`white-text text-xs content-chat`}>
                                                                {chat?.chat}
                                                            </span>
                                                        )}

                                                        <div className={`time grey-text-accent text-xxs`}>
                                                            {moment(chat?.updated_at).format('HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {chat?.p2p_user?.member?.uid == profile?.member?.uid && (
                                                    <div className="ava-container d-flex justify-content-center align-items-center">
                                                        <img
                                                            src="/img/avatar.png"
                                                            alt="ava"
                                                            width={32}
                                                            height={32}
                                                            className=""
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}

                                <div className="date my-2">
                                    <p className="mb-0 text-xs grey-text text-center">
                                        {moment(detail?.order?.created_at).format('DD-MM-YYYY')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="position-fixed nav-send-chat-bottom dark-bg-main p-24">
                        {imageBlob?.includes('blob') && (
                            <div style={{ width: '200px' }} className="position-relative">
                                <img src={imageBlob} alt="chat" width={200}></img>
                                <span
                                    onClick={() => {
                                        setMessage(null);
                                        setImageBlob('');
                                    }}
                                    className="position-absolute top-0 btn-close cursor-pointer">
                                    <CloseIconFilter />
                                </span>

                                <span
                                    onClick={() => {
                                        setShowImage(true);
                                        setImageView(imageBlob);
                                    }}
                                    className="position-absolute btn-zoom cursor-pointer">
                                    <ZoomIcon />
                                </span>
                            </div>
                        )}
                        <form className="chat-writing gap-16 w-100">
                            <div>
                                <label
                                    htmlFor="attachment-file"
                                    className={`mb-0 ${
                                        (detail?.order?.state == 'prepare' ||
                                            detail?.order?.state == 'waiting' ||
                                            detail?.order?.state == 'rejected') &&
                                        'cursor-pointer'
                                    }`}>
                                    <AddArchiveMobileIcon
                                        fillColor={
                                            detail?.order?.state == 'prepare' ||
                                            detail?.order?.state == 'waiting' ||
                                            detail?.order?.state == 'rejected'
                                                ? '#B5B3BC'
                                                : '#6F6F6F'
                                        }
                                    />
                                </label>
                                <input
                                    disabled={
                                        detail?.order?.state == 'canceled' ||
                                        detail?.order?.state == 'accepted' ||
                                        detail?.order?.state == 'success'
                                    }
                                    onChange={onImageChange}
                                    type={'file'}
                                    id="attachment-file"
                                    className="d-none"
                                />
                            </div>
                            <textarea
                                disabled={
                                    detail?.order?.state == 'canceled' ||
                                    detail?.order?.state == 'accepted' ||
                                    detail?.order?.state == 'success' ||
                                    (imageBlob && true)
                                }
                                onKeyDown={handleSubmitChat}
                                placeholder={
                                    imageBlob
                                        ? 'Send image..'
                                        : detail?.order?.state == 'prepare' ||
                                          detail?.order?.state == 'waiting' ||
                                          detail?.order?.state == 'rejected'
                                        ? 'Text Message'
                                        : 'Trasaction end.'
                                }
                                value={imageBlob ? '' : message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                                className="form-transparent dark-bg-accent white-text p-16 w-100"></textarea>

                            <button
                                disabled={
                                    detail?.order?.state == 'canceled' ||
                                    detail?.order?.state == 'accepted' ||
                                    detail?.order?.state == 'success'
                                }
                                onClick={handleSendChat}
                                type="button"
                                className="btn-transparent p-0 w-auto">
                                <SendChatMobileIcon
                                    fillColor={
                                        detail?.order?.state == 'prepare' ||
                                        detail?.order?.state == 'waiting' ||
                                        detail?.order?.state == 'rejected'
                                            ? '#B5B3BC'
                                            : '#6F6F6F'
                                    }
                                />
                            </button>
                        </form>
                    </div>
                </div>
            </React.Fragment>
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
                        <h1 className="m-0 p-0 mb-8 text-md font-extrabold white-text">Order Created</h1>

                        <div className="d-flex align-items-center gap-4">
                            <p className="m-0 p-0 text-sm grey-text">Your order has been created</p>
                            <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
                        </div>
                    </div>
                    <div className="order-step-container">
                        <div className="d-flex align-items-center justify-content-between px-12 mt-24 mb-16">
                            <div className={`arrow arrow-right active`}>Transfers Payment To Seller</div>
                            <div className={`arrow arrow-right ${detail?.order?.state !== 'prepare' && 'active'}`}>
                                Pay Seller to Release Cryptos
                            </div>
                            <div
                                className={`arrow arrow-right ${
                                    detail?.order?.state !== 'waiting' &&
                                    detail?.order?.state !== 'rejected' &&
                                    detail?.order?.state !== 'prepare' &&
                                    'active'
                                }`}>
                                Release Crypto and Complete
                            </div>
                        </div>

                        <div className="d-flex flex-column align-items-center justify-content-center gap-8 w-100 mb-24">
                            <p className="m-0 p-0 grey-text text-xxs">
                                Click “Make Payment” button below to go to next step.
                            </p>
                            <span>
                                <DropUpMobileIcon />
                            </span>
                        </div>

                        <div className="mx-24 order-info-container">
                            <div className="d-flex align-items-center justify-content-between w-100 mb-16">
                                <div className="w-80">
                                    <Link
                                        to={`/p2p/profile/${detail?.order?.trades?.uid}`}
                                        className="d-flex align-items-center gap-8">
                                        <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                            {detail?.order?.trades?.username
                                                ? detail?.order?.trades?.username?.toUpperCase()?.slice(0, 1)
                                                : detail?.order?.trades?.email?.toUpperCase()?.slice(0, 1)}
                                        </div>
                                        <p className="m-0 p-0 text-ms grey-text-accent">
                                            {detail?.order?.trades?.username
                                                ? detail?.order?.trades?.username
                                                : detail?.order?.trades?.email}
                                        </p>

                                        <span>
                                            <VerificationIcon />
                                        </span>

                                        <ArrowRight className={''} />
                                    </Link>
                                </div>

                                <div className="w-20">
                                    <div
                                        onClick={() => setShowChat(!showChat)}
                                        className="btn-chat d-flex align-items-center justify-content-center cursor-pointer">
                                        <ChatMobileIcon />
                                        <p className="m-0 p-0 gradient-text text-xxs">Chat</p>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-8 mb-16">
                                <p className="m-0 p-0 text-xxs grey-text">
                                    HeavenExchange is holding the seller’s crypto in the escrow account
                                </p>
                                <p className="m-0 p-0 text-xxs grey-text">HeavenExchange 24/7 customer support</p>
                            </div>

                            <div className="d-flex flex-column gap-16">
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="m-0 p-0 text-sm grey-text">
                                        <span className={`${side == 'buy' ? 'contrast-text' : 'danger-text'}`}>
                                            {capitalizeFirstLetter(side)}
                                        </span>{' '}
                                        {detail?.offer?.fiat}
                                    </p>

                                    <p className="m-0 p-0 text-sm grey-text">Icon</p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="m-0 p-0 text-sm grey-text">Fiat Amount</p>

                                    <p className="m-0 p-0 text-md white-text font-extrabold">{detail?.order?.amount}</p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="m-0 p-0 text-sm grey-text">Price</p>
                                    <p className="m-0 p-0 text-sm grey-text">{detail?.offer?.price}</p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="m-0 p-0 text-sm grey-text">Crypto Amount</p>
                                    <p className="m-0 p-0 text-sm grey-text">
                                        {detail?.order?.quantity} {detail?.offer?.fiat}
                                    </p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="m-0 p-0 text-sm grey-text">Order Number</p>
                                    <p className="m-0 p-0 text-sm grey-text">{detail?.order?.order_number}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mx-24 order-info-container gap-8">
                            <p className="m-0 p-0 white-text text-ms">Payment Method</p>

                            <div className="d-flex align-items-center flex-wrap w-100 gap-8">
                                {detail?.payment_user?.map((bank, i) => (
                                    <div key={i} className="payment d-flex align-items-center gap-4">
                                        <div className="payment-label"></div>
                                        <p className="m-0 p-0 text-xxs grey-text">{bank?.bank}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mx-24 order-info-container gap-8">
                            <div className="d-flex align-items-center justify-content-between">
                                <p className="m-0 p-0 white-text text-ms">Terms</p>

                                <span className="cursor-pointer" onClick={() => setShowTerms(!showTerms)}>
                                    {showTerms ? <DropUpMobileIcon /> : <DropdownMobileIcon />}
                                </span>
                            </div>

                            {showTerms && (
                                <p className="m-0 p-0 text-sm grey-text">{detail?.offer?.term_of_condition}</p>
                            )}
                        </div>
                    </div>

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
                </div>

                <ModalMobile
                    show={showModalCancel}
                    content={renderModalCancel()}
                    className="custom-modal-content-cancel"
                />
                <ModalFullScreenMobile show={showChat} content={renderModalChat()} />

                <div
                    id="off-canvas-payment"
                    className={`position-fixed off-canvas-payment ${showPayment ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-payment overflow-auto">
                        <div className="d-flex justify-content-center align-items-center w-100 position-relative mb-24">
                            <h1 className="text-md grey-text-accent font-extrabold">Select payment method</h1>

                            <span
                                onClick={() => setShowPayment(!showPayment)}
                                className="position-absolute close-canvas cursor-pointer">
                                <CloseMobileIcon />
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-16 mb-64">
                            {detail?.payment_user?.map((bank, i) => (
                                <div key={i} className="modal-bank-info-container cursor-pointer">
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
            </div>
        </React.Fragment>
    );
};
