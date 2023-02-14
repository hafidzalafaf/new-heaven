import * as React from 'react';
import { OrderPercentage } from '../../components';
import { Decimal } from '../../../components';
import { selectUserLoggedIn, selectMarketTickers, selectCurrentMarket, Ticker, selectWallets } from '../../../modules';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

export interface OrderFormProps {
    loading: boolean;
    side: string;
    orderType: string;
    orderPercentage: number;
    handleSelectPercentage: (e: number) => void;
    labelAmount: string;
    labelPrice: string;
    labelTotal: string;
    labelPercent0: string;
    labelPercent25: string;
    labelPercent50: string;
    labelPercent75: string;
    labelPercent100: string;
    amount: string;
    handleChangeAmount: (e: string) => void;
    total: string;
    price: string;
    totalPrice: number;
    handleChangePrice: (e: string) => void;
    handleSide: (e: string) => void;
    handleSubmit: () => void;
    disabledButton: any;
}

export const OrderFormComponent: React.FunctionComponent<OrderFormProps> = (props) => {
    const {
        loading,
        side,
        orderType,
        orderPercentage,
        handleSelectPercentage,
        labelAmount,
        labelPrice,
        labelTotal,
        labelPercent0,
        labelPercent25,
        labelPercent50,
        labelPercent75,
        labelPercent100,
        amount,
        handleChangeAmount,
        total,
        price,
        totalPrice,
        handleChangePrice,
        handleSide,
        handleSubmit,
        disabledButton,
    } = props;

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const tickers = useSelector(selectMarketTickers);
    const currentMarket = useSelector(selectCurrentMarket);
    const wallets = useSelector(selectWallets);

    const [disabled, setDisabled] = React.useState(true);

    const { currency = '' } = useParams<{ currency?: string }>();
    const tickerItem: Ticker = tickers[currency];
    const wallet =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.base_unit?.toLowerCase());
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';

    const usd =
        wallets.length &&
        wallets.find((item) => item.currency.toLowerCase() === currentMarket?.quote_unit?.toLowerCase());
    const usdt = usd && usd.balance ? usd.balance.toString() : '0';

    const handleSetValue = (value: string | number | undefined, defaultValue: string) => value || defaultValue;
    const safePrice = totalPrice / Number(amount) || price;
    const precision = (+currentMarket?.min_amount + '').split('.')[1];

    return (
        <React.Fragment>
            <form action="">
                <div className="form-group mb-3 position-relative  w-100">
                    <input
                        type="text"
                        disabled={orderType === 'market'}
                        placeholder={'0'}
                        defaultValue={
                            orderType === 'market'
                                ? amount != '0'
                                    ? handleSetValue(
                                          Decimal.format(+safePrice, currentMarket?.price_precision, ','),
                                          tickerItem.last
                                      )
                                    : tickerItem.last
                                : price
                        }
                        value={
                            orderType === 'market'
                                ? amount != '0'
                                    ? handleSetValue(
                                          Decimal.format(+safePrice, currentMarket?.price_precision, ','),
                                          tickerItem.last
                                      )
                                    : tickerItem.last
                                : price
                        }
                        onChange={(e) => handleChangePrice(e.target.value)}
                        className={`form-control input-order-form ${orderType === 'market' && 'text-sm grey-text'}`}
                        id={labelPrice}
                    />
                    <label htmlFor={labelPrice} className="input-order-label-left">
                        Price
                    </label>
                    <label htmlFor={labelPrice} className="input-order-label-right">
                        {currentMarket?.quote_unit?.toUpperCase()}
                    </label>
                </div>
                <div className="form-group mb-3 position-relative w-100">
                    <input
                        type="text"
                        placeholder={'0'}
                        defaultValue={''}
                        value={amount?.includes('NaN') ? '' : amount}
                        onChange={(e) => {
                            handleChangeAmount(e.target.value);
                            handleSide(side === 'Sell' ? 'sell' : 'buy');
                        }}
                        className="form-control input-order-form"
                        id={labelAmount}
                    />
                    <label htmlFor={labelAmount} className="input-order-label-left">
                        Amount
                    </label>
                    <label htmlFor={labelAmount} className="input-order-label-right">
                        {currentMarket?.base_unit?.toUpperCase()}
                    </label>
                    {isLoggedIn && (
                        <div className="text-xs grey-text mt-1">Min amount: {currentMarket?.min_amount}</div>
                    )}
                </div>
                <OrderPercentage
                    orderPercentage={orderPercentage}
                    handleSelectPercentage={(e) => handleSelectPercentage(e)}
                    label0={labelPercent0}
                    label25={labelPercent25}
                    label50={labelPercent50}
                    label75={labelPercent75}
                    label100={labelPercent100}
                    handleSide={handleSide}
                    side={side}
                    amount={amount}
                />

                <div className="form-group mb-3 position-relative  w-100">
                    <input
                        type="text"
                        placeholder={
                            total?.includes('NaN')
                                ? Decimal.format('0', currentMarket?.price_precision)
                                : Decimal.format(+total, currentMarket?.price_precision)
                        }
                        readOnly
                        className="form-control input-order-form"
                        id={labelTotal}
                    />
                    <label htmlFor={labelTotal} className="input-order-label-left">
                        Total
                    </label>
                    <label htmlFor={labelTotal} className="input-order-label-right">
                        {currentMarket?.quote_unit?.toUpperCase()}
                    </label>
                </div>
                <div className="mb-3 d-flex justify-content-between">
                    <p className="text-sm grey-text-accent"> Avaliable </p>
                    <p className="text-sm white-text">
                        {side === 'Buy' ? (
                            <>
                                {Decimal.format(usdt, currentMarket?.price_precision)}{' '}
                                {currentMarket?.quote_unit?.toUpperCase()}
                            </>
                        ) : (
                            <>
                                {Decimal.format(balance, currentMarket?.amount_precision)}{' '}
                                {currentMarket?.base_unit?.toUpperCase()}
                            </>
                        )}
                    </p>
                </div>
                <button
                    type="button"
                    className={`btn btn-block ${side === 'Buy' ? 'btn-success' : 'btn-danger'}`}
                    onClick={handleSubmit}
                    disabled={disabledButton()}>
                    {side} {currentMarket?.base_unit?.toUpperCase()}
                </button>
            </form>
        </React.Fragment>
    );
};
