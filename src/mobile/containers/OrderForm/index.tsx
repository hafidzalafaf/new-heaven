import * as React from 'react';
import { OrderSide } from 'src/modules/types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
    selectUserLoggedIn,
    selectCurrentMarket,
    selectMarketTickers,
    Ticker,
    selectDepthAsks,
    selectDepthBids,
    selectWallets,
    orderExecuteFetch,
    selectOrderExecuteLoading,
} from '../../../modules';
import { Decimal } from '../../../components';
import { Modal } from '../../../desktop/components';
import Select from 'react-select';
import { OrderFormComponent } from '../../components';
import { CustomStylesSelect } from 'src/desktop/components';
import { ArrowDownIcon, MinusIcon, PlusIcon, SidebarMenuIcon } from '../../assets/Trading';
import { getTotalPrice, getAmount } from '../../../helpers';

export interface OrderFormProps {
    priceSell?: string;
    priceBuy?: string;
    changeMarket?: boolean;
}

export const OrderForm: React.FunctionComponent<OrderFormProps> = (props) => {
    const { currency = '' } = useParams<{ currency?: string }>();
    const dispatch = useDispatch();
    const currentMarket = useSelector(selectCurrentMarket);
    const isLoggedin = useSelector(selectUserLoggedIn);
    const tickers = useSelector(selectMarketTickers);
    const asks = useSelector(selectDepthAsks);
    const bids = useSelector(selectDepthBids);
    const wallets = useSelector(selectWallets);
    const orderLoading = useSelector(selectOrderExecuteLoading);

    const [marketType, setMerketType] = React.useState('buy');
    const [orderPercentageBuy, setOrderPercentageBuy] = React.useState(0);
    const [orderPercentageSell, setOrderPercentageSell] = React.useState(0);
    const [showModalSell, setShowModalSell] = React.useState(false);
    const [showModalBuy, setShowModalBuy] = React.useState(false);
    const [priceBuy, setPriceBuy] = React.useState('');
    const [amountBuy, setAmountBuy] = React.useState('');
    const [totalBuy, setTotalBuy] = React.useState('');
    const [priceSell, setPriceSell] = React.useState('');
    const [amountSell, setAmountSell] = React.useState('');
    const [totalSell, setTotalSell] = React.useState('');
    const [orderType, setOrderType] = React.useState('limit');
    const [side, setSide] = React.useState<OrderSide>('buy');
    const [changeMarket, setChangeMarket] = React.useState(props.changeMarket);

    const tickerItem: Ticker = tickers[currency];
    const totalPriceBuy = getTotalPrice(amountBuy, +tickerItem?.last, bids);
    const totalPriceSell = getTotalPrice(amountSell, +tickerItem?.last, asks);
    const wallet =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.base_unit?.toLowerCase());
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';

    const usd =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.quote_unit?.toLowerCase());
    const usdt = usd && usd.balance ? usd.balance.toString() : '0';

    // buat yang type market
    const totalPrice = getTotalPrice(
        side === 'buy' ? amountBuy : amountSell,
        +tickerItem?.last,
        side === 'buy' ? bids : asks
    );

    React.useEffect(() => {
        setPriceBuy(props.priceBuy);
    }, [props.priceBuy]);

    React.useEffect(() => {
        setPriceBuy(props.priceSell);
    }, [props.priceSell]);

    const handleChangeValueByButton = (increase: boolean, type: string) => {
        let updatedValue: string;
        if (type == 'Buy') {
            updatedValue = priceBuy;
        } else {
            updatedValue = priceSell;
        }
        const increasedValue = (+updatedValue + 10 ** -currentMarket?.price_precision).toFixed(
            currentMarket?.price_precision
        );
        const decreasedValue = (+updatedValue - 10 ** -currentMarket?.price_precision).toFixed(
            currentMarket?.price_precision
        );

        updatedValue = increase ? increasedValue : +decreasedValue >= 0 ? decreasedValue : updatedValue;
        if (type == 'Buy') {
            setPriceBuy(String(updatedValue));
        } else {
            setPriceSell(String(updatedValue));
        }
    };

    const handleChangeValueAmountByButton = (increase: boolean, type: string) => {
        let updatedValue: string;
        if (type == 'Buy') {
            updatedValue = amountBuy;
        } else {
            updatedValue = amountSell;
        }
        const increasedValue = (+updatedValue + 10 ** -currentMarket?.amount_precision).toFixed(
            currentMarket?.amount_precision
        );
        const decreasedValue = (+updatedValue - 10 ** -currentMarket?.amount_precision).toFixed(
            currentMarket?.amount_precision
        );

        updatedValue = increase ? increasedValue : +decreasedValue >= 0 ? decreasedValue : updatedValue;
        if (type == 'Buy') {
            setAmountBuy(String(updatedValue));
        } else {
            setAmountSell(String(updatedValue));
        }
    };

    // belum kepakai
    const totalAmount = getAmount(
        side === 'buy' ? +usdt : +balance,
        side === 'buy' ? bids : asks,
        side === 'buy' ? orderPercentageBuy : orderPercentageSell
    );

    // buat set amount sell
    React.useEffect(() => {
        const safePrice = +totalPrice / +totalAmount || priceSell;

        const market = orderPercentageSell !== 0 ? (+balance * orderPercentageSell) / 100 : amountSell;

        let limit: string | number;
        if (orderPercentageSell !== 0) {
            if (priceSell === '0' || priceSell === '') {
                limit = '0';
            } else {
                limit = +totalSell / +priceSell;
            }
        } else {
            limit = amountSell;
        }

        setAmountSell(orderType === 'market' ? market.toString() : limit.toString());
    }, [orderPercentageSell, totalSell, priceSell]);

    // buat ngeset total sel
    React.useEffect(() => {
        const safePrice = totalPrice / +amountSell || priceSell;

        const market = Decimal.format(+amountSell * +safePrice, currentMarket?.price_precision);

        const limit =
            orderPercentageSell !== 0
                ? Decimal.format((+balance * +orderPercentageSell) / 100, currentMarket?.price_precision)
                : Decimal.format(+priceSell * +amountSell, currentMarket?.price_precision);

        setTotalSell(orderType === 'market' ? market : limit);
    }, [priceSell, amountSell, orderPercentageSell]);

    // buat order amout buy
    React.useEffect(() => {
        const market = orderPercentageBuy !== 0 ? (+usdt * orderPercentageBuy) / 100 : amountBuy;

        let limit: string | number;
        if (orderPercentageBuy !== 0) {
            if (priceBuy === '0' || priceBuy === '') {
                limit = '0';
            } else {
                limit = +totalBuy / +priceBuy;
            }
        } else {
            limit = amountBuy;
        }

        setAmountBuy(orderType === 'market' ? market.toString() : limit.toString());
    }, [orderPercentageBuy, totalBuy, priceBuy]);

    // buat total buy
    React.useEffect(() => {
        const safePrice = totalPrice / +amountBuy || priceBuy;
        const market = Decimal.format(+amountBuy * +safePrice, currentMarket?.price_precision);
        const limit =
            orderPercentageBuy !== 0
                ? Decimal.format((+usdt * +orderPercentageBuy) / 100, currentMarket?.price_precision)
                : Decimal.format(+priceBuy * +amountBuy, currentMarket?.price_precision);

        setTotalBuy(orderType === 'market' ? market : limit);
    }, [priceBuy, amountBuy, orderPercentageBuy]);

    // ketika pindah dari limit dan market dan setelah dispatch
    const resetForm = () => {
        setShowModalSell(false);
        setShowModalBuy(false);
        setAmountBuy('');
        setAmountSell('');
        setPriceBuy('');
        setPriceSell('');
        setTotalBuy('');
        setTotalSell('');
        setOrderPercentageSell(0);
        setOrderPercentageBuy(0);
        setChangeMarket(false);
    };

    // React.useEffect(() => {
    //     setChangeMarket(props.changeMarket);
    //     if (changeMarket) {
    //         resetForm();
    //     }
    // }, [props.changeMarket, changeMarket]);

    // ini ngepush data nya
    const handleSubmit = () => {
        const payloadLimit = {
            market: currentMarket?.id,
            side: side,
            volume: side === 'sell' ? amountSell : amountBuy,
            price: side === 'sell' ? priceSell : priceBuy,
            ord_type: orderType,
        };

        const payloadMarket = {
            market: currentMarket?.id,
            side: side,
            volume: side === 'sell' ? amountSell : amountBuy,
            ord_type: orderType,
        };

        dispatch(orderExecuteFetch(orderType === 'limit' ? payloadLimit : payloadMarket));

        resetForm();
    };

    // ganti harga buy
    const handleChangePriceBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceBuy(value);
    };

    // ganti harga sell
    const handleChangePriceSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setPriceSell(value);
    };

    // ganti amount buy
    const handleChangeAmountBuy = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountBuy(value);
        setOrderPercentageBuy(0);
    };

    // ganti amout sell
    const handleChangeAmountSell = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmountSell(value);
        setOrderPercentageSell(0);
    };

    // buy sell
    const handleSide = (value: OrderSide) => {
        setSide(value);
    };

    // ganti select persenan
    const handleSelectPercentageSell = (e: number) => {
        setOrderPercentageSell(e);
    };

    // ganti select persenan
    const handleSelectPercentageBuy = (e: number) => {
        setOrderPercentageBuy(e);
    };

    // close modal sell
    const handleCancelModalSell = () => {
        setShowModalSell(false);
    };

    // close modal buy
    const handleCancelModalBuy = () => {
        setShowModalBuy(false);
    };

    // submit sell
    const handleSubmitSell = () => {
        setShowModalSell(true);
    };

    // submit buy
    const handleSubmitBuy = () => {
        setShowModalBuy(true);
    };

    // order type
    const handleSelectOrderType = (e: string) => {
        setOrderType(e);
        resetForm();
    };
    // End Order Form

    // Function Order Book
    const handleSelectPriceAsks = (e: string) => {
        setPriceSell(e);
        setPriceBuy(e);
    };

    const handleSelectPriceBids = (e: string) => {
        setPriceBuy(e);
        setPriceSell(e);
    };
    // End Function Order Book

    const disabledButtonSell = () => {
        if (!isLoggedin) {
            return true;
        }

        if (orderLoading) {
            return true;
        }

        if (amountSell < currentMarket?.min_amount) {
            return true;
        }

        if (amountSell === '0') {
            return true;
        }

        if (priceSell === '0') {
            return true;
        }
    };

    const disabledButtonBuy = () => {
        if (!isLoggedin) {
            return true;
        }

        if (orderLoading) {
            return true;
        }

        if (amountBuy < currentMarket?.min_amount) {
            return true;
        }

        if (amountBuy === '0') {
            return true;
        }

        if (priceBuy === '0') {
            return true;
        }
    };

    const renderModalContentSell = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24">
                Are you sure to Sell {currentMarket?.base_unit?.toUpperCase()}?
            </h6>
            <ul className="pl-2 mb-24">
                <li className="text-ms grey-text-accent font-semibold">
                    Sell in {amountSell} {currentMarket?.base_unit?.toUpperCase()} = $ {totalSell}
                </li>
                <li className="text-ms grey-text-accent font-semibold">Total spent $ {totalSell}</li>
            </ul>
            <div className="d-flex">
                <button className="btn btn-danger sm px-5 mr-3" onClick={handleCancelModalSell}>
                    Cancel
                </button>
                <button onClick={handleSubmit} type="button" className="btn btn-success sm px-5">
                    Sell
                </button>
            </div>
        </React.Fragment>
    );

    const renderModalContentBuy = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24">
                Are you sure to Buy {currentMarket?.base_unit?.toUpperCase()}?
            </h6>
            <ul className="pl-2 mb-24">
                <li className="text-ms grey-text-accent font-semibold">
                    Bought {amountBuy} {currentMarket?.base_unit?.toUpperCase()} = $ {totalBuy}
                </li>
                <li className="text-ms grey-text-accent font-semibold">Total spent $ {totalBuy}</li>
            </ul>
            <div className="d-flex">
                <button className="btn btn-danger sm px-5 mr-3" onClick={handleCancelModalBuy}>
                    Cancel
                </button>
                <button onClick={handleSubmit} type="button" className="btn btn-success sm px-5">
                    Buy
                </button>
            </div>
        </React.Fragment>
    );

    const optionStatus = [
        {
            label: <p className="m-0 text-sm grey-text-accent">Limit Order</p>,
            value: 'limit',
        },
        {
            label: <p className="m-0 text-sm grey-text-accent">Market</p>,
            value: 'market',
        },
    ];

    const handleChangetoBuy = () => {
        setMerketType('buy');
    };

    const handleChangetoSell = () => {
        setMerketType('sell');
    };

    return (
        <React.Fragment>
            <div className={`buy-sell-container  w-60 ${isLoggedin ? '' : 'blur-effect blur-mobile'}`}>
                {isLoggedin ? (
                    ''
                ) : (
                    <div className="blur-content">
                        <div className="d-flex flex-column justify-content-between align-items-center">
                            <img src={'/img/lock.png'} alt="lock" width={28} height={28} className="mb-24" />
                            <span className="text-xs">
                                Please{' '}
                                <Link to={'/signin'} className="blue-text text-xs font-bold">
                                    login
                                </Link>{' '}
                                for accessing trade
                            </span>
                        </div>
                    </div>
                )}
                <ul className="nav nav-pills w-100" id="pills-tab" role="tablist">
                    <li
                        className={`nav-item buy ${marketType == 'buy' && 'active'}`}
                        id="buy-tab"
                        onClick={handleChangetoBuy}>
                        <a className={`nav-link buy ${marketType == 'buy' && 'active'}`}>Buy</a>
                    </li>
                    <li
                        className={`nav-item sell ${marketType == 'sell' && 'active'}`}
                        id="sell-tab"
                        onClick={handleChangetoSell}>
                        <a className={`nav-link sell ${marketType == 'sell' && 'active'}`}>Sell</a>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <form
                        className="tab-pane fade show active"
                        id="pills-buy"
                        role="tabpanel"
                        aria-labelledby="pills-buy-tab">
                        <div className="dropdown w-100 mb-8">
                            <Select
                                value={optionStatus.filter(function (option) {
                                    return option.value === orderType;
                                })}
                                styles={CustomStylesSelect}
                                options={optionStatus}
                                onChange={(e) => {
                                    handleSelectOrderType(e.value);
                                }}
                            />
                        </div>
                        {marketType == 'buy' ? (
                            <OrderFormComponent
                                handleChangeValueByButton={handleChangeValueByButton}
                                handleChangeValueAmountByButton={handleChangeValueAmountByButton}
                                loading={orderLoading}
                                side={'Buy'}
                                handleSide={handleSide}
                                orderType={orderType}
                                orderPercentage={orderPercentageBuy}
                                handleSelectPercentage={handleSelectPercentageBuy}
                                labelAmount={'label-amount-buy'}
                                labelPrice={'label-price-buy'}
                                labelTotal={'label-total-buy'}
                                labelPercent0={'label-buy-0'}
                                labelPercent25={'label-buy-25'}
                                labelPercent50={'label-buy-50'}
                                labelPercent75={'label-buy-75'}
                                labelPercent100={'label-buy-100'}
                                amount={amountBuy}
                                handleChangeAmount={handleChangeAmountBuy}
                                total={totalBuy}
                                price={priceBuy}
                                totalPrice={totalPriceBuy}
                                handleChangePrice={handleChangePriceBuy}
                                handleSubmit={handleSubmitBuy}
                                disabledButton={disabledButtonBuy}
                            />
                        ) : (
                            <OrderFormComponent
                                handleChangeValueByButton={handleChangeValueByButton}
                                handleChangeValueAmountByButton={handleChangeValueAmountByButton}
                                loading={orderLoading}
                                side={'Sell'}
                                handleSide={handleSide}
                                orderType={orderType}
                                orderPercentage={orderPercentageSell}
                                handleSelectPercentage={handleSelectPercentageSell}
                                labelAmount={'label-amount-sell'}
                                labelPrice={'label-price-sell'}
                                labelTotal={'label-total-sell'}
                                labelPercent0={'label-sell-0'}
                                labelPercent25={'label-sell-25'}
                                labelPercent50={'label-sell-50'}
                                labelPercent75={'label-sell-75'}
                                labelPercent100={'label-sell-100'}
                                amount={amountSell}
                                handleChangeAmount={handleChangeAmountSell}
                                total={totalSell}
                                price={priceSell}
                                totalPrice={totalPriceSell}
                                handleChangePrice={handleChangePriceSell}
                                handleSubmit={handleSubmitSell}
                                disabledButton={disabledButtonSell}
                            />
                        )}
                    </form>
                </div>
            </div>
            <Modal content={renderModalContentSell()} show={showModalSell} />
            <Modal content={renderModalContentBuy()} show={showModalBuy} />
        </React.Fragment>
    );
};
