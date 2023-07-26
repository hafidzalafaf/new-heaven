import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'src/modules';
import Select, { components } from 'react-select';
import { CustomStyleSelectOfferForm } from './CustomStyleSelectOfferForm';
import { Link } from 'react-router-dom';
export interface OfferFormProps {
    showModalCreateOffer?: boolean;
    onCloseModal?: () => void;
    optionFiats: any;
    optionCurrency: any;
    optionPayment: any;
    currency: string;
    price: string;
    fiat: string;
    trade_amount: string;
    min_order: string;
    max_order: string;
    payment: {};
    paymentValue: any;
    payment_limit: string;
    term_of_condition: string;
    auto_replay: string;
    handleChangeFiat: (e: string) => void;
    handleChangeCurrency: (e: string) => void;
    handleChangePayment: (e: any) => void;
    handleChangePrice: (e: string) => void;
    handleChangeTradeAmount: (e: string) => void;
    handleChangeMinOrder: (e: string) => void;
    handleChangeMaxOrder: (e: string) => void;
    handleChangePaymentLimit: (e: string) => void;
    handleChangeTermOfCondition: (e: string) => void;
    handleChangeAutoReplay: (e: string) => void;
    handleCreateOffer: () => void;
    isDisabled: any;
}

export const OfferForm: React.FunctionComponent<OfferFormProps> = (props) => {
    const {
        showModalCreateOffer,
        onCloseModal,
        optionCurrency,
        optionFiats,
        optionPayment,
        currency,
        price,
        fiat,
        trade_amount,
        min_order,
        max_order,
        payment,
        paymentValue,
        payment_limit,
        term_of_condition,
        auto_replay,
        handleChangeCurrency,
        handleChangeFiat,
        handleChangePayment,
        handleChangeAutoReplay,
        handleChangeMaxOrder,
        handleChangeMinOrder,
        handleChangePaymentLimit,
        handleChangePrice,
        handleChangeTermOfCondition,
        handleChangeTradeAmount,
        handleCreateOffer,
        isDisabled,
    } = props;

    const user = useSelector(selectUserInfo);

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
            <form className="com-form-crete-offer">
                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">CRYPTOCURRENCY</p>
                    <Select
                        value={optionCurrency?.filter(function (option) {
                            return option.value === currency;
                        })}
                        styles={CustomStyleSelectOfferForm}
                        options={optionCurrency}
                        onChange={(e) => {
                            handleChangeCurrency(e.value);
                        }}
                    />
                </div>

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PRICE</p>
                    <div className="w-100 d-flex justify-content-between align-items-center input-price-container">
                        <input
                            type="text"
                            required
                            value={price}
                            onChange={(e) => handleChangePrice(e.target.value)}
                            placeholder="Enter amount"
                            className="w-80 custom-input-offer mb-24 white-text"
                        />
                        <div className="w-20">
                            <Select
                                value={optionFiats?.filter(function (option) {
                                    return option.value === fiat;
                                })}
                                styles={CustomStyleSelectOfferForm}
                                options={optionFiats}
                                onChange={(e) => {
                                    handleChangeFiat(e.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">TRADING AMOUNT</p>
                    <input
                        type="text"
                        required
                        value={trade_amount}
                        onChange={(e) => handleChangeTradeAmount(e.target.value)}
                        placeholder="00.00"
                        className="custom-input-offer w-100 mb-24 white-text"
                    />
                </div>

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">ORDER LIMIT</p>
                    <div className="w-100 d-flex justify-content-between align-items-center input-price-container">
                        <div className="position-relative w-50">
                            <input
                                type="text"
                                required
                                value={min_order}
                                onChange={(e) => handleChangeMinOrder(e.target.value)}
                                placeholder="0.00"
                                className="custom-input-offer w-100 mb-24 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute">min</label>
                        </div>
                        <div className="position-relative w-50">
                            <input
                                type="text"
                                required
                                value={max_order}
                                onChange={(e) => handleChangeMaxOrder(e.target.value)}
                                placeholder="0.00"
                                className="custom-input-offer w-100 mb-24 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute">max</label>
                        </div>
                    </div>
                </div>

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PAYMENT METHOD</p>
                    <Select
                        isMulti
                        value={paymentValue}
                        components={{ MenuList: AddPayment }}
                        styles={CustomStyleSelectOfferForm}
                        options={optionPayment}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(e) => {
                            handleChangePayment(e);
                        }}
                    />
                </div>

                {/* <div className='mb-24'>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PAYMENT TIME LIMIT</p>
                    <input
                        type="text"
                        required
                        value={payment_limit}
                        onChange={(e) => handleChangePaymentLimit(e.target.value)}
                        placeholder="10 MIN"
                        className="custom-input-offer w-100 mb-24 white-text"
                    />
                </div> */}

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">TERM CONDITIONS</p>
                    <input
                        type="text"
                        required
                        value={term_of_condition}
                        onChange={(e) => handleChangeTermOfCondition(e.target.value)}
                        placeholder="Enter Term Conditions"
                        className="custom-input-offer w-100 mb-24 white-text"
                    />
                </div>

                <div className="mb-24">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">AUTO REPLY (OPTIONAL)</p>
                    <input
                        type="text"
                        value={auto_replay}
                        onChange={(e) => handleChangeAutoReplay(e.target.value)}
                        placeholder="Auto Reply"
                        className="custom-input-offer w-100 mb-24 white-text"
                    />
                </div>

                <div className="position-fixed btn-wrapper dark-bg-accent">
                    <button
                        type="button"
                        onClick={handleCreateOffer}
                        disabled={isDisabled()}
                        className="btn-secondary w-100 mb-24">
                        Create Offers
                    </button>
                    <button type="button" onClick={onCloseModal} className="danger-text btn-danger btn-outline w-100">
                        Close
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
};
