import * as React from 'react';
import { useDocumentTitle, useWalletsFetch } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserLoggedIn,
    p2pOfferFetch,
    offersFetch,
    selectP2PAccountOffer,
    selectP2POffers,
    selectP2PFiatsData,
    p2pFiatFetch,
    P2PFiat,
    selectP2POffersAccountLoading,
    selectP2POffersFetchLoading,
    selectWallets,
    selectP2PCurrenciesData,
    selectP2PPaymentUser,
    p2pCurrenciesFetch,
    p2pPaymentUserFetch,
    orderCreate,
    orderCreateData,
    selectP2POrderCreateData,
    selectP2POrderCreateLoading,
    selectP2POrderCreateSuccess,
} from 'src/modules';
import { P2PPaymentMethodProps } from 'src/desktop/components';
import { p2pProfileFetch } from 'src/modules/user/p2pProfile';
import { Link } from 'react-router-dom';
import { useLocation, useHistory, useParams } from 'react-router';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { capitalizeFirstLetter } from 'src/helpers';
import { RefreshMobileIcon, CloseMobileIcon, AddMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { Spinner } from 'react-bootstrap';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { ModalFullScreenMobile } from 'src/mobile/components';
import { Decimal } from 'src/components';

export const P2PDetailOrderMobileScreen: React.FC = () => {
    useDocumentTitle('P2P Detail Order');
    useWalletsFetch();

    const dispatch = useDispatch();
    const history = useHistory();
    const { offer_number = '' } = useParams<{ offer_number?: string }>();
    const location = useLocation<{ side?: string; fiat?: string; currency?: string }>();
    const side = location?.state?.side;
    const fiat = location?.state?.fiat;
    const currency = location?.state?.currency;

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const publicOffer = useSelector(selectP2POffers);
    const privateOffer = useSelector(selectP2PAccountOffer);
    const publicLoading = useSelector(selectP2POffersFetchLoading);
    const privateLoading = useSelector(selectP2POffersAccountLoading);
    const createData = useSelector(selectP2POrderCreateData);
    const createOrderSuccess = useSelector(selectP2POrderCreateSuccess);
    const createOrderLoading = useSelector(selectP2POrderCreateLoading);
    const fiats: P2PFiat[] = useSelector(selectP2PFiatsData);
    const myPayment: any = useSelector(selectP2PPaymentUser);
    const wallets = useSelector(selectWallets);
    const wallet = wallets?.find((item) => item?.currency == currency);

    const [detail, setDetail] = React.useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [showPayment, setShowPayment] = React.useState(false);
    const [showUnsupported, setShowUnsupported] = React.useState(false);
    const [price, setPrice] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [payment_order, setPaymentOrder] = React.useState('');
    const [selectedPayment, setSelectedPayment] = React.useState<any>();

    const fiatData = fiats?.find((item) => item?.name == fiat);

    React.useEffect(() => {
        dispatch(p2pPaymentUserFetch({}));
    }, [dispatch]);

    React.useEffect(() => {
        if (side == 'buy') {
            const temp = +price / +detail?.price;
            if (price && detail?.price) {
                setAmount(temp?.toString());
            } else if (!price) {
                setAmount('');
            }
        } else {
            const temp = +amount * +detail?.price;
            if (amount && detail?.price) {
                setPrice(temp?.toString());
            } else if (!amount) {
                setPrice('');
            }
        }
    }, [price, detail, side, amount]);

    React.useEffect(() => {
        if (isLoggedIn) {
            setDetail(privateOffer?.find((item) => item?.offer_number == offer_number));
            setLoading(privateLoading);
        } else {
            setDetail(publicOffer?.find((item) => item?.offer_number == offer_number));
            setLoading(publicLoading);
        }
    }, [isLoggedIn, publicOffer, privateOffer, privateLoading, publicLoading]);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(p2pOfferFetch({ side: side, fiat: fiat, currency: currency }));
        }
        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(offersFetch({ side: side, fiat: fiat, currency: currency }));
        }
    }, [currency, fiat, side, dispatch]);

    React.useEffect(() => {
        if (createOrderSuccess) {
            dispatch(orderCreateData());
            setAmount('');
            setPrice('');
            setPaymentOrder('');
            history.push(`/p2p/order/detail/${createData?.order_number}`, { side: createData?.side });
        }
    }, [createOrderSuccess, createData]);

    const handleClickAll = () => {
        if (!isLoggedIn) {
            const temPrice = +detail?.max_order * +detail?.price;
            const tempAmount = +detail?.max_order;
            setPrice(temPrice?.toString());
            setAmount(tempAmount?.toString());
        } else {
            const balance = +wallet?.p2p_balance > +detail?.max_order ? +detail?.max_order : +wallet?.p2p_balance;
            const temPrice = side == 'buy' ? +detail?.max_order : balance * +detail?.price;
            const tempAmount = side == 'buy' ? +detail?.max_order : balance;
            setPrice(temPrice?.toString());
            setAmount(tempAmount?.toString());
        }
    };

    const availablePayment = myPayment?.list?.filter(({ bank_name }) =>
        detail?.payment?.some(({ name }) => bank_name === name)
    );
    const supported = detail?.payment?.filter(({ name }) =>
        availablePayment.some(({ bank_name }) => name !== bank_name)
    );
    const unsupported = myPayment?.list?.filter(({ bank_name }) =>
        detail?.payment?.some(({ name }) => bank_name !== name)
    );

    const handleChangePrice = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPrice(value);
    };

    const handleChangeAmount = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmount(value);
    };

    const handleCreacteOrder = async () => {
        const payloadSell = {
            offer_number,
            price,
            amount,
            payment_order,
        };

        const payloadBuy = {
            offer_number,
            price,
            amount,
        };

        await dispatch(orderCreate(side == 'buy' ? payloadBuy : payloadSell));
    };

    const handleRefresh = () => {
        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(p2pOfferFetch({ side: side, fiat: fiat, currency: currency }));
        }
        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(offersFetch({ side: side, fiat: fiat, currency: currency }));
        }
    };

    const disableButton = () => {
        if (!price || !amount || !offer_number || createOrderLoading) {
            return true;
        }

        if (side == 'sell' && !payment_order) {
            return true;
        }

        if (+amount < +detail?.min_order || +amount > +detail?.max_order) {
            return true;
        }
    };

    const renderModalPayment = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center position-relative mb-48">
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Select payment method</p>
                    <span onClick={() => setShowPayment(!showPayment)} className="back position-absolute">
                        <ArrowLeft className={'cursor-pointer'} />
                    </span>
                </div>

                <div className="d-flex flex-column gap-16 mb-32">
                    {availablePayment?.map((bank, i) => (
                        <div
                            key={i}
                            className="modal-bank-info-container cursor-pointer"
                            onClick={() => {
                                setPaymentOrder(bank?.payment_user_uid);
                                setShowPayment(!showPayment);
                                setSelectedPayment(bank);
                            }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="label-payment"></div>
                                    <p className="m-0 p-0 grey-text-accent text-ms">{bank?.bank_name}</p>
                                </div>

                                <div className="d-flex align-items-center gap-16">
                                    <img src={bank?.logo} alt="logo" width={40} className="h-auto" />

                                    <ArrowRight className={''} />
                                </div>
                            </div>

                            <p className="m-0 p-0 grey-text-accent text-ms">{bank?.account_name}</p>
                            <p className="m-0 p-0 grey-text-accent text-ms font-bold">{bank?.account_number}</p>
                            <p className="m-0 p-0 grey-text text-ms">{bank?.symbol}</p>
                        </div>
                    ))}
                </div>

                <div className="d-flex flex-column gap-16 mb-32">
                    <div className="title-support">
                        <p className="m-0 p-0 grey-text text-sm">Supported payment methods</p>
                    </div>

                    {supported?.map((bank, i) => (
                        <div key={i} className="modal-support-container">
                            <div className="d-flex align-items-center gap-16">
                                <img src={bank?.logo_url} alt="bank" height={20} />
                                <p className="m-0 p-0 grey-text text-sm">Add {bank?.name}</p>
                            </div>

                            <span className="cursor-pointer">
                                <AddMobileIcon />
                            </span>
                        </div>
                    ))}
                </div>

                <div className="d-flex flex-column gap-16 mb-32">
                    <div className="title-support d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-sm">View unsupported payment methods</p>
                        <span onClick={() => setShowUnsupported(!showUnsupported)} className="cursor-pointer">
                            <ArrowRight className={''} />
                        </span>
                    </div>

                    {showUnsupported &&
                        unsupported?.map((bank, i) => (
                            <div key={i} className="modal-bank-info-container">
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="label-payment-disable"></div>
                                        <p className="m-0 p-0 grey-text text-ms">{bank?.bank_name}</p>
                                    </div>

                                    <div className="d-flex align-items-center gap-16">
                                        <img src={bank?.logo} alt="logo" width={40} className="h-auto" />

                                        <ArrowRight className={''} />
                                    </div>
                                </div>

                                <p className="m-0 p-0 grey-text text-ms">{bank?.account_name}</p>
                                <p className="m-0 p-0 grey-text text-ms font-bold">{bank?.account_number}</p>
                                <p className="m-0 p-0 grey-text text-ms">{bank?.symbol}</p>
                            </div>
                        ))}
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p-detail-offer mobile-container dark-bg-main">
                <div className="position-relative">
                    <div className="d-flex justify-content-center align-items-center position-relative mb-24">
                        <p className="m-0 p-0 grey-text-accent text-md font-extrabold">
                            {capitalizeFirstLetter(side)} {detail?.currency?.toUpperCase()}
                        </p>
                        <span onClick={() => history.goBack()} className="back position-absolute">
                            <ArrowLeft className={'cursor-pointer'} />
                        </span>
                    </div>

                    <div>
                        <div className="d-flex align-item-center gap-8">
                            <p className="m-0 p-0 grey-text text-sm">Price</p>
                            <p className="m-0 p-0 green-text text-sm">
                                {fiatData?.symbol} {detail?.price}
                            </p>

                            {loading ? (
                                <Spinner animation="border" variant="secondary" size="sm" />
                            ) : (
                                <span onClick={handleRefresh} className="cursor-pointer m-0 p-0">
                                    <RefreshMobileIcon />
                                </span>
                            )}
                        </div>

                        <div className="d-flex align-item-center gap-8 mb-24">
                            <p className="m-0 p-0 grey-text text-sm">Limit</p>
                            <p className="m-0 p-0 white-text text-sm">
                                {fiatData?.symbol} {+detail?.min_order * +detail?.price} - {fiatData?.symbol}{' '}
                                {+detail?.max_order * +detail?.price}
                            </p>
                        </div>

                        <form className="form-container mb-24">
                            <div className="w-100">
                                <label className="white-text text-ms">I want to {side == 'buy' ? 'pay' : 'sell'}</label>

                                <div className="d-flex align-items-center w-100 mb-8">
                                    <div className="w-80">
                                        <input
                                            type="text"
                                            value={side == 'buy' ? price : amount}
                                            onChange={(e) =>
                                                side == 'buy'
                                                    ? handleChangePrice(e.target.value)
                                                    : handleChangeAmount(e.target.value)
                                            }
                                            placeholder="Enter amount"
                                            className="input-pay w-100 filter-input"
                                        />
                                    </div>
                                    <div className="w-20 d-flex align-items-center justify-content-end gap-4 btn-pay-all">
                                        <p
                                            onClick={handleClickAll}
                                            className="m-0 p-0 text-sm grey-text cursor-pointer">
                                            All
                                        </p>
                                        <p className="m-0 p-0 text-sm grey-text">
                                            {side == 'buy' ? fiat?.toUpperCase() : currency?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {side == 'sell' && isLoggedIn && (
                                    <p className="m-0 p-0 mt-8 text-sm grey-text">
                                        Your Balance : {Decimal.format(wallet?.p2p_balance, wallet?.fixed)}{' '}
                                        {currency?.toUpperCase()}
                                    </p>
                                )}
                            </div>

                            <div className="w-100">
                                <label className="white-text text-ms mb-16">I will receive</label>

                                <div className="d-flex align-items-center w-100">
                                    <div className="w-100 position-relative">
                                        <input
                                            value={side == 'buy' ? amount : price}
                                            required
                                            readOnly
                                            type="text"
                                            placeholder="Enter amount"
                                            className="custom-input-order w-100 filter-input"
                                        />
                                        <label className="input-label-right text-sm grey-text position-absolute">
                                            {side == 'buy' ? currency?.toUpperCase() : fiat?.toUpperCase()}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {side == 'sell' && (
                                <div className="w-100">
                                    <label className="white-text text-ms mb-16">Select payment method</label>

                                    <button
                                        type="button"
                                        onClick={() => setShowPayment(!showPayment)}
                                        className="btn-secondary w-100 d-flex justify-content-between align-items-center">
                                        {selectedPayment ? (
                                            <div className="d-flex align-items-center gap-8">
                                                <img src={selectedPayment?.logo} alt="bank" height={12} />
                                                <p className="m-0 p-0 grey-text text-sm">
                                                    {selectedPayment?.tipe == 'ewallet' ? 'E-Wallet' : 'Bank Transfer'}{' '}
                                                    {selectedPayment?.bank_name}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="m-0 p-0 grey-text text-sm">Set payment method</p>
                                        )}

                                        <ArrowRight className={''} />
                                    </button>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center w-100">
                                <p className="m-0 p-0 grey-text text-sm">Crypto amount</p>
                                <p className="m-0 p-0 white-text text-sm">
                                    {amount ? amount : 0} {detail?.currency?.toUpperCase()}
                                </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <p className="m-0 p-0 grey-text text-sm">Fiat amount</p>
                                <p className="m-0 p-0 white-text text-sm">
                                    {price ? price : 0} {fiatData?.name}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCreacteOrder}
                                disabled={disableButton()}
                                className={`w-100 text-ms font-normal ${side == 'buy' ? 'btn-primary' : 'btn-danger'}`}>
                                {capitalizeFirstLetter(side)} {detail?.currency?.toUpperCase()}
                            </button>
                        </form>

                        <div className="trade-info mb-32">
                            <h2 className="m-0 p-0 white-text text-ms">Trade Info</h2>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <p className="m-0 p-0 grey-text text-sm">Payment Time Limit</p>
                                <p className="m-0 p-0 white-text text-sm">45 Minute</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <p className="m-0 p-0 grey-text text-sm">Seller’s Nickname / Email</p>

                                <Link
                                    to={`/p2p/profile/${detail?.trader?.uid}`}
                                    className="d-flex align-items-center gap-8">
                                    <p className="m-0 p-0 white-text text-sm">{detail?.trader?.email}</p>
                                    <span>
                                        <ArrowRight className={''} />
                                    </span>
                                </Link>
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <p className="m-0 p-0 grey-text text-sm">Payment Method</p>

                                <div className="d-flex align-items-center gap-8">
                                    {detail?.payment?.map((bank, i) => (
                                        <img key={i} src={bank?.logo_url} alt="bank" className="" height={12} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="trade-info mb-32">
                            <h2 className="m-0 p-0 white-text text-ms">Terms</h2>
                            <p className="m-0 p-0 grey-text text-sm">{detail?.term_of_condition}</p>
                        </div>
                    </div>
                </div>

                <ModalFullScreenMobile show={showPayment} content={renderModalPayment()} />
            </div>
        </React.Fragment>
    );
};
