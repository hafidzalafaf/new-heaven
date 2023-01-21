import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDocumentTitle } from '../../../hooks';
import { alertPush } from 'src/modules';
import { HeaderP2P, BannerP2P, OrderP2PTable } from 'src/desktop/containers';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
    Wallet,
    ArrowDown,
    ArrowDownMd,
    AttachmentIcon,
    SendIcon,
    CheckFillIcon,
} from '../../../assets/images/P2PIcon';

export const P2PWalletOrderScreen: React.FC = () => {
    const dispatch = useDispatch();
    const [seconds, setSeconds] = useState(30000);
    const [timerActive, setTimerActive] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showChat, setShowChat] = useState(true);

    useDocumentTitle('P2P || Order');

    const doCopyNumber = () => {
        copy('kid-code');
        dispatch(alertPush({ message: ['Order Number copied'], type: 'success' }));
    };

    useEffect(() => {
        let timer = null;
        if (timerActive) {
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1000);

                if (seconds === 0) {
                    setTimerActive(false);
                    setSeconds(30000);
                }
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    });

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
                    <div>
                        <p className="mb-2 text-lg white-text font-bold">Buy USDT from USDTCYPTO</p>
                        <p className="mb-0 text-sm grey-text">
                            Order has been made. Please wait for system confirmation.
                        </p>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                        <div className="d-flex align-items-center">
                            <div className="second radius-sm mx-1">
                                <p className="mb-0 text-md font-bold white-text text">
                                    {moment(seconds).format('mm:ss').slice(0, 1)}
                                </p>
                            </div>
                            <div className="second radius-sm mx-1">
                                <p className="mb-0 text-md font-bold white-text text">
                                    {moment(seconds).format('mm:ss').slice(1, 2)}
                                </p>
                            </div>
                            <p className="dots grey-text-accent mb-0 white-text">:</p>
                            <div className="second radius-sm mx-1">
                                <p className="mb-0 text-md font-bold white-text text">
                                    {moment(seconds).format('mm:ss').slice(3, 4)}
                                </p>
                            </div>
                            <div className="second radius-sm mx-1">
                                <p className="mb-0 text-md font-bold white-text text">
                                    {moment(seconds).format('mm:ss').slice(4, 5)}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="grey-text text-sm">Order number</span>
                            <fieldset onClick={doCopyNumber}>
                                <CopyableTextField
                                    value={'20000000000000000000'}
                                    className="ml-3 w-100 "
                                    fieldId="kid-code"
                                />
                            </fieldset>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="grey-text text-sm mr-2">Time created</span>
                            <span className="grey-text text-sm">2022-12-16 08:54:57</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex container justify-content-between mt-4 ">
                    <div className="mb-4 left-side">
                        <p className="mb-3 text-sm font-bold white-text">Order Steps</p>
                        <div className="d-flex align-items-center justofy-content-between mb-3">
                            <div className="arrow active arrow-right"> Transfers Payment To Seller</div>
                            <div className="arrow active  arrow-right"> Pending Seller to Release Cryptos</div>
                            <div className="arrow  arrow-right"> Completed Order</div>
                        </div>
                        <div className="order-form dark-bg-main d-flex radius-md pt-5 p-4">
                            <div className="line"></div>
                            <div>
                                <div className="mb-36 payment-form">
                                    <p className="mb-2 text-ms font-semibold white-text">Confirm Order Info</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="mb-1">
                                            <span className="text-xs grey-text-accent">Amount</span>
                                            <p className="text-sm white-text font-semibold">Rp 150,000.00</p>
                                        </div>
                                        <div className="mb-1">
                                            <span className="text-xs grey-text-accent">Price</span>
                                            <p className="text-sm white-text font-semibold">Rp 15,755.00</p>
                                        </div>
                                        <div className="mb-1">
                                            <span className="text-xs grey-text-accent">Quantity</span>
                                            <p className="text-sm white-text font-semibold">9.52 USDT</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-36 payment-form">
                                    <p className="mb-0 text-ms font-semibold white-text">
                                        Transfer Funds To The Seller's Account Provided Below
                                    </p>
                                    <p className="mb-1 text-xs grey-text-accent font-semibold">
                                        Heaven only supports real-name verified payment methods
                                    </p>
                                    <div className="payment">
                                        <div
                                            className="header-payment d-flex justify-content-between align-items-center mt-3 cursor-pointer"
                                            onClick={() => setShowPayment(!showPayment)}>
                                            <p className="mb-0">
                                                <Wallet />
                                                <span className="mb-0 ml-3 text-sm white-text font-semibold">
                                                    Payment Methods
                                                </span>
                                            </p>
                                            <div className={`${showPayment ? 'rotate-180' : ''}`}>
                                                <ArrowDown />
                                            </div>
                                        </div>
                                        <div className={`content-payment ${showPayment ? 'hide' : ''}`}>
                                            <div className="d-flex align-items-center justify-content-end flex-wrap ">
                                                <img
                                                    src="/img/logo-bca.png"
                                                    className="bank-logo mx-2"
                                                    alt="bank logo"
                                                />
                                                <img
                                                    src="/img/logo-dana.png"
                                                    className="bank-logo mx-2"
                                                    alt="bank logo"
                                                />
                                                <img
                                                    src="/img/logo-jago.png"
                                                    className="bank-logo mx-2"
                                                    alt="bank logo"
                                                />
                                                <img
                                                    src="/img/logo-shopee.png"
                                                    className="bank-logo mx-2"
                                                    alt="bank logo"
                                                />
                                            </div>
                                        </div>
                                        <div className={`content-payment-expand ${showPayment ? '' : 'hide'}`}>
                                            <div className="payment-item">
                                                <div className="payment-item_title">
                                                    <img src="/img/logo-jago.png" className="bank-logo" alt="" />
                                                </div>
                                                <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                    AT. Ade Sumargo
                                                </p>
                                                <p className="primary-text text-xs font-semibold mb-0"> 00001111</p>
                                            </div>
                                            <div className="payment-item">
                                                <div className="payment-item_title">
                                                    <img src="/img/logo-shopee.png" className="bank-logo" alt="" />
                                                </div>
                                                <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                    AT. Ade Sumargo
                                                </p>
                                                <p className="primary-text text-xs font-semibold mb-0"> 00001111</p>
                                            </div>
                                            <div className="payment-item">
                                                <div className="payment-item_title">
                                                    <img src="/img/logo-bca.png" className="bank-logo" alt="" />
                                                </div>
                                                <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                    AT. Ade Sumargo
                                                </p>
                                                <p className="primary-text text-xs font-semibold mb-0"> 00001111</p>
                                            </div>
                                            <div className="payment-item">
                                                <div className="payment-item_title">
                                                    <img src="/img/logo-dana.png" className="bank-logo" alt="" />
                                                </div>
                                                <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                    AT. Ade Sumargo
                                                </p>
                                                <p className="primary-text text-xs font-semibold mb-0"> 00001111</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" payment-form last">
                                    <p className="mb-3 text-ms font-semibold white-text">
                                        After transferring funds. Click the button "Confirm"
                                    </p>
                                    <div className="d-flex">
                                        <button className="btn btn-primary mr-5 px-5">Confirm</button>
                                        <button className="btn btn-transparent btn-inline w-auto font-semibold text-danger">
                                            Cancel Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 right-side dark-bg-main p-3">
                        <div className="d-flex justify-content-between align-items-center mb-24">
                            <h6 className="mb-0 text-md font-bold white-text">Chat Information </h6>
                            <div className="ml-2 cursor-pointer" onClick={() => setShowChat(!showChat)}>
                                <ArrowDownMd />
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-3 radius-md border-b-1 dark-bg-accent p-3">
                            <div className="d-flex align-items-center">
                                <img src="/img/coin.png" className="icon-lg" alt="" />
                                <div className="ml-3">
                                    <p className="text-ms mb-2 white-text font-normal">
                                        {' '}
                                        USDT CRYPTO <CheckFillIcon />
                                    </p>
                                    <p className="mb-1 grey-text-accent text-sm">30D Trades</p>
                                    <p className="mb-1 grey-text-accent text-sm">30D Completetition Rate</p>
                                </div>
                            </div>
                            <div className="ml-2">
                                <p className="text-xs my-2 danger-text font-normal text-right">Report</p>
                                <p className="mb-1 grey-text-accent text-sm text-right">1,419</p>
                                <p className="mb-1 grey-text-accent text-sm text-right">90,01%</p>
                            </div>
                        </div>
                        {showChat && (
                            <div className="chat-wrap position-relative">
                                <div className="chat">
                                    <div className="sender-chat">
                                        <p className="sender-name text-xxs text-white">Bambang</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">
                                                Yowes aku pesen komodone 12 yo mas
                                            </span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="my-chat">
                                        <p className="sender-name text-xxs text-white">You</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">
                                                Yowes deal mas, ditunggu 2 dino ya mas
                                            </span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="sender-chat">
                                        <p className="sender-name text-xxs text-white">Bambang</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">Lahh pie to mas ?</span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="my-chat">
                                        <p className="sender-name text-xxs text-white">You</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">
                                                Siki aku dadi jasa travel komodo mas, menowo njenengan purun ?
                                            </span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="my-chat">
                                        <p className="sender-name text-xxs text-white">You</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">
                                                Lohh Ora sido mas, saiki aku ora dodolan
                                            </span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="sender-chat">
                                        <p className="sender-name text-xxs text-white">Bambang</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">Ditunggu</span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="sender-chat">
                                        <p className="sender-name text-xxs text-white">Bambang</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">Y</span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="my-chat">
                                        <p className="sender-name text-xxs text-white">You</p>
                                        <div className="buble-chat">
                                            <span className="white-text text-xs">Sudah dikirim Ya Mas</span>
                                            <div className="time grey-text-accent text-xxs">13.01</div>
                                        </div>
                                    </div>

                                    <div className="chat-notification py-1 px-2 my-1">
                                        <p className="mb-0 text-xxs text-center font-normal primary-text">
                                            You have marked the order as paid, please wait for seller to confirm and
                                            release the asset.
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
                                <div className="chat-writing">
                                    <textarea
                                        placeholder="write a message"
                                        className="form-transparent white-text w-100"></textarea>
                                    <div className="ml-0 d-flex align-items-center">
                                        <label htmlFor="attachment-file" className="cursor-pointer mb-0">
                                            <AttachmentIcon />
                                        </label>
                                        <input type="file" id="attachment-file" className="d-none" />
                                        <button type="button" className="btn btn-transparent p-0 ml-2">
                                            <SendIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
