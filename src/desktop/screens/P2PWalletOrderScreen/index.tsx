import * as React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { orderDetailFetch, selectP2POrderDetail } from 'src/modules';
import { useDocumentTitle } from '../../../hooks';
import { alertPush } from 'src/modules';
import { HeaderP2P, BannerP2P, P2PFAQ, P2PChat, P2POrderStep } from 'src/desktop/containers';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'src/desktop/components';
import moment from 'moment';
import { CheckFillIcon, UploadIcon, CommentIcon, GreyCheck, ActiveCheck } from '../../../assets/images/P2PIcon';

export const P2PWalletOrderScreen: React.FC = () => {
    useDocumentTitle('P2P || Order');
    const dispatch = useDispatch();
    const { order_number = '' } = useParams<{ order_number?: string }>();
    const location: { state: { side: string } } = useLocation();
    const side = location.state?.side;

    const detail = useSelector(selectP2POrderDetail);

    const [seconds, setSeconds] = React.useState(30000);
    const [timerActive, setTimerActive] = React.useState(false);
    const [showPayment, setShowPayment] = React.useState(false);
    const [showChat, setShowChat] = React.useState(true);
    const [step, setStep] = React.useState(1);
    const [inputFile, setInputFile] = React.useState(null);
    const [fileName, setFileName] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('');
    const [checkModalOne, setcheckModalOne] = React.useState(false);
    const [checkModalTwo, setcheckModalTwo] = React.useState(false);
    const [comment, setComment] = React.useState('');

    const [showModalConfirm, setShowModalConfirm] = React.useState(false);
    const [showModalReport, setShowModalReport] = React.useState(false);
    const [showModalBuyOrderCompleted, setShowModalBuyOrderCompleted] = React.useState(false);

    React.useEffect(() => {
        dispatch(orderDetailFetch({ offer_number: order_number }));
    }, [dispatch, order_number]);

    React.useEffect(() => {
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

    const handleChangePaymentMethod = (e: string) => {
        setPaymentMethod(e);
    };

    const handleChangeStep = (e: number) => {
        setStep(e);
    };

    const handleChangeComment = (e: string) => {
        setComment(e);
    };

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

    const renderModalBuyOrderCompleted = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center w-100 mb-24">
                    <img src="/img/p2pcalendar.png" alt="completed" width={104} height={106} />
                </div>
                <h1 className="m-0 p-0 white-text text-ms font-bold text-center mb-24">Buy Order Completed</h1>

                <div className="d-flex justify-content-between align-items-center gap-48 mb-24">
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Amount</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">Rp 150,000.00</p>
                    </div>
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Price</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">Rp 15,755.00</p>
                    </div>
                    <div>
                        <p className="m-0 p-0 grey-text-accent text-xs font-semibold">Quantity</p>
                        <p className="m-0 p-0 white-text text-ms font-semibold">9.52 USDT</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (side == 'buy') {
                            setShowModalBuyOrderCompleted(false);
                            setStep(3);
                        }
                    }}
                    type="button"
                    className="btn-primary w-100">
                    Continue
                </button>
            </React.Fragment>
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
                    <P2POrderStep
                        step={step}
                        paymentMethod={paymentMethod}
                        showPayment={showPayment}
                        comment={comment}
                        side={side}
                        bank={bank}
                        detail={detail}
                        handleChangePaymentMethod={handleChangePaymentMethod}
                        handleChangeStep={handleChangeStep}
                        handleChangeComment={handleChangeComment}
                        handleShowPayment={() => setShowPayment(!showPayment)}
                        handleShowModalBuyOrderCompleted={() =>
                            setShowModalBuyOrderCompleted(!showModalBuyOrderCompleted)
                        }
                        handleShowModalConfirm={() => setShowModalConfirm(!showModalConfirm)}
                    />

                    <P2PChat
                        showChat={showChat}
                        handleExpandChat={() => setShowChat(!showChat)}
                        handleModalReport={() => setShowModalReport(true)}
                    />
                </div>

                <div className="dark-bg-accent">
                    <div className="container">
                        <P2PFAQ />
                    </div>
                </div>

                <Modal show={showModalReport} content={renderModalContent()} />
                <Modal show={showModalConfirm} content={renderModalConfirmRelease()} />
                <Modal show={showModalBuyOrderCompleted} content={renderModalBuyOrderCompleted()} />
            </div>
        </React.Fragment>
    );
};
