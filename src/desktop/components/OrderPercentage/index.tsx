import * as React from 'react';

export interface OrderPercentageProps {
    orderPercentage: number;
    handleSelectPercentage: (e: number) => void;
    label0: string;
    label25: string;
    label50: string;
    label75: string;
    label100: string;
    side: string;
    amount: string;
    handleSide: (e: string) => void;
}

export const OrderPercentage: React.FunctionComponent<OrderPercentageProps> = (props) => {
    const {
        orderPercentage,
        handleSelectPercentage,
        label0,
        label25,
        label50,
        label75,
        label100,
        handleSide,
        side,
        amount,
    } = props;

    return (
        <React.Fragment>
            <div className="input-timeline mb-24 position-relative">
                <div className="line-wrap">
                    <div className="line" id="line-order" style={{ width: orderPercentage + '%' }} />
                </div>
                <div className="main-input">
                    <div className="d-flex justify-content-between">
                        <div
                            className="input-item start"
                            onClick={() => {
                                handleSelectPercentage(0);
                                handleSide(side === 'Sell' ? 'sell' : 'buy');
                            }}>
                            <label htmlFor={label0} className="cursor-pointer">
                                <div className={`dots-wrap ${orderPercentage == 0 ? 'active' : 'check'}`}>
                                    <div className={`dots ${orderPercentage == 0 ? '' : 'check'}`} />
                                </div>
                            </label>
                            <input
                                type="radio"
                                id={label0}
                                name="order-form"
                                defaultValue="market"
                                className="d-none"
                            />
                            <label
                                htmlFor={label0}
                                className="btn btn-transparent dark-text w-auto text-xs font-bold cursor-pointer p-0 d-block">
                                0%
                            </label>
                        </div>
                        <div
                            className="input-item"
                            onClick={() => {
                                handleSelectPercentage(25);
                                handleSide(side === 'Sell' ? 'sell' : 'buy');
                            }}>
                            <label htmlFor={label25} className="cursor-pointer">
                                <div
                                    className={`dots-wrap ${
                                        orderPercentage == 25 ? 'active' : orderPercentage > 25 ? 'check' : ''
                                    }`}>
                                    <div className={`dots ${orderPercentage > 25 ? 'check' : ''}`} />
                                </div>
                            </label>
                            <input
                                type="radio"
                                className="d-none"
                                id={label25}
                                name="order-form"
                                defaultValue="market"
                            />
                            <label
                                htmlFor={label25}
                                className="btn btn-transparent dark-text w-auto text-xs font-bold cursor-pointer p-0 d-block">
                                25%
                            </label>
                        </div>
                        <div
                            className="input-item"
                            onClick={() => {
                                handleSelectPercentage(50);
                                handleSide(side === 'Sell' ? 'sell' : 'buy');
                            }}>
                            <label htmlFor={label50} className="cursor-pointer">
                                <div
                                    className={`dots-wrap ${
                                        orderPercentage == 50 ? 'active' : orderPercentage > 50 ? 'check' : ''
                                    }`}>
                                    <div className={`dots ${orderPercentage > 50 ? 'check' : ''}`} />
                                </div>
                            </label>
                            <input
                                type="radio"
                                className="d-none"
                                id={label50}
                                name="order-form"
                                defaultValue="market"
                            />
                            <label
                                htmlFor={label50}
                                className="btn btn-transparent dark-text w-auto text-xs font-bold cursor-pointer p-0 d-block">
                                50%
                            </label>
                        </div>
                        <div
                            className="input-item"
                            onClick={() => {
                                handleSelectPercentage(75);
                                handleSide(side === 'Sell' ? 'sell' : 'buy');
                            }}>
                            <label htmlFor={label75} className="cursor-pointer">
                                <div
                                    className={`dots-wrap ${
                                        orderPercentage == 75 ? 'active' : orderPercentage > 75 ? 'check' : ''
                                    }`}>
                                    <div className={`dots ${orderPercentage > 75 ? 'check' : ''}`} />
                                </div>
                            </label>
                            <input
                                type="radio"
                                className="d-none"
                                id={label75}
                                name="order-form"
                                defaultValue="market"
                            />
                            <label
                                htmlFor={label75}
                                className="btn btn-transparent dark-text w-auto text-xs font-bold cursor-pointer p-0 d-block">
                                75%
                            </label>
                        </div>
                        <div
                            className="input-item end"
                            onClick={() => {
                                handleSelectPercentage(100);
                                handleSide(side === 'Sell' ? 'sell' : 'buy');
                            }}>
                            <label htmlFor={label100} className="cursor-pointer">
                                <div
                                    className={`dots-wrap ${
                                        orderPercentage == 100 ? 'active' : orderPercentage > 100 ? 'check' : ''
                                    }`}>
                                    <div className={`dots ${orderPercentage == 100 ? 'check' : ''}`} />
                                </div>
                            </label>
                            <input
                                type="radio"
                                className="d-none"
                                id={label100}
                                name="order-form"
                                defaultValue="market"
                            />
                            <label
                                htmlFor={label100}
                                className="btn btn-transparent dark-text w-auto text-xs font-bold cursor-pointer p-0 d-block">
                                100%
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
