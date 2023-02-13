import * as React from 'react';
import { LikeSuccessIcon, UnLikeDangerIcon, ArrowDown, Wallet } from 'src/assets/images/P2PIcon';
import { CustomInput } from 'src/desktop/components';
import { Link } from 'react-router-dom';

export interface P2POrderStepProps {
    paymentMethod: string;
    paymentUser: any;
    showPayment: boolean;
    comment: string;
    side: string;
    bank: any[];
    detail: any;
    handleChangePaymentMethod: (e: string, el: any) => void;
    handleChangeComment: (e: string) => void;
    handleConfirmPaymentBuy: () => void;
    handleConfirm: () => void;
    handleShowPayment: () => void;
    handleShowModalBuyOrderCompleted: () => void;
    handleShowModalConfirm: () => void;
}

export const P2POrderStep: React.FunctionComponent<P2POrderStepProps> = (props) => {
    const {
        paymentMethod,
        paymentUser,
        showPayment,
        comment,
        side,
        bank,
        detail,
        handleChangePaymentMethod,
        handleChangeComment,
        handleShowPayment,
        handleConfirmPaymentBuy,
        handleConfirm,
        handleShowModalBuyOrderCompleted,
        handleShowModalConfirm,
    } = props;

    return (
        <React.Fragment>
            <div className="mb-4 left-side">
                <p className="mb-3 text-sm font-bold white-text">Order Steps</p>
                <div className="d-flex align-items-center justofy-content-between mb-3">
                    <div className={`arrow arrow-right active`}>Transfers Payment To Seller</div>
                    <div className={`arrow arrow-right ${detail?.order?.payment !== null && 'active'}`}>
                        Pending Seller to Release Cryptos
                    </div>
                    <div
                        className={`arrow arrow-right ${
                            detail?.order?.first_approve !== null && detail?.order?.second_approve !== null && 'active'
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
                                    <p className="text-sm white-text font-semibold">{detail?.order?.quantity} USDT</p>
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
                                <div className="payment-method py-3 d-flex justify-content-between align-items-center text-xs font-semibold">
                                    {detail?.order?.payment !== null && side == 'sell' && (
                                        <img
                                            src={
                                                detail?.order?.payment?.logo === 'dummy'
                                                    ? '/img/logo-bca.png'
                                                    : detail?.order?.payment?.logo
                                            }
                                            className="bank-logo mx-2"
                                            alt="bank logo"
                                        />
                                    )}

                                    <div>
                                        {detail?.order?.payment !== null && side == 'sell' ? (
                                            <React.Fragment>
                                                <p className="m-0 p-0 mb-8 font-semibold text-xs">
                                                    {detail?.order?.payment?.account_number}
                                                </p>
                                                <p className="m-0 p-0 mb-8 font-semibold text-xs">
                                                    {detail?.order?.payment?.account_name}
                                                </p>
                                            </React.Fragment>
                                        ) : (
                                            <p className="m-0 p-0 text-center font-semibold text-xs">
                                                Waiting buyer to choose a payment method
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="payment">
                                    <div
                                        className="header-payment d-flex justify-content-between align-items-center mt-3 cursor-pointer"
                                        onClick={handleShowPayment}>
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
                                    {detail?.order?.payment !== null || paymentUser ? (
                                        <div className="payment-method py-3 d-flex justify-content-between align-items-center text-xs font-semibold">
                                            {(paymentUser || detail?.order?.payment !== null) && side == 'buy' && (
                                                <img
                                                    src={
                                                        paymentUser?.logo || detail?.order?.payment?.logo === 'dummy'
                                                            ? '/img/logo-bca.png'
                                                            : detail?.order?.payment !== null
                                                            ? detail?.order?.payment?.logo
                                                            : paymentUser?.logo
                                                    }
                                                    className="bank-logo mx-2"
                                                    alt="bank logo"
                                                />
                                            )}

                                            <div>
                                                {(paymentUser || detail?.order?.payment !== null) && side == 'buy' && (
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
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <React.Fragment>
                                            <div className={`content-payment ${showPayment ? 'hide' : ''}`}>
                                                <div className="d-flex align-items-center justify-content-end flex-wrap ">
                                                    {detail?.payment_user?.map((el, i) => (
                                                        <img
                                                            key={i}
                                                            src={el?.logo === 'dummy' ? '/img/logo-bca.png' : el?.logo}
                                                            className="bank-logo mx-2"
                                                            alt="bank logo"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`content-payment-expand ${showPayment ? '' : 'hide'}`}>
                                                {detail?.payment_user?.map((el, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() =>
                                                            handleChangePaymentMethod(el?.payment_user_id, el)
                                                        }
                                                        className="payment-item cursor-pointer">
                                                        <div className="payment-item_title">
                                                            <img
                                                                src={
                                                                    el?.logo === 'dummy'
                                                                        ? '/img/logo-bca.png'
                                                                        : el?.logo
                                                                }
                                                                className="bank-logo"
                                                                alt=""
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
                        <div className=" payment-form last">
                            <p className="mb-3 text-ms font-semibold white-text">
                                After transferring funds. Click the button "Confirm"
                            </p>
                            {detail?.order?.second_approve !== null ? (
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
                            ) : detail?.order?.payment !== null && side == 'sell' ? (
                                <div className="d-flex gap-24">
                                    <button
                                        type="button"
                                        onClick={() => handleShowModalConfirm()}
                                        className="btn btn-primary px-5 text-sm">
                                        Payment Received
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-transparent btn-inline w-auto font-semibold grey-text text-sm">
                                        Transaction Issue; appeal after (00:00)
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex gap-24">
                                    <button
                                        type="button"
                                        onClick={
                                            detail?.order?.payment == null
                                                ? handleConfirmPaymentBuy
                                                : handleShowModalBuyOrderCompleted
                                        }
                                        className="btn btn-primary px-5">
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-transparent btn-inline w-auto font-semibold text-danger">
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {detail?.order?.second_approve && (
                    <div className="">
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
                                className="btn button-grey white-text text-sm font-semibold align-items-center mr-2 py-3 w-50">
                                Positive <LikeSuccessIcon />{' '}
                            </button>
                            <button
                                type="button"
                                className="btn button-grey white-text text-sm font-semibold align-items-center ml-2 py-3 w-50">
                                Positive <UnLikeDangerIcon />{' '}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
