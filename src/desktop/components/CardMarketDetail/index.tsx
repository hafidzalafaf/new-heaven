import * as React from 'react';
import { Currency } from 'src/modules';
import './CardMarketDetail.pcss';
import { numberFormat } from '../../../helpers';
import { NoData } from '../../components';
import { Decimal } from '../../../components';

export interface DetailProps {
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
export interface CardMarketDetailProps {
    title: string;
    data: DetailProps | any;
}

export const CardMarketDetail: React.FunctionComponent<CardMarketDetailProps> = ({ title, data }) => {
    return (
        <React.Fragment>
            <div className="com-card-market-detail">
                <h1 className="text-lg white-text mb-24">{title}</h1>

                {data &&
                    data.slice(0, 3).map((detail, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-start mb-24">
                            <div className="d-flex">
                                <span className="mr-8">
                                    <img
                                        src={detail && detail.currency && detail.currency.icon_url}
                                        alt="icon"
                                        className="small-coin-icon"
                                    />
                                </span>
                                <div>
                                    <p className="mb-8 text-sm white-text font-bold">
                                        {detail && detail.base_unit && detail.base_unit.toUpperCase()}
                                    </p>
                                    <p className="m-0 text-xs grey-text-accent">
                                        {detail && detail.currency && detail.currency.name}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="mb-8 text-sm white-text text-left font-bold" style={{ minWidth: 100 }}>
                                    {title == 'Top 3 Volumes'
                                        ? `${detail?.quote_unit == 'idr' ? 'Rp' : '$'} ${detail && detail.volume}`
                                        : detail?.quote_unit == 'idr'
                                        ? 'Rp'
                                        : '$ ' +
                                          Decimal.format(
                                              detail && detail.last,
                                              detail.price_precision,
                                              detail?.quote_unit == 'idr' ? ',' : '.'
                                          )}
                                </p>
                                <p
                                    className={`m-0 text-xs ${
                                        detail &&
                                        detail.price_change_percent &&
                                        detail.price_change_percent.includes('-')
                                            ? 'danger-text'
                                            : 'green-text'
                                    }`}>
                                    {detail && detail.price_change_percent}
                                </p>
                            </div>
                        </div>
                    ))}
                {data.length < 1 && <NoData text="There is no market data" />}
            </div>
        </React.Fragment>
    );
};
