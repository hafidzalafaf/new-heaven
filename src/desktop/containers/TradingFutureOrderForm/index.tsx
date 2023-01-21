import React, { FC, ReactElement } from 'react';
import { selectCurrencies } from 'src/modules';
import './TradingFutureOrderForm.pcss';
import { SpeedIcon } from 'src/assets/images/SpeedIcon';
import { CustomInput, Modal } from 'src/desktop/components';
import { selectUserLoggedIn } from '../../../modules';
import { useSelector } from 'react-redux';

export const TradingFutureOrderForm: FC = (): ReactElement => {
    const currencies = useSelector(selectCurrencies);
    const [showModalBuyConfirmation, setShowModalBuyConfirmation] = React.useState(false);
    const [showModalBuySuccessfully, setShowModalBuySuccessfully] = React.useState(false);
    const [showModalSellConfirmation, setShowModalSellConfirmation] = React.useState(false);
    const [showModalSellSuccessfully, setShowModalSellSuccessfully] = React.useState(false);
    const isLoggedin = useSelector(selectUserLoggedIn);

    const renderHeaderModalBuyConfirmation = () => {
        return <h6 className="text-md white-text font-semibold">Are you sure to Buy BTC?</h6>;
    };

    const renderContentModalBuyConfirmation = () => {
        return (
            <React.Fragment>
                <ul className="pl-2 mb-24">
                    <li className="text-ms grey-text-accent font-semibold">Bought 0.00003324 BTC = $ 212,642,342</li>
                    <li className="text-ms grey-text-accent font-semibold">Total spent $ 12,453</li>
                </ul>
                <div className="d-flex">
                    <button
                        onClick={() => setShowModalBuyConfirmation(!showModalBuyConfirmation)}
                        type="button"
                        className="btn btn-danger sm px-5 mr-3">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setShowModalBuyConfirmation(!showModalBuyConfirmation);
                            setShowModalBuySuccessfully(!showModalBuySuccessfully);
                        }}
                        type="button"
                        className="btn btn-success sm px-5">
                        Buy
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const renderHeaderModalBuySuccessfully = () => {
        return <h6 className="text-md white-text font-semibold">Buy Order has Succesfully placed for $ 12,453</h6>;
    };

    const renderContentModalBuySuccessfully = () => {
        return (
            <React.Fragment>
                <ul className="pl-2  mb-24">
                    <li className="text-ms grey-text-accent font-semibold">Bought 0.00003324 BTC = $ 212,642,342</li>
                    <li className="text-ms grey-text-accent font-semibold">Total spent $ 12,453</li>
                    <li className="text-ms grey-text-accent font-semibold">Fee $ 63</li>
                    <li className="text-ms grey-text-accent font-semibold">Amount Received : 0.000002154</li>
                </ul>
                <div className="d-flex">
                    <button
                        onClick={() => setShowModalBuySuccessfully(!showModalBuySuccessfully)}
                        type="button"
                        className="btn btn-danger sm px-5 mr-3">
                        Close
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const renderHeaderModalSellConfirmation = () => {
        return <h6 className="text-md white-text font-semibold">Are you sure to Sell BTC?</h6>;
    };

    const renderContentModalSellConfirmation = () => {
        return (
            <React.Fragment>
                <ul className="pl-2 mb-24">
                    <li className="text-ms grey-text-accent font-semibold">Sell in 0.00003324 BTC = $ 857,887,545</li>
                    <li className="text-ms grey-text-accent font-semibold">Total spent $ 12,453</li>
                </ul>
                <div className="d-flex">
                    <button
                        onClick={() => setShowModalSellConfirmation(!showModalSellConfirmation)}
                        type="button"
                        className="btn btn-danger sm px-5 mr-3">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setShowModalSellConfirmation(!showModalSellConfirmation);
                            setShowModalSellSuccessfully(!showModalSellSuccessfully);
                        }}
                        type="button"
                        className="btn btn-success sm px-5">
                        Sell
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const renderHeaderModalSellSuccessfully = () => {
        return <h6 className="text-md white-text font-semibold">Sell BTC has Succesfully </h6>;
    };

    const renderContentModalSellSuccessfully = () => {
        return (
            <React.Fragment>
                <ul className="pl-2">
                    <li className="text-ms grey-text-accent font-semibold">Bought 0.00003324 BTC = $ 212,642,342</li>
                    <li className="text-ms grey-text-accent font-semibold">Sell in 0.00003324 BTC = $ 857,887,545</li>
                    <li className="text-ms grey-text-accent font-semibold">Fee $ 64</li>
                    <li className="text-ms grey-text-accent font-semibold">Amount Received : 0.000002154</li>
                </ul>
                <div className="d-flex">
                    <button
                        onClick={() => setShowModalSellSuccessfully(!showModalSellSuccessfully)}
                        type="button"
                        className="btn btn-danger sm px-5 mr-3">
                        Cancel
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pr-3">
                <p className="white-text font-bold text-sm mb-6">Order Form</p>
                <form action="" className={isLoggedin ? '' : 'blur-effect'}>
                    <div className="d-flex mb-1 order-tab">
                        <input
                            type="radio"
                            id="market-order"
                            className="d-none"
                            name="order-form"
                            defaultValue="market"
                        />
                        <label
                            htmlFor="market-order"
                            className="btn btn-transparent w-auto text-xs font-bold cursor-pointer px-0 mr-4 grey-text-accent">
                            Market
                        </label>
                        <input
                            type="radio"
                            id="limit-order"
                            className="d-none"
                            name="order-form"
                            defaultValue="limit"
                        />
                        <label
                            htmlFor="limit-order"
                            className="btn btn-transparent w-auto text-xs font-bold cursor-pointer px-0 mr-4 grey-text-accent">
                            Limit
                        </label>
                        <input type="radio" id="stop-order" className="d-none" name="order-form" defaultValue="stop" />
                        <label
                            htmlFor="stop-order"
                            className="btn btn-transparent w-auto text-xs font-bold cursor-pointer px-0 mr-4 grey-text-accent">
                            Stop
                        </label>
                    </div>
                    <div className="mb-0 d-flex justify-content-between">
                        <p className="text-sm grey-text-accent"> Avaliable </p>
                        <p className="text-sm white-text"> 0.000000 BTC </p>
                    </div>
                    <div className="form-group mb-3 position-relative w-100 custom-input-order-form ">
                        <CustomInput
                            type="text"
                            label={'Buy'}
                            placeholder={'0.0000000'}
                            defaultLabel={'Buy'}
                            // handleChangeInput={}
                            inputValue={''}
                            // handleFocusInput={}
                            classNameLabel="d-none"
                            classNameInput={`dark-bg-accent custom-input-order-form__input m-0`}
                            classNameGroup={`m-0`}
                            autoFocus={false}
                            labelVisible={false}
                        />
                        <p className="position-absolute text-xs grey-text-accent font-bold m-0 custom-input-order-form__price">
                            Price
                        </p>
                        <p className="position-absolute text-xs grey-text-accent font-bold m-0 custom-input-order-form__coin">
                            USDT
                        </p>
                    </div>
                    <div className="form-group mb-3 position-relative w-100 custom-input-order-form ">
                        <CustomInput
                            type="text"
                            label={'Buy'}
                            placeholder={'0.0000000'}
                            defaultLabel={'Buy'}
                            // handleChangeInput={}
                            inputValue={''}
                            // handleFocusInput={}
                            classNameLabel="d-none"
                            classNameInput={`dark-bg-accent custom-input-order-form__input m-0`}
                            classNameGroup={`m-0`}
                            autoFocus={false}
                            labelVisible={false}
                        />
                        <p className="position-absolute text-xs grey-text-accent font-bold m-0 custom-input-order-form__price">
                            Amount
                        </p>
                        <p className="position-absolute text-xs grey-text-accent font-bold m-0 custom-input-order-form__coin">
                            BTC
                        </p>
                    </div>

                    <div className="input-timeline mb-24 position-relative">
                        <div className="line-wrap">
                            <div className="line" id="line-order" />
                        </div>
                        <div className="main-input">
                            <div className="d-flex justify-content-between">
                                <div className="input-item start">
                                    <label htmlFor="percent-0" className="cursor-pointer">
                                        <div className="dots-wrap check">
                                            <div className="dots check" />
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        id="percent-0"
                                        name="order-form"
                                        defaultValue="market"
                                        className="d-none"
                                    />
                                    <label
                                        htmlFor="percent-0"
                                        className="btn btn-transparent white-text text-xxs cursor-pointer p-0 d-block">
                                        0%
                                    </label>
                                </div>
                                <div className="input-item">
                                    <label htmlFor="percent-25" className="cursor-pointer">
                                        <div className="dots-wrap check">
                                            <div className="dots check" />
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        className="d-none"
                                        id="percent-25"
                                        name="order-form"
                                        defaultValue="market"
                                    />
                                    <label
                                        htmlFor="percent-25"
                                        className="btn btn-transparent white-text text-xxs cursor-pointer p-0 d-block">
                                        25%
                                    </label>
                                </div>
                                <div className="input-item">
                                    <label htmlFor="percent-50" className="cursor-pointer">
                                        <div className="dots-wrap check">
                                            <div className="dots check" />
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        className="d-none"
                                        id="percent-50"
                                        name="order-form"
                                        defaultValue="market"
                                    />
                                    <label
                                        htmlFor="percent-50"
                                        className="btn btn-transparent white-text text-xxs cursor-pointer p-0 d-block">
                                        50%
                                    </label>
                                </div>
                                <div className="input-item">
                                    <label htmlFor="percent-75" className="cursor-pointer">
                                        <div className="dots-wrap check">
                                            <div className="dots check" />
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        className="d-none"
                                        id="percent-75"
                                        name="order-form"
                                        defaultValue="market"
                                    />
                                    <label
                                        htmlFor="percent-75"
                                        className="btn btn-transparent white-text text-xxs cursor-pointer p-0 d-block">
                                        75%
                                    </label>
                                </div>
                                <div className="input-item end">
                                    <label htmlFor="percent-100" className="cursor-pointer">
                                        <div className="dots-wrap check">
                                            <div className="dots check" />
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        className="d-none"
                                        id="percent-100"
                                        name="order-form"
                                        defaultValue="market"
                                    />
                                    <label
                                        htmlFor="percent-100"
                                        className="btn btn-transparent white-text text-xxs cursor-pointer p-0 d-block">
                                        100%
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="tp-sl" />
                        <label className="form-check-label text-sm font-semibold grey-text-accent" htmlFor="hide-all">
                            TP/SL
                        </label>
                    </div>
                    <div className="mb-24" id="tp-sl-form">
                        <div className="form-group mb-3 position-relative  w-100">
                            <input
                                type="text"
                                className="form-control input-order-form"
                                id="input-order"
                                placeholder="Take Profit"
                            />
                            <label htmlFor="input-order" className="input-order-label-right cursor-pointer">
                                Mark
                                <img src="../../Assets/Icon/arrow.svg" className="ml-2" alt="" />
                            </label>
                        </div>
                        <div className="form-group mb-3 position-relative w-100">
                            <input
                                type="text"
                                className="form-control input-order-form"
                                id="input-order"
                                placeholder="Stop Loss"
                            />
                            <label htmlFor="input-order" className="input-order-label-right cursor-pointer">
                                Mark
                                <img src="../../Assets/Icon/arrow.svg" className="ml-2" alt="" />
                            </label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-around">
                        <button
                            onClick={() => setShowModalBuyConfirmation(!showModalBuyConfirmation)}
                            type="button"
                            className="btn btn-success px-4"
                            data-toggle="modal"
                            disabled={!isLoggedin}
                            data-target="#buy-order">
                            Buy Long
                        </button>
                        <button
                            onClick={() => setShowModalSellConfirmation(!showModalSellConfirmation)}
                            type="button"
                            className="btn btn-danger px-4"
                            data-toggle="modal"
                            disabled={!isLoggedin}
                            data-target="#sell-order">
                            Sell Short
                        </button>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                        <div>
                            <div className="d-flex mb-8">
                                <p className="text-xs mb-0 grey-text-accent mr-2"> Cost </p>
                                <p className="text-sm mb-0 font-bold white-text"> 0.00 USDT </p>
                            </div>
                            <div className="d-flex mb-8">
                                <p className="text-xs mb-0 grey-text-accent mr-2 text-right"> Max </p>
                                <p className="text-sm mb-0 font-bold white-text text-right"> 0.00 BTC</p>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-end mb-8">
                                <p className="text-xs mb-0 grey-text-accent mr-2"> Cost </p>
                                <p className="text-sm mb-0 font-bold white-text"> 0.00 USDT </p>
                            </div>
                            <div className="d-flex justify-content-end mb-8">
                                <p className="text-xs mb-0 grey-text-accent mr-2 text-right"> Max </p>
                                <p className="text-sm mb-0 font-bold white-text text-right"> 0.00 BTC</p>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="margin-ratio mt-5">
                    <p className="white-text font-bold text-sm mb-12">Margin Ratio</p>
                    <button className="btn btn-secondary btn-block mb-24">Single Asset Mode</button>
                    <div className="d-flex justify-content-between mb-8">
                        <p className="text-xs mb-0 grey-text-accent mr-2"> Margin Ratio </p>
                        <p className="text-sm mb-0 font-bold contrast-text">
                            {' '}
                            <SpeedIcon />
                            0.00%
                        </p>
                    </div>
                    <div className="d-flex justify-content-between mb-8">
                        <p className="text-xs mb-0 grey-text-accent mr-2"> Maintenance Margin </p>
                        <p className="text-sm mb-0 font-bold white-text"> 0.0000 USD </p>
                    </div>
                    <div className="d-flex justify-content-between mb-8">
                        <p className="text-xs mb-0 grey-text-accent mr-2"> Margin Balance </p>
                        <p className="text-sm mb-0 font-bold white-text"> 0.0000 USD </p>
                    </div>
                </div>
            </div>

            {showModalBuyConfirmation && (
                <Modal
                    show={showModalBuyConfirmation}
                    header={renderHeaderModalBuyConfirmation()}
                    content={renderContentModalBuyConfirmation()}
                />
            )}

            {showModalBuySuccessfully && (
                <Modal
                    show={showModalBuySuccessfully}
                    header={renderHeaderModalBuySuccessfully()}
                    content={renderContentModalBuySuccessfully()}
                />
            )}

            {showModalSellConfirmation && (
                <Modal
                    show={showModalSellConfirmation}
                    header={renderHeaderModalSellConfirmation()}
                    content={renderContentModalSellConfirmation()}
                />
            )}

            {showModalSellSuccessfully && (
                <Modal
                    show={showModalSellSuccessfully}
                    header={renderHeaderModalSellSuccessfully()}
                    content={renderContentModalSellSuccessfully()}
                />
            )}
        </React.Fragment>
    );
};
