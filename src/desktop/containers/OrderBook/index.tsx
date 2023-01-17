import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentMarket, selectLastRecentTrade, selectUserLoggedIn } from '../../../modules';
import { useParams } from 'react-router-dom';
import { useOpenOrdersFetch, useDepthFetch, usePrevious } from '../../../hooks';
import { TradeDown, TradeUp } from '../../../assets/images/TradeIcon';
import { numberFormat, accumulateVolume, calcMaxVolume } from '../../../helpers';
import { Decimal, Loading } from '../../../components';
import { NoData } from '../../../desktop/components';

const OrderBookComponent = ({ asks, bids, loading, handleSelectPriceAsks, handleSelectPriceBids }) => {
    useOpenOrdersFetch();
    useDepthFetch();

    const dispatch = useDispatch();
    const { currency = '' } = useParams<{ currency?: string }>();
    const [ask, setAsk] = React.useState([]);
    const [bid, setBid] = React.useState([]);

    const currentMarket = useSelector(selectCurrentMarket);
    const lastTrade = useSelector(selectLastRecentTrade);
    const isLoggedIn = useSelector(selectUserLoggedIn);

    React.useEffect(() => {
        setAsk(asks);
        setBid(bids);
    }, [asks, bids, currentMarket]);

    const mapValues = (maxVolume?: number, data?: number[]) => {
        const resultData =
            data && maxVolume && data.length
                ? data.map((currentVolume) => {
                      return { value: (currentVolume / maxVolume) * 100 };
                  })
                : [];

        return resultData;
    };

    const bgWitdhBids = mapValues(calcMaxVolume(bid, ask), accumulateVolume(bid, false));
    const bgWidthAsk = mapValues(calcMaxVolume(bid, ask), accumulateVolume(ask, false));

    return (
        <React.Fragment>
            <div className="p-3">
                <p className="white-text font-bold text-sm">Order Book</p>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <Loading />
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="max-400 position-relative table-ask">
                            <div className="table-background">
                                {ask &&
                                    ask.map((item, i) => (
                                        <div
                                            key={i}
                                            className="table-background-row danger"
                                            style={{ width: `${bgWidthAsk[i].value.toString()}%` }}
                                        />
                                    ))}
                            </div>
                            <table id="example" className="table hidden-filter table-small" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className="text-left grey-text">Price</th>
                                        <th className="text-right grey-text">Amount</th>
                                        <th className="text-right grey-text">Total</th>
                                    </tr>
                                </thead>
                                {!ask || !ask[0] ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan={3}>
                                                <NoData text="No data yet" />
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody className="">
                                        {asks &&
                                            asks.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    onClick={() =>
                                                        isLoggedIn &&
                                                        handleSelectPriceAsks(
                                                            Decimal.format(+item[0], currentMarket?.price_precision)
                                                        )
                                                    }
                                                    className={`m-0 p-0 ${isLoggedIn && 'cursor-pointer'}`}>
                                                    <td>
                                                        <p className="text-sm danger-text font-bold m-0 p-0 text-left">
                                                            {Decimal.format(+item[0], currentMarket?.price_precision)}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-sm grey-text-accent font-bold m-0 p-0 text-right">
                                                            {Decimal.format(+item[1], currentMarket?.amount_precision)}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-sm m-0 p-0 grey-text-accent font-bold text-right">
                                                            {Decimal.format(
                                                                +item[0] * +item[1],
                                                                currentMarket?.price_precision
                                                            )}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="price-highlight py-3 d-flex justify-content-between align-items-center">
                            <h3
                                className={`text-md font-bold m-0 p-0 ${
                                    lastTrade && +lastTrade.price_change > 0 ? 'green-text' : 'danger-text'
                                }`}>
                                {Decimal.format(lastTrade && +lastTrade.price, currentMarket?.price_precision)}
                                {lastTrade && +lastTrade.price_change > 0 ? <TradeUp /> : <TradeDown />}
                            </h3>
                            <p
                                className={`p-0 m-0 text-sm font-normal ${
                                    lastTrade && +lastTrade.price_change > 0 ? 'green-text' : 'danger-text'
                                }`}>
                                {Decimal.format(lastTrade && +lastTrade.price_change, currentMarket?.price_precision)}
                            </p>
                        </div>
                        <div className="max-400 position-relative">
                            <div className="table-background top-30">
                                {bid &&
                                    bid.map((item, i) => (
                                        <div
                                            key={i}
                                            className="table-background-row good"
                                            style={{ width: `${bgWitdhBids[i].value.toString()}%` }}
                                        />
                                    ))}
                            </div>
                            <table id="example" className="table hidden-filter table-small" style={{ width: '100%' }}>
                                {!bid || !bid[0] ? (
                                    <NoData text="No data yet" />
                                ) : (
                                    <tbody>
                                        {bid.map((item, i) => (
                                            <tr
                                                key={i}
                                                onClick={() =>
                                                    isLoggedIn &&
                                                    handleSelectPriceBids(
                                                        Decimal.format(+item[0], currentMarket?.price_precision)
                                                    )
                                                }
                                                className={`m-0 p-0 ${isLoggedIn && 'cursor-pointer'}`}>
                                                <td>
                                                    <p className="text-sm green-text font-bold m-0 p-0 text-left">
                                                        {Decimal.format(+item[0], currentMarket?.price_precision)}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="text-sm grey-text-accent font-bold m-0 p-0 text-right">
                                                        {Decimal.format(+item[1], currentMarket?.amount_precision)}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="text-sm m-0 p-0 grey-text-accent font-bold text-right">
                                                        {Decimal.format(
                                                            +item[0] * +item[1],
                                                            currentMarket?.price_precision
                                                        )}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export const OrderBook = React.memo(OrderBookComponent);
