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
} from 'src/modules';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { RefreshIcon, CheckIcon, CloseIcon } from 'src/assets/images/P2PIcon';
import { CustomStylesSelect, ModalCreateOffer } from '../../../desktop/components';
import Select from 'react-select';
import '../../../styles/colors.pcss';

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
    const [expandBuy, setExpandBuy] = React.useState('');
    const [expandSell, setExpandSell] = React.useState('');
    const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(false);

    console.log(list, 'ini list');

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

    const dummySell = [
        {
            id: '1',
        },
        {
            id: '2',
        },
        {
            id: '3',
        },
        {
            id: '4',
        },
        {
            id: '5',
        },
    ];

    const dummyBuy = [
        {
            id: '1',
        },
        {
            id: '2',
        },
        {
            id: '3',
        },
        {
            id: '4',
        },
        {
            id: '5',
        },
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
                                // value={optionQuote.filter(function (option) {
                                //     return option.value === status;
                                // })}
                                styles={CustomStylesSelect}
                                options={optionQuote}
                                // onChange={(e) => {
                                //     setStatus(e.value);
                                //     filterredStatus(e.value);
                                // }}
                            />
                        </div>

                        {/* <div>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="Text input with dropdown button" />

                            <DropdownButton
                                variant="outline-secondary"
                                title="Dropdown"
                                id="input-group-dropdown-2"
                                align="end">
                                <Dropdown.Item href="#">Action</Dropdown.Item>
                                <Dropdown.Item href="#">Another action</Dropdown.Item>
                                <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">Separated link</Dropdown.Item>
                            </DropdownButton>
                        </InputGroup>
                    </div> */}

                        <div className="select-filter mr-16">
                            <Select
                                // value={optionQuote.filter(function (option) {
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
                            {dummyBuy?.map((buy, i) => (
                                <tr
                                    key={i}
                                    onClick={() => {
                                        !expandBuy && setExpandBuy(buy.id);
                                    }}
                                    className="white-text border-table cursor-pointer">
                                    {expandBuy === buy.id ? (
                                        <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                            <div className="d-flex align-items-center justify-content-between mb-24">
                                                <div className="d-flex align-items-center">
                                                    <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                    <div>
                                                        <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                            USDT CRYPTO
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
                                                    <p className="m-0 p-0 mr-4">16,749.00 IDR</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                    <p className="m-0 p-0 mr-16">Available</p>
                                                    <p className="m-0 p-0 mr-4">29,710.54 USDT</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                    <p className="m-0 p-0 mr-16">Payment Time Limit</p>
                                                    <p className="m-0 p-0 mr-16">15 Minutes</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold">
                                                    <p className="m-0 p-0 mr-16">Seller's Payment Methods</p>
                                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                        <div className="label-bank">
                                                            <img src="/img/logo-jago.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-shopee.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-bca.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-dana.png" alt="logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <form className="dark-bg-accent w-50 form-buy">
                                                    <h1 className="white-text text-lg mb-44">Buy USDT Crypto</h1>

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
                                                            All IDR
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
                                                            USDT
                                                        </label>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                        <button className="w-50 btn-secondary grey-text">Cancel</button>
                                                        <button className="w-50 btn-primary">Buy USDT</button>
                                                    </div>
                                                </form>

                                                <div className="w-40">
                                                    <h1 className="white-text text-md mb-16">Term and Conditions :</h1>
                                                    <p className="text-xs font-extrabold grey-text mb-16">
                                                        Fast Trade. <br /> Rek Bank Harus Sama Dengan Nama Di
                                                        Binance,jika Rek Bank Berbeda Mana Akan Di Refund. Kolom Berita
                                                        Harap Di Kosongkan,jangan Diisi Dengan Kata2 Mengandung Crypto
                                                        Seperti Binance,bitcoin,usdt,crypto Iklan Online Berarti Saya
                                                        Standby,silahkan Lgsg Trf Lgsg Proses.
                                                    </p>
                                                    <p className="text-xs font-extrabold grey-text ">
                                                        Name In Binance Must Be Same With Bank Account.
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
                                                                USDT - Trader
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
                                            <td className="text-xs font-bold">16,749.00 IDR</td>
                                            <td>
                                                <div className="d-flex text-xs font-bold mb-6">
                                                    <p className="m-0 p-0 mr-8">Available</p>
                                                    <p className="m-0 p-0">1,000 USDT</p>
                                                </div>

                                                <div className="d-flex text-xxs font-bold mb-6">
                                                    <p className="m-0 p-0 mr-8">Limit</p>
                                                    <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                    <div className="label-bank">
                                                        <img src="/img/logo-jago.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-shopee.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-bca.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-dana.png" alt="logo" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn-success">Buy USDT</button>
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
                            {dummySell?.map((sell, i) => (
                                <tr
                                    key={i}
                                    onClick={() => {
                                        !expandSell && setExpandSell(sell.id);
                                    }}
                                    className="white-text border-table cursor-pointer">
                                    {expandSell === sell.id ? (
                                        <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                            <div className="d-flex align-items-center justify-content-between mb-24">
                                                <div className="d-flex align-items-center">
                                                    <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                    <div>
                                                        <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                            USDT CRYPTO
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
                                                    <p className="m-0 p-0 mr-4">16,749.00 IDR</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                    <p className="m-0 p-0 mr-16">Available</p>
                                                    <p className="m-0 p-0 mr-4">29,710.54 USDT</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                    <p className="m-0 p-0 mr-16">Payment Time Limit</p>
                                                    <p className="m-0 p-0 mr-16">15 Minutes</p>
                                                </div>

                                                <div className="padding-4 d-flex align-items-center white-text text-xs font-bold">
                                                    <p className="m-0 p-0 mr-16">Seller's Payment Methods</p>
                                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                        <div className="label-bank">
                                                            <img src="/img/logo-jago.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-shopee.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-bca.png" alt="logo" />
                                                        </div>

                                                        <div className="label-bank">
                                                            <img src="/img/logo-dana.png" alt="logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <form className="dark-bg-accent w-50 form-buy">
                                                    <h1 className="white-text text-lg mb-44">Sell USDT Crypto</h1>

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
                                                            All IDR
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
                                                            USDT
                                                        </label>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                        <button className="w-50 btn-secondary grey-text">Cancel</button>
                                                        <button className="w-50 btn-primary">Sell USDT</button>
                                                    </div>
                                                </form>

                                                <div className="w-40">
                                                    <h1 className="white-text text-md mb-16">Term and Conditions :</h1>
                                                    <p className="text-xs font-extrabold grey-text mb-16">
                                                        Fast Trade. <br /> Rek Bank Harus Sama Dengan Nama Di
                                                        Binance,jika Rek Bank Berbeda Mana Akan Di Refund. Kolom Berita
                                                        Harap Di Kosongkan,jangan Diisi Dengan Kata2 Mengandung Crypto
                                                        Seperti Binance,bitcoin,usdt,crypto Iklan Online Berarti Saya
                                                        Standby,silahkan Lgsg Trf Lgsg Proses.
                                                    </p>
                                                    <p className="text-xs font-extrabold grey-text ">
                                                        Name In Binance Must Be Same With Bank Account.
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
                                                                USDT - Trader
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
                                            <td className="text-xs font-bold">16,749.00 IDR</td>
                                            <td>
                                                <div className="d-flex text-xs font-bold mb-6">
                                                    <p className="m-0 p-0 mr-8">Available</p>
                                                    <p className="m-0 p-0">1,000 USDT</p>
                                                </div>

                                                <div className="d-flex text-xxs font-bold mb-6">
                                                    <p className="m-0 p-0 mr-8">Limit</p>
                                                    <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                    <div className="label-bank">
                                                        <img src="/img/logo-jago.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-shopee.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-bca.png" alt="logo" />
                                                    </div>

                                                    <div className="label-bank">
                                                        <img src="/img/logo-dana.png" alt="logo" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn-danger">Sell USDT</button>
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
