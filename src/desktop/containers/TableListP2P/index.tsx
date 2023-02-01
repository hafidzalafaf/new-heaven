import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useP2PCurrenciesFetch, useP2PPaymentMethodsFetch, useUserPaymentMethodsFetch } from 'src/hooks';
import {
    selectUserLoggedIn,
    Offer,
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
} from 'src/modules';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { RefreshIcon, CheckIcon, CloseIcon } from 'src/assets/images/P2PIcon';
import { CustomStylesSelect, ModalCreateOffer } from '../../../desktop/components';
import Select from 'react-select';
import '../../../styles/colors.pcss';
import { CustomStyleFiat } from './CustomStyleFiat';

export const TableListP2P = () => {
    useP2PCurrenciesFetch();
    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();

    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const page = useSelector(selectP2POffersCurrentPage);
    const list = useSelector(selectP2POffers);
    const fiats = useSelector(selectP2PFiatsData);
    const currencies = useSelector(selectP2PCurrenciesData);
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
    const [fiat, setFiat] = React.useState('idr');
    const [currency, setCurrency] = React.useState('usdt');
    const [expandBuy, setExpandBuy] = React.useState('');
    const [expandSell, setExpandSell] = React.useState('');
    const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(false);

    React.useEffect(() => {
        dispatch(offersFetch({ fiat: 'idr', currency: 'eth', side: side }));
    }, [dispatch, side]);

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat]);

    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
    });

    const optionQuote = [
        { label: <p className="m-0 text-sm grey-text-accent">USDT</p>, value: 'usdt' },
        { label: <p className="m-0 text-sm grey-text-accent">IDR</p>, value: 'idr' },
        { label: <p className="m-0 text-sm grey-text-accent">BTC</p>, value: 'btc' },
        { label: <p className="m-0 text-sm grey-text-accent">TRX</p>, value: 'trx' },
    ];

    const optionPayment = [
        { label: <p className="m-0 text-sm grey-text-accent">All Payment</p>, value: 'all' },
        { label: <p className="m-0 text-sm grey-text-accent">Dana</p>, value: 'dana' },
        { label: <p className="m-0 text-sm grey-text-accent">Bank BCA</p>, value: 'bca' },
    ];

    return (
        <React.Fragment>
            <div className="com-table-p2p w-100">
                {/* ========= TOOLBAR START ========= */}
                <div className="d-flex align-items-start justify-content-between toolbar-p2p w-100">
                    <div className="d-flex align-items-center">
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
                                value={optionFiats.filter(function (option) {
                                    return option.value === fiat;
                                })}
                                styles={CustomStylesSelect}
                                options={optionFiats}
                                onChange={(e) => {
                                    setFiat(e.value);
                                }}
                            />
                        </div>

                        <div className="d-flex align-items-center mb-24">
                            <input type="text" placeholder="00.00" className="input-filter-fiat dark-bg-accent" />
                            <div className="select-filter mr-16">
                                <Select
                                    // value={optionQuote.filter(function (option) {
                                    //     return option.value === fiat;
                                    // })}
                                    styles={CustomStyleFiat}
                                    options={optionQuote}
                                    // onChange={(e) => {
                                    //     setFiat(e.value);
                                    // }}
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
                    </div>

                    <div className="d-flex align-items-center">
                        <button className="grey-text btn-secondary mr-16">
                            <RefreshIcon fillColor={'var(--text-grey-color)'} /> Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                isLoggedIn ? setShowModalCreateOffer(!showModalCreateOffer) : history.push('/signin')
                            }
                            className="btn-primary">
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
                            {list?.map((buy, i) => (
                                <tr
                                    key={i}
                                    onClick={() => {
                                        !expandBuy && setExpandBuy(buy.offer_number);
                                    }}
                                    className="white-text border-table cursor-pointer">
                                    {expandBuy === buy.offer_number ? (
                                        <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                            <div className="d-flex align-items-center justify-content-between mb-24">
                                                <div className="d-flex align-items-center">
                                                    <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                    <div>
                                                        <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                            MERCHANT NAME
                                                        </h2>
                                                        <div className="d-flex">
                                                            <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                            <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span
                                                    className="btn-close"
                                                    onClick={() => {
                                                        setExpandBuy('');
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
                                                            className="form-control input-p2p-form white-text"
                                                        />
                                                        <label className="input-label-right text-sm grey-text position-absolute">
                                                            {currency?.toUpperCase()}
                                                        </label>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                        <button className="w-50 btn-secondary grey-text">Cancel</button>
                                                        <button className="w-50 btn-primary">
                                                            Buy {currency?.toUpperCase()}
                                                        </button>
                                                    </div>
                                                </form>

                                                <div className="w-40">
                                                    <h1 className="white-text text-md mb-16">Term and Conditions :</h1>
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
                                                                MERCHANT NAME
                                                            </p>
                                                            <span className="check">
                                                                <CheckIcon />
                                                            </span>
                                                        </div>
                                                        <div className="d-flex">
                                                            <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                            <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
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
                                                <button className="btn-success">Buy {currency?.toUpperCase()}</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
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
                            {list?.map((sell, i) => (
                                <tr
                                    key={i}
                                    onClick={() => {
                                        !expandSell && setExpandSell(sell.offer_number);
                                    }}
                                    className="white-text border-table cursor-pointer">
                                    {expandSell === sell.offer_number ? (
                                        <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                            <div className="d-flex align-items-center justify-content-between mb-24">
                                                <div className="d-flex align-items-center">
                                                    <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                    <div>
                                                        <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                            MERCHANT NAME
                                                        </h2>
                                                        <div className="d-flex">
                                                            <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                            <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span
                                                    className="btn-close"
                                                    onClick={() => {
                                                        setExpandSell('');
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
                                                            className="form-control input-p2p-form white-text"
                                                        />
                                                        <label className="input-label-right text-sm grey-text position-absolute">
                                                            {currency?.toUpperCase()}
                                                        </label>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                        <button className="w-50 btn-secondary grey-text">Cancel</button>
                                                        <button className="w-50 btn-primary">
                                                            Sell {currency?.toUpperCase()}
                                                        </button>
                                                    </div>
                                                </form>

                                                <div className="w-40">
                                                    <h1 className="white-text text-md mb-16">Term and Conditions :</h1>
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
                                                                MERCHANT NAME
                                                            </p>
                                                            <span className="check">
                                                                <CheckIcon />
                                                            </span>
                                                        </div>
                                                        <div className="d-flex">
                                                            <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                            <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
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
                                                <button className="btn-danger">Sell {currency?.toUpperCase()}</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {/* ========= TABLE SELL END ========= */}
            </div>

            {showModalCreateOffer && <ModalCreateOffer showModalCreateOffer={showModalCreateOffer} />}
        </React.Fragment>
    );
};
