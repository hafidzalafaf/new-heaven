import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../../desktop/components';
import { Loading } from '../../../components';
import { VerificationIcon, MobileMoreArrow } from '../../../assets/images/P2PIcon';
import { useHistory } from 'react-router-dom';
import {
    orderFetch,
    selectP2POrder,
    selectP2POrderLoading,
    p2pFiatFetch,
    selectP2PFiatsData,
    selectCurrencies,
    alertPush,
} from 'src/modules';
import { copy } from 'src/helpers';
import { capitalizeFirstLetter } from 'src/helpers';
import './OrderP2PTableMobile.pcss';
import { MobileFilterIcon } from '../../../assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';

export const OrderP2PTableMobile = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const currencies: any = useSelector(selectCurrencies);
    const order = useSelector(selectP2POrder);
    const loading = useSelector(selectP2POrderLoading);
    const fiats = useSelector(selectP2PFiatsData);

    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [side, setSide] = React.useState('');
    const [state, setState] = React.useState('');
    const [tab, setTab] = React.useState('processing');
    const [data, setData] = React.useState([]);
    const [orderLoading, setOrderLoading] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
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
        setSide('');
        setState('');
        setFiat('');
        setStartDate('');
        setEndDate('');
    };

    // fiat, side, state, from, to
    const optionFiats = currencies?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item?.id?.toUpperCase()}</p>, value: item?.id };
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

    const FilterredItem = ({ data }) => {
        return (
            <React.Fragment>
                {data?.map((item) => (
                    <div className="d-flex flex-column com-mobile-card-order-list gap-20 border-b-1 p-2 grey-text">
                        <div className="d-flex align-items-center gap-8 my-2">
                            <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                                {item?.trades?.username
                                    ? item?.trades?.username?.slice(0, 1).toUpperCase()
                                    : item?.trades?.email?.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="m-0 p-0 text-ms grey-text-accent">
                                {' '}
                                {item?.trades?.username ? item?.trades?.username : item?.trades?.email}
                            </span>
                            <span>
                                <VerificationIcon />
                            </span>
                        </div>
                        <div
                            onClick={() =>
                                history.push(`/p2p/wallet/order/${item?.order_number}`, { side: item?.side })
                            }
                            className="d-flex flex-row justify-content-between cursor-pointer">
                            <div>
                                <span className={item?.side === `buy` ? `contrast-text` : `danger-text`}>
                                    {capitalizeFirstLetter(item?.side)}{' '}
                                </span>
                                <span className="grey-text-accent font-bold">
                                    {item?.currency?.name?.toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <span
                                    className={
                                        item?.state == 'success' || item?.state == 'accepted'
                                            ? 'contrast-text'
                                            : item?.state?.includes('waiting')
                                            ? 'warning-text'
                                            : item?.state == 'prepare'
                                            ? 'blue-text'
                                            : 'danger-text'
                                    }>
                                    {capitalizeFirstLetter(item?.state)}
                                </span>
                                <MobileMoreArrow className={''} />
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Coin</span>
                            <div className="d-flex flex-row align-items-center">
                                <img height={24} width={24} src={item?.fiat.icon_url} alt={item?.fiat.name} />
                                <span className="grey-text-accent font-bold ml-1">{item?.fiat.name}</span>
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Date</span>
                            <span>{moment(item?.created_at).format('YYYY-MM-DD hh:mm:ss')}</span>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Fiat Amount</span>
                            <span>{item?.fiat_amount}</span>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Price</span>
                            <span>{item?.price}</span>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Crypto Amount</span>
                            <span>{item?.amount}</span>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                            <span>Order ID</span>
                            <span>{item?.order_number}</span>
                        </div>
                    </div>
                ))}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="d-flex justify-content-between align-items-center mb-32">
                <span onClick={() => history.goBack()}>
                    <ArrowLeft className={'cursor-pointer'} />
                </span>
                <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Order History</p>
                <span onClick={() => setShowFilter(!showFilter)}>
                    <MobileFilterIcon className={'cursor-pointer'} />
                </span>
            </div>
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
                                {/* <div className="w-100">{renderFilter()}</div> */}
                                {orderLoading ? (
                                    <Loading />
                                ) : (
                                    // <Table header={getTableHeaders()} data={getTableData(data)} />

                                    <FilterredItem data={data} />
                                )}
                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="processing" title="Processing">
                                {orderLoading ? <Loading /> : <FilterredItem data={data} />}
                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
                            </Tab>
                            <Tab eventKey="done" title="Done">
                                {orderLoading ? <Loading /> : <FilterredItem data={data} />}
                                {(!data || !data[0]) && !orderLoading && <NoData text="No Order Yet" />}
                            </Tab>
                        </Tabs>
                    </div>
                </div>

                <div id="off-canvas-filter" className={`position-fixed off-canvas-filter ${showFilter ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-filter overflow-auto">
                        <div className="mb-24">
                            <label className="m-0 white-text text-sm mb-8">Select Coin</label>
                            <Select
                                value={optionFiats.filter(function (option) {
                                    return option.value === fiat;
                                })}
                                styles={CustomStylesSelect}
                                options={optionFiats}
                                onChange={(e) => setFiat(e.value)}
                            />
                        </div>

                        <div className="mb-24">
                            <label className="m-0 white-text text-sm mb-8">Order type</label>
                            <Select
                                value={optionSide.filter(function (option) {
                                    return option.value === side;
                                })}
                                styles={CustomStylesSelect}
                                options={optionSide}
                                onChange={(e) => setSide(e.value)}
                            />
                        </div>

                        <div className="mb-24">
                            <label className="m-0 white-text text-sm mb-8">Status</label>
                            <Select
                                value={optionState.filter(function (option) {
                                    return option.value === state;
                                })}
                                styles={CustomStylesSelect}
                                options={optionState}
                                onChange={(e) => setState(e.value)}
                            />
                        </div>

                        <div>
                            <label className="m-0 white-text text-sm mb-8">Start Date</label>
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

                        <div>
                            <label className="m-0 white-text text-sm mb-8">End Date</label>
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

                        <div className="d-flex justify-content-center align-items-center">
                            <button
                                onClick={() => {
                                    setShowFilter(!showFilter);
                                    setSide('');
                                    setState('');
                                    setFiat('');
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                type="button"
                                className="btn btn-reset grey-text-accent dark-bg-accent text-sm w-40 mr-8">
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                type="button"
                                className="btn-primary grey-text-accent text-sm font-normal w-40">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
