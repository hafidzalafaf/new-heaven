import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
    p2pFiatFetch,
    p2pPaymentUserFetch,
    p2pCurrenciesFetch,
    p2pOfferCreate,
    selectP2PPaymentUser,
    selectP2PFiatsData,
    selectP2PCurrenciesData,
    selectP2PCreateOffersLoading,
    selectP2PCreateOffersSuccess,
    selectP2POrderCreateData,
    selectUserInfo,
} from 'src/modules';
import { P2PPaymentMethodProps } from 'src/desktop/components';
import { useHistory } from 'react-router';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import Select, { components } from 'react-select';
import { CustomStylesSelect } from 'src/mobile/components';
import { CustomStyleFiat } from 'src/desktop/containers/TableListP2P/CustomStyleFiat';
import { Link } from 'react-router-dom';

export const P2PCreateOfferMobileScreen: React.FC = () => {
    useDocumentTitle('P2P || Create Offer');
    const dispatch = useDispatch();
    const history = useHistory();

    const user = useSelector(selectUserInfo);
    const fiats = useSelector(selectP2PFiatsData);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const paymentMethods: P2PPaymentMethodProps[] = useSelector(selectP2PPaymentUser);
    const createOfferLoading = useSelector(selectP2PCreateOffersLoading);
    const createOfferSuccess = useSelector(selectP2PCreateOffersSuccess);

    const [currencies, setCurrencies] = React.useState([]);
    const [payments, setPayments] = React.useState([]);
    const [paymentListUser, setPaymentListUser] = React.useState([]);

    const [side, setSide] = React.useState('buy');
    const [currency, setCurrency] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [price, setPrice] = React.useState('');
    const [fiat, setFiat] = React.useState('IDR');
    const [trade_amount, setTradeAmount] = React.useState('');
    const [min_order, setMinOrder] = React.useState('');
    const [max_order, setMaxOrder] = React.useState('');
    const [paymentValue, setPaymentValue] = React.useState([]);
    const [term_of_condition, setTermOfCondition] = React.useState('');
    const [auto_replay, setAutoReplay] = React.useState('');
    const [paymentOffer, setPaymentOffer] = React.useState([]);

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
        dispatch(p2pPaymentUserFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat, currency, price]);

    React.useEffect(() => {
        setCurrencies(currenciesData?.currency);
        setPayments(currenciesData?.payment);
        setPaymentListUser(paymentMethods);
    }, [currenciesData, paymentMethods]);

    const handleConfirmOffer = () => {
        const payload = {
            currency: currency,
            price: price,
            fiat: fiat,
            trade_amount: trade_amount,
            min_order: min_order,
            max_order: max_order,
            payment: paymentOffer,
            payment_limit: '',
            term_of_condition: term_of_condition,
            auto_replay: auto_replay,
            side: side,
        };

        dispatch(p2pOfferCreate(payload));
        setTradeAmount('');
        setMinOrder('');
        setMaxOrder('');
        setPaymentValue([]);
        setTermOfCondition('');
        setAutoReplay('');
        setPrice('');
        setCurrency('');
    };

    const handleChangeCurrency = (e: string) => {
        setCurrency(e);
    };

    const handleChangePrice = (e: string) => {
        setPrice(e);
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

    const handleChangePayment = (e: any) => {
        setPaymentValue(e);
        let data = e;
        let temp = [];
        data?.map((el) => {
            temp.push(el.value);
        });

        setPaymentOffer(temp);
    };

    const handleChangeTermOfCondition = (e: string) => {
        setTermOfCondition(e);
    };

    const handleChangeAutoReplay = (e: string) => {
        setAutoReplay(e);
    };

    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
    });

    const optionCurrency = currencies?.map((item) => {
        return {
            label: <p className="m-0 text-sm grey-text-accent">{item?.currency?.toUpperCase()}</p>,
            value: item.currency,
        };
    });

    const optionPayment = paymentListUser?.map((item) => {
        return {
            label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>,
            value: item.payment_user_uid,
        };
    });

    const AddPayment = (props) => {
        return (
            <React.Fragment>
                <components.MenuList {...props}>
                    <div>{props.children}</div>
                    <Link to={`/p2p/profile/${user?.uid}`}>
                        <div className="add-payment-select">
                            <p className="m-0 p-0 gradient-text text-ms font-semibold text-center ">
                                Add payment method
                            </p>
                        </div>
                    </Link>
                </components.MenuList>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p-create-offer mobile-container dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24">
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Create Offers</p>
                    <span onClick={() => history.goBack()} className="back position-absolute">
                        <ArrowLeft className={'cursor-pointer'} />
                    </span>
                </div>

                <div className="d-flex align-items-center gap-16 mb-16">
                    <button
                        onClick={() => setSide('buy')}
                        type="button"
                        className={`btn-transparent py-10 w-auto ${side == 'buy' && 'active'}`}>
                        <span className={` ${side == 'buy' ? 'gradient-text' : 'grey-text'}`}>Buy</span>
                    </button>

                    <button
                        onClick={() => setSide('sell')}
                        type="button"
                        className={`btn-transparent py-10 w-auto ${side == 'sell' && 'active'}`}>
                        <span className={` ${side == 'sell' ? 'gradient-text' : 'grey-text'}`}>Sell</span>
                    </button>
                </div>

                <form className="form-crete-offer">
                    <div className="mb-16">
                        <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">CRYPTOCURRENCY</p>
                        <Select
                            value={optionCurrency?.filter(function (option) {
                                return option.value === currency;
                            })}
                            styles={CustomStylesSelect}
                            options={optionCurrency}
                            onChange={(e) => {
                                handleChangeCurrency(e.value);
                            }}
                        />
                    </div>

                    <div className="mb-16">
                        <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PRICE</p>
                        <div className="d-flex align-items-center">
                            <input
                                style={{
                                    color: 'white',
                                }}
                                value={price}
                                onChange={(e) => handleChangePrice(e.target.value)}
                                type="text"
                                placeholder="00.00"
                                className="input-filter-fiat dark-bg-accent filter-input"
                            />

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

                    <div className="mb-16">
                        <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">TRADING AMOUNT</p>
                        <input
                            type="text"
                            required
                            value={trade_amount}
                            onChange={(e) => handleChangeTradeAmount(e.target.value)}
                            placeholder="00.00"
                            className="custom-input-offer w-100 white-text"
                        />
                    </div>

                    <div className="mb-16">
                        <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">ORDER LIMIT</p>

                        <div className="d-flex align-items-center gap-16 w-100">
                            <div className="w-50 m-0 position-relative">
                                <input
                                    type="text"
                                    required
                                    value={min_order}
                                    onChange={(e) => handleChangeMinOrder(e.target.value)}
                                    placeholder="00.00"
                                    className="custom-input-offer white-text w-100"
                                />
                                <label className="input-label-right text-sm grey-text position-absolute">min</label>
                            </div>
                            <div className="w-50 m-0 position-relative">
                                <input
                                    type="text"
                                    required
                                    value={max_order}
                                    onChange={(e) => handleChangeMaxOrder(e.target.value)}
                                    placeholder="00.00"
                                    className="custom-input-offer white-text w-100"
                                />
                                <label className="input-label-right text-sm grey-text position-absolute">max</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PAYMENT METHOD</p>
                        <Select
                            isMulti
                            value={paymentValue}
                            components={{ MenuList: AddPayment }}
                            styles={CustomStylesSelect}
                            options={optionPayment}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onChange={(e) => {
                                handleChangePayment(e);
                            }}
                        />
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};
