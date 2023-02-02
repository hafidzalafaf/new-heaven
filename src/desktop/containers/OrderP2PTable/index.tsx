import * as React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect } from '../../../desktop/components';
import { Table } from '../../../components';
import { HideIcon } from '../../../assets/images/P2PIcon';
import { Link, useHistory } from 'react-router-dom';

export const OrderP2PTable = () => {
    const history = useHistory();
    const [endDate, setEndDate] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [data, setData] = React.useState([]);

    const dummy = [
        {
            type: 'sell',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
        {
            type: 'sell',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
        {
            type: 'sell',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
        {
            type: 'buy',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
        {
            type: 'sell',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
        {
            type: 'buy',
            coin: 'USDT',
            fiat_amount: '216,169.60 IDR',
            price: '15,710.00 IDR',
            crypto_amount: '13.76 USDT',
            counter_party: 'OAChanger',
            status: 'Completed',
            created_at: '2023-01-15T04:09:15Z',
        },
    ];

    React.useEffect(() => {
        setData(dummy);
    }, []);

    const filterredType = (type) => {
        let filterredList;
        let temp;
        temp = dummy;

        filterredList = temp.filter((item) => item.type === type);
        setData(filterredList);
    };

    const optionQuote = [
        { label: <p className="m-0 text-sm grey-text-accent">USDT</p>, value: 'usdt' },
        { label: <p className="m-0 text-sm grey-text-accent">IDR</p>, value: 'idr' },
        { label: <p className="m-0 text-sm grey-text-accent">BTC</p>, value: 'btc' },
        { label: <p className="m-0 text-sm grey-text-accent">TRX</p>, value: 'trx' },
    ];

    const optionStatus = [
        { label: <p className="m-0 text-sm grey-text-accent">All Status</p>, value: 'all' },
        { label: <p className="m-0 text-sm grey-text-accent">Processing</p>, value: 'processing' },
        { label: <p className="m-0 text-sm grey-text-accent">Done</p>, value: 'done' },
    ];

    const optionType = [
        { label: <p className="m-0 text-sm grey-text-accent">Buy</p>, value: 'buy' },
        { label: <p className="m-0 text-sm grey-text-accent">Sell</p>, value: 'sell' },
    ];

    const getTableHeaders = () => {
        return ['Order Type', 'Coin', 'Fiat Amount', 'Price', `Crypto Amount`, `Counter Party`, 'Status', 'Action'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <div>
                <p
                    className={`m-0 p-0 text-ms font-bold mb-4 ${
                        item.type === 'sell' ? 'danger-text' : 'contrast-text'
                    }`}>
                    {item.type === 'sell' ? 'Sell' : 'Buy'}
                </p>
                <p className="m-0 p-0 white-text text-xs">{moment(item.created_at).format('DD-MM-YYYY HH:MM:SS')}</p>
            </div>,
            <div className="d-flex align-items-center">
                <img src="/img/coin.png" alt={item.coin} className="mr-12" />
                <p className="white-text text-sm font-semibold m-0 p-0">{item.coin}</p>
            </div>,
            <p className="m-0 p-0 grey-text text-sm font-semibold">{item.fiat_amount}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item.price}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item.crypto_amount}</p>,
            <a
                target="_blank"
                rel="noreferrer"
                href={'https://api.heavenexchange.io/'}
                className="text-underline blue-text text-sm font-semibold">
                {item.counter_party}
            </a>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item.status}</p>,
            <div className="d-flex align-items-center">
                <div
                    onClick={() => history.push('/p2p/wallet/order', { type: item.type })}
                    className="d-flex align-items-center cursor-pointer mr-8">
                    <p className="m-0 p-0 mr-6 text-xs grey-text">Order</p>
                    <HideIcon />
                </div>
                <p className="m-0 p-0 mr-6 text-xs grey-text cursor-pointer">Cancel</p>
            </div>,
        ]);
    };

    const renderFilter = () => {
        return (
            <div className="d-flex justify-content-start align-items-center w-100 filter-container">
                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Coins</p>
                    <Select
                        // value={optionQuote.filter(function (option) {
                        //     return option.value === status;
                        // })}
                        styles={CustomStylesSelect}
                        options={optionQuote}
                        // onChange={(e) => {
                        //     setStatus(e.value);
                        //     filterredStatus(e.value);
                        // }}
                    />
                </div>

                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Order Type</p>
                    <Select
                        // value={optionQuote.filter(function (option) {
                        //     return option.value === status;
                        // })}
                        styles={CustomStylesSelect}
                        options={optionType}
                        onChange={(e) => {
                            filterredType(e.value);
                        }}
                    />
                </div>

                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Status</p>
                    <Select
                        // value={optionQuote.filter(function (option) {
                        //     return option.value === status;
                        // })}
                        styles={CustomStylesSelect}
                        options={optionStatus}
                        // onChange={(e) => {
                        //     setStatus(e.value);
                        //     filterredStatus(e.value);
                        // }}
                    />
                </div>

                <div className="w-20">
                    <label className="m-0 p-0 mb-8 white-text text-xxs font-bold">Start Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setStartDate(e.target.value);
                        }}
                    />
                </div>

                <div className="w-20">
                    <label className="m-0 p-0 mb-8 white-text text-xxs font-bold">End Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            setEndDate(e.target.value);
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="com-order-p2p-table">
                <div className="d-flex justify-content-between align-items-start mb-24">
                    <div className="position-relative w-100">
                        <Tabs defaultActiveKey="all" id="fill-tab-example" className="mb-3" fill>
                            <Tab eventKey="all" title="All Orders">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                            </Tab>
                            <Tab eventKey="processing" title="Processing">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                            </Tab>
                            <Tab eventKey="done" title="Transaction Done">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                            </Tab>
                        </Tabs>

                        <div className="position-absolute btn-warning white-text text-ms font-extrabold radius-sm cursor-pointer">
                            Unread Message (1)
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
