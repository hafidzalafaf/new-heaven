import * as React from 'react';
import Select from 'react-select';
import { CustomStylesSelect } from '..';

export interface OfferFormProps {
    showModalCreateOffer?: boolean;
}

export const OfferForm: React.FunctionComponent<OfferFormProps> = (props) => {
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
            <form className="com-form-crete-offer">
                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">CRYPTOCURRENCY</p>
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

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PRICE</p>
                    <div className="w-100 d-flex justify-content-between align-items-center input-price-container">
                        <input placeholder="Enter amount" className="w-80 custom-input-offer mb-24 white-text" />
                        <div className="w-20">
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
                    </div>
                </div>

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">TRADING AMOUNT</p>
                    <input placeholder="00.00" className="custom-input-offer w-100 mb-24 white-text" />
                </div>

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">ORDER LIMIT</p>
                    <div className="w-100 d-flex justify-content-between align-items-center input-price-container">
                        <div className="position-relative w-50">
                            <input placeholder="0.00" className="custom-input-offer w-100 mb-24 white-text" />
                            <label className="input-label-right text-sm grey-text position-absolute">min</label>
                        </div>
                        <div className="position-relative w-50">
                            <input placeholder="0.00" className="custom-input-offer w-100 mb-24 white-text" />
                            <label className="input-label-right text-sm grey-text position-absolute">max</label>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PAYMENT METHOD</p>
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

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">PAYMENT TIME LIMIT</p>
                    <input placeholder="10 MIN" className="custom-input-offer w-100 mb-24 white-text" />
                </div>

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">TERM CONDITIONS</p>
                    <input className="custom-input-offer w-100 mb-24 white-text" />
                </div>

                <div>
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">AUTO REPLY (OPTIONAL)</p>
                    <input className="custom-input-offer w-100 mb-24 white-text" />
                </div>

                <button className="btn-secondary w-100">Create Offers</button>
            </form>
        </React.Fragment>
    );
};
