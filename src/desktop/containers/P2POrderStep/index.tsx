import * as React from 'react';
import { LikeSuccessIcon, UnLikeDangerIcon, ArrowDown, Wallet } from 'src/assets/images/P2PIcon';
import { CustomInput } from 'src/desktop/components';
import { Link } from 'react-router-dom';

export interface P2POrderStepProps {
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
    handleShowModalBuyOrderCompleted: () => void;
    handleShowModalSellConfirm: () => void;
    handleShowModalCancel: () => void;
    handleShowModalReport: () => void;
    handleSendFeedbackPositive: () => void;
    handleSendFeedbackNegative: () => void;
    timeLeft: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const P2POrderStep: React.FunctionComponent<P2POrderStepProps> = (props) => {
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
        handleConfirmPaymentBuy,
        handleShowModalBuyOrderCompleted,
        handleShowModalSellConfirm,
        handleShowModalCancel,
        handleShowModalReport,
        handleSendFeedbackPositive,
        handleSendFeedbackNegative,
        timeLeft,
        days,
        hours,
        minutes,
        seconds,
    } = props;

    return (
        <React.Fragment>
            <div className="mb-4 left-side">
                <p className="mb-3 text-sm font-bold white-text">Order Steps</p>
                <div className="d-flex align-items-center justofy-content-between mb-3">
                    <div className={`arrow arrow-right active`}>Transfers Payment To Seller</div>
                    <div className={`arrow arrow-right ${detail?.order?.state !== 'prepare' && 'active'}`}>
                        Pending Seller to Release Cryptos
                    </div>
                    <div
                        className={`arrow arrow-right ${
                            detail?.order?.state !== 'waiting' && detail?.order?.state !== 'prepare' && 'active'
                        }`}>
                        {' '}
                        Completed Order
                    </div>
                </div>
                <div className="order-form dark-bg-main d-flex radius-md pt-5 p-4">
                    <div className="line"></div>
                    <div>
                        <div className="mb-36 payment-form">
                            <p className="mb-2 text-ms font-semibold white-text">Confirm Order Info</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-1">
                                    <span className="text-xs grey-text-accent">Amount</span>
                                    <p className="text-sm white-text font-semibold">Rp {detail?.order?.amount}</p>
                                </div>
                                <div className="mb-1">
                                    <span className="text-xs grey-text-accent">Price</span>
                                    <p className="text-sm white-text font-semibold">Rp {detail?.offer?.price}</p>
                                </div>
                                <div className="mb-1">
                                    <span className="text-xs grey-text-accent">Quantity</span>
                                    <p className="text-sm white-text font-semibold">
                                        {detail?.order?.quantity} {detail?.offer?.fiat}
                                    </p>
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
                            {side == 'sell' ? (
                                <div className="payment-method py-3 d-flex justify-content-between align-items-center text-xs font-semibold mt-3">
                                    {detail?.order?.state === 'canceled' && side == 'sell' ? (
                                        <React.Fragment>
                                            <p className="m-0 p-0 font-semibold text-xs">Transaction end.</p>
                                        </React.Fragment>
                                    ) : (
                                        detail?.order?.payment !== null &&
                                        side == 'sell' && (
                                            <img
                                                src={
                                                    detail?.order?.payment?.logo === 'dummy'
                                                        ? '/img/logo-bca.png'
                                                        : detail?.order?.payment?.logo
                                                }
                                                className="bank-logo mx-2"
                                                alt="bank logo"
                                            />
                                        )
                                    )}
                                    <div>
                                        {detail?.order?.state == 'prepare' &&
                                        detail?.order?.payment == null &&
                                        side == 'sell' ? (
                                            <p className="m-0 p-0 text-center font-semibold text-xs">
                                                Waiting buyer to choose a payment method
                                            </p>
                                        ) : (
                                            <React.Fragment>
                                                <p className="m-0 p-0 mb-8 font-semibold text-xs">
                                                    {detail?.order?.payment?.account_number}
                                                </p>
                                                <p className="m-0 p-0 mb-8 font-semibold text-xs">
                                                    {detail?.order?.payment?.account_name}
                                                </p>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="payment">
                                    <div
                                        className="header-payment d-flex justify-content-between align-items-center mt-3 cursor-pointer"
                                        onClick={detail?.order?.state == 'prepare' && handleShowPayment}>
                                        <p className="mb-0">
                                            <Wallet />
                                            <span className="mb-0 ml-3 text-sm white-text font-semibold">
                                                Payment Methods
                                            </span>
                                        </p>
                                        {detail?.order?.state == 'prepare' && (
                                            <div className={`${showPayment ? 'rotate-180' : ''}`}>
                                                <ArrowDown />
                                            </div>
                                        )}
                                    </div>
                                    {detail?.order?.state === 'canceled' ? (
                                        <React.Fragment>
                                            <div className="payment-method py-3 d-flex justify-content-between align-items-center text-xs font-semibold">
                                                <p className="m-0 p-0 font-semibold text-xs">Transaction end.</p>
                                            </div>
                                        </React.Fragment>
                                    ) : paymentUser || detail?.order?.state !== null ? (
                                        <React.Fragment>
                                            <div
                                                className={`payment-method content-payment ${
                                                    showPayment ? '' : 'hide'
                                                }  py-3 d-flex justify-content-between align-items-center text-xs font-semibold`}>
                                                <>
                                                    <img
                                                        src={
                                                            paymentUser?.logo ||
                                                            detail?.order?.payment?.logo === 'dummy'
                                                                ? '/img/logo-bca.png'
                                                                : detail?.order?.payment !== null
                                                                ? detail?.order?.payment?.logo
                                                                : paymentUser?.logo
                                                        }
                                                        className="bank-logo mx-2"
                                                        alt="bank logo"
                                                    />
                                                    <div>
                                                        <React.Fragment>
                                                            <p className="m-0 p-0 mb-8 font-semibold text-xs">
                                                                {detail?.order?.payment !== null
                                                                    ? detail?.order?.payment?.account_number
                                                                    : paymentUser?.account_number}
                                                            </p>
                                                            <p className="m-0 p-0 font-semibold text-xs">
                                                                {detail?.order?.payment !== null
                                                                    ? detail?.order?.payment?.account_name
                                                                    : paymentUser?.account_name}
                                                            </p>
                                                        </React.Fragment>
                                                    </div>
                                                </>
                                            </div>

                                            <div className={`content-payment-expand ${showPayment ? '' : 'hide'}`}>
                                                {detail?.payment_user?.map((el, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            if (el !== undefined) {
                                                                handleChangePaymentMethod(el);
                                                            }
                                                        }}
                                                        className="payment-item cursor-pointer">
                                                        <div className="payment-item_title">
                                                            <img
                                                                src={
                                                                    el?.logo === 'dummy'
                                                                        ? '/img/logo-bca.png'
                                                                        : el?.logo
                                                                }
                                                                className="bank-logo"
                                                                alt="bank"
                                                            />
                                                        </div>
                                                        <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                            {el?.account_name}
                                                        </p>
                                                        <p className="primary-text text-xs font-semibold mb-0">
                                                            {el?.account_number}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <div className={`content-payment ${showPayment ? 'hide' : ''}`}>
                                                <div className="d-flex align-items-center justify-content-end flex-wrap ">
                                                    {detail?.payment_user?.slice(0, 14).map((el, i) => (
                                                        <div className="mb-4">
                                                            <img
                                                                key={i}
                                                                src={
                                                                    el?.logo === 'dummy'
                                                                        ? '/img/logo-bca.png'
                                                                        : el?.logo
                                                                }
                                                                className="bank-logo mx-2"
                                                                alt="bank logo"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`content-payment-expand ${showPayment ? '' : 'hide'}`}>
                                                {detail?.payment_user?.map((el, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            if (el !== undefined) {
                                                                handleChangePaymentMethod(el);
                                                            }
                                                        }}
                                                        className="payment-item cursor-pointer">
                                                        <div className="payment-item_title">
                                                            <img
                                                                src={
                                                                    el?.logo === 'dummy'
                                                                        ? '/img/logo-bca.png'
                                                                        : el?.logo
                                                                }
                                                                className="bank-logo"
                                                                alt="bank"
                                                            />
                                                        </div>
                                                        <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                            {el?.account_name}
                                                        </p>
                                                        <p className="primary-text text-xs font-semibold mb-0">
                                                            {el?.account_number}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="payment-form last">
                            <p className="mb-3 text-ms font-semibold white-text">
                                {side == 'sell'
                                    ? 'After conffirming the payment, be sure to click the “Payment Received” button'
                                    : 'After transferring funds. Click the button "Confirm"'}
                            </p>
                            {detail?.order?.state == 'success' || detail?.order?.state == 'accepted' ? (
                                side === 'buy' ? (
                                    <div className="d-flex gap-24">
                                        <Link
                                            to={`/p2p/wallets`}
                                            type="button"
                                            className="btn btn-primary px-5 text-sm">
                                            Wallet P2P
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-transparent btn-inline w-auto font-semibold grey-text text-sm">
                                            Crypto has been to your wallet
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-flex gap-16">
                                        <button
                                            type="button"
                                            className="btn btn-transparent font-semibold gradient-text text-sm">
                                            Have a question
                                        </button>
                                        <Link
                                            to={`/p2p/wallets`}
                                            type="button"
                                            className="btn btn-transparent gradient-text text-sm">
                                            View my wallet p2p
                                        </Link>
                                    </div>
                                )
                            ) : (detail?.order?.state !== 'success' || detail?.order?.state !== 'accepted') &&
                              side == 'sell' ? (
                                <div className="d-flex gap-24">
                                    <button
                                        disabled={detail?.order?.state !== 'waiting'}
                                        type="button"
                                        onClick={() => handleShowModalSellConfirm()}
                                        className="btn btn-secondary px-5 text-sm">
                                        {detail?.order?.state == 'waiting' ? 'Payment Received' : 'Waiting Payment'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => side == 'sell' && handleShowModalReport()}
                                        className="btn btn-transparent btn-inline w-auto font-semibold text-danger">
                                        Report
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex gap-24">
                                    {detail?.order?.state == 'prepare' ? (
                                        <button
                                            disabled={timeLeft <= 0 || detail?.order?.state !== 'prepare'}
                                            type="button"
                                            onClick={
                                                detail?.order?.payment == null
                                                    ? handleConfirmPaymentBuy
                                                    : handleShowModalBuyOrderCompleted
                                            }
                                            className="btn btn-primary px-5">
                                            Confirm
                                        </button>
                                    ) : detail?.order?.state == 'waiting' ? (
                                        <button
                                            type="button"
                                            onClick={() => side == 'buy' && handleShowModalCancel()}
                                            className="btn btn-transparent btn-inline w-auto font-semibold text-danger">
                                            Cancel Order
                                        </button>
                                    ) : (
                                        ''
                                    )}

                                    {detail?.order?.state == 'prepare' ? (
                                        <button
                                            type="button"
                                            onClick={() => side == 'buy' && handleShowModalCancel()}
                                            className="btn btn-transparent btn-inline w-auto font-semibold text-danger">
                                            Cancel Order
                                        </button>
                                    ) : detail?.order?.state == 'waiting' ? (
                                        <button
                                            type="button"
                                            className="btn btn-transparent btn-inline w-auto font-semibold grey-text">
                                            Transaction Issue; appeal after (
                                            {`${days} : ${hours} : ${minutes} : ${seconds}`})
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {(detail?.order?.state == 'success' || detail?.order?.state == 'accepted') && (
                    <div className="mb-5">
                        <CustomInput
                            inputValue={comment}
                            type="text"
                            label={'Comment'}
                            defaultLabel={'Comment'}
                            placeholder={'Enter Comment'}
                            labelVisible
                            classNameLabel="grey-text-accent text-sm font-semibold"
                            handleChangeInput={(e) => handleChangeComment(e)}
                        />

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={handleSendFeedbackPositive}
                                className="btn button-grey white-text text-sm font-semibold align-items-center mr-2 py-3 w-50">
                                Positive <LikeSuccessIcon />{' '}
                            </button>
                            <button
                                type="button"
                                onClick={handleSendFeedbackNegative}
                                className="btn button-grey white-text text-sm font-semibold align-items-center ml-2 py-3 w-50">
                                Negative <UnLikeDangerIcon />{' '}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
