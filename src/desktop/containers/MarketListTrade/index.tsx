import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Decimal } from '../../../components';
import { FilterInput, NoData } from '../../../desktop/components';
import { useMarketsFetch, useMarketsTickersFetch } from '../../../hooks';
import {
    selectCurrencies,
    selectMarketTickers,
    selectMarkets,
    setCurrentMarket,
    Market,
    selectCurrentMarket,
    depthFetch,
} from '../../../modules';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const MarketListTradeComponent = ({ handleRedirectToTrading }) => {
    useMarketsFetch();
    useMarketsTickersFetch();

    const dispatch = useDispatch();
    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();

    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);
    const currencies = useSelector(selectCurrencies);
    const currentMarket = useSelector(selectCurrentMarket);

    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredMarket, setFilteredMarket] = React.useState([]);

    const marketList = markets
        .map((market) => ({
            ...market,
            currency: currencies.find((cur) => cur.id == market.base_unit),
            last: Number((marketTickers[market.id] || defaultTicker).last),
            open: Number((marketTickers[market.id] || defaultTicker).open),
            price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
        }))
        .map((market) => ({
            ...market,
            change: Decimal.format(
                (+market.last - +market.open).toFixed(market.price_precision),
                market.price_precision
            ),
        }));

    const searchFilter = (row: Market, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.id?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredMarket(result as Market[]);
    };

    const filteredList = marketList.filter(
        (i) =>
            !filterValue ||
            i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
            i.id?.toLocaleLowerCase().includes(filterValue.toLowerCase())
    );

    return (
        <React.Fragment>
            <div className="p-3">
                <p className="white-text font-bold text-sm mb-24">Market List</p>

                <div className="form-group mb-0 position-relative w-100">
                    <FilterInput
                        data={marketList}
                        onFilter={handleFilter}
                        filter={searchFilter}
                        placeholder={'Search Coin'}
                        className="filter-market-trade"
                    />
                </div>

                <div className="max-300 position-relative mt-2">
                    <table id="example" className="table hidden-filter table-small" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th className="grey-text-accent text-left">Pair</th>
                                <th className="grey-text-accent text-right text-nowrap">Last Price</th>
                                <th className="grey-text-accent text-right">Change</th>
                            </tr>
                        </thead>
                        {!filteredList || !filteredList[0] ? (
                            <NoData text="No data yet" />
                        ) : (
                            <tbody>
                                {filteredList.map((item) => (
                                    <tr
                                        onClick={() => {
                                            handleRedirectToTrading(item.id);
                                        }}
                                        key={item.id}
                                        className={`cursor-pointer ${item.id === currency && 'active'}`}>
                                        <td>
                                            <div className="d-flex justify-content-between">
                                                <div className="mr-0 d-flex align-items-center">
                                                    <span className="cr-crypto-icon">
                                                        <img
                                                            src={item.currency && item.currency.icon_url}
                                                            className="small-coin-icon"
                                                            alt="btc icon"
                                                        />
                                                    </span>
                                                    <div className="name ml-1">
                                                        <p className="text-sm text-white font-bold mb-0">{item.name}</p>
                                                        <span className="text-xs grey-text-accent">
                                                            {item.currency && item.currency.name.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="py-2">
                                                <p
                                                    className={`text-xs my-auto  mb-0 text-right ${
                                                        item.last < item.open ? 'danger-text' : 'green-text'
                                                    }`}>
                                                    {Decimal.format(item.last, item.price_precision)}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="py-2">
                                                <p
                                                    className={`text-xs mb-0 text-right ${
                                                        item.price_change_percent.includes('+')
                                                            ? 'green-text'
                                                            : item.price_change_percent.includes('-')
                                                            ? 'danger-text'
                                                            : 'green-text'
                                                    }`}>
                                                    {item.price_change_percent}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
};

export const MarketListTrade = React.memo(MarketListTradeComponent);
