import * as React from 'react';
import { LikeSuccessIcon, UnLikeDangerIcon, ArrowDown, Wallet } from 'src/assets/images/P2PIcon';
import { CustomInput } from 'src/desktop/components';
import { Link } from 'react-router-dom';

export interface P2POrderStepProps {
    step: number;
    paymentMethod: string;
    showPayment: boolean;
    comment: string;
    side: string;
    bank: any[];
    detail: any;
    handleChangePaymentMethod: (e: string) => void;
    handleChangeStep: (e: number) => void;
    handleChangeComment: (e: string) => void;
    handleShowPayment: () => void;
    handleShowModalBuyOrderCompleted: () => void;
    handleShowModalConfirm: () => void;
}

export const P2POrderStep: React.FunctionComponent<P2POrderStepProps> = (props) => {
    const {
        step,
        paymentMethod,
        showPayment,
        comment,
        side,
        bank,
        detail,
        handleChangePaymentMethod,
        handleChangeStep,
        handleChangeComment,
        handleShowPayment,
        handleShowModalBuyOrderCompleted,
        handleShowModalConfirm,
    } = props;

    return (
        <React.Fragment>
            <div className="mb-4 left-side">
                <p className="mb-3 text-sm font-bold white-text">Order Steps</p>
                <div className="d-flex align-items-center justofy-content-between mb-3">
                    <div className={`arrow arrow-right ${step <= 3 && 'active'}`}>Transfers Payment To Seller</div>
                    <div className={`arrow arrow-right ${step >= 2 && step <= 3 && 'active'}`}>
                        Pending Seller to Release Cryptos
                    </div>
                    <div className={`arrow arrow-right ${step === 3 && 'active'}`}> Completed Order</div>
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
                            {paymentMethod ? (
                                <div className="payment-method d-flex justify-content-between align-items-center text-xs font-semibold">
                                    <img
                                        src={
                                            paymentMethod === 'bca'
                                                ? '/img/logo-bca.png'
                                                : paymentMethod === 'dana'
                                                ? '/img/logo-dana.png'
                                                : paymentMethod === 'jago'
                                                ? '/img/logo-jago.png'
                                                : '/img/logo-shopee.png'
                                        }
                                        className="bank-logo mx-2"
                                        alt="bank logo"
                                    />

                                    <div>
                                        <p className="m-0 p-0 mb-8 font-semibold text-xs">32165543</p>
                                        <p className="m-0 p-0 mb-8 font-semibold text-xs">A.n Syaripudin</p>
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
                                                onClick={() => handleChangePaymentMethod(el?.payment_user_id)}
                                                className="payment-item cursor-pointer">
                                                <div className="payment-item_title">
                                                    <img
                                                        src={el?.logo === 'dummy' ? '/img/logo-bca.png' : el?.logo}
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
                                </div>
                            )}
                        </div>
                        <div className=" payment-form last">
                            <p className="mb-3 text-ms font-semibold white-text">
                                After transferring funds. Click the button "Confirm"
                            </p>
                            {step === 3 ? (
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
                            ) : step === 2 ? (
                                <div className="d-flex gap-24">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (side === 'buy') {
                                                handleShowModalBuyOrderCompleted();
                                            } else {
                                                handleShowModalConfirm();
                                            }
                                        }}
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
                                        onClick={() => handleChangeStep(2)}
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
                {step === 3 && (
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
                            <button className="btn button-grey white-text text-sm font-semibold align-items-center mr-2 py-3 w-50">
                                Positive <LikeSuccessIcon />{' '}
                            </button>
                            <button className="btn button-grey white-text text-sm font-semibold align-items-center ml-2 py-3 w-50">
                                Positive <UnLikeDangerIcon />{' '}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
