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
import { ArrowDownMd, CheckFillIcon, AttachmentIcon, SendIcon } from 'src/assets/images/P2PIcon';
import moment from 'moment';

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
    const [chats, setChats] = React.useState([]);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setChats(p2pChat.reverse());
    }, [p2pChat]);

    React.useEffect(() => {
        dispatch(orderChat({ offer_number: order_number }));
        if (p2pChatCreateSuccess) {
            setMessage('');
        }
    }, [dispatch, p2pChatCreateSuccess]);

    const handleSendChat = (e) => {
        if (message) {
            if (e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                const payload = {
                    message,
                    offer_number: order_number,
                };
                dispatch(orderChatCreate(payload));
            }
            // } else {
            //     const payload = {
            //         message,
            //         offer_number: order_number,
            //     };
            //     dispatch(orderChatCreate(payload));
            // }
        }
    };

    return (
        <React.Fragment>
            <div className="mb-4 right-side dark-bg-main p-3">
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
                                USDT CRYPTO <CheckFillIcon />
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
                        <div className="chat">
                            {chats?.map((chat, i) => (
                                <React.Fragment key={i}>
                                    <div
                                        className={
                                            chat?.p2p_user?.uid === profile?.member?.uid ? 'my-chat' : 'sender-chat'
                                        }>
                                        <p className="sender-name text-xxs text-white">
                                            {chat?.p2p_user?.uid === profile?.member?.uid
                                                ? 'You'
                                                : chat?.p2p_user == 'Nusablocks'
                                                ? chat?.p2p_user
                                                : chat?.p2p_user?.email}
                                        </p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">{chat?.chat}</span>
                                            <div className="time grey-text-accent text-xxs">
                                                {moment(chat?.updated_at).format('HH:mm')}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}

                            <div className="chat-notification py-1 px-2 my-1">
                                <p className="mb-0 text-xxs text-center font-normal primary-text">
                                    You have marked the order as paid, please wait for seller to confirm and release the
                                    asset.
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
                        <form className="chat-writing">
                            <textarea
                                onKeyDown={handleSendChat}
                                placeholder="write a message.."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-transparent white-text w-100"></textarea>
                            <div className="ml-0 d-flex align-items-center">
                                <label htmlFor="attachment-file" className="cursor-pointer mb-0">
                                    <AttachmentIcon />
                                </label>
                                <input type="file" id="attachment-file" className="d-none" />
                                <button onClick={handleSendChat} type="button" className="btn btn-transparent p-0 ml-2">
                                    <SendIcon />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
