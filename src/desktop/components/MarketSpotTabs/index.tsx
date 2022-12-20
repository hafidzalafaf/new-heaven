import React, { FC, ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies, selectMarkets, selectMarketTickers } from 'src/modules';
import { useMarketsFetch, useMarketsTickersFetch } from 'src/hooks';
import { Link } from 'react-router-dom';
import { Table, Decimal } from '../../../components';
import { Favorite } from '../../../assets/images/Favorite';
import './MarketSpotTabs.pcss';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    // price_change_percent: '+0.00%',
    volume: '0.0',
};

export const MarketSpotTabs: FC = (): ReactElement => {
    useMarketsFetch();
    useMarketsTickersFetch();
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);
    const [favorite, setFavorite] = useState(false);

    const marketList = markets
        .map((market) => ({
            ...market,
            last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
            open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
            // price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
            high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.amount_precision),
            currency: currencies.find((cur) => cur.id == market.base_unit),
            volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.price_precision),
        }))
        .map((market) => ({
            ...market,
            change: Decimal.format(
                (+market.last - +market.open).toFixed(market.price_precision),
                market.price_precision
            ),
        }));

    const spotMarket = marketList.filter((market) => {
        return market.type == 'spot';
    });

    const getTableHeaders = () => {
        return ['Name', 'Price', '24 Change', 'Volume', 'Market Cap', ''];
    };

    const getTableData = (data) => {
        return data.map((item, i) => [
            <div key={i} className="d-flex align-items-center text-sm">
                <div className="mr-2">
                    <Favorite
                        fillColor={favorite ? '#EF8943' : '#23262F'}
                        strokeColor={favorite ? '#EF8943' : '#B5B3BC'}
                        onClick={() => setFavorite(!favorite)}
                    />
                </div>
                <p className="m-0 mr-24 white-text font-bold">{item.name && item.name.toUpperCase()}</p>
            </div>,
            <p className="m-0 text-sm white-text">{item.currency && item.currency.price}</p>,
            <p className={`text-sm m-0 ${item.change.includes('-') ? 'danger-text' : 'green-text'}`}>{item.change}</p>,
            <p className="text-sm m-0 grey-text-accent">{item.change}</p>,
            <p className="m-0 text-sm white-text">{item.cap}</p>,
            <div className="d-flex">
                <div className="mr-3">
                    <Link to={`/markets/${item.base_unit}/detail`}>
                        <p className="m-0 text-sm font-bold gradient-text cursor-pointer">Detail</p>
                    </Link>
                </div>
                <div>
                    <Link to={`/markets/${item.base_unit}/trading-future`}>
                        <p className="m-0 text-sm font-bold gradient-text cursor-pointer">Trade</p>
                    </Link>
                </div>
            </div>,
        ]);
    };

    return (
        <React.Fragment>
            <div className="com-market-all-tabs">
                <Table header={getTableHeaders()} data={getTableData(spotMarket)} />
            </div>
        </React.Fragment>
    );
};
