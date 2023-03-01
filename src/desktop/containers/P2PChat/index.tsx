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
import { ArrowDownMd, CheckFillIcon, AttachmentIcon, SendIcon, ZoomIcon } from 'src/assets/images/P2PIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { DownloadSecondaryIcon } from 'src/assets/images/DownloadIcon';
import moment from 'moment';
import { Modal } from 'src/desktop/components';
import { Loading } from 'src/components';

export interface P2PChatProps {
    detail: any;
    order_number: string;
    showChat: boolean;
    handleExpandChat: () => void;
    handleModalReport: () => void;
}

export const P2PChat: React.FunctionComponent<P2PChatProps> = (props) => {
    const { detail, order_number, showChat, handleExpandChat, handleModalReport } = props;
    const dispatch = useDispatch();
    const profile = useSelector(selectP2PProfile);
    const p2pChat = useSelector(selectP2PChat);
    const p2pChatLoading = useSelector(selectP2PChatLoading);
    const p2pChatSuccess = useSelector(selectP2PChatSuccess);
    const p2pChatCreateLoading = useSelector(selectP2PChatCreateLoading);
    const p2pChatCreateSuccess = useSelector(selectP2PChatCreateSuccess);
    const [message, setMessage] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [chats, setChats] = React.useState([]);
    const [showImage, setShowImage] = React.useState(false);
    const [imageView, setImageView] = React.useState('');
    const [imageBlog, setImageBlob] = React.useState('');
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

                // const formData = new FormData();
                // formData.append('message', message);
                // formData.append('order_number', order_number);

                const payload = {
                    message: imageBlog ? image : message,
                    offer_number: order_number,
                };
                dispatch(orderChatCreate(payload));
            }
        }
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('message', message);
        const payload = {
            message: imageBlog ? image : message,
            offer_number: order_number,
        };
        dispatch(orderChatCreate(payload));
    };

    const onImageChange = (e) => {

        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setImageBlob(URL.createObjectURL(img));
            // setImage({
            //     lastModified: e.target.files[0].lastModified,
            //     lastModifiedDate: e.target.files[0].lastModifiedDate,
            //     name: e.target.files[0].name,
            //     size: e.target.files[0].size,
            //     type: e.target.files[0].type,
            //     webkitRelativePath: e.target.files[0].webkitRelativePath,
            // });
            // setImage(e.target.files[0]);
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
            <div className="mb-4 right-side dark-bg-main p-3 p2p-chat-component-container">
                <div className="d-flex justify-content-between align-items-center mb-24">
                    <h6 className="mb-0 text-md font-bold white-text">Chat Information </h6>
                    <div className="ml-2 cursor-pointer" onClick={handleExpandChat}>
                        <ArrowDownMd />
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3 radius-md border-b-1 dark-bg-accent p-3">
                    <div className="d-flex align-items-center">
                        <img src="/img/coin.png" className="icon-lg" alt="" />
                        <div className="ml-3">
                            <p className="text-ms mb-2 white-text font-normal">
                                {p2pChat?.target?.member?.email} <CheckFillIcon />
                            </p>
                            <p className="mb-1 grey-text-accent text-sm">30D Trades</p>
                            <p className="mb-1 grey-text-accent text-sm">30D Completetition Rate</p>
                        </div>
                    </div>
                    <div className="ml-2">
                        <p
                            onClick={handleModalReport}
                            className="text-xs my-2 danger-text font-normal text-right cursor-pointer">
                            Report
                        </p>
                        <p className="mb-1 grey-text-accent text-sm text-right">{detail?.order?.stats?.mount_trade}</p>
                        <p className="mb-1 grey-text-accent text-sm text-right">
                            {detail?.order?.stats?.completed_rate} %
                        </p>
                    </div>
                </div>
                {showChat && (
                    <div className="chat-wrap position-relative">
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
                                            <p className="sender-name text-xxs text-white">
                                                {chat?.p2p_user?.member?.uid === profile?.member?.uid
                                                    ? 'You'
                                                    : chat?.p2p_user?.username
                                                    ? chat?.p2p_user?.username
                                                    : chat?.p2p_user?.member?.email}
                                            </p>
                                            <div className="buble-chat">
                                                {chat?.chat?.includes('{') ? (
                                                    <p className="white-text text-xs content-chat">
                                                        {chat?.chat.toString().replaceAll('=>', ':')}
                                                    </p>
                                                ) : (
                                                    // <img
                                                    //     src={URL.createObjectURL(
                                                    //         JSON.parse(chat?.chat?.toString().replaceAll('=>', ':'))
                                                    //     )}
                                                    //     onClick={() => {
                                                    //         setShowImage(true);
                                                    //         setImageView(chat?.chat);
                                                    //     }}
                                                    //     alt="chat"
                                                    //     width={200}
                                                    // />
                                                    // ) : (
                                                    <span className="white-text text-xs content-chat">
                                                        {chat?.chat}
                                                    </span>
                                                )}

                                                <div className="time grey-text-accent text-xxs">
                                                    {moment(chat?.updated_at).format('HH:mm')}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}

                                <div className="chat-notification py-1 px-2 my-1">
                                    <p className="mb-0 text-xxs text-center font-normal primary-text">
                                        You have marked the order as paid, please wait for seller to confirm and release
                                        the asset.
                                    </p>
                                </div>
                                <div className="chat-notification py-1 px-2 my-1">
                                    <p className="mb-0 text-xxs text-center font-normal primary-text">
                                        Successfully placed an order, please pay within the time limit.
                                    </p>
                                </div>

                                <div className="date my-2">
                                    <p className="mb-0 text-xs grey-text text-center">12-01-2022</p>
                                </div>
                            </div>
                        )}

                        {imageBlog?.includes('blob') && (
                            <div style={{ width: '200px' }} className="position-relative">
                                <img src={imageBlog} alt="chat" width={200}></img>
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
                                        setImageView(imageBlog);
                                    }}
                                    className="position-absolute btn-zoom cursor-pointer">
                                    <ZoomIcon />
                                </span>
                            </div>
                        )}
                        <form className="chat-writing">
                            <textarea
                                disabled={
                                    detail?.order?.state == 'canceled' ||
                                    detail?.order?.state == 'accepted' ||
                                    detail?.order?.state == 'success' ||
                                    (imageBlog && true)
                                }
                                onKeyDown={handleSubmitChat}
                                placeholder={
                                    imageBlog
                                        ? 'Send image..'
                                        : detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting'
                                        ? 'write a message..'
                                        : 'Trasaction end.'
                                }
                                value={imageBlog ? '' : message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                                className="form-transparent white-text w-100"></textarea>
                            <div className="ml-0 d-flex align-items-center">
                                <label
                                    htmlFor="attachment-file"
                                    className={`mb-0 ${
                                        (detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting') &&
                                        'cursor-pointer'
                                    }`}>
                                    <AttachmentIcon
                                        fillColor={
                                            detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting'
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
                                <button
                                    disabled={
                                        detail?.order?.state == 'canceled' ||
                                        detail?.order?.state == 'accepted' ||
                                        detail?.order?.state == 'success'
                                    }
                                    onClick={handleSendChat}
                                    type="button"
                                    className="btn btn-transparent p-0 ml-2">
                                    <SendIcon
                                        fillColor={
                                            detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting'
                                                ? '#B5B3BC'
                                                : '#6F6F6F'
                                        }
                                    />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <Modal show={showImage} content={renderModalImageViewer()} />
            </div>
        </React.Fragment>
    );
};
