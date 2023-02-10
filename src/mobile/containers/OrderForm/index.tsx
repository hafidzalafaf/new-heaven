import * as React from 'react';
import { OrderSide } from 'src/modules/types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserLoggedIn, selectCurrentMarket } from '../../../modules';
import { Modal } from '../../../desktop/components';
import Select from 'react-select';
import { OrderFormComponent } from '../../components';
import { CustomStylesSelect } from 'src/desktop/components';
import { Decimal } from 'src/components';

export interface OrderFormProps {
    changeMarket?: boolean;
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
    side: string;
    handleChangeValueByButton: (increase: boolean, type: string) => void;
    handleChangeValueAmountByButton: (increase: boolean, type: string) => void;
    willRecive: string | number;
    fee: string;
    willPay: string | number;
}

export const OrderForm: React.FunctionComponent<OrderFormProps> = (props) => {
    const {
        changeMarket,
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
        side,
        handleChangeValueByButton,
        handleChangeValueAmountByButton,
        fee,
        willPay,
        willRecive,
    } = props;
    const currentMarket = useSelector(selectCurrentMarket);
    const isLoggedin = useSelector(selectUserLoggedIn);

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
            if (priceSell === '') {
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
            if (priceBuy === '') {
                return true;
            }
        }
    };

    const renderModalContentSell = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24">
                Are you sure to Sell {currentMarket?.base_unit?.toUpperCase()}?
            </h6>
            <ul className="pl-2 mb-24">
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
                        className={`nav-item buy cursor-pointer ${side == 'buy' && 'active'}`}
                        id="buy-tab"
                        onClick={() => handleSide('buy')}>
                        <a className={`nav-link buy ${side == 'buy' && 'active'}`}>Buy</a>
                    </li>
                    <li
                        className={`nav-item sell cursor-pointer ${side == 'sell' && 'active'}`}
                        id="sell-tab"
                        onClick={() => handleSide('sell')}>
                        <a className={`nav-link sell ${side == 'sell' && 'active'}`}>Sell</a>
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
                        {side == 'buy' ? (
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
