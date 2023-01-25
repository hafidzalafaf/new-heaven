import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useDocumentTitle, useHistoryFetch, useMarketsFetch } from '../../../hooks';
import {
    selectCurrencies,
    Currency,
    selectHistory,
    selectHistoryLoading,
    selectFirstElemIndex,
    selectCurrentPage,
    selectLastElemIndex,
    selectNextPageExists,
    RootState,
    selectMarkets,
} from '../../../modules';
import { localeDate } from '../../../helpers';
import { Table } from '../../../components';
import { Pagination, CustomStylesSelect } from '../../../desktop/components';
import Select from 'react-select';
import moment from 'moment';
import { NoData } from '../../components';
import { Loading } from '../../../components';

const DEFAULT_LIMIT = 7;

export const HistoryTrade: FC = (): ReactElement => {
    const currencies: Currency[] = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const historyLoading = useSelector(selectHistoryLoading);

    const [historys, setHistorys] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [asset, setAsset] = React.useState('');
    const [currency, setCurrency] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));

    useDocumentTitle('Trade History');
    useMarketsFetch();
    useHistoryFetch({ type: 'trades', limit: DEFAULT_LIMIT, currency, page: currentPage });

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

    React.useEffect(() => {
        setLoading(true);
        if (!historyLoading) {
            setLoading(false);
        }
    }, [historyLoading]);

    React.useEffect(() => {
        setHistorys(list);
    }, [list]);

    React.useEffect(() => {
        if (startDate != '' && endDate != '') {
            let filterredList;
            let temp;
            temp = list;
            filterredList = temp.filter(
                (item) =>
                    moment(item.created_at).format() >= moment(startDate).format() &&
                    moment(item.created_at).format() <= moment(endDate).format()
            );
            setHistorys(filterredList);
        }
    }, [startDate, endDate]);

    let currentBidUnitMarkets = markets;
    const formattedMarkets = currentBidUnitMarkets.length
        ? currentBidUnitMarkets.map((market) => ({
              ...market,
              currency: currencies.find((cur) => cur.id == market.base_unit),
          }))
        : [];

    // console.log(formattedMarkets);

    // const filterredAsset = (id) => {
    //     let filterredList;
    //     let temp;
    //     temp = list;
    //     filterredList = temp.filter((item) => item.market === id);
    //     setHistorys(id === '' ? historys : filterredList);
    // };

    const getTableHeaders = () => {
        return ['Date', 'Side', 'Market', 'Type', 'Volume', 'Price', 'Total'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <p className="m-0 text-sm white-text">{localeDate(item.created_at, 'fullDate')}</p>,
            <p className={`m-0 text-sm ${item.side == 'buy' ? 'green-text' : 'danger-text'}`}>
                {item.side === 'buy' ? 'Buy' : 'Sell'}
            </p>,
            <p className="m-0 text-sm white-text">{item.market?.toUpperCase()}</p>,
            <p className="m-0 text-sm white-text">{item.market_type}</p>,
            <p className="m-0 text-sm white-text">{item.amount}</p>,
            <p className="m-0 text-sm white-text">{item.price}</p>,
            <p className="m-0 text-sm white-text">{item.total}</p>,
        ]);
    };

    const optionAssets = formattedMarkets.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center">
                <img src={item.currency?.icon_url} alt="icon" className="mr-12 small-coin-icon" />
                <div>
                    <p className="m-0 text-sm grey-text-accent">{item.name.toUpperCase()}</p>
                    <p className="m-0 text-xs grey-text-accent">{item.currency?.name}</p>
                </div>
            </div>
        );
        return {
            label: customLabel,
            value: item.base_unit,
        };
    });

    const renderFilter = () => {
        return (
            <div className="d-flex align-items-center">
                <div className="w-20 mr-24">
                    <label className="m-0 white-text text-sm mb-8">Start Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setStartDate(e.target.value);
                        }}
                        value={startDate}
                    />
                </div>

                <div className="w-20 mr-24">
                    <label className="m-0 white-text text-sm mb-8">End Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setEndDate(e.target.value);
                        }}
                        value={endDate}
                    />
                </div>

                <div className="w-20 mr-24">
                    <p className="m-0 white-text text-sm mb-8">Assets</p>
                    <Select
                        value={optionAssets.filter(function (option) {
                            return option.value === currency;
                        })}
                        styles={CustomStylesSelect}
                        options={optionAssets}
                        onChange={(e) => {
                            setCurrency(e.value);
                            console.log(list);

                            // filterredAsset(e.value);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="history-trade-screen content-wrapper dark-bg-main">
                <div className="px-24 dark-bg-main pt-4 pb-4">
                    <h1 className="m-0 white-text text-xl">Trade History</h1>
                </div>
                <div className="pg-history-transaction-screen__content-wrapper dark-bg-accent">
                    <div className="position-relative">{renderFilter()}</div>
                    <Table header={getTableHeaders()} data={getTableData(historys)} />
                    {historys[0] && (
                        <Pagination
                            firstElemIndex={firstElemIndex}
                            lastElemIndex={lastElemIndex}
                            page={page}
                            nextPageExists={nextPageExists}
                            onClickPrevPage={onClickPrevPage}
                            onClickNextPage={onClickNextPage}
                        />
                    )}

                    {loading && <Loading />}
                    {historys.length < 1 && !loading && <NoData text="No Data Yet" />}
                </div>
            </div>
        </React.Fragment>
    );
};
