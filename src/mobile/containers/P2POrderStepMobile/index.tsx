import * as React from 'react';
import { CustomInput } from 'src/desktop/components';
import { useDispatch, useSelector } from 'react-redux';
import { alertPush } from 'src/modules';
import { Link } from 'react-router-dom';
import { DropUpMobileIcon, DropdownMobileIcon, ChatMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { VerificationIcon } from 'src/assets/images/P2PIcon';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { capitalizeFirstLetter, copy } from 'src/helpers';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { CopyableTextField } from 'src/components';
import moment from 'moment';
import { InfoWarningIcon } from 'src/assets/images/P2PIcon';
import { selectUserInfo } from 'src/modules';
import { ModalMobile } from 'src/mobile/components';
import { DownloadSecondaryIcon } from 'src/assets/images/DownloadIcon';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';

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

    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const profiles = user?.profiles?.slice(-1);

    const doCopyNumber = () => {
        copy('kid-code');
        dispatch(alertPush({ message: ['Order Number copied'], type: 'success' }));
    };

    const [showImage, setShowImage] = React.useState(false);
    const [imageView, setImageView] = React.useState('');
    const [imageBlob, setImageBlob] = React.useState('');

    // console.log(paymentUser);

    // const onImageChange = (e) => {
    //     if (e.target.files && e.target.files[0]) {
    //         let img = e.target.files[0];
    //         setImageBlob(URL.createObjectURL(img));
    //         setImage(e.target.files);
    //     }
    // };

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
                    {side == 'buy'
                        ? detail?.order?.state == 'prepare'
                            ? 'Click “Make Payment” button below to go to next step.'
                            : 'Proceed to make payment to seller, then click “Confirm”'
                        : ''}
                </p>
                <span>
                    <DropUpMobileIcon />
                </span>
            </div>

            {side == 'buy' && (
                <div className="mx-24 order-info-container">
                    <div className="d-flex align-items-start gap-8 justify-content-between w-100 mb-16">
                        <div className="w-80">
                            {side == 'buy' && detail?.order?.state == 'prepare' && !paymentUser ? (
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
                            ) : side == 'buy' && detail?.order?.state == 'prepare' && paymentUser ? (
                                <p className="m-0 p-0 text-md white-text font-extrabold">{detail?.order?.amount}</p>
                            ) : side == 'buy' && detail?.order?.state == 'waiting' ? (
                                <p className="m-0 p-0 text-sm grey-text-accent">
                                    Waiting for payment confirmation from the seller to release order, 98% of this
                                    seller’s order have been completed within 50min.
                                </p>
                            ) : side == 'buy' &&
                              (detail?.order?.state == 'success' || detail?.order?.state == 'accepted') ? (
                                <p className="m-0 p-0 text-sm gradient-text">
                                    Crypto has been transferred succesfully to your wallet
                                </p>
                            ) : (
                                ''
                            )}
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

                    {side == 'buy' && detail?.order?.state !== 'prepare' && (
                        <div className="mb-16">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="grey-text text-sm">Order number</span>
                                <fieldset onClick={doCopyNumber}>
                                    <CopyableTextField
                                        value={`${detail?.order?.order_number}`}
                                        className="ml-3 w-100 text-sm grey-text-accent"
                                        fieldId="kid-code"
                                    />
                                </fieldset>
                            </div>
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="grey-text text-sm">Time created</span>
                                <span className="text-sm grey-text-accent">
                                    {moment(detail?.order?.created_at).format('YYYY-MM-DD hh:mm:ss')}
                                </span>
                            </div>
                        </div>
                    )}

                    {side == 'buy' && (detail?.order?.state == 'prepare' || detail?.order?.state == 'waiting') && (
                        <div className="order-step-info-warning d-flex align-items-center p-16 gap-8 radius-sm mb-24">
                            <InfoWarningIcon />
                            <p className="m-0 p-0 grey-text-accent text-xxs ">
                                {detail?.order?.state == 'prepare'
                                    ? 'Only use your own payment account to transfer funds to the seller. Third-party payment are prohibited.'
                                    : 'Waiting for payment confirmation. Please do not cancel the order if payment has been made. Once the counterparty confirms the payment. The crypto will be released to your wallet.'}
                            </p>
                        </div>
                    )}

                    {side == 'buy' &&
                        detail?.order?.state == 'prepare' &&
                        paymentUser === undefined &&
                        detail?.order?.payment === null && (
                            <>
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

                                        <p className="m-0 p-0 text-md white-text font-extrabold">
                                            {detail?.order?.amount}
                                        </p>
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
                            </>
                        )}

                    {side == 'buy' && detail?.order?.state !== 'prepare' && (
                        <>
                            <div className="mb-16">
                                <p className="m-0 p-0 white-text text-sm mb-8">Order Info</p>

                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                        <p className="m-0 p-0 grey-text text-sm">Amount</p>
                                        <p className="m-0 p-0 white-text font-bold text-sm">{detail?.order?.amount}</p>
                                    </div>

                                    <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                        <p className="m-0 p-0 grey-text text-sm">Price</p>
                                        <p className="m-0 p-0 white-text font-bold text-sm">{detail?.offer?.price}</p>
                                    </div>

                                    <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                        <p className="m-0 p-0 grey-text text-sm">Quantity</p>
                                        <p className="m-0 p-0 white-text font-bold text-sm">
                                            {detail?.order?.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-16">
                                <p className="m-0 p-0 white-text text-sm mb-8">Payment Method</p>

                                <div className="payment-user-selected">
                                    <div className="payment d-flex align-items-center gap-4">
                                        <div className="payment-label"></div>
                                        <p className="m-0 p-0 text-sm grey-text-accent">Bank Transfer</p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                        <p className="m-0 p-0 grey-text">Name</p>
                                        <p className="m-0 p-0 grey-text">{detail?.order?.payment?.account_name}</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                        <p className="m-0 p-0 grey-text">Bank account number</p>
                                        <p className="m-0 p-0 grey-text">{detail?.order?.payment?.account_number}</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                        <p className="m-0 p-0 grey-text">Bank name</p>
                                        <p className="m-0 p-0 grey-text">{detail?.order?.payment?.bank_name}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {side == 'buy' && detail?.order?.state == 'prepare' && (paymentUser || detail?.order?.payment !== null) && (
                <div className="order-form mx-24 order-info-container">
                    <div className="line"></div>
                    <div>
                        <div className="mb-36 payment-form">
                            <div className="number">
                                <div className="step">1</div>
                            </div>
                            <p className="mb-2 text-sm grey-text">
                                Leave the Heaven Exchange app, open your selected banking or payment platform that
                                matches the funds the seller’s account provide below.
                            </p>
                            <div className="d-flex align-items-start gap-8 mb-16">
                                <InfoIcon />
                                <p className="m-0 p-0 grey-text text-xxs">
                                    Do not include any crypto related word (eg=.g Crypto, BTC) in the description of
                                    your payment transfer
                                </p>
                            </div>

                            <div className="payment-user-selected">
                                <div className="payment d-flex align-items-center gap-4">
                                    <div className="payment-label"></div>
                                    <p className="m-0 p-0 text-sm grey-text-accent">Bank Transfer</p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                    <p className="m-0 p-0 grey-text">Name</p>
                                    <p className="m-0 p-0 grey-text">
                                        {detail?.order?.payment
                                            ? detail?.order?.payment?.account_name
                                            : paymentUser?.account_name}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                    <p className="m-0 p-0 grey-text">Bank account number</p>
                                    <p className="m-0 p-0 grey-text">
                                        {detail?.order?.payment
                                            ? detail?.order?.payment?.account_number
                                            : paymentUser?.account_number}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                    <p className="m-0 p-0 grey-text">Bank name</p>
                                    <p className="m-0 p-0 grey-text">
                                        {detail?.order?.payment ? detail?.order?.payment?.bank_name : paymentUser?.bank}
                                    </p>
                                </div>
                            </div>

                            {(paymentUser?.qrcode?.url || detail?.order?.payment?.qrcode?.url) && (
                                <button
                                    onClick={() => {
                                        setShowImage(!showImage);
                                        setImageView(paymentUser?.qrcode?.url || detail?.order?.payment?.qrcode?.url);
                                    }}
                                    type="button"
                                    className="btn-transparent gradient-text cursor-pointer mt-24">
                                    QR Code
                                </button>
                            )}
                        </div>

                        <div className="payment-form last">
                            <div className="number">
                                <div className="step">2</div>
                            </div>
                            <p className="mb-2 text-sm grey-text">
                                After transferring the funds, click on the "Transferred, notify seller" button bellow.
                            </p>
                            <div className="d-flex align-items-start gap-8 mb-16">
                                <InfoIcon />
                                <p className="m-0 p-0 grey-text text-xxs">
                                    Do not click on the cancel button, the order will be cancelled and you might lose
                                    your funds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {side == 'buy' &&
                detail?.order?.state == 'prepare' &&
                paymentUser !== undefined &&
                detail?.order?.payment !== null && (
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
                )}

            {side == 'buy' && detail?.order?.state == 'prepare' && (
                <div className="mx-24 order-info-container gap-8">
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 white-text text-ms">Terms</p>

                        <span className="cursor-pointer" onClick={handleExpandTerms}>
                            {showTerms ? <DropUpMobileIcon /> : <DropdownMobileIcon />}
                        </span>
                    </div>

                    {showTerms && <p className="m-0 p-0 text-sm grey-text">{detail?.offer?.term_of_condition}</p>}
                </div>
            )}

            {side == 'sell' && (
                <div className="order-form mx-24 order-info-container">
                    <div className="line"></div>
                    <div>
                        <div className="mb-36 payment-form">
                            <div className="number">
                                <div className="step">1</div>
                            </div>
                            <div className="d-flex align-items-start justify-content-between gap-8 mb-16">
                                <p className="m-0 p-0 text-sm grey-text">Confirm Order Info</p>
                                <div
                                    onClick={handleExpandChat}
                                    className="btn-chat d-flex align-items-center justify-content-center cursor-pointer">
                                    <ChatMobileIcon />
                                    <p className="m-0 p-0 gradient-text text-xxs">Chat</p>
                                </div>
                            </div>

                            <div className="mb-16">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <span className="grey-text text-sm">Order number</span>
                                    <fieldset onClick={doCopyNumber}>
                                        <CopyableTextField
                                            value={`${detail?.order?.order_number}`}
                                            className="ml-3 w-100 text-sm grey-text-accent"
                                            fieldId="kid-code"
                                        />
                                    </fieldset>
                                </div>
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <span className="grey-text text-sm">Time created</span>
                                    <span className="text-sm grey-text-accent">
                                        {moment(detail?.order?.created_at).format('YYYY-MM-DD hh:mm:ss')}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-16">
                                <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                    <p className="m-0 p-0 grey-text text-sm">Amount</p>
                                    <p className="m-0 p-0 white-text font-bold text-sm">{detail?.order?.amount}</p>
                                </div>

                                <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                    <p className="m-0 p-0 grey-text text-sm">Price</p>
                                    <p className="m-0 p-0 white-text font-bold text-sm">{detail?.offer?.price}</p>
                                </div>

                                <div className="d-flex flex-column align-items-center justify-content-center gap-8">
                                    <p className="m-0 p-0 grey-text text-sm">Quantity</p>
                                    <p className="m-0 p-0 white-text font-bold text-sm">{detail?.order?.quantity}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-36 payment-form">
                            <div className="number">
                                <div className="step">2</div>
                            </div>
                            <div className="d-flex align-items-start justify-content-between gap-8 mb-16">
                                <p className="m-0 p-0 text-sm grey-text">
                                    Confirm that the payment is made using the buyer’s real time name (
                                    {profiles[0]?.first_name})
                                </p>
                                <InfoIcon />
                            </div>

                            <div className="payment-user-selected">
                                <div className="payment d-flex align-items-center gap-4">
                                    <div className="payment-label"></div>
                                    <p className="m-0 p-0 text-sm grey-text-accent">
                                        {detail?.order?.payment !== null
                                            ? 'Bank Transfer'
                                            : 'Waiting buyer choose payment method'}
                                    </p>
                                </div>

                                {detail?.order?.payment !== null && (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                            <p className="m-0 p-0 grey-text">Name</p>
                                            <p className="m-0 p-0 grey-text">{detail?.order?.payment?.account_name}</p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                            <p className="m-0 p-0 grey-text">Bank account number</p>
                                            <p className="m-0 p-0 grey-text">
                                                {detail?.order?.payment?.account_number}
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center text-sm w-100">
                                            <p className="m-0 p-0 grey-text">Bank name</p>
                                            <p className="m-0 p-0 grey-text">{detail?.order?.payment?.bank_name}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="payment-form last">
                            <div className="number">
                                <div className="step">3</div>
                            </div>
                            <p className="mb-2 text-sm grey-text m-0 p-0">
                                After confirming the payment, click the “Release Crypto” button.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <ModalMobile show={showImage} content={renderModalImageViewer()} />
        </div>
    );
};
