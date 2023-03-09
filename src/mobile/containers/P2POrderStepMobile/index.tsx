import * as React from 'react';
import { LikeSuccessIcon, UnLikeDangerIcon, ArrowDown, Wallet } from 'src/assets/images/P2PIcon';
import { CustomInput } from 'src/desktop/components';
import { Link } from 'react-router-dom';
import { DropUpMobileIcon, DropdownMobileIcon, ChatMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { VerificationIcon } from 'src/assets/images/P2PIcon';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { capitalizeFirstLetter } from 'src/helpers';

export interface P2POrderStepMobileProps {
    paymentMethod: string;
    paymentUser: any;
    showPayment: boolean;
    showModalCancel: boolean;
    comment: string;
    side: string;
    detail: any;
    order_number: string;
    handleChangePaymentMethod: (el: any) => void;
    handleChangeComment: (e: string) => void;
    handleConfirmPaymentBuy: () => void;
    handleShowPayment: () => void;
    handleShowModalPaymentConfirm: () => void;
    handleShowModalBuyOrderCompleted: () => void;
    handleShowModalSellConfirm: () => void;
    handleShowModalCancel: () => void;
    handleShowModalReport: () => void;
    handleSendFeedbackPositive: () => void;
    handleSendFeedbackNegative: () => void;
    handleExpandChat: () => void;
    handleExpandTerms: () => void;
    timeLeft: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    showTerms: boolean;
}

export const P2POrderStepMobile: React.FunctionComponent<P2POrderStepMobileProps> = (props) => {
    const {
        paymentMethod,
        paymentUser,
        showPayment,
        showModalCancel,
        comment,
        side,
        detail,
        order_number,
        handleChangePaymentMethod,
        handleChangeComment,
        handleShowPayment,
        handleShowModalPaymentConfirm,
        handleConfirmPaymentBuy,
        handleShowModalBuyOrderCompleted,
        handleShowModalSellConfirm,
        handleShowModalCancel,
        handleShowModalReport,
        handleSendFeedbackPositive,
        handleSendFeedbackNegative,
        handleExpandChat,
        handleExpandTerms,
        timeLeft,
        days,
        hours,
        minutes,
        seconds,
        showTerms,
    } = props;

    return (
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
                <p className="m-0 p-0 grey-text text-xxs">Click “Make Payment” button below to go to next step.</p>
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
                            onClick={handleExpandChat}
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

                    <span className="cursor-pointer" onClick={handleExpandTerms}>
                        {showTerms ? <DropUpMobileIcon /> : <DropdownMobileIcon />}
                    </span>
                </div>

                {showTerms && <p className="m-0 p-0 text-sm grey-text">{detail?.offer?.term_of_condition}</p>}
            </div>
        </div>
    );
};
