import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../../desktop/components';
import { Table } from '../../../components';
import { HideIcon, GreyCheck, ActiveCheck } from '../../../assets/images/P2PIcon';
import { Link, useHistory } from 'react-router-dom';
import { orderFetch, selectP2POrder, selectP2POrderLoading } from 'src/modules';
import { Modal } from '../../../desktop/components';
import { capitalizeFirstLetter } from 'src/helpers';

export const OrderP2PTable = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const order = useSelector(selectP2POrder);
    const loading = useSelector(selectP2POrderLoading)

    const [endDate, setEndDate] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [data, setData] = React.useState([]);
    const [active, setActive] = React.useState('');
    const [tab, setTab] = React.useState('all');
    const [showModalCancel, setShowModalCancel] = React.useState(false);

    React.useEffect(() => {
        dispatch(orderFetch());
        const fetchInterval = setInterval(()=>{
        dispatch(orderFetch());
        }, 5000)

        return ()=> {
            clearInterval(fetchInterval)
        }
    }, [dispatch]);

    React.useEffect(() => {
        setData(
            tab == 'done'
                ? order.filter((item) => item.state == 'accepted')
                : tab == 'processing'
                ? order.filter((item) => item.state == 'success' || item.state == 'waiting' || item.state == 'prepare')
                : order
        );
    }, [order, tab]);

    const handleSelect = (k) => {
        setTab(k);
    };

    const filterredType = (type) => {
        let filterredList;
        let temp;
        temp = data;

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
        { label: <p className="m-0 text-sm grey-text-accent">Prepared</p>, value: 'prepared' },
        { label: <p className="m-0 text-sm grey-text-accent">Waiting</p>, value: 'waiting' },
        { label: <p className="m-0 text-sm grey-text-accent">Rejected</p>, value: 'rejected' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
        { label: <p className="m-0 text-sm grey-text-accent">Success</p>, value: 'success' },
        { label: <p className="m-0 text-sm grey-text-accent">Acepted</p>, value: 'acepted' },
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
                        item.side === 'sell' ? 'danger-text' : 'contrast-text'
                    }`}>
                    {item.side === 'sell' ? 'Sell' : 'Buy'}
                </p>
                <p className="m-0 p-0 white-text text-xs">{moment(item?.created_at).format('DD-MM-YYYY hh:mm:ss')}</p>
            </div>,
            <div className="d-flex align-items-center">
                <img src={item?.fiat?.icon_url} alt={item?.fiat?.name} className="mr-12" height={32} width={32} />
                <p className="white-text text-sm font-semibold m-0 p-0">{item?.fiat?.name}</p>
            </div>,
            <p className="m-0 p-0 grey-text text-sm font-semibold">{item.fiat_amount}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item.price}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">
                {item?.amount} {item?.currency?.name?.toUpperCase()}
            </p>,
            // <a
            //     target="_blank"
            //     rel="noreferrer"
            //     href={'https://api.heavenexchange.io/'}
            //     className="text-underline blue-text text-sm font-semibold">
            //     {item?.trades?.uid}
            // </a>,
            <p className="m-0 p-0 text-underline blue-text text-sm font-semibold">{item?.trades?.uid}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{capitalizeFirstLetter(item?.state)}</p>,
            <div className="d-flex align-items-center">
                <div
                    onClick={() => history.push(`/p2p/wallet/order/${item?.order_number}`, { side: item?.side })}
                    className="d-flex align-items-center cursor-pointer mr-8">
                    <p className="m-0 p-0 mr-6 text-xs grey-text">Order</p>
                    <HideIcon />
                </div>
                <p onClick={() => setShowModalCancel(true)} className="m-0 p-0 mr-6 text-xs grey-text cursor-pointer">
                    Cancel
                </p>
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

    const renderModalCancel = () => {
        return (
            <div>
                <div className="w-100 d-flex align-items-center justify-content-center">
                    <img src="/img/warningp2p.png" alt="warning" width={68} height={68} className="mb-16" />
                </div>

                <p className="m-0 p-0 grey-text-accent text-sm">Tips</p>
                <ul className="m-0 p-0 grey-text-accent text-sm mb-16 pl-16">
                    <li>If you have already paid the seller, please do not cancel the order.</li>
                    <li>
                        If the seller cannot reply to the chat within 15 minutes, you will not be responsible for
                        canceling this order. This will not affect your completion rate. You can make up to 5
                        irresponsible cancellations in a day.
                    </li>
                    <li>
                        Your account will be SUSPENDED for the day if you exceed 3 responsible cancellation times in a
                        day.
                    </li>
                </ul>

                <div className="p-16 mb-16">
                    <p className="m-0 p-0 grey-text-accent text-sm">Why do you want to cancel the order?</p>
                    <div className="d-flex flex-column gap-16">
                        <div className="d-flex align-items-center gap-8">
                            {active == 'I dont want to trade anymore' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('I dont want to trade anymore')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">I dont want to trade anymore</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active ==
                            'I did not comply with the obligations related to the advertising trade terms and conditions' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setActive(
                                            'I did not comply with the obligations related to the advertising trade terms and conditions'
                                        )
                                    }>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">
                                I did not comply with the obligations related to the advertising trade terms and
                                conditions
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active == 'The seller asked for additional fees' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('The seller asked for additional fees')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">The seller asked for additional fees</p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active ==
                            'An issue with the sellers payment method resulted in an unsuccessful payment' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span
                                    onClick={() =>
                                        setActive(
                                            'An issue with the sellers payment method resulted in an unsuccessful payment'
                                        )
                                    }>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">
                                An issue with the sellers payment method resulted in an unsuccessful payment
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-8">
                            {active == 'Another reason' ? (
                                <span onClick={() => setActive('')}>
                                    <ActiveCheck />
                                </span>
                            ) : (
                                <span onClick={() => setActive('Another reason')}>
                                    <GreyCheck />
                                </span>
                            )}
                            <p className="m-0 p-0 grey-text text-sm">Another reason</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => setShowModalCancel(false)} className="btn-primary w-100">
                    Confirm
                </button>
            </div>
        );
    };

    return (
        <React.Fragment>
            <div className="com-order-p2p-table">
                <div className="d-flex justify-content-between align-items-start mb-24">
                    <div className="position-relative w-100">
                        <Tabs
                            defaultActiveKey="all"
                            activeKey={tab}
                            onSelect={(k) => handleSelect(k)}
                            id="fill-tab-example"
                            className="mb-3"
                            fill>
                            <Tab eventKey="all" title="All Orders">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                                {(!data || !data[0]) && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="processing" title="Processing">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                                {(!data || !data[0]) && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="done" title="Transaction Done">
                                <div className="w-100">{renderFilter()}</div>
                                <Table header={getTableHeaders()} data={getTableData(data)} />
                                {(!data || !data[0]) && <NoData text="No Order Yet" />}
                            </Tab>
                        </Tabs>

                        <div className="btn-warning-container position-absolute">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="warning"
                                    id="dropdown-basic"
                                    className="btn-warning white-text text-ms font-extrabold radius-sm cursor-pointer">
                                    Unread Message (8)
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Tabs defaultActiveKey="order" id="fill-tab-example" className="mb-3" fill>
                                        <Tab eventKey="order" title="Order">
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="offer" title="Offer">
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                            <div className="p-16 d-flex justify-content-between align-items-center notif-item">
                                                <div className="d-flex align-items-start justify-content-start gap-8">
                                                    <img src="/img/notif.svg" alt="notif" width={16} height={16} />
                                                    <div>
                                                        <p className="m-0 p-0 mb-4 grey-text text-sm font-semibold">
                                                            Buy USDT
                                                        </p>
                                                        <p className="m-0 p-0 grey-text-accent text-sm">Time</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="m-0 p-0 mb-4 grey-text text-sm">Completed</p>
                                                    <p className="m-0 p-0 grey-text text-sm">2022-12-16 08:54:57</p>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <Modal show={showModalCancel} content={renderModalCancel()} />
            </div>
        </React.Fragment>
    );
};
