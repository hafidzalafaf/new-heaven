import * as React from 'react';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../components';
import { Loading, Table } from '../../../components';
import { HideIcon } from '../../../assets/images/P2PIcon';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from 'src/helpers';

export interface OfferP2PTableProps {
    type: string;
    fiat: string;
    state: string;
    side: string;
    startDate: string | number;
    endDate: string | number;
    data: any;
    fiats: any;
    loading: boolean;
    handleShowModalCancel?: (e: string) => void;
    handleChangeFiat: (e: string) => void;
    handleChangeState: (e: string) => void;
    handleChangeSide: (e: string) => void;
    handleChangeStartDate: (e: string) => void;
    handleChangeEndDate: (e: string) => void;
}

export const OfferP2PTable: React.FunctionComponent<OfferP2PTableProps> = (props) => {
    const {
        type,
        fiat,
        state,
        side,
        startDate,
        endDate,
        data,
        fiats,
        loading,
        handleShowModalCancel,
        handleChangeFiat,
        handleChangeState,
        handleChangeSide,
        handleChangeStartDate,
        handleChangeEndDate,
    } = props;
    // fiat, side, state, from, to
    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
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
        return [
            `${type === 'offer' ? 'Offer' : 'Order'} Type`,
            'Coin',
            'Amount',
            'Sale',
            `Available`,
            'Status',
            'Action',
        ];
    };

    const getTableData = (data) => {
        return data?.map((item) => [
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
                <p className="white-text text-sm font-semibold m-0 p-0">{item?.fiat?.name?.toUpperCase()}</p>
            </div>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item?.stats_offer?.bought}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">{item?.stats_offer?.sold}</p>,
            <p className="m-0 p-0 white-text text-sm font-semibold">
                {item?.available_amount} {item?.currency?.name?.toUpperCase()}
            </p>,
            <p className={`m-0 p-0 text-sm font-semibold ${item.state === 'canceled' ? `danger-text` : `white-text`}`}>
                {type === 'detail' || type === 'offer' ? item.state : capitalizeFirstLetter(item?.side)}
            </p>,
            <div className="d-flex align-items-center gap-24">
                <Link
                    to={
                        type == 'offer' ? `/p2p/offer/${item?.offer_number}` : `/p2p/wallet/order/${item?.order_number}`
                    }
                    className="d-flex align-items-center cursor-pointer mr-8">
                    <p className="m-0 p-0 mr-6 text-xs grey-text">Detail</p>
                    <HideIcon />
                </Link>
                {type === 'offer' && (
                    <button
                        disabled={item?.state === 'canceled'}
                        onClick={() => handleShowModalCancel(item?.offer_number)}
                        className={`btn-transparent m-0 px-3 py-2 mr-6 text-xs ${
                            item?.state === 'canceled' ? `white-text` : `gradient-text`
                        }`}>
                        Cancel
                    </button>
                )}
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
                        onChange={(e) => handleChangeFiat(e.value)}
                    />
                </div>

                <div className="w-20">
                    <p className="m-0 p-0 mb-8 white-text text-xxs font-bold">
                        {type == 'offer' ? 'Offer' : 'Order'} Type
                    </p>
                    <Select
                        value={optionSide.filter(function (option) {
                            return option.value === side;
                        })}
                        styles={CustomStylesSelect}
                        options={optionSide}
                        onChange={(e) => handleChangeSide(e.value)}
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
                        onChange={(e) => handleChangeState(e.value)}
                    />
                </div>

                <div className="w-20">
                    <label className="m-0 p-0 mb-8 white-text text-xxs font-bold">Start Date</label>
                    <input
                        type="date"
                        className="form-control mb-24"
                        onChange={(e) => {
                            handleChangeStartDate(e.target.value);
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
                            handleChangeEndDate(e.target.value);
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
                        <div className="w-100">{renderFilter()}</div>
                        {loading ? <Loading /> : <Table header={getTableHeaders()} data={getTableData(data)} />}
                        {(!data || !data[0]) && !loading && (
                            <NoData text={type === 'offer' ? 'No Offer Yet' : 'No Order Yet'} />
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
