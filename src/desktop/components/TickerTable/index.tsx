import React from 'react';
import { useIntl } from 'react-intl';
import { setCurrentMarket, Market } from '../../../modules';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { numberFormat } from '../../../helpers';

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
}

export const TickerTable: React.FC<Props> = ({
    currentBidUnit,
    markets,
    setCurrentBidUnit,
    currentBidUnitsList,
    redirectToTrading,
}) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleRedirectToTrading = (id: string) => {
        const currentMarket: Market | undefined = markets.find((item) => item.id === id);

        if (currentMarket) {
            dispatch(setCurrentMarket(currentMarket));
            history.push(
                `/markets/${currentMarket.type == 'spot' ? 'trading/' : '/trading-future/'}${currentMarket.id}`
            );
        }
    };

    const handleToMarket = (id) => {
        history.push(`markets/detail/${id}`);
    };

    const renderItem = React.useCallback(
        (market, index: number) => {
            const marketChangeColor = +(market.change || 0) < 0 ? 'negative-price' : 'positive-price';
            return (
                <tr key={index}>
                    <td>
                        <div className="d-flex align-items-center">
                            <img
                                src={market && market.currency && market.currency.icon_url}
                                className="small-coin-icon"
                                alt=""
                            />
                            <div className="font-bold ml-2 text-uppercase">{market && market.name.toUpperCase()}</div>
                        </div>
                    </td>
                    <td>
                        <span>{market.last}</span>
                    </td>
                    <td>
                        <span className={marketChangeColor}>{market.price_change_percent}</span>
                    </td>
                    <td>
                        <span>{market.high}</span>
                    </td>
                    <td>
                        <span>{market.low}</span>
                    </td>
                    <td>
                        <span>{market.volume}</span>
                    </td>
                    <td>
                        <div className="d-flex">
                            <p
                                className="gradient-text font-normal mx-2 text-sm cursor-pointer"
                                onClick={() => handleToMarket(market.id)}>
                                Detail
                            </p>
                            <p
                                onClick={() => handleRedirectToTrading(market.id)}
                                className="gradient-text font-normal mx-2 text-sm cursor-pointer">
                                Trade
                            </p>
                        </div>
                    </td>
                </tr>
            );
        },
        [redirectToTrading]
    );

    return (
        <div>
            <div className="navbar__ticker-table">
                <ul className="navbar-nav__ticker-table" role="tablist">
                    {currentBidUnitsList.map((item, i) => (
                        <li
                            key={i}
                            className={`nav-item__ticker-table ${item === currentBidUnit ? 'active' : ''}`}
                            onClick={() => setCurrentBidUnit(item)}>
                            <span>
                                {item ? item.toUpperCase() : formatMessage({ id: 'page.body.marketsTable.filter.all' })}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <table className="pg-ticker-table__table">
                <thead>
                    <tr>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.pair' })}</th>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.lastPrice' })}</th>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.change' })}</th>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.high' })}</th>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.low' })}</th>
                        <th scope="col">{formatMessage({ id: 'page.body.marketsTable.header.volume' })}</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {markets[0] ? (
                        markets.map(renderItem)
                    ) : (
                        <tr>
                            <td>
                                <span className="no-data">{formatMessage({ id: 'page.noDataToShow' })}</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
