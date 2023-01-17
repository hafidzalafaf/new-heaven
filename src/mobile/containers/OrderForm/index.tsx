import * as React from 'react';
import { OrderSide } from 'src/modules/types';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserLoggedIn } from '../../../modules';
import Select from 'react-select';
import { CustomStylesSelect } from 'src/desktop/components';
import { ArrowDownIcon, MinusIcon, PlusIcon, SidebarMenuIcon } from '../../assets/Trading';

export interface OrderFormProps {
    amountSell?: string;
    priceSell?: string;
    totalSell?: string;
    orderPercentageSell?: number;
    totalPriceSell?: any;
    handleChangeAmountSell?: (e: string) => void;
    handleChangePriceSell?: (e: string) => void;
    handleSelectPercentageSell?: (e: number) => void;
    showModalSell?: boolean;
    handleCancelModalSell?: () => void;
    handleSubmitSell?: () => void;
    amountBuy?: string;
    priceBuy?: string;
    totalBuy?: string;
    orderPercentageBuy?: number;
    totalPriceBuy?: any;
    handleChangeAmountBuy?: (e: string) => void;
    handleChangePriceBuy?: (e: string) => void;
    handleSelectPercentageBuy?: (e: number) => void;
    showModalBuy?: boolean;
    handleCancelModalBuy?: () => void;
    handleSubmitBuy?: () => void;
    handleSubmit?: () => void;
    resetForm?: () => void;
    orderType?: string;
    orderLoading?: boolean;
    handleSide?: (e?: OrderSide) => void;
    handleSelectOrderType?: (e: string) => void;
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
    } = props;
    const isLoggedin = useSelector(selectUserLoggedIn);
    const [marketType, setMerketType] = React.useState('buy');

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Limit Order</p>, value: 'limit-order' },
        { label: <p className="m-0 text-sm grey-text-accent">Market</p>, value: 'market' },
    ];

    return (
        <React.Fragment>
            <div className={`buy-sell-container  w-60 ${isLoggedin ? '' : 'blur-effect blur-mobile'}`}>
                <ul className="nav nav-pills w-100" id="pills-tab" role="tablist">
                    <li
                        className={`nav-item buy ${marketType == 'buy' && 'active'}`}
                        id="buy-tab"
                        onClick={() => setMerketType('buy')}>
                        <a className={`nav-link buy ${marketType == 'buy' && 'active'}`}>Buy</a>
                    </li>
                    <li
                        className={`nav-item sell ${marketType == 'sell' && 'active'}`}
                        id="sell-tab"
                        onClick={() => setMerketType('sell')}>
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
                                    return option.value === 'limit-order';
                                })}
                                styles={CustomStylesSelect}
                                options={optionStatus}
                            />
                        </div>
                        <div className="input-group mb-8">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <PlusIcon />
                                </span>
                            </div>
                            <input type="text" className="form-control" placeholder="1518.72" />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <MinusIcon />
                                </span>
                            </div>
                        </div>
                        <p className="m-0 mb-8 amount">= Rp 234,009,833</p>
                        <div className="input-group mb-8">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <PlusIcon />
                                </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Amount BTC" />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <MinusIcon />
                                </span>
                            </div>
                        </div>
                        <div className="badge-container d-flex justify-content-between align-items-center flex-wrap mb-8">
                            <div className="badge">25%</div>
                            <div className="badge">50%</div>
                            <div className="badge">75%</div>
                            <div className="badge">100%</div>
                        </div>
                        <div className="input-group mb-8">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <PlusIcon />
                                </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Total BIDR" />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <MinusIcon />
                                </span>
                            </div>
                        </div>
                        {marketType == 'buy' ? (
                            <button
                                type="button"
                                className="btn-primary btn-buy btn-block"
                                data-toggle="modal"
                                disabled={!isLoggedin}
                                data-target="#modal-confirm-buy">
                                Buy
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn-danger btn-sell btn-block"
                                data-toggle="modal"
                                disabled={!isLoggedin}
                                data-target="#modal-confirm-buy">
                                Sell
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};
