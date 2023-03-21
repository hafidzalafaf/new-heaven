import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectP2PChat,
    selectP2PChatLoading,
    selectP2PChatSuccess,
    selectP2PChatCreateLoading,
    selectP2PChatCreateSuccess,
    selectP2PProfile,
    orderChat,
    orderChatCreate,
    p2pProfileFetch,
} from 'src/modules';
import { Link, useLocation } from 'react-router-dom';
import { ZoomIcon } from 'src/assets/images/P2PIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { DownloadSecondaryIcon } from 'src/assets/images/DownloadIcon';
import moment from 'moment';
import { Loading } from 'src/components';
import { ModalMobile } from 'src/mobile/components';
import { Countdown } from 'src/mobile/screens';
import { VerificationIcon } from 'src/assets/images/P2PIcon';
import { AddArchiveMobileIcon, SendChatMobileIcon } from 'src/mobile/assets/P2PMobileIcon';

export interface P2PChatMobileProps {
    detail?: any;
    order_number?: string;
    showChat?: boolean;
    timeLeft: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    handleExpandChat?: () => void;
    handleModalReport?: () => void;
    handleMakePayment?: () => void;
}

export const P2PChatMobile: React.FunctionComponent<P2PChatMobileProps> = (props) => {
    const {
        detail,
        order_number,
        showChat,
        timeLeft,
        days,
        hours,
        minutes,
        seconds,
        handleExpandChat,
        handleModalReport,
        handleMakePayment,
    } = props;

    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;
    const dispatch = useDispatch();
    const profile = useSelector(selectP2PProfile);
    const p2pChat = useSelector(selectP2PChat);
    const p2pChatLoading = useSelector(selectP2PChatLoading);
    const p2pChatSuccess = useSelector(selectP2PChatSuccess);
    const p2pChatCreateLoading = useSelector(selectP2PChatCreateLoading);
    const p2pChatCreateSuccess = useSelector(selectP2PChatCreateSuccess);
    const [message, setMessage] = React.useState('');
    const [image, setImage] = React.useState<File[]>();
    const [chats, setChats] = React.useState([]);
    const [showImage, setShowImage] = React.useState(false);
    const [imageView, setImageView] = React.useState('');
    const [imageBlob, setImageBlob] = React.useState('');
    const [chatLoading, setChatLoading] = React.useState(false);

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

    return (
        <React.Fragment>
            <div className="w-100">
                <div className=" nav-chat-info-top dark-bg-main">
                    <div className="d-flex justify-content-center align-items-center position-relative mb-24 w-100">
                        <div className="d-flex align-items-center gap-8">
                            <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                                {p2pChat?.target?.member?.email &&
                                    p2pChat?.target?.member?.email?.toUpperCase()?.slice(0, 1)}
                            </div>
                            <p className="m-0 p-0 text-ms grey-text-accent">
                                {/* {detail?.order?.trades?.username
                                    ? detail?.order?.trades?.username
                                    : detail?.order?.trades?.email} */}

                                {p2pChat?.target?.member?.email}
                            </p>

                            <span>
                                <VerificationIcon />
                            </span>
                        </div>
                        <span onClick={handleExpandChat} className="chat-close position-absolute cursor-pointer">
                            <CloseIconFilter />
                        </span>
                    </div>
                    <div className="order-info-container d-flex flex-column gap-16 p-16 w-100">
                        {detail?.order?.state == 'prepare' ||
                            (detail?.order?.state == 'waiting' && (
                                <div className="d-flex align-items-center gap-4">
                                    <p className="m-0 p-0 text-ms white-text font-semibold">
                                        {detail?.order?.state == 'prepare'
                                            ? 'Order will be cancelled in'
                                            : 'Crypto will be release in'}
                                    </p>
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
                                </div>
                            ))}
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="w-80">
                                <p className="m-0 p-0 white-text text-sm">
                                    <span className="grey-text">Amount : </span>
                                    {detail?.order?.amount}
                                </p>
                            </div>

                            {side == 'sell' && (
                                <button
                                    type="button"
                                    onClick={handleModalReport}
                                    className="btn-transparent danger-text text-sm w-20 text-right">
                                    Report
                                </button>
                            )}
                        </div>

                        {side == 'buy' && detail?.order?.state == 'prepare' && (
                            <button
                                type="button"
                                onClick={handleMakePayment}
                                className="btn-primary white-text text-ms font-normal">
                                Make Payment
                            </button>
                        )}

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
                                        <div className="d-flex align-items-center mb-8 gap-8">
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

                                            <p className="sender-name text-xxs text-white">
                                                {chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                    ? 'You'
                                                    : chat?.p2p_user?.member?.role == 'superadmin'
                                                    ? 'Admin Support'
                                                    : chat?.p2p_user?.username
                                                    ? chat?.p2p_user?.username
                                                    : chat?.p2p_user?.member?.email}
                                            </p>

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

                                        <div
                                            className={`d-flex justify-content-start align-items-end gap-16 bubble-chat-container`}>
                                            <div
                                                className={`w-100 d-flex flex-column  ${
                                                    chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                        ? 'align-items-end justify-content-end'
                                                        : 'align-items-start justify-content-start'
                                                }`}>
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
                                                            className="cursor-pointer"
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

                <ModalMobile show={showImage} content={renderModalImageViewer()} />
            </div>
        </React.Fragment>
    );
};
