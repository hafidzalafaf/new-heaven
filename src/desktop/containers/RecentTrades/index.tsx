import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRecentTrades, recentTradesFetch, selectCurrentMarket } from '../../../modules';
import { Decimal } from '../../../components';
import { localeDate } from '../../../helpers';
import { NoData } from '../../../desktop/components';

const RecentTradesComponent = (props) => {
    const dispatch = useDispatch();
    const recentTrades = useSelector(selectRecentTrades);
    const currentMarket = useSelector(selectCurrentMarket);

    React.useEffect(() => {
        if (currentMarket) {
            dispatch(recentTradesFetch(currentMarket));
        }
    }, [dispatch, currentMarket]);

    return (
        <React.Fragment>
            <div className="p-3">
                <div className="d-flex justify-content-between">
                    <p className="white-text font-bold text-sm labels">Recent Trades</p>
                </div>
                <div className="max-400 position-relative">
                    <table id="example" className="table hidden-filter table-small" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th className="text-left grey-text dark-bg-accent">Price</th>
                                <th className="text-right grey-text dark-bg-accent">Amount</th>
                                <th className="text-right grey-text dark-bg-accent">Time</th>
                            </tr>
                        </thead>
                        {!recentTrades || !recentTrades[0] ? (
                            <tbody>
                                <tr>
                                    <td colSpan={3}>
                                        <NoData text="No data yet" />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {recentTrades?.map((trade, i) => (
                                    <tr key={i}>
                                        <td>
                                            <p
                                                className={`text-sm font-bold mb-0 text-left ${
                                                    trade.taker_type === 'sell' ? 'danger-text' : 'contrast-text'
                                                }`}>
                                                {Decimal.format(trade.price, currentMarket?.price_precision)}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-sm grey-text-accent font-bold mb-0 text-right">
                                                {Decimal.format(trade.amount, currentMarket?.amount_precision)}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="text-sm mb-0 grey-text-accent font-bold text-right">
                                                {String(localeDate(trade.created_at, 'time'))}
                                            </p>
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

export const RecentTrades = React.memo(RecentTradesComponent);
