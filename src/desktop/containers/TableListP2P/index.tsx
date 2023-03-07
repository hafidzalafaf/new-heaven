import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
    selectUserLoggedIn,
    offersFetch,
    selectP2POffers,
    p2pOfferFetch,
    selectP2PAccountOffer,
    p2pFiatFetch,
    selectP2PFiatsData,
    p2pCurrenciesFetch,
    selectP2PCurrenciesData,
    orderCreate,
    orderCreateData,
    p2pOfferCreate,
    selectUserInfo,
    selectP2POrderCreateData,
    selectP2POrderCreateSuccess,
    selectP2POffersFetchLoading,
    selectP2PPaymentUser,
    p2pPaymentUserFetch,
    selectP2POrderCreateLoading,
    selectP2PCreateOfferLoading,
    selectP2PCreateOfferSuccess,
} from 'src/modules';
import { RefreshIcon, FilterIcon, DropdownIcon, InfoSecondaryIcon } from 'src/assets/images/P2PIcon';
import {
    CustomStylesSelect,
    ModalCreateOffer,
    TableOfferP2P,
    ModalUserLevel,
    ModalOptionPayment,
    P2PPaymentMethodProps,
} from '../../../desktop/components';
import Select from 'react-select';
import '../../../styles/colors.pcss';
import { CustomStyleFiat } from './CustomStyleFiat';
import { Modal } from '../../../desktop/components';
import { Spinner } from 'react-bootstrap';

export const TableListP2P = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const publicOffer = useSelector(selectP2POffers);
    const privateOffer = useSelector(selectP2PAccountOffer);
    const fiats = useSelector(selectP2PFiatsData);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const user = useSelector(selectUserInfo);
    const createData = useSelector(selectP2POrderCreateData);
    const createOrderSuccess = useSelector(selectP2POrderCreateSuccess);
    const createOrderLoading = useSelector(selectP2POrderCreateLoading);
    const createOfferLoading = useSelector(selectP2PCreateOfferLoading);
    const createOfferSuccess = useSelector(selectP2PCreateOfferSuccess);
    const loadingOffers = useSelector(selectP2POffersFetchLoading);
    const paymentMethods: P2PPaymentMethodProps[] = useSelector(selectP2PPaymentUser);

    const [currencies, setCurrencies] = React.useState([]);
    const [payments, setPayments] = React.useState([]);
    const [expandBuy, setExpandBuy] = React.useState('');
    const [expandSell, setExpandSell] = React.useState('');
    const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [showModalPrice, setShowModalPrice] = React.useState(false);
    const [showModalOptionPayment, setShowModalOptionPayment] = React.useState(false);
    const [showSelectedPayment, setShowSelectedPayment] = React.useState(false);
    const [showModalUserLevel, setShowModalUserLevel] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [offerLoading, setOfferLoading] = React.useState(false);
    const [loadingRefresh, setLoadingRefresh] = React.useState(false);
    const [paymentListUser, setPaymentListUser] = React.useState([]);

    /* ========== ORDER FETCH STATE START ========== */
    const [side, setSide] = React.useState('buy');
    const [fiat, setFiat] = React.useState('IDR');
    const [currency, setCurrency] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [amountList, setAmountList] = React.useState('');
    const [amountFilter, setAmountFilter] = React.useState('');
    const [minPriceFilter, setMinPriceFilter] = React.useState('');
    const [maxPriceFilter, setMaxPriceFilter] = React.useState('');
    const [paymentFilterValue, setPaymentFilterValue] = React.useState([]);
    const [paymentFilter, setPaymentFilter] = React.useState([]);
    /* ========== ORDER FETCH STATE END ========== */

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
        setOfferLoading(true);
        setTimeout(() => {
            setOfferLoading(false);
        }, 3000);
    }, []);

    React.useEffect(() => {
        const defaultPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
        };

        const amountListPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountList,
        };

        const amountFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountFilter,
        };

        const priceFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
        };

        const paymentFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            payment: paymentFilter,
        };

        const filterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
            amount: amountFilter,
            paymentFilter: paymentFilter,
        };

        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(
                p2pOfferFetch(
                    amountList
                        ? amountListPayload
                        : amountFilter
                        ? amountFilterPayload
                        : minPriceFilter && maxPriceFilter
                        ? priceFilterPayload
                        : paymentFilter
                        ? paymentFilterPayload
                        : minPriceFilter && maxPriceFilter && amountFilter && paymentFilter
                        ? filterPayload
                        : defaultPayload
                )
            );
        }

        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(
                offersFetch(
                    amountList
                        ? amountListPayload
                        : amountFilter
                        ? amountFilterPayload
                        : minPriceFilter && maxPriceFilter
                        ? priceFilterPayload
                        : paymentFilter
                        ? paymentFilterPayload
                        : minPriceFilter && maxPriceFilter && amountFilter && paymentFilter
                        ? filterPayload
                        : defaultPayload
                )
            );
        }
    }, [
        dispatch,
        side,
        fiat,
        currency,
        amountList,
        amountFilter,
        minPriceFilter,
        maxPriceFilter,
        paymentFilter,
        createOfferSuccess,
        isLoggedIn,
    ]);

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
        dispatch(p2pPaymentUserFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat, currencyOffer, priceOffer]);

    React.useEffect(() => {
        setCurrencies(currenciesData?.currency);
        setPayments(currenciesData?.payment);
        setPaymentListUser(paymentMethods);
    }, [currenciesData, paymentMethods]);

    React.useEffect(() => {
        if (createOrderSuccess) {
            dispatch(orderCreateData());
            history.push(`/p2p/wallet/order/${createData?.order_number}`, { side: createData?.side });
        }
    }, [createOrderSuccess, createData]);

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
        return { label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>, value: item.payment_id };
    });

    const handleSelectPaymentFilter = (e: any) => {
        if (paymentFilter?.includes(e)) {
            setPaymentFilter(paymentFilter.filter((item) => item !== e));
        } else {
            setPaymentFilter([...paymentFilter, e]);
        }
    };

    const handleSelectPaymentFilterDropdown = (e: any) => {
        if (paymentFilter?.includes(e)) {
            setPaymentFilter(paymentFilter.filter((item) => item !== e));
        } else {
            setPaymentFilter([e]);
        }
    };

    const handleRefresh = () => {
        setLoadingRefresh(true);

        const defaultPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
        };

        const amountListPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountList,
        };

        const amountFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountFilter,
        };

        const priceFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
        };

        const filterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
            amount: amountFilter,
        };

        setTimeout(() => {
            setLoadingRefresh(false);
            if (currency !== undefined && fiat !== undefined) {
                dispatch(
                    isLoggedIn
                        ? p2pOfferFetch(
                              amountList
                                  ? amountListPayload
                                  : amountFilter
                                  ? amountFilterPayload
                                  : minPriceFilter && maxPriceFilter
                                  ? priceFilterPayload
                                  : minPriceFilter && maxPriceFilter && amountFilter
                                  ? filterPayload
                                  : defaultPayload
                          )
                        : offersFetch(
                              amountList
                                  ? amountListPayload
                                  : amountFilter
                                  ? amountFilterPayload
                                  : minPriceFilter && maxPriceFilter
                                  ? priceFilterPayload
                                  : minPriceFilter && maxPriceFilter && amountFilter
                                  ? filterPayload
                                  : defaultPayload
                          )
                );
            }
        }, 1500);
    };

    /* ============== FUNCTION CREATE ORDER START ============== */
    const filteredPayments = payments?.filter(({ bank_name }) =>
        payment_option?.some(({ name }) => bank_name === name)
    );

    const optionPaymentOrder = isLoggedIn
        ? filteredPayments?.map((item) => {
              return {
                  label: <p className="m-0 text-sm grey-text-accent">{item?.bank_name}</p>,
                  value: item?.payment_user_uid,
              };
          })
        : payment_option?.map((item) => {
              return {
                  label: <p className="m-0 text-sm grey-text-accent">{item?.name}</p>,
                  value: item?.p2p_payment_user_id,
              };
          });

    React.useEffect(() => {
        const temp = +price / +price_actual;
        if (price && price_actual) {
            setAmount(temp.toString());
        } else if (!price) {
            setAmount('');
        }
    }, [price, price_actual]);

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

        if (user?.level < 3) {
            setShowModalUserLevel(true);
            setTitle('Create Order');
        } else {
            await dispatch(orderCreate(side == 'buy' ? payloadBuy : payloadSell));
            resetForm();
        }
    };

    const handleChangePrice = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPrice(value);
    };

    const handleChangePaymentOrder = (e: string) => {
        setPaymentOrder(e);
    };

    const handleSelectOfferBuy = (expand: string, offer_number: string, price: string, payment?: any) => {
        setExpandBuy(expand);
        setOfferNumber(offer_number);
        setPriceActual(price);
        setPaymentOption([]);
    };

    const handleSelectOfferSell = (expand: string, offer_number: string, price: string, payment: any) => {
        setExpandSell(expand);
        setOfferNumber(offer_number);
        setPriceActual(price);
        setPaymentOption(payment);
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

    /* ============== FUNCTION MODAL PAYMENT OPTION START ============== */

    const handleSelectPayment = () => {
        setShowSelectedPayment(true);
    };

    const handleConfirmSelectedPayment = () => {
        setShowModalOptionPayment(false);
    };

    const handleCancelSelectedPayment = () => {
        setShowSelectedPayment(false);
    };
    /* ============== FUNCTION MODAL PAYMENT OPTION END ============== */

    const handleChangeAmountList = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setAmountList(value);
    };

    const handleChangeAmountFilter = (e) => {
        setAmountFilter(e);
    };

    const handleChangeMinPrice = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setMinPriceFilter(value);
    };

    const handleChangeMaxPrice = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setMaxPriceFilter(value);
    };

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
                <div
                    onClick={() => setShowFilter(false)}
                    style={{
                        float: 'right',
                    }}>
                    <svg
                        className="cursor-pointer"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="#FFFFFF"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                            fill="#606060"
                        />
                    </svg>
                </div>
                <h1 className="text-md font-semibold grey-text-accent mb-24 text-center">Filter</h1>

                <form action="">
                    <div className="mb-24">
                        <label htmlFor="" className="mb-16 text-ms font-extrabold grey-text">
                            Price
                        </label>

                        <div className="position-relative mb-16">
                            <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">min</label>
                            <input
                                type="number"
                                required
                                value={minPriceFilter}
                                onChange={(e) => handleChangeMinPrice(e.target.value)}
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
                                type="number"
                                required
                                value={maxPriceFilter}
                                onChange={(e) => handleChangeMaxPrice(e.target.value)}
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
                                type="number"
                                required
                                value={amountFilter}
                                onChange={(e) => handleChangeAmountFilter(e.target.value)}
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
                                    <div
                                        onClick={() => handleSelectPaymentFilter(payment?.payment_id)}
                                        key={i}
                                        className={`badge-payment text-center text-sm cursor-pointer ${
                                            paymentFilter?.find((item) => item == payment?.payment_id) && 'active'
                                        }`}>
                                        <span
                                            className={` ${
                                                paymentFilter?.find((item) => item == payment?.payment_id)
                                                    ? 'gradient-text'
                                                    : 'grey-text'
                                            }`}>
                                            {payment?.bank_name}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="m-0 p-0 text-center text-sm grey-text">No Payment Method Yet</p>
                            )}
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-16">
                        <button
                            type="button"
                            onClick={() => {
                                setShowFilter(false);
                                setAmountFilter('');
                                setMaxPriceFilter('');
                                setMinPriceFilter('');
                                setPaymentFilter([]);
                            }}
                            className="btn-secondary w-50">
                            Reset
                        </button>
                        <button type="button" onClick={() => setShowFilter(false)} className="btn-primary w-50">
                            Confirm
                        </button>
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
                    <button
                        type="button"
                        disabled={createOfferLoading}
                        onClick={handleConfirmOffer}
                        className="btn-primary w-60">
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
                                className={`btn-side white-text font-semibold text-sm ${
                                    side == 'buy' ? 'success' : 'btn-transparent'
                                }`}>
                                Buy
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSide('sell');
                                    setExpandSell('');
                                    resetForm();
                                }}
                                className={`btn-side white-text font-semibold text-sm ${
                                    side == 'sell' ? 'danger' : 'btn-transparent'
                                }`}>
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
                            <input
                                style={{
                                    color: 'white',
                                }}
                                value={amountList}
                                onChange={(e) => handleChangeAmountList(e.target.value)}
                                type="text"
                                placeholder="00.00"
                                className="input-filter-fiat dark-bg-accent filter-input"
                            />
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
                                value={optionPayment?.filter(function (option) {
                                    return option.value == paymentFilter[0];
                                })}
                                styles={CustomStylesSelect}
                                options={optionPayment}
                                onChange={(e) => {
                                    handleSelectPaymentFilterDropdown(e.value);
                                }}
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
                        <button onClick={handleRefresh} type="button" className="grey-text btn-secondary mr-16 mb-24">
                            {loadingRefresh ? (
                                <Spinner animation="border" variant="secondary" size="sm" />
                            ) : (
                                <RefreshIcon fillColor={'var(--text-grey-color)'} />
                            )}
                            Refresh
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
                        list={isLoggedIn ? privateOffer : publicOffer}
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
                        loading={offerLoading}
                        refresh={loadingRefresh}
                    />
                )}
                {/* ========= TABLE BUY END ========= */}

                {/* ========= TABLE SELL START ========= */}
                {side === 'sell' && (
                    <TableOfferP2P
                        side="sell"
                        list={isLoggedIn ? privateOffer : publicOffer}
                        optionPaymentOrder={optionPaymentOrder}
                        expand={expandSell}
                        currency={currency}
                        fiat={fiat}
                        price={price}
                        amount={amount}
                        payment_order={payment_order}
                        handleShowPaymentOption={() => setShowModalOptionPayment(true)}
                        handleChangePrice={handleChangePrice}
                        handleChangePaymentOrder={handleChangePaymentOrder}
                        handleCreacteOrder={handleCreacteOrder}
                        handleSelectOffer={handleSelectOfferSell}
                        handleCloseExpand={handleCloseExpandSell}
                        resetForm={resetForm}
                        loading={offerLoading}
                        refresh={loadingRefresh}
                    />
                )}
                {/* ========= TABLE SELL END ========= */}

                {showModalCreateOffer && (
                    <ModalCreateOffer
                        showModalCreateOffer={showModalCreateOffer}
                        onCloseModal={handleCloseModalCreateOffer}
                        currencies={currencies}
                        fiats={fiats}
                        payments={paymentListUser}
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
                        loading={createOfferLoading}
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

                {showModalOptionPayment && (
                    <ModalOptionPayment
                        show={showModalOptionPayment}
                        showSelectedPayment={showSelectedPayment}
                        onClose={() => setShowModalOptionPayment(false)}
                        handleSelectPayment={handleSelectPayment}
                        handleCancelSelectedPayment={handleCancelSelectedPayment}
                        handleConfirmSelectedPayment={handleConfirmSelectedPayment}
                    />
                )}

                <Modal show={showFilter} content={renderModalFilter()} />
                <Modal show={showModalPrice} content={renderModalPrice()} />
                <Modal show={showModalConfirmation} content={renderModalConfirmation()} />
            </div>
        </React.Fragment>
    );
};
