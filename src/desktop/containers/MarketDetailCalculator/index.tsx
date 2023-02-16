import React, { useState } from 'react';
import { Currency } from 'src/modules';
import { Link } from 'react-router-dom';
import { CustomInput } from 'src/desktop/components';
import './MarketDetailCalculator.pcss';
import { numberFormat } from '../../../helpers';
import { Decimal } from 'src/components';

export interface CalculatorMarketDetailProps {
    amount_precision: string;
    base_unit: string;
    change: string;
    currency: Currency;
    high: string;
    id: string;
    kline: [];
    last: string;
    max_price: string;
    min_amount: string;
    min_price: string;
    name: string;
    open: string;
    price_change_percent: string;
    price_precision: number;
    quote_unit: string;
    state: string;
    symbol: string;
    type: string;
    volume: string;
}

export interface MarketDetailCalculatorProps {
    detail: CalculatorMarketDetailProps | any;
}

export const MarketDetailCalculator: React.FC<MarketDetailCalculatorProps> = ({ detail }) => {
    const [inputCalc, setInputCalc] = useState('');

    return (
        <React.Fragment>
            <form className="cr-market-detail-calculator dark-bg-main w-100">
                <h1 className="text-lg white-text mb-18">
                    {detail && detail.base_unit && detail.base_unit.toUpperCase()} Calculator
                </h1>
                <div className="calculator-wrapper dark-bg-accent w-100 mb-24 d-flex align-items-center">
                    <div>
                        <CustomInput
                            type="text"
                            label={'Buy'}
                            placeholder={Decimal.format(
                                '0',
                                detail?.price_precision,
                                detail?.quote_unit == 'idr' ? ',' : '.'
                            )}
                            defaultLabel={'Buy'}
                            handleChangeInput={(e) => setInputCalc(e)}
                            inputValue={inputCalc}
                            // handleFocusInput={}
                            classNameLabel="text-sm grey-text-accent mb-8"
                            classNameInput={`dark-bg-accent calculator-wrapper__input p-0 m-0`}
                            classNameGroup={`m-0`}
                            autoFocus={false}
                            labelVisible
                        />
                    </div>
                    <span>
                        <img src={detail?.logo_url} alt="icon" className="calculator-wrapper__icon" />
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-24 grey-text-accent text-ms font-bold">
                    <p className="m-0">Price</p>
                    <p className="m-0">
                        {Decimal.format(
                            +inputCalc * detail?.last,
                            detail?.price_precision,
                            detail?.quote_unit == 'idr' ? ',' : '.'
                        )}
                        {/* {numberFormat(+inputCalc * (detail && detail.last), 'USD').toString()} */}
                    </p>
                </div>
                <Link to={`/markets/trading/${detail && detail.id}`}>
                    <button className="btn-primary w-100">Trade Now</button>
                </Link>
            </form>
        </React.Fragment>
    );
};
