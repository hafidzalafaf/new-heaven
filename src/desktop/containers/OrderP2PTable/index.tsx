import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../../desktop/components';
import { Loading, Table } from '../../../components';
import { HideIcon, GreyCheck, ActiveCheck } from '../../../assets/images/P2PIcon';
import { Link, useHistory } from 'react-router-dom';
import {
    orderFetch,
    selectP2POrder,
    selectP2POrderLoading,
    p2pFiatFetch,
    selectP2PFiatsData,
    selectCurrencies,
} from 'src/modules';
import { Modal } from '../../../desktop/components';
import { capitalizeFirstLetter } from 'src/helpers';

export const OrderP2PTable = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const order = useSelector(selectP2POrder);
    const loading = useSelector(selectP2POrderLoading);
    const fiats = useSelector(selectP2PFiatsData);
    const currencies = useSelector(selectCurrencies);

    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [side, setSide] = React.useState('');
    const [state, setState] = React.useState('');
    const [tab, setTab] = React.useState('processing');
    const [data, setData] = React.useState([]);
    const [orderLoading, setOrderLoading] = React.useState(false);

    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setOrderLoading(true);
        setTimeout(() => {
            setOrderLoading(false);
        }, 3000);
    }, []);

    React.useEffect(() => {
        const fiatDatePayload = {
            currency: fiat,
            from: time_from,
            to: time_to,
        };

        const sideDatePayload = {
            side,
            from: time_from,
            to: time_to,
        };

        const stateDatePayload = {
            state,
            from: time_from,
            to: time_to,
        };

        const fullPayload = {
            currency: fiat,
            side,
            state,
            from: time_from,
            to: time_to,
        };
        dispatch(
            orderFetch(
                fiat
                    ? { currency: fiat }
                    : side
                    ? { side }
                    : state
                    ? { state }
                    : startDate && endDate
                    ? { from: time_from, to: time_to }
                    : fiat && side
                    ? { currency: fiat, side }
                    : fiat && state
                    ? { currency: fiat, state }
                    : fiat && startDate && endDate
                    ? fiatDatePayload
                    : side && state
                    ? { side, state }
                    : side && startDate && endDate
                    ? sideDatePayload
                    : state && startDate && endDate
                    ? stateDatePayload
                    : fiat && side && state && startDate && endDate
                    ? fullPayload
                    : null
            )
        );
        const fetchInterval = setInterval(() => {
            dispatch(
                orderFetch(
                    fiat
                        ? { currency: fiat }
                        : side
                        ? { side }
                        : state
                        ? { state }
                        : startDate && endDate
                        ? { from: time_from, to: time_to }
                        : fiat && side
                        ? { currency: fiat, side }
                        : fiat && state
                        ? { currency: fiat, state }
                        : fiat && startDate && endDate
                        ? fiatDatePayload
                        : side && state
                        ? { side, state }
                        : side && startDate && endDate
                        ? sideDatePayload
                        : state && startDate && endDate
                        ? stateDatePayload
                        : fiat && side && state && startDate && endDate
                        ? fullPayload
                        : null
                )
            );
        }, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dispatch, startDate, endDate, state, fiat, side, time_from, time_to]);

    React.useEffect(() => {
        setData(
            tab == 'done'
                ? order.filter(
                      (item) =>
                          item?.state == 'accepted' || item?.state == 'success' || item?.state?.includes('canceled')
                  )
                : tab == 'processing'
                ? order.filter(
                      (item) =>
                          item?.state == 'waiting' ||
                          item?.state?.includes('waiting') ||
                          item?.state == 'prepare' ||
                          item?.state == 'rejected'
                  )
                : order
        );
    }, [order, tab]);

    const handleSelect = (k) => {
        setTab(k);
    };

    // fiat, side, state, from, to
    const optionFiats = currencies?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.id?.toUpperCase()}</p>, value: item.id };
    });

    const optionState = [
        { label: <p className="m-0 text-sm grey-text-accent">All Status</p>, value: '' },
        { label: <p className="m-0 text-sm grey-text-accent">Prepared</p>, value: 'prepare' },
        { label: <p className="m-0 text-sm grey-text-accent">Waiting</p>, value: 'waiting' },
        { label: <p className="m-0 text-sm grey-text-accent">Rejected</p>, value: 'rejected' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
        { label: <p className="m-0 text-sm grey-text-accent">Success</p>, value: 'success' },
        { label: <p className="m-0 text-sm grey-text-accent">Acepted</p>, value: 'accepted' },
    ];

    const optionSide = [
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
            <Link
                to={`/p2p/profile/${item?.trades?.uid}`}
                className="m-0 p-0 text-underline blue-text text-sm font-semibold cursor-pointer">
                {item?.trades?.uid}
            </Link>,
            <p
                className={`m-0 p-0 text-sm font-semibold ${
                    item?.state == 'success' || item?.state == 'accepted'
                        ? 'contrast-text'
                        : item?.state?.includes('waiting')
                        ? 'warning-text'
                        : item?.state == 'prepare'
                        ? 'blue-text'
                        : 'danger-text'
                }`}>
                {capitalizeFirstLetter(item?.state)}
            </p>,
            <div className="d-flex align-items-center">
                <div
                    onClick={() => history.push(`/p2p/wallet/order/${item?.order_number}`, { side: item?.side })}
                    className="d-flex align-items-center cursor-pointer mr-8">
                    <p className="m-0 p-0 mr-6 text-xs grey-text">Order</p>
                    <HideIcon />
                </div>
            </div>,
        ]);
    };

    const renderFilter = () => {
        return (
            <div className="d-flex justify-content-start align-items-center w-100 filter-container">
                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Coins</p>
                    <Select
                        value={optionFiats.filter(function (option) {
                            return option.value === fiat;
                        })}
                        styles={CustomStylesSelect}
                        options={optionFiats}
                        onChange={(e) => setFiat(e.value)}
                    />
                </div>

                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Order Type</p>
                    <Select
                        value={optionSide.filter(function (option) {
                            return option.value === side;
                        })}
                        styles={CustomStylesSelect}
                        options={optionSide}
                        onChange={(e) => setSide(e.value)}
                    />
                </div>

                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">Status</p>
                    <Select
                        value={optionState.filter(function (option) {
                            return option.value === state;
                        })}
                        styles={CustomStylesSelect}
                        options={optionState}
                        onChange={(e) => setState(e.value)}
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
                        value={startDate}
                        defaultValue={new Date().toISOString().slice(0, 10)}
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
                        value={endDate}
                        defaultValue={new Date().toISOString().slice(0, 10)}
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
                        <Tabs
                            defaultActiveKey="all"
                            activeKey={tab}
                            onSelect={(k) => handleSelect(k)}
                            id="fill-tab-example"
                            className="mb-3 w-70"
                            fill>
                            <Tab eventKey="all" title="All Orders">
                                <div className="w-100">{renderFilter()}</div>
                                {orderLoading ? (
                                    <Loading />
                                ) : (
                                    <Table header={getTableHeaders()} data={getTableData(data)} />
                                )}

                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="processing" title="Processing">
                                <div className="w-100">{renderFilter()}</div>
                                {orderLoading ? (
                                    <Loading />
                                ) : (
                                    <Table header={getTableHeaders()} data={getTableData(data)} />
                                )}
                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="done" title="Transaction Done">
                                <div className="w-100">{renderFilter()}</div>
                                {orderLoading ? (
                                    <Loading />
                                ) : (
                                    <Table header={getTableHeaders()} data={getTableData(data)} />
                                )}
                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
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
            </div>
        </React.Fragment>
    );
};
