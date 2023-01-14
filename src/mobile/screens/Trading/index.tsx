import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { TradingViewEmbed, widgetType } from 'react-tradingview-embed';
import { useMarketsFetch, useMarketsTickersFetch, useDocumentTitle } from '../../../hooks';
import {
    selectCurrencies,
    selectMarketTickers,
    MarketsTickersData,
    Currency,
    selectMarkets,
    Market,
    selectUserLoggedIn,
} from '../../../modules';
import { Decimal } from '../../../components';
import { ModalFullScreenMobile } from 'src/mobile/components';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {
    ArrowDownIcon,
    BuyIcon,
    DotsIcon,
    HistoryIcon,
    InformationIcon,
    MinusIcon,
    PlusIcon,
    SellIcon,
    SidebarMenuIcon,
} from '../../assets/Trading';
import { FilterInput } from 'src/desktop/components';
import Select from 'react-select';
import { CustomStylesSelect } from 'src/desktop/components';
import { Table } from '../../../components';

export const TradingMobileScreen: React.FC = (): React.ReactElement => {
    const { currency } = useParams<{ currency?: string }>();
    const [marketType, setMerketType] = React.useState('buy');
    const [showTrading, setShowTrading] = React.useState(false);
    const [showSidebar, setShowSidebar] = React.useState(false);
    const [key, setKey] = React.useState('USDT');
    const isLoggedin = useSelector(selectUserLoggedIn);
    useDocumentTitle('Trading');

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">Limit Order</p>, value: 'limit-order' },
        { label: <p className="m-0 text-sm grey-text-accent">Market</p>, value: 'market' },
    ];

    const SidebarData = [
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
        {
            currency: 'BTC',
            pair: 'USDT',
            x: '5X',
            price: '1505.79',
            change: '-2.99%',
        },
    ];

    const renderHeaderData = [<p>Pair</p>, <p className="text-right">Price 24h Change</p>];

    const renderSidebarData = (data) => {
        return data.map((item) => [
            <div className="td-pair d-flex align-items-center">
                <p className="mb-0">
                    {item.currency} <span>/USDT</span>
                </p>
                <div className="tag-pair">5X</div>
            </div>,
            <div className="td-price d-flex flex-column justify-content-end align-items-end w-full">
                <h4>1505.79</h4>
                <h5>-2.99%</h5>
            </div>,
        ]);
    };

    return (
        <React.Fragment>
            <div className="mobile-container trading-screen no-header position-relative dark-bg-main">
                <div className="d-flex justify-content-between align-items-center mb-3 ">
                    <div className="d-flex align-items-center menu-title">
                        <div className="cursor-pointer" onClick={() => setShowSidebar(true)}>
                            <SidebarMenuIcon />
                        </div>
                        <h1 className="mb-0">BTC/BIDR</h1>
                        <div className="badge-primary">+2.00%</div>
                    </div>
                    <div className="d-flex align-items-center menu-expand">
                        <div className="cursor-pointer more">
                            <DotsIcon />
                        </div>
                        <div
                            id="expand-trade-view"
                            className="d-flex expand-container cursor-pointer"
                            onClick={() => setShowTrading(!showTrading)}>
                            <p className="m-0">Expand</p>
                            <ArrowDownIcon />
                        </div>
                    </div>
                </div>
                {showTrading && (
                    <TradingViewEmbed
                        widgetType={widgetType.ADVANCED_CHART}
                        widgetConfig={{
                            colorTheme: 'dark',
                            symbol: currency,
                            width: '100%',
                            height: '400',
                        }}
                    />
                )}
                <div className="d-flex justify-content-between align-items-start trade-container w-100 ">
                    <div className={`buy-sell-container  ${isLoggedin ? '' : 'blur-effect blur-mobile'}`}>
                        <ul className="nav nav-pills w-100" id="pills-tab" role="tablist">
                            <li
                                className={`nav-item buy ${marketType == 'buy' && 'active'}`}
                                id="buy-tab"
                                onClick={() => setMerketType('buy')}>
                                <a className={`nav-link buy ${marketType == 'buy' && 'active'}`}>Buy</a>
                            </li>
                            <li
                                className={`nav-item sell ${marketType == 'sell' && 'active'}`}
                                id="sell-tab"
                                onClick={() => setMerketType('sell')}>
                                <a className={`nav-link sell ${marketType == 'sell' && 'active'}`}>Sell</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <form
                                className="tab-pane fade show active"
                                id="pills-buy"
                                role="tabpanel"
                                aria-labelledby="pills-buy-tab">
                                <div className="dropdown w-100 mb-8">
                                    <Select
                                        value={optionStatus.filter(function (option) {
                                            return option.value === 'limit-order';
                                        })}
                                        styles={CustomStylesSelect}
                                        options={optionStatus}
                                    />
                                </div>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="1518.72" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                <p className="m-0 mb-8 amount">= Rp 234,009,833</p>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Amount BTC" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                <div className="badge-container d-flex justify-content-between align-items-center flex-wrap mb-8">
                                    <div className="badge">25%</div>
                                    <div className="badge">50%</div>
                                    <div className="badge">75%</div>
                                    <div className="badge">100%</div>
                                </div>
                                <div className="input-group mb-8">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <PlusIcon />
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Total BIDR" />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <MinusIcon />
                                        </span>
                                    </div>
                                </div>
                                {marketType == 'buy' ? (
                                    <button
                                        type="button"
                                        className="btn-primary btn-buy btn-block"
                                        data-toggle="modal"
                                        disabled={!isLoggedin}
                                        data-target="#modal-confirm-buy">
                                        Buy
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-danger btn-sell btn-block"
                                        data-toggle="modal"
                                        disabled={!isLoggedin}
                                        data-target="#modal-confirm-buy">
                                        Buy
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className=" trading-view-container position-relative">
                        <div className="table-background position-absolute w-100">
                            <div className="table-background-row row-danger" style={{ width: '70%' }} />
                            <div className="table-background-row row-danger" style={{ width: '30%' }} />
                            <div className="table-background-row row-danger" style={{ width: '50%' }} />
                            <div className="table-background-row row-danger" style={{ width: '40%' }} />
                            <div className="table-background-row row-danger" style={{ width: '80%' }} />
                            <div className="table-background-row row-danger" style={{ width: '40%' }} />
                            <div className="table-background-row row-danger" style={{ width: '100%' }} />
                            <div className="table-background-row row-danger" style={{ width: '30%' }} />
                            <div className="table-background-row row-primary" style={{ width: '90%' }} />
                            <div className="table-background-row row-primary" style={{ width: '50%' }} />
                            <div className="table-background-row row-primary" style={{ width: '60%' }} />
                            <div className="table-background-row row-primary" style={{ width: '30%' }} />
                            <div className="table-background-row row-primary" style={{ width: '80%' }} />
                            <div className="table-background-row row-primary" style={{ width: '100%' }} />
                            <div className="table-background-row row-primary" style={{ width: '30%' }} />
                            <div className="table-background-row row-primary" style={{ width: '60%' }} />
                        </div>
                        <table className="table table-borderless w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Price (BIDR)</th>
                                    <th scope="col" className="text-right">
                                        Quantity(BTC)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price danger">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                                <tr>
                                    <td className="td-price primary">323,451,889</td>
                                    <td className="td-qty">0.092390</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center sorting-container w-100 mb-16">
                    <div className="d-flex justify-content-between align-items-center sorting-left-container">
                        <p className="sorting-by m-0">Sorting by:</p>
                        <div className="d-flex align-items-center sort-buy">
                            <p className="m-0">Buy</p>
                            <BuyIcon />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center sorting-right-container">
                        <div className="d-flex align-items-center sort-sell">
                            <p className="m-0">Sell</p>
                            <SellIcon />
                        </div>
                        <div className="d-flex align-items-center hide-pairs">
                            <img src="../../assets/icons/checkbox.svg" alt="pairs" width={10} height={10} />
                            <p className="mb-0">Hide all pairs</p>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center table-container w-100 mb-16">
                    <div className="d-flex align-items-center table-head-container">
                        <p>Date</p>
                        <p>Pair</p>
                        <p>Type</p>
                        <p>Price</p>
                        <p>Filled</p>
                        <p>Total</p>
                    </div>
                    <Link to="/history-transaction">
                        <div className="d-flex align-items-center all-order">
                            <p className="mb-0">All Order</p>
                            <HistoryIcon />
                        </div>
                    </Link>
                </div>
                <div className="no-order text-center"> You have no order</div>

                {/* OFF CANVAS SIDEBAR */}
                <div
                    id="sidebar"
                    className={`position-absolute w-100 overflow-auto sidebar-wrapper ${showSidebar && 'active'}`}>
                    <div className="sidebar d-flex justify-content-between align-items-start w-100">
                        <div className="sidebar-container">
                            <div className="sidebar-head mb-24">
                                <h1>Trade</h1>
                            </div>
                            <div className="search-container w-100 mb-16">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                    />
                                    <div className="input-group-append">
                                        {/* <FilterInput
                                                data={wallets}
                                                onFilter={handleFilter}
                                                filter={searchFilter}
                                                placeholder={formatMessage({ id: 'page.body.wallets.overview.seach' })}
                                                className="search-wallet"
                                            /> */}
                                    </div>
                                </div>
                            </div>
                            <Tabs
                                id="controlled-tab-example"
                                defaultActiveKey="all-crypto"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="">
                                <Tab eventKey="USDT" title="USDT">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="FIAT" title="FIAT">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="BNB" title="BNB">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="BTC" title="BTC">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                                <Tab eventKey="ALTS" title="ALTS">
                                    <div className="table-mobile-wrapper">
                                        <Table data={renderSidebarData(SidebarData)} header={renderHeaderData} />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                        <div
                            id="close-sidebar"
                            className="sidebar-close cursor-pointer"
                            onClick={() => setShowSidebar(false)}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
