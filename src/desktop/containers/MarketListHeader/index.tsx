import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Decimal } from 'src/components';
import { selectCurrencies, Market, selectMarkets, selectMarketTickers } from 'src/modules';
import { useMarketsFetch, useMarketsTickersFetch } from 'src/hooks';
import { CardMarket } from '../../components';
import './MarketListHeader.pcss';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

export const MarketListHeader: FC = (): ReactElement => {
    useMarketsFetch();
    useMarketsTickersFetch();
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);

    const marketList = markets.map((market) => ({
        ...market,
        last: Decimal.format(+(marketTickers[market.id] || defaultTicker).last, market.price_precision),
        open: Decimal.format(+(marketTickers[market.id] || defaultTicker).open, market.price_precision),
        price_change_percent: marketTickers[market.id]?.price_change_percent,
        high: Decimal.format(+(marketTickers[market.id] || defaultTicker).high, market.price_precision),
        low: Decimal.format(+(marketTickers[market.id] || defaultTicker).low, market.price_precision),
        volume: Decimal.format(+(marketTickers[market.id] || defaultTicker).volume, market.amount_precision),
        currency: currencies.find((cur) => cur.id == market.base_unit),
    }));

    const dataVolumes = [...marketList].sort((a, b) => Number(+b.volume) - Number(+a.volume));
    const dataGainers = [...marketList]
        .filter((data) => data.price_change_percent?.includes('+'))
        .sort((a, b) => Number(b.price_change_percent.slice(1, -1)) - Number(a.price_change_percent.slice(1, -1)));
    const dataLosers = [...marketList]
        .filter((data) => data.price_change_percent?.includes('-'))
        .sort((a, b) => Number(b.price_change_percent.slice(1, -1)) - Number(a.price_change_percent.slice(1, -1)));

    const dataHighlight = [...marketList].sort(
        (a, b) => Number(b.currency && b.currency.price) - Number(a.currency && a.currency.price)
    );

    return (
        <React.Fragment>
            <h1 className="m-0 mb-24 text-lg white-text">Markets</h1>

            <div className="cr-market-list-header__card-container">
                <CardMarket title="Top Volume Coins" data={dataVolumes} />
                <CardMarket title="Highlight Coins" data={dataHighlight} />
                <CardMarket title="Top Gainers" data={dataGainers} />
                <CardMarket title="Top Losers" data={dataLosers} />
            </div>
        </React.Fragment>
    );
};
