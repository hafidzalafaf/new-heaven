import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useDocumentTitle } from '../../../hooks';
import { alertPush } from 'src/modules';
import { HeaderP2P, BannerP2P, OrderP2PTable } from 'src/desktop/containers';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Wallet, ArrowDown } from '../../../assets/images/P2PIcon';

export const P2PWalletOrderScreen: React.FC = () => {
    const dispatch = useDispatch();
    const [seconds, setSeconds] = useState(30000);
    const [timerActive, setTimerActive] = useState(false);

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
                        <div className="order-form dark-bg-main radius-md pt-5 p-4">
                            <div className="mb-24">
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
                            <div className="mb-24">
                                <p className="mb-0 text-ms font-semibold white-text">
                                    Transfer Funds To The Seller's Account Provided Below
                                </p>
                                <p className="mb-2 text-xs grey-text-accent font-semibold">
                                    Heaven only supports real-name verified payment methods
                                </p>
                                <div className="payment">
                                    <div className="header-payment d-flex justify-content-between align-items-center mt-24">
                                        <p className="mb-0">
                                            <Wallet />
                                            <span className="mb-0 ml-3 text-sm white-text font-semibold">
                                                Payment Methods
                                            </span>
                                        </p>
                                        <ArrowDown />
                                    </div>
                                    <div className="content-payment hide ">
                                        <div className="d-flex align-items-center justify-content-end flex-wrap ">
                                            <img src="/img/logo-bca.png" className="bank-logo mx-2" alt="bank logo" />
                                            <img src="/img/logo-dana.png" className="bank-logo mx-2" alt="bank logo" />
                                            <img src="/img/logo-jago.png" className="bank-logo mx-2" alt="bank logo" />
                                            <img
                                                src="/img/logo-shopee.png"
                                                className="bank-logo mx-2"
                                                alt="bank logo"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 right-side"></div>
                </div>
            </div>
        </React.Fragment>
    );
};
