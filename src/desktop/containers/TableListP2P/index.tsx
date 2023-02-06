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
} from 'src/modules';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { RefreshIcon, CheckIcon, CloseIcon, NoDataIcon, FilterIcon, DropdownIcon } from 'src/assets/images/P2PIcon';
import { CustomStylesSelect, ModalCreateOffer } from '../../../desktop/components';
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

    /* ========== ORDER CREATE STATE START ========== */
    const [price_actual, setPriceActual] = React.useState<string | number>();
    const [payment_option, setPaymentOption] = React.useState([]);
    const [offer_number, setOfferNumber] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [payment_order, setPaymentOrder] = React.useState('');
    /* ========== ORDER CREATE STATE END ========== */

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
    }, [fiat]);

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

    const handleCloseModalCreateOffer = () => {
        setShowModalCreateOffer(false);
    };

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

        dispatch(orderCreate(side == 'buy' ? payloadBuy : payloadSell));
        resetForm();
    };

    const handleChangePrice = (e: string) => {
        setPrice(e);
    };

    const handleChangePaymentOrder = (e: string) => {
        setPaymentOrder(e);
    };

    const handleChangeOfferNumber = (e: string) => {
        setOfferNumber(e);
    };

    const resetForm = () => {
        setPaymentOrder('');
        setOfferNumber('');
        setAmount('');
        setPrice('');
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
            <div className="p-24">
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
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">IDR</label>
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
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">IDR</label>
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
                            <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">IDR</label>
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

    return (
        <React.Fragment>
            <div className="com-table-p2p w-100">
                {/* ========= TOOLBAR START ========= */}
                <div className="d-flex align-items-center justify-content-between toolbar-p2p w-100">
                    <div className="d-flex align-items-center flex-wrap">
                        <div className="d-flex align-items-center btn-type-side mb-24">
                            <button type="button" onClick={() => setSide('buy')} className="btn-side success">
                                Buy
                            </button>
                            <button type="button" onClick={() => setSide('sell')} className="btn-side danger">
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
                            onClick={() =>
                                isLoggedIn ? setShowModalCreateOffer(!showModalCreateOffer) : history.push('/signin')
                            }
                            className="btn-primary mb-24">
                            + Create Offers
                        </button>
                    </div>
                </div>
                {/* ========= TOOLBAR END ========= */}

                {/* ========= TABLE BUY START ========= */}
                {side === 'buy' && (
                    <table className="w-100">
                        <thead className="w-100">
                            <tr className="w-100 text-xs font-bold grey-text-accent border-table">
                                <th className="table-head">Advertiser</th>
                                <th className="table-head">Price</th>
                                <th className="table-head">Available / Limit</th>
                                <th className="table-head">Payment Methods</th>
                                <th className="table-head">Trades 0 Fee(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 1 ? (
                                list?.map((buy, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => {
                                            !expandBuy && setExpandBuy(buy.offer_number);
                                            handleChangeOfferNumber(buy?.offer_number);
                                            setPriceActual(buy?.price);
                                        }}
                                        className="white-text border-table cursor-pointer">
                                        {expandBuy === buy.offer_number ? (
                                            <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                                <div className="d-flex align-items-center justify-content-between mb-24">
                                                    <div className="d-flex align-items-center">
                                                        <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                        <div>
                                                            <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                                {buy?.trader?.email}
                                                            </h2>
                                                            <div className="d-flex">
                                                                <p className="p-0 m-0 text-xs mr-8">
                                                                    {buy?.sum_order} Orders
                                                                </p>
                                                                <p className="p-0 m-0 text-xs ">
                                                                    {buy?.persentage} % Complete
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="btn-close"
                                                        onClick={() => {
                                                            setExpandBuy('');
                                                            resetForm();
                                                        }}>
                                                        <CloseIcon />
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mb-24 py-12">
                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Price</p>
                                                        <p className="m-0 p-0 mr-4">
                                                            {buy?.price} {fiat?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Available</p>
                                                        <p className="m-0 p-0 mr-4">
                                                            {buy?.available_amount} {currency?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Payment Time Limit</p>
                                                        <p className="m-0 p-0 mr-16">{buy?.payment_time} Minutes</p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold">
                                                        <p className="m-0 p-0 mr-16">Seller's Payment Methods</p>
                                                        <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                            {buy?.payment[0]
                                                                ? buy?.payment?.map((bank, i) => (
                                                                      <div key={i} className="label-bank">
                                                                          <img src={bank?.logo} alt={bank?.bank_name} />
                                                                      </div>
                                                                  ))
                                                                : '-'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <form className="dark-bg-accent w-50 form-buy">
                                                        <h1 className="white-text text-lg mb-44">
                                                            Buy {currency?.toUpperCase()} Crypto
                                                        </h1>

                                                        <div className="position-relative mb-24">
                                                            <label className="white-text text-xs font-semibold mb-8">
                                                                I Want To Pay
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={'00.00'}
                                                                value={price}
                                                                onChange={(e) => handleChangePrice(e.target.value)}
                                                                required
                                                                className="form-control input-p2p-form white-text"
                                                            />
                                                            <label className="input-label-right text-sm grey-text position-absolute">
                                                                All {fiat?.toUpperCase()}
                                                            </label>
                                                        </div>

                                                        <div className="position-relative mb-44">
                                                            <label className="white-text text-xs font-semibold mb-8">
                                                                I Will Recieve
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={'00.00'}
                                                                value={amount}
                                                                required
                                                                className="form-control input-p2p-form white-text"
                                                            />
                                                            <label className="input-label-right text-sm grey-text position-absolute">
                                                                {currency?.toUpperCase()}
                                                            </label>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                            <button
                                                                type="button"
                                                                onClick={resetForm}
                                                                className="w-50 btn-secondary grey-text">
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCreacteOrder}
                                                                className="w-50 btn-primary">
                                                                Buy {currency?.toUpperCase()}
                                                            </button>
                                                        </div>
                                                    </form>

                                                    <div className="w-40">
                                                        <h1 className="white-text text-md mb-16">
                                                            Term and Conditions :
                                                        </h1>
                                                        <p className="text-xs font-extrabold grey-text mb-16">
                                                            {buy?.term_of_condition}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <>
                                                <td>
                                                    <div className="d-flex align-items-center table-row">
                                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                                        <div>
                                                            <div className="d-flex align-items-center">
                                                                <p className="p-0 m-0 mr-12 text-sm font-bold">
                                                                    {buy?.trader?.email}
                                                                </p>
                                                                <span className="check">
                                                                    <CheckIcon />
                                                                </span>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className="p-0 m-0 text-xs mr-8">
                                                                    {buy?.sum_order} Orders
                                                                </p>
                                                                <p className="p-0 m-0 text-xs ">
                                                                    {buy?.persentage} % Complete
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-xs font-bold">
                                                    {buy?.price} {fiat?.toUpperCase()}
                                                </td>
                                                <td>
                                                    <div className="d-flex text-xs font-bold mb-6">
                                                        <p className="m-0 p-0 mr-8">Available</p>
                                                        <p className="m-0 p-0">
                                                            {buy?.available_amount} {currency?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="d-flex text-xxs font-bold mb-6">
                                                        <p className="m-0 p-0 mr-8">Limit</p>
                                                        <p className="m-0 p-0">
                                                            {buy?.min_order}-{buy?.max_order} AED
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                        {buy?.payment[0]
                                                            ? buy?.payment?.map((bank, i) => (
                                                                  <div key={i} className="label-bank">
                                                                      <img src={bank?.logo} alt={bank?.bank_name} />
                                                                  </div>
                                                              ))
                                                            : '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="btn-success">
                                                        Buy {currency?.toUpperCase()}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="d-flex justify-content-center align-items-center w-100 min-h-300">
                                            <div className="d-flex flex-column justify-content-center align-items-center">
                                                <NoDataIcon />
                                                <p className="grey-text">No Data</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                {/* ========= TABLE BUY END ========= */}

                {/* ========= TABLE SELL START ========= */}
                {side === 'sell' && (
                    <table className="w-100">
                        <thead className="w-100">
                            <tr className="w-100 text-xs font-bold grey-text-accent border-table">
                                <th className="table-head">Advertiser</th>
                                <th className="table-head">Price</th>
                                <th className="table-head">Available / Limit</th>
                                <th className="table-head">Payment Methods</th>
                                <th className="table-head">Trades 0 Fee(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? (
                                list?.map((sell, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => {
                                            !expandSell && setExpandSell(sell.offer_number);
                                            handleChangeOfferNumber(sell?.offer_number);
                                            setPriceActual(sell?.price);
                                            setPaymentOption(sell?.payment);
                                        }}
                                        className="white-text border-table cursor-pointer">
                                        {expandSell === sell.offer_number ? (
                                            <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                                <div className="d-flex align-items-center justify-content-between mb-24">
                                                    <div className="d-flex align-items-center">
                                                        <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                        <div>
                                                            <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                                {sell?.trader?.email}
                                                            </h2>
                                                            <div className="d-flex">
                                                                <p className="p-0 m-0 text-xs mr-8">
                                                                    {sell?.sum_order} Orders
                                                                </p>
                                                                <p className="p-0 m-0 text-xs ">
                                                                    {sell?.persentage} % Complete
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="btn-close"
                                                        onClick={() => {
                                                            setExpandSell('');
                                                            resetForm();
                                                        }}>
                                                        <CloseIcon />
                                                    </span>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mb-24 py-12">
                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Price</p>
                                                        <p className="m-0 p-0 mr-4">
                                                            {sell?.price} {fiat?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Available</p>
                                                        <p className="m-0 p-0 mr-4">
                                                            {sell?.available_amount} {currency?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                        <p className="m-0 p-0 mr-16">Payment Time Limit</p>
                                                        <p className="m-0 p-0 mr-16">{sell?.payment_time} Minutes</p>
                                                    </div>

                                                    <div className="padding-4 d-flex align-items-center white-text text-xs font-bold">
                                                        <p className="m-0 p-0 mr-16">Seller's Payment Methods</p>
                                                        <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                            {sell?.payment[0]
                                                                ? sell?.payment?.map((bank, i) => (
                                                                      <div key={i} className="label-bank">
                                                                          <img src={bank?.logo} alt={bank?.bank_name} />
                                                                      </div>
                                                                  ))
                                                                : '-'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <form className="dark-bg-accent w-50 form-buy">
                                                        <h1 className="white-text text-lg mb-44">
                                                            Sell {currency?.toUpperCase()} Crypto
                                                        </h1>

                                                        <div className="position-relative mb-24">
                                                            <label className="white-text text-xs font-semibold mb-8">
                                                                I Want To Pay
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={'00.00'}
                                                                value={price}
                                                                onChange={(e) => handleChangePrice(e.target.value)}
                                                                required
                                                                className="form-control input-p2p-form white-text"
                                                            />
                                                            <label className="input-label-right text-sm grey-text position-absolute">
                                                                All {fiat?.toUpperCase()}
                                                            </label>
                                                        </div>

                                                        <div className="position-relative mb-24">
                                                            <label className="white-text text-xs font-semibold mb-8">
                                                                I Will Recieve
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder={'00.00'}
                                                                value={amount}
                                                                required
                                                                className="form-control input-p2p-form white-text"
                                                            />
                                                            <label className="input-label-right text-sm grey-text position-absolute">
                                                                {currency?.toUpperCase()}
                                                            </label>
                                                        </div>

                                                        <div className="position-relative mb-44">
                                                            <label className="white-text text-xs font-semibold mb-8">
                                                                Payment Method
                                                            </label>
                                                            <Select
                                                                value={optionPaymentOrder?.filter(function (option) {
                                                                    return option.value === payment_order;
                                                                })}
                                                                styles={CustomStylePaymentOrder}
                                                                options={optionPaymentOrder}
                                                                onChange={(e) => {
                                                                    handleChangePaymentOrder(e.value);
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                            <button
                                                                type="button"
                                                                onClick={resetForm}
                                                                className="w-50 btn-secondary grey-text">
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCreacteOrder}
                                                                className="w-50 btn-primary">
                                                                Sell {currency?.toUpperCase()}
                                                            </button>
                                                        </div>
                                                    </form>

                                                    <div className="w-40">
                                                        <h1 className="white-text text-md mb-16">
                                                            Term and Conditions :
                                                        </h1>
                                                        <p className="text-xs font-extrabold grey-text mb-16">
                                                            {sell?.term_of_condition}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            <>
                                                <td>
                                                    <div className="d-flex align-items-center table-row">
                                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                                        <div>
                                                            <div className="d-flex align-items-center">
                                                                <p className="p-0 m-0 mr-12 text-sm font-bold">
                                                                    {sell?.trader?.email}
                                                                </p>
                                                                <span className="check">
                                                                    <CheckIcon />
                                                                </span>
                                                            </div>
                                                            <div className="d-flex">
                                                                <p className="p-0 m-0 text-xs mr-8">
                                                                    {sell?.sum_order} Orders
                                                                </p>
                                                                <p className="p-0 m-0 text-xs ">
                                                                    {sell?.persentage} % Complete
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-xs font-bold">
                                                    {sell?.price} {fiat?.toUpperCase()}
                                                </td>
                                                <td>
                                                    <div className="d-flex text-xs font-bold mb-6">
                                                        <p className="m-0 p-0 mr-8">Available</p>
                                                        <p className="m-0 p-0">
                                                            {sell?.available_amount} {currency?.toUpperCase()}
                                                        </p>
                                                    </div>

                                                    <div className="d-flex text-xxs font-bold mb-6">
                                                        <p className="m-0 p-0 mr-8">Limit</p>
                                                        <p className="m-0 p-0">
                                                            {sell?.min_order}-{sell?.max_order} AED
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                        {sell?.payment[0]
                                                            ? sell?.payment?.map((bank, i) => (
                                                                  <div className="label-bank">
                                                                      <img src={bank?.logo} alt={bank?.bank_name} />
                                                                  </div>
                                                              ))
                                                            : '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="btn-danger">
                                                        Sell {currency?.toUpperCase()}
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="d-flex justify-content-center align-items-center w-100 min-h-300">
                                            <div className="d-flex flex-column justify-content-center align-items-center">
                                                <NoDataIcon />
                                                <p className="grey-text">No Data</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                {/* ========= TABLE SELL END ========= */}

                {showModalCreateOffer && (
                    <ModalCreateOffer
                        showModalCreateOffer={showModalCreateOffer}
                        onCloseModal={handleCloseModalCreateOffer}
                    />
                )}

                <Modal show={showFilter} content={renderModalFilter()} />

                <Modal show={showModalPrice} content={renderModalPrice()} />
            </div>
        </React.Fragment>
    );
};
