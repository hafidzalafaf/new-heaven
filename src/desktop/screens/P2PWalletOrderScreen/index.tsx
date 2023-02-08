import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { orderDetailFetch, selectP2POrderDetail } from 'src/modules';
import { useDocumentTitle } from '../../../hooks';
import { alertPush } from 'src/modules';
import { HeaderP2P, BannerP2P, P2PFAQ } from 'src/desktop/containers';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, CustomInput } from 'src/desktop/components';
import moment from 'moment';
import {
    Wallet,
    ArrowDown,
    ArrowDownMd,
    AttachmentIcon,
    SendIcon,
    CheckFillIcon,
    UploadIcon,
    CommentIcon,
    GreyCheck,
    ActiveCheck,
    UnLikeDangerIcon,
    LikeSuccessIcon,
} from '../../../assets/images/P2PIcon';

export const P2PWalletOrderScreen: React.FC = () => {
    useDocumentTitle('P2P || Order');
    const dispatch = useDispatch();
    const { order_number = '' } = useParams<{ order_number?: string }>();
    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;

    const detail = useSelector(selectP2POrderDetail);

    const [seconds, setSeconds] = useState(30000);
    const [timerActive, setTimerActive] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [step, setStep] = useState(1);
    const [showModalReport, setShowModalReport] = useState(false);
    const [inputFile, setInputFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [checkModalOne, setcheckModalOne] = useState(false);
    const [checkModalTwo, setcheckModalTwo] = useState(false);
    const [comment, setComment] = useState('');

    console.log(detail);

    React.useEffect(() => {
        dispatch(orderDetailFetch({ offer_number: order_number }));
    }, [dispatch, order_number]);

    const bank = [
        {
            id: 1,
            name: 'jago',
        },
        { id: 2, name: 'bca' },
        {
            id: 3,
            name: 'shopee',
        },
        { id: 4, name: 'dana' },
    ];

    const doCopyNumber = () => {
        copy('kid-code');
        dispatch(alertPush({ message: ['Order Number copied'], type: 'success' }));
    };

    const disableButton = !checkModalOne || !checkModalTwo;

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

    const renderModalContent = () => {
        return (
            <div>
                <div className="d-flex align-items-center justify-content-between mb-24 radius-md border-b-1 dark-bg-accent p-3">
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
                        <></>
                        <p className="mb-1 grey-text-accent text-sm text-right">1,419</p>
                        <p className="mb-1 grey-text-accent text-sm text-right">90,01%</p>
                    </div>
                </div>

                <div>
                    <h1 className="m-0 p-0 white-text text-ms font-semibold mb-12">Log Transaction Dispute</h1>
                    <p className="m-0 p-0 grey-text-accent text-sm mb-24">
                        Lorem ipsum dolor sit amet consectetur. Aliquam lectus id pharetra eget placerat suscipit neque
                        ornare. Ultrices commodo morbi duis elementum diam ultrices nulla convallis nibh.
                    </p>

                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">QR Code (Optional)</label>
                        <input
                            id="custom-input-file"
                            type="file"
                            // value={inputFile}
                            onChange={(e) => {
                                setInputFile(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                            }}
                            placeholder="Enter Full Name"
                            className="custom-input-add-payment w-100 white-text d-none"
                        />
                        <label
                            htmlFor="custom-input-file"
                            className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent border-1 p-16 radius-lg mb-16">
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <UploadIcon />
                                <p className="m-0 p-0 text-xxs grey-text">{fileName ? fileName : 'Upload'}</p>
                            </div>
                        </label>
                        <p className="m-0 p-0 text-right grey-text-accent text-xxs font-bold">
                            JPG,SVG,PNG, GIF and PDF, Maximum file size is 20MB.
                        </p>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        {/* <label htmlFor="stable-coin" className="m-0 p-0 grey-text-accent text-sm "></label> */}
                        <input
                            type="checkbox"
                            id="stable-coin"
                            // checked={true}
                            readOnly={true}
                            className="m-0 p-0 check-with-label"
                        />
                        <label htmlFor="stable-coin" className="m-0 p-0 grey-text-accent text-sm">
                            Didn’t Not Receive My Stable Coin
                        </label>
                    </div>

                    <div className="mb-16 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="taking-long"
                            // checked={true}
                            readOnly={true}
                            className="m-0 p-0"
                        />
                        <label htmlFor="taking-long" className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Taking To Long
                        </label>
                    </div>

                    <div className="mb-24 d-flex align-items-center gap-8">
                        <input
                            type="checkbox"
                            id="different-order"
                            // checked={true}
                            readOnly={true}
                            className="m-0 p-0"
                        />
                        <label htmlFor="different-order" className="m-0 p-0 grey-text-accent text-sm">
                            Transaction Ammount Is Different to Order Value
                        </label>
                    </div>

                    <div className="mb-24">
                        <label className="m-0 p-0 mb-16 white-text text-ms">Your Message</label>
                        <textarea
                            placeholder=""
                            className="form-message border-1 radius-lg p-16 white-text w-100"></textarea>
                    </div>

                    <button className="btn-primary w-100" type="button">
                        Submit The Sidepute
                    </button>
                </div>
            </div>
        );
    };

    const renderModalConfirmRelease = () => {
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center mb-24">
                    <CommentIcon />
                </div>
                <div
                    className="d-flex align-items-center mb-24 cursor-pointer"
                    onClick={() => setcheckModalOne(!checkModalOne)}>
                    <div className="icon-sm">{checkModalOne ? <ActiveCheck /> : <GreyCheck />}</div>
                    <p className="mb-0 text-sm grey-text-accent ml-3">I have not receive payment from the buyer</p>
                </div>
                <div className="d-flex align-items-center mb-24" onClick={() => setcheckModalTwo(!checkModalTwo)}>
                    <div className="icon-sm">{checkModalTwo ? <ActiveCheck /> : <GreyCheck />}</div>
                    <p className="mb-0 text-sm grey-text-accent cursor-pointer ml-3">
                        I have received the correct amount. Payment sender matches the buyer’s verified name on Heaven
                        Ecchange, and i agree to release mu crypto to the buyer
                    </p>
                </div>
                <p className="mb-2 text-sm grey-text-accent">Tips</p>
                <ul className="ml-0 pl-3 mb-24">
                    <li className="text-sm grey-text-accent">
                        Do not only check th buyer’s payment proof. Make sure to long into your account and verify
                        payment is received!
                    </li>
                    <li className="text-sm grey-text-accent">
                        If the payment is still processing, wait until you have received payment in your account before
                        releasing the crypto!
                    </li>
                    <li className="text-sm grey-text-accent">
                        Do NOT accept payment from a third-party account. Refund the amount immediately if you receive
                        such payment to avoid financial losses caused by bank chargerback after you have released
                        crypto.
                    </li>
                </ul>
                <button
                    className={`${
                        disableButton ? 'button-grey white-text ' : 'btn-primary'
                    } text-sm py-3 btn btn-block`}
                    disabled={disableButton}
                    onClick={() => {
                        setStep(3);
                        setShowModalConfirm(false);
                    }}>
                    Confirm
                </button>
            </div>
        );
    };

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
                        <p className="mb-2 text-lg white-text font-bold">
                            {side === 'sell' ? 'Sell' : 'Buy'} USDT from USDT CRYPTO
                        </p>
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
                                    value={`${detail?.order?.order_number}`}
                                    className="ml-3 w-100 "
                                    fieldId="kid-code"
                                />
                            </fieldset>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="grey-text text-sm mr-2">Time created</span>
                            <span className="grey-text text-sm">
                                {moment(detail?.order?.created_at).format('YYYY-MM-DD hh:mm:ss')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="d-flex container justify-content-between mt-4 ">
                    <div className="mb-4 left-side">
                        <p className="mb-3 text-sm font-bold white-text">Order Steps</p>
                        <div className="d-flex align-items-center justofy-content-between mb-3">
                            <div className={`arrow arrow-right ${step <= 3 && 'active'}`}>
                                Transfers Payment To Seller
                            </div>
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
                                                    {bank.map((el, i) => (
                                                        <img
                                                            key={i}
                                                            src={
                                                                el.name === 'bca'
                                                                    ? '/img/logo-bca.png'
                                                                    : el.name === 'dana'
                                                                    ? '/img/logo-dana.png'
                                                                    : el.name === 'jago'
                                                                    ? '/img/logo-jago.png'
                                                                    : '/img/logo-shopee.png'
                                                            }
                                                            className="bank-logo mx-2"
                                                            alt="bank logo"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`content-payment-expand ${showPayment ? '' : 'hide'}`}>
                                                {bank.map((el, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setPaymentMethod(el.name)}
                                                        className="payment-item cursor-pointer">
                                                        <div className="payment-item_title">
                                                            <img
                                                                src={
                                                                    el.name === 'bca'
                                                                        ? '/img/logo-bca.png'
                                                                        : el.name === 'dana'
                                                                        ? '/img/logo-dana.png'
                                                                        : el.name === 'jago'
                                                                        ? '/img/logo-jago.png'
                                                                        : '/img/logo-shopee.png'
                                                                }
                                                                className="bank-logo"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <p className="primary-text text-xs mb-1 font-semibold mt-3">
                                                            AT. Ade Sumargo
                                                        </p>
                                                        <p className="primary-text text-xs font-semibold mb-0">
                                                            00001111
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
                                                        setStep(3);
                                                    } else {
                                                        setShowModalConfirm(true);
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
                                                onClick={() => setStep(2)}
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
                                    handleChangeInput={(e) => setComment(e)}
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
                                        USDT CRYPTO <CheckFillIcon />
                                    </p>
                                    <p className="mb-1 grey-text-accent text-sm">30D Trades</p>
                                    <p className="mb-1 grey-text-accent text-sm">30D Completetition Rate</p>
                                </div>
                            </div>
                            <div className="ml-2">
                                <p
                                    onClick={() => setShowModalReport(true)}
                                    className="text-xs my-2 danger-text font-normal text-right cursor-pointer">
                                    Report
                                </p>
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

                <div className="dark-bg-accent">
                    <div className="container">
                        <P2PFAQ />
                    </div>
                </div>

                {showModalReport && <Modal show={showModalReport} content={renderModalContent()} />}
                {showModalConfirm && <Modal show={showModalConfirm} content={renderModalConfirmRelease()} />}
            </div>
        </React.Fragment>
    );
};
