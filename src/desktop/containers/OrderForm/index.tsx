import * as React from 'react';
import { Modal, OrderFormComponent } from '../../components';
import { selectUserLoggedIn, selectCurrentMarket } from '../../../modules';
import { OrderSide } from 'src/modules/types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Decimal } from 'src/components';

export interface OrderFormProps {
    amountSell: string;
    priceSell: string;
    totalSell: string;
    orderPercentageSell: number;
    totalPriceSell: any;
    handleChangeAmountSell: (e: string) => void;
    handleChangePriceSell: (e: string) => void;
    handleSelectPercentageSell: (e: number) => void;
    showModalSell: boolean;
    handleCancelModalSell: () => void;
    handleSubmitSell: () => void;
    amountBuy: string;
    priceBuy: string;
    totalBuy: string;
    orderPercentageBuy: number;
    totalPriceBuy: any;
    handleChangeAmountBuy: (e: string) => void;
    handleChangePriceBuy: (e: string) => void;
    handleSelectPercentageBuy: (e: number) => void;
    showModalBuy: boolean;
    handleCancelModalBuy: () => void;
    handleSubmitBuy: () => void;
    handleSubmit: () => void;
    resetForm: () => void;
    orderType: string;
    orderLoading: boolean;
    handleSide: (e: OrderSide) => void;
    handleSelectOrderType: (e: string) => void;
    balanceCoin: string;
    balanceQuote: string;
    willRecive: string | number;
    fee: string;
    willPay: string | number;
}

export const OrderForm: React.FunctionComponent<OrderFormProps> = (props) => {
    const {
        amountSell,
        priceSell,
        totalSell,
        orderPercentageSell,
        totalPriceSell,
        handleChangeAmountSell,
        handleChangePriceSell,
        handleSelectPercentageSell,
        showModalSell,
        handleCancelModalSell,
        handleSubmitSell,
        amountBuy,
        priceBuy,
        totalBuy,
        orderPercentageBuy,
        totalPriceBuy,
        handleChangeAmountBuy,
        handleChangePriceBuy,
        handleSelectPercentageBuy,
        showModalBuy,
        handleCancelModalBuy,
        handleSubmitBuy,
        handleSubmit,
        resetForm,
        orderType,
        orderLoading,
        handleSide,
        handleSelectOrderType,
        balanceCoin,
        balanceQuote,
        fee,
        willPay,
        willRecive,
    } = props;
    const isLoggedin = useSelector(selectUserLoggedIn);
    const currentMarket = useSelector(selectCurrentMarket);

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

        if (orderType == 'limit') {
            if (priceSell === '0') {
                return true;
            }
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

        if (orderType == 'limit') {
            if (priceBuy === '0') {
                return true;
            }
        }
    };

    const renderModalContentSell = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24 text-center">
                Are you sure to Sell {currentMarket?.base_unit?.toUpperCase()}?
            </h6>
            <ul className="pl-2 mb-24 text-center style-none">
                <li className="text-ms grey-text-accent font-semibold">
                    Sell in {amountSell} {currentMarket?.base_unit?.toUpperCase()} ={' '}
                    {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'} {totalSell}
                </li>
                <li className="text-ms grey-text-accent font-semibold">
                    Total spent {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'} {totalSell}
                </li>
                <li className="text-ms grey-text-accent font-semibold">Fee {fee}%</li>
                <li className="text-ms grey-text-accent font-semibold">
                    Estimation receive = {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'}{' '}
                    {Decimal.format(
                        willRecive,
                        currentMarket?.price_precision,
                        currentMarket?.quote_unit == 'idr' ? ',' : '.'
                    )}
                </li>
            </ul>
            <div className="d-flex justify-content-center">
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
            <h6 className="text-md white-text font-semibold mb-24 text-center">
                Are you sure to Buy {currentMarket?.base_unit?.toUpperCase()}?
            </h6>
            <ul className="pl-2 mb-24 text-center style-none">
                <li className="text-ms grey-text-accent font-semibold">
                    Bought {amountBuy} {currentMarket?.base_unit?.toUpperCase()} ={' '}
                    {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'} {totalBuy}
                </li>
                <li className="text-ms grey-text-accent font-semibold">
                    Total spent {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'} {totalBuy}
                </li>
                <li className="text-ms grey-text-accent font-semibold">Fee {fee}%</li>
                <li className="text-ms grey-text-accent font-semibold">
                    Estimation payment = {currentMarket?.quote_unit == 'idr' ? 'Rp' : '$'}{' '}
                    {Decimal.format(
                        willPay,
                        currentMarket?.price_precision,
                        currentMarket?.quote_unit == 'idr' ? ',' : '.'
                    )}
                </li>
            </ul>
            <div className="d-flex justify-content-center">
                <button className="btn btn-danger sm px-5 mr-3" onClick={handleCancelModalBuy}>
                    Cancel
                </button>
                <button onClick={handleSubmit} type="button" className="btn btn-success sm px-5">
                    Buy
                </button>
            </div>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className="p-3">
                <p className="white-text font-bold text-sm mb-3">Order Form</p>

                <div className={isLoggedin ? ' ' : 'blur-effect'}>
                    {isLoggedin ? (
                        ''
                    ) : (
                        <div className="blur-content">
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                <img src={'/img/lock.png'} alt="lock" width={64} height={64} className="mb-24" />
                                <span>
                                    Please{' '}
                                    <Link to={'/signin'} className="blue-text font-bold">
                                        login
                                    </Link>{' '}
                                    for accessing trade
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="d-flex mb-1 order-tab">
                        <input
                            type="radio"
                            id="limit-order-sell"
                            className="d-none"
                            name="order-form"
                            defaultValue="limit"
                        />
                        <label
                            htmlFor="limit-order-sell"
                            onClick={() => handleSelectOrderType('limit')}
                            className={`btn btn-transparent w-auto text-xs font-bold cursor-pointer px-0 mr-4 ${
                                orderType === 'limit' ? 'green-text' : 'white-text'
                            }`}>
                            LIMIT
                        </label>
                        <input
                            type="radio"
                            id="market-order-sell"
                            className="d-none"
                            name="order-form"
                            defaultValue="market"
                        />
                        <label
                            onClick={() => handleSelectOrderType('market')}
                            htmlFor="market-order-sell"
                            className={`btn btn-transparent w-auto text-xs font-bold cursor-pointer px-0 mr-4 ${
                                orderType === 'market' ? 'green-text' : 'white-text'
                            }`}>
                            MARKET
                        </label>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <OrderFormComponent
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
                        </div>
                        <div className="col-6">
                            <OrderFormComponent
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
                        </div>
                    </div>
                </div>
            </div>

            <Modal content={renderModalContentSell()} show={showModalSell} />
            <Modal content={renderModalContentBuy()} show={showModalBuy} />
        </React.Fragment>
    );
};
