import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
    selectUserLoggedIn,
    offersFetch,
    RootState,
    selectP2POffers,
    selectP2POffersCurrentPage,
    selectP2POffersFirstElemIndex,
    selectP2POffersLastElemIndex,
    selectP2POffersNextPageExists,
    selectP2POffersTotalNumber,
    selectP2PPaymentMethodsData,
    selectWallets,
    p2pFiatFetch,
    selectP2PFiatsData,
    p2pCurrenciesFetch,
    selectP2PCurrenciesData,
    orderCreate,
    p2pOfferCreate,
    selectUserInfo,
} from 'src/modules';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import {
    RefreshIcon,
    CheckIcon,
    CloseIcon,
    NoDataIcon,
    FilterIcon,
    DropdownIcon,
    InfoSecondaryIcon,
} from 'src/assets/images/P2PIcon';
import { CustomStylesSelect, ModalCreateOffer, TableOfferP2P, ModalUserLevel } from '../../../desktop/components';
import Select from 'react-select';
import '../../../styles/colors.pcss';
import { CustomStyleFiat } from './CustomStyleFiat';
import { CustomStylePaymentOrder } from './CustomStylePaymentOrder';
import { Modal } from '../../../desktop/components';

export const TableListP2P = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const page = useSelector(selectP2POffersCurrentPage);
    const list = useSelector(selectP2POffers);
    const fiats = useSelector(selectP2PFiatsData);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const user = useSelector(selectUserInfo);
    const total = useSelector(selectP2POffersTotalNumber);
    const wallets = useSelector(selectWallets);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const firstElemIndex = useSelector((state: RootState) =>
        selectP2POffersFirstElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT)
    );
    const lastElemIndex = useSelector((state: RootState) =>
        selectP2POffersLastElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT)
    );
    const nextPageExists = useSelector((state: RootState) =>
        selectP2POffersNextPageExists(state, DEFAULT_TABLE_PAGE_LIMIT)
    );

    const [side, setSide] = React.useState('buy');
    const [currencies, setCurrencies] = React.useState([]);
    const [payments, setPayments] = React.useState([]);
    const [fiat, setFiat] = React.useState('IDR');
    const [currency, setCurrency] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [payment, setPayment] = React.useState('');
    const [expandBuy, setExpandBuy] = React.useState('');
    const [expandSell, setExpandSell] = React.useState('');
    const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [showModalPrice, setShowModalPrice] = React.useState(false);
    const [showModalUserLevel, setShowModalUserLevel] = React.useState(false);
    const [title, setTitle] = React.useState('');

    /* ========== ORDER CREATE STATE START ========== */
    const [price_actual, setPriceActual] = React.useState<string | number>();
    const [payment_option, setPaymentOption] = React.useState([]);
    const [offer_number, setOfferNumber] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [payment_order, setPaymentOrder] = React.useState('');
    /* ========== ORDER CREATE STATE END ========== */

    /* ============== CREATE OFFER STATE START ============== */
    const [currencyOffer, setCurrencyOffer] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [priceOffer, setPriceOffer] = React.useState('');
    const [fiatOffer, setFiatOffer] = React.useState('IDR');
    const [trade_amount, setTradeAmount] = React.useState('');
    const [min_order, setMinOrder] = React.useState('');
    const [max_order, setMaxOrder] = React.useState('');
    const [paymentValue, setPaymentValue] = React.useState([]);
    const [paymentOffer, setPaymentOffer] = React.useState([]);
    const [payment_limit, setPaymentLimit] = React.useState('');
    const [term_of_condition, setTermOfCondition] = React.useState('');
    const [auto_replay, setAutoReplay] = React.useState('');
    const [sideOffer, setSideOffer] = React.useState('buy');
    const [showModalConfirmation, setShowModalConfirmation] = React.useState(false);
    /* ============== CREATE OFFER STATE END ============== */

    React.useEffect(() => {
        if (currency !== undefined && fiat !== undefined) {
            dispatch(offersFetch({ fiat: fiat, currency: currency, side: side }));
        }
    }, [dispatch, side, fiat, currency]);

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat, currencyOffer, priceOffer]);

    React.useEffect(() => {
        setCurrencies(currenciesData?.currency);
        setPayments(currenciesData?.payment);
    }, [currenciesData]);

    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
    });

    const optionCurrency = currencies?.map((item) => {
        return {
            label: <p className="m-0 text-sm grey-text-accent">{item?.currency?.toUpperCase()}</p>,
            value: item.currency,
        };
    });

    const optionPayment = payments?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>, value: item.payment_user_id };
    });

    /* ============== FUNCTION CREATE ORDER START ============== */
    const optionPaymentOrder = payment_option?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>, value: item.payment_user_id };
    });

    React.useEffect(() => {
        const temp = +price / +price_actual;
        if (price && price_actual) {
            setAmount(temp.toString());
        } else if (!price) {
            setAmount('');
        }
    }, [price, price_actual]);

    const handleCreacteOrder = () => {
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

        if (user?.level < 3) {
            setShowModalUserLevel(true);
            setTitle('Create Order');
        } else {
            dispatch(orderCreate(side == 'buy' ? payloadBuy : payloadSell));
            resetForm();
        }
    };

    const handleChangePrice = (e: string) => {
        setPrice(e);
    };

    const handleChangePaymentOrder = (e: string) => {
        setPaymentOrder(e);
    };

    const handleSelectOfferBuy = (expand: string, offer_number: string, price: string, payment?: any) => {
        if (!expandBuy) {
            setExpandBuy(expand);
            setOfferNumber(offer_number);
            setPriceActual(price);
            setPaymentOption([]);
        }
    };

    const handleSelectOfferSell = (expand: string, offer_number: string, price: string, payment: any) => {
        if (!expandSell) {
            setExpandSell(expand);
            setOfferNumber(offer_number);
            setPriceActual(price);
            setPaymentOption(payment);
        }
    };

    const handleCloseExpandBuy = () => {
        setExpandBuy('');
        resetForm();
    };

    const handleCloseExpandSell = () => {
        setExpandSell('');
        resetForm();
    };

    const resetForm = () => {
        setPaymentOrder('');
        setOfferNumber('');
        setAmount('');
        setPrice('');
    };
    /* ============== FUNCTION CREATE ORDER END ============== */

    /* ============== FUNCTION CREATE OFFER START ============== */
    const handleConfirmOffer = () => {
        const payload = {
            currency: currencyOffer,
            price: priceOffer,
            fiat: fiatOffer,
            trade_amount: trade_amount,
            min_order: min_order,
            max_order: max_order,
            payment: paymentOffer,
            payment_limit: payment_limit,
            term_of_condition: term_of_condition,
            auto_replay: auto_replay,
            side: sideOffer,
        };

        dispatch(p2pOfferCreate(payload));

        setShowModalConfirmation(false);
        setCurrencyOffer(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
        setPriceOffer('');
        setFiatOffer('IDR');
        setTradeAmount('');
        setMinOrder('');
        setMaxOrder('');
        setPaymentValue([]);
        setPaymentOffer([]);
        setPaymentLimit('');
        setTermOfCondition('');
        setAutoReplay('');
        setSideOffer('buy');
    };

    const handleCreacteOffer = () => {
        setShowModalConfirmation(true);
        setShowModalCreateOffer(false);
    };

    const handleCloseModalCreateOffer = () => {
        setShowModalCreateOffer(false);
    };

    const handleChangeFiatOffer = (e: string) => {
        setFiatOffer(e);
    };

    const handleChangeCurrencyOffer = (e: string) => {
        setCurrencyOffer(e);
    };

    const handleChangePaymentOffer = (e: any) => {
        setPaymentValue(e);
        let data = e;
        let temp = [];
        data?.map((el) => {
            temp.push(el.value);
        });

        setPaymentOffer(temp);
    };

    const handleChangePriceOffer = (e: string) => {
        setPriceOffer(e);
    };

    const handleChangeTradeAmount = (e: string) => {
        setTradeAmount(e);
    };

    const handleChangeMinOrder = (e: string) => {
        setMinOrder(e);
    };

    const handleChangeMaxOrder = (e: string) => {
        setMaxOrder(e);
    };

    const handleChangePaymentLimit = (e: string) => {
        setPaymentLimit(e);
    };

    const handleChangeTermOfCondition = (e: string) => {
        setTermOfCondition(e);
    };

    const handleChangeAutoReplay = (e: string) => {
        setAutoReplay(e);
    };

    const handleChangeSideOffer = (e: string) => {
        setSideOffer(e);
    };
    /* ============== FUNCTION CREATE OFFER END ============== */

    const renderModalPrice = () => {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <img src="/img/p2pprice.png" alt="price" width={128} height={128} className="mb-24" />
                <h1 className="white-text text-ms font-bold mb-24">Ads Price Changed, Please Refresh</h1>
                <button onClick={() => location.reload()} className="btn-primary w-100">
                    Refresh
                </button>
            </div>
        );
    };

    const renderModalFilter = () => {
        return (
            <div className="">
                <h1 className="text-md font-semibold grey-text-accent mb-24 text-center">Filter</h1>

                <form action="">
                    <div className="mb-24">
                        <label htmlFor="" className="mb-16 text-ms font-extrabold grey-text">
                            Price
                        </label>

                        <div className="position-relative mb-16">
                            <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">min</label>
                            <input
                                type="text"
                                required
                                // value={min_order}
                                // onChange={(e) => handleChangeMinOrder(e.target.value)}
                                placeholder="00000"
                                className="custom-input-offer w-100 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                {fiat?.toUpperCase()}
                            </label>
                        </div>

                        <div className="position-relative">
                            <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">max</label>
                            <input
                                type="text"
                                required
                                // value={max_order}
                                // onChange={(e) => handleChangeMaxOrder(e.target.value)}
                                placeholder="00000"
                                className="custom-input-offer w-100 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                {fiat?.toUpperCase()}
                            </label>
                        </div>
                    </div>

                    <div className="mb-24">
                        <label htmlFor="" className="mb-16 text-ms font-extrabold grey-text">
                            Amount
                        </label>

                        <div className="position-relative mb-16">
                            <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">e.g</label>
                            <input
                                type="text"
                                required
                                // value={min_order}
                                // onChange={(e) => handleChangeMinOrder(e.target.value)}
                                placeholder="00000"
                                className="custom-input-offer w-100 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                {fiat?.toUpperCase()}
                            </label>
                        </div>
                    </div>

                    <div className="mb-24">
                        <div className="d-flex align-items-center justify-content-between mb-16">
                            <label htmlFor="" className="text-ms font-extrabold grey-text">
                                Payment Methods
                            </label>

                            <div className="d-flex align-items-center cursor-pointer">
                                <p className="m-0 p-0 text-ms grey-text">All</p>
                                <DropdownIcon />
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-8">
                            {payments && payments[0] ? (
                                payments?.map((payment, i) => (
                                    <div key={i} className="badge-payment text-center text-sm grey-text">
                                        {payment?.bank_name}
                                    </div>
                                ))
                            ) : (
                                <p className="m-0 p-0 text-center text-sm grey-text">No Payment Method Yet</p>
                            )}
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-16">
                        <button className="btn-secondary w-50">Reset</button>
                        <button className="btn-primary w-50">Confirm</button>
                    </div>
                </form>
            </div>
        );
    };

    const renderModalConfirmation = () => {
        return (
            <div>
                <h1 className="white-text text-md font-bold text-center mb-24">CONFIRM OFFER</h1>
                <h2 className="grey-text text-ms font-bold mb-16">{sideOffer?.toUpperCase()}</h2>
                <div className="d-flex flex-column gap-12 mb-24">
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Asset</p>
                        <div className="d-flex align-items-center gap-4">
                            <img src="/img/coin.png" alt="coin" width={25} height={25} />
                            <p className="m-0 p-0 white-text text-xxs font-bold">USDT</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Currency(Fiat)</p>
                        <p className="m-0 p-0 white-text text-xxs font-bold">{fiatOffer?.toUpperCase()}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Price</p>
                        <p className="m-0 p-0 white-text text-xxs font-bold">{priceOffer}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Trading Amount</p>
                        <p className="m-0 p-0 white-text text-xxs font-bold">{trade_amount} USDT</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Order Limit</p>
                        <p className="m-0 p-0 white-text text-xxs font-bold">
                            {min_order}-{max_order} IDR
                        </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Payment Method</p>
                        {paymentValue?.map((el) => (
                            <p className="m-0 p-0 white-text text-xxs font-bold">{el.label}</p>
                        ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="m-0 p-0 grey-text text-xs font-bold">Payment time limit</p>
                        <p className="m-0 p-0 white-text text-xxs font-bold">{payment_limit} Minutes</p>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-4 mb-24">
                    <p className="m-0 p-0 grey-text text-xs font-semibold">
                        After confirmation od the {sideOffer?.toUpperCase()} order, the trading assets will be frozen.
                    </p>
                    <InfoSecondaryIcon />
                </div>

                <div className="d-flex align-items-center justify-content-between gap-8 w-100">
                    <button
                        onClick={() => {
                            setShowModalConfirmation(false);
                            setCurrencyOffer(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
                            setPriceOffer('');
                            setFiatOffer('IDR');
                            setTradeAmount('');
                            setMinOrder('');
                            setMaxOrder('');
                            setPaymentValue([]);
                            setPaymentOffer([]);
                            setPaymentLimit('');
                            setTermOfCondition('');
                            setAutoReplay('');
                            setSideOffer('buy');
                        }}
                        className="btn-secondary w-40">
                        Cancel
                    </button>
                    <button onClick={handleConfirmOffer} className="btn-primary w-60">
                        Confirm
                    </button>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="com-table-p2p w-100">
                {/* ========= TOOLBAR START ========= */}
                <div className="d-flex align-items-center justify-content-between toolbar-p2p w-100">
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="d-flex align-items-center btn-type-side mb-24">
                            <button
                                type="button"
                                onClick={() => {
                                    setSide('buy');
                                    setExpandBuy('');
                                    resetForm();
                                }}
                                className="btn-side success">
                                Buy
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSide('sell');
                                    setExpandSell('');
                                    resetForm();
                                }}
                                className="btn-side danger">
                                Sell
                            </button>
                        </div>

                        <div className="select-filter mr-16">
                            <Select
                                value={optionCurrency?.filter(function (option) {
                                    return option.value === currency;
                                })}
                                styles={CustomStylesSelect}
                                options={optionCurrency}
                                onChange={(e) => {
                                    setCurrency(e.value);
                                }}
                            />
                        </div>

                        <div className="d-flex align-items-center mb-24">
                            <input type="text" placeholder="00.00" className="input-filter-fiat dark-bg-accent" />
                            <div className="mr-16">
                                <Select
                                    value={optionFiats?.filter(function (option) {
                                        return option.value === fiat;
                                    })}
                                    styles={CustomStyleFiat}
                                    options={optionFiats}
                                    onChange={(e) => {
                                        setFiat(e.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="select-filter mr-16">
                            <Select
                                // value={optionPayment.filter(function (option) {
                                //     return option.value === status;
                                // })}
                                styles={CustomStylesSelect}
                                options={optionPayment}
                                // onChange={(e) => {
                                //     setStatus(e.value);
                                //     filterredStatus(e.value);
                                // }}
                            />
                        </div>

                        <div
                            onClick={() => setShowFilter(true)}
                            className="btn-filter d-flex align-items-center gap-8 mb-24 cursor-pointer">
                            <p className="m-0 p-0 text-sm grey-text">Filter</p>
                            <FilterIcon />
                        </div>
                    </div>

                    <div className="d-flex align-items-center flex-wrap">
                        <button
                            onClick={() => {
                                setFiat('IDR');
                                setCurrency(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
                                setPayment('');
                            }}
                            type="button"
                            className="grey-text btn-secondary mr-16 mb-24">
                            <RefreshIcon fillColor={'var(--text-grey-color)'} /> Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (isLoggedIn && user?.level < 3) {
                                    setShowModalUserLevel(true);
                                    setTitle('Create Offer');
                                } else if (isLoggedIn && user?.level == 3) {
                                    setShowModalCreateOffer(!showModalCreateOffer);
                                } else {
                                    history.push('/signin');
                                }
                            }}
                            className="btn-primary mb-24">
                            + Create Offers
                        </button>
                    </div>
                </div>
                {/* ========= TOOLBAR END ========= */}

                {/* ========= TABLE BUY START ========= */}
                {side === 'buy' && (
                    <TableOfferP2P
                        side="buy"
                        list={list}
                        expand={expandBuy}
                        currency={currency}
                        fiat={fiat}
                        price={price}
                        amount={amount}
                        handleChangePrice={handleChangePrice}
                        handleCreacteOrder={handleCreacteOrder}
                        handleSelectOffer={handleSelectOfferBuy}
                        handleCloseExpand={handleCloseExpandBuy}
                        resetForm={resetForm}
                    />
                )}
                {/* ========= TABLE BUY END ========= */}

                {/* ========= TABLE SELL START ========= */}
                {side === 'sell' && (
                    <TableOfferP2P
                        side="sell"
                        list={list}
                        optionPaymentOrder={optionPaymentOrder}
                        expand={expandSell}
                        currency={currency}
                        fiat={fiat}
                        price={price}
                        amount={amount}
                        payment_order={payment_order}
                        handleChangePrice={handleChangePrice}
                        handleChangePaymentOrder={handleChangePaymentOrder}
                        handleCreacteOrder={handleCreacteOrder}
                        handleSelectOffer={handleSelectOfferSell}
                        handleCloseExpand={handleCloseExpandSell}
                        resetForm={resetForm}
                    />
                )}
                {/* ========= TABLE SELL END ========= */}

                {showModalCreateOffer && (
                    <ModalCreateOffer
                        showModalCreateOffer={showModalCreateOffer}
                        onCloseModal={handleCloseModalCreateOffer}
                        currencies={currencies}
                        fiats={fiats}
                        payments={payments}
                        auto_replay={auto_replay}
                        currency={currencyOffer}
                        fiat={fiatOffer}
                        max_order={max_order}
                        min_order={min_order}
                        payment={paymentOffer}
                        paymentValue={paymentValue}
                        payment_limit={payment_limit}
                        price={priceOffer}
                        side={sideOffer}
                        term_of_condition={term_of_condition}
                        trade_amount={trade_amount}
                        handleChangeAutoReplay={handleChangeAutoReplay}
                        handleChangeCurrency={handleChangeCurrencyOffer}
                        handleChangeFiat={handleChangeFiatOffer}
                        handleChangeMaxOrder={handleChangeMaxOrder}
                        handleChangeMinOrder={handleChangeMinOrder}
                        handleChangePayment={handleChangePaymentOffer}
                        handleChangePaymentLimit={handleChangePaymentLimit}
                        handleChangePrice={handleChangePriceOffer}
                        handleChangeSide={handleChangeSideOffer}
                        handleChangeTermOfCondition={handleChangeTermOfCondition}
                        handleChangeTradeAmount={handleChangeTradeAmount}
                        handleConfirmOffer={handleConfirmOffer}
                        handleCreateOffer={handleCreacteOffer}
                    />
                )}

                {showModalUserLevel && (
                    <ModalUserLevel
                        show={showModalUserLevel}
                        title={title}
                        onClose={() => setShowModalUserLevel(false)}
                    />
                )}
                <Modal show={showFilter} content={renderModalFilter()} />
                <Modal show={showModalPrice} content={renderModalPrice()} />
                <Modal show={showModalConfirmation} content={renderModalConfirmation()} />
            </div>
        </React.Fragment>
    );
};
