import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrencies, selectMarkets, selectMarketTickers } from 'src/modules';
import { useMarketsFetch, useMarketsTickersFetch } from 'src/hooks';
import { SearchIcon } from '../../assets/Market';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Table, Decimal } from '../../../components';
import { Link } from 'react-router-dom';
import { Favorite } from '../../../assets/images/Favorite';
import { FilterInput } from 'src/desktop/components';
import { DocIcon } from 'src/mobile/assets/Wallet';
import { alertPush } from 'src/modules';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const MarketListlMobileScreen: React.FC = () => {
    const [key, setKey] = React.useState('all-crypto');
    const [showSearch, setShowSearch] = React.useState(false);

    useMarketsFetch();
    useMarketsTickersFetch();
    const dispatch = useDispatch();
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);
    const [favoriteMarket, setFavoriteMarket] = React.useState(() =>
        JSON.parse(localStorage.getItem('favourites') || '[]')
    );
    const [filterMarket, setFilterMarket] = React.useState([]);
    const [filterValue, setFilterValue] = React.useState('');
    const [filterData, setFilterData] = React.useState([]);

    const marketList = markets
        .map((market) => ({
            ...market,
            last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
            open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
            price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
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

    const futureMarket = marketList.filter((market) => {
        return market.type == 'future';
    });

    const newListingMarket = marketList.filter((market) => {
        return market.type == 'spot';
    });

    const favoriteList = marketList.filter((market) =>
        JSON.parse(localStorage.getItem('favourites') || '[]').some((name) => name == market.name)
    );

    const renderTableHeader = [
        <p className="mb-0 text-sm grey-text">Name</p>,
        <p className="mb-0 text-sm grey-text text-nowrap">Last Price</p>,
        <p className="mb-0 text-sm grey-text">Change</p>,
        <p className="mb-0 text-sm grey-text">Action</p>,
    ];

    useEffect(() => {
        setFavoriteMarket(JSON.parse(localStorage.getItem('favourites') || '[]'));
    }, [localStorage.getItem('favourites'), dispatch]);

    const handleFavorite = (data) => {
        const isFavorite = favoriteMarket.includes(data);
        const favorite = JSON.parse(localStorage.getItem('favourites') || '[]');
        if (!isFavorite) {
            const newStorageItem = [...favoriteMarket, data];
            setFavoriteMarket(newStorageItem);
            localStorage.setItem('favourites', JSON.stringify(newStorageItem));
            //dispatch(alertPush({ message: [`Item added to your favorites`], type: 'success' }));
        } else {
            const newStorageItem = favoriteMarket.filter((savedId) => savedId !== data);
            setFavoriteMarket(newStorageItem);
            localStorage.setItem('favourites', JSON.stringify(newStorageItem));
            //dispatch(alertPush({ message: [`Item remove from your favorites`], type: 'success' }));
        }
    };

    useEffect(() => {
        filterDataMarket();
    }, [key, filterMarket]);

    const handleFilter = (result) => {
        setFilterMarket(result);
    };

    const searchFilter = (row, searchKey) => {
        setFilterValue(searchKey);
        return row ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const tableData = () => {
        if (key == 'favorite') {
            if (!filterMarket[0] && filterValue == '') {
                return favoriteList;
            } else {
                return filterMarket;
            }
        } else if (key == 'all-crypto') {
            if (!filterMarket[0] && filterValue == '') {
                return marketList;
            } else {
                return filterMarket;
            }
        } else if (key == 'spot') {
            if (!filterMarket[0] && filterValue == '') {
                return spotMarket;
            } else {
                return filterMarket;
            }
        } else if (key == 'future') {
            if (!filterMarket[0] && filterValue == '') {
                return futureMarket;
            } else {
                return filterMarket;
            }
        } else if (key == 'new-listing') {
            if (!filterMarket[0] && filterValue == '') {
                return newListingMarket;
            } else {
                return filterMarket;
            }
        }
    };

    const filterDataMarket = () => {
        if (key == 'favorite') {
            setFilterData(favoriteList);
        } else if (key == 'all-crypto') {
            setFilterData(marketList);
        } else if (key == 'spot') {
            setFilterData(spotMarket);
        } else if (key == 'future') {
            setFilterData(futureMarket);
        } else if (key == 'new-listing') {
            setFilterData(newListingMarket);
        } else {
            setFilterData([]);
        }
    };

    const handleSelect = (k) => {
        setKey(k);
        setFilterMarket([]);
    };

    const renderDataTable = (data, type: boolean) => {
        return data.map((item, key) => [
            <React.Fragment>
                {type ? (
                    <div className="ml-1 d-flex align-items-center">
                        <div className="mr-1 cursor-pointer">
                            <Favorite
                                fillColor={favoriteMarket.includes(item.name) ? '#EF8943' : '#23262F'}
                                strokeColor={favoriteMarket.includes(item.name) ? '#EF8943' : '#B5B3BC'}
                                onClick={() => handleFavorite(item.name)}
                            />
                        </div>
                        <p className="mb-0 grey-text-accent mb-0 text-sm ml-2 text-nowrap">
                            {item && item.name && item.name.toUpperCase()}
                        </p>
                    </div>
                ) : (
                    <div className="d-flex align-items-center text-sm" key={key}>
                        <img
                            src={item && item.currency && item.currency.icon_url}
                            alt="coin"
                            className="small-coin-icon"
                        />
                        <div className="ml-1">
                            <p className="mb-0 grey-text-accent mb-0 text-sm ml-2 text-nowrap">
                                {item && item.base_unit && item.base_unit.toUpperCase()} /
                                {item && item.quote_unit && item.quote_unit.toUpperCase()}
                            </p>
                            <p className="mb-0 grey-text text-xxs ml-2">vol : {item && item.volume}</p>
                        </div>
                    </div>
                )}
            </React.Fragment>,
            <p
                className={`grey-text text-sm font-bold mb-0 ${
                    item.price_change_percent.includes('-') ? 'danger-text' : 'contrast-text'
                }`}>
                {item && item.last}
            </p>,
            <p
                className={`badge white-text font-bold mb-0 ${
                    item.price_change_percent.includes('-') ? 'badge-danger' : 'badge-success'
                }`}>
                {item && item.price_change_percent}
            </p>,
            <div>
                <Link to={`/markets/detail/${item.base_unit}`} className="gradient-text text-sm">
                    Detail
                </Link>
                <Link to={`/trading/${item.id}`} className="gradient-text text-sm ml-2">
                    Trade
                </Link>
            </div>,
        ]);
    };
    return (
        <React.Fragment>
            <div className="mobile-container  no-header market-list dark-bg-main">
                <nav className="d-flex justify-content-between navbar-dark p-0 mb-16">
                    <h1 className="navbar-brand p-0 m-0">Market</h1>
                    <div className="menu">
                        <div className="d-inline" onClick={() => setShowSearch(!showSearch)}>
                            <SearchIcon />
                        </div>
                    </div>
                </nav>
                {showSearch && (
                    <div className="mb-24 mt-24">
                        <FilterInput
                            data={filterData}
                            onFilter={handleFilter}
                            filter={searchFilter}
                            placeholder={'Enter the currency you are looking for.'}
                            className="w-100 text-sm"
                        />
                    </div>
                )}
                <Tabs
                    id="controlled-tab-example"
                    defaultActiveKey="all-crypto"
                    activeKey={key}
                    onSelect={(k) => handleSelect(k)}
                    className="">
                    <Tab eventKey="favorite" title="Favorite">
                        <div className="table-mobile-wrapper">
                            {!favoriteList[0] ? (
                                <div className="empty-data d-flex flex-column align-items-center mb-5 w-100">
                                    <DocIcon className={'w-20'} />
                                    <p className="text-secondary">You haven't added any items to your favorites</p>
                                </div>
                            ) : (
                                <Table data={renderDataTable(tableData(), true)} header={renderTableHeader} />
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="all-crypto" title="All crypto">
                        <div className="table-mobile-wrapper">
                            <Table data={renderDataTable(tableData(), false)} header={renderTableHeader} />
                        </div>
                    </Tab>
                    {spotMarket.length > 0 && (
                        <Tab eventKey="spot" title="Spot">
                            <div className="table-mobile-wrapper">
                                <Table data={renderDataTable(tableData(), true)} header={renderTableHeader} />
                            </div>
                        </Tab>
                    )}
                    {futureMarket.length > 0 && (
                        <Tab eventKey="future" title="Future">
                            <div className="table-mobile-wrapper">
                                <Table data={renderDataTable(tableData(), true)} header={renderTableHeader} />
                            </div>
                        </Tab>
                    )}
                    {newListingMarket.length > 0 && (
                        <Tab eventKey="new-listing" title="New Listing">
                            <div className="table-mobile-wrapper">
                                <Table data={renderDataTable(tableData(), false)} header={renderTableHeader} />
                            </div>
                        </Tab>
                    )}
                </Tabs>
            </div>
        </React.Fragment>
    );
};

export { MarketListlMobileScreen };
