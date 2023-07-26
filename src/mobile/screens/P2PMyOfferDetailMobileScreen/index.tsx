import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { MobileFilterIcon } from 'src/assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile';
import {
    P2PUserOfferDetail,
    p2pUserOfferDetailFetch,
    selectP2PFiatsData,
    selectP2PUserAccountOfferDetail,
    selectCurrencies,
} from 'src/modules';
import { CustomStylesSelect } from 'src/desktop/components';
import Select from 'react-select';

export const P2PMyOfferDetailMobileScreen = () => {
    const { offer_number = '' } = useParams<{ offer_number?: string }>();
    const [data, setData] = useState([]);
    const [side, setSide] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [state, setState] = React.useState('');
    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    const dispatch = useDispatch();
    const history = useHistory();

    const offerDetail: P2PUserOfferDetail = useSelector(selectP2PUserAccountOfferDetail);

    const optionState = [
        { label: <p className="m-0 text-sm grey-text-accent">All Status</p>, value: '' },
        { label: <p className="m-0 text-sm grey-text-accent">Prepared</p>, value: 'prepare' },
        { label: <p className="m-0 text-sm grey-text-accent">Waiting</p>, value: 'waiting' },
        { label: <p className="m-0 text-sm grey-text-accent">Rejected</p>, value: 'rejected' },
        { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
        { label: <p className="m-0 text-sm grey-text-accent">Success</p>, value: 'success' },
        { label: <p className="m-0 text-sm grey-text-accent">Acepted</p>, value: 'accepted' },
    ];

    React.useEffect(() => {
        const payloadState = {
            offer_number: offer_number,
            state: state,
        };

        const payloadDate = {
            offer_number: offer_number,
            from: time_from,
            to: time_to,
        };

        const payloadFull = {
            offer_number: offer_number,
            state: state,
            from: time_from,
            to: time_to,
        };

        const payloadDefault = {
            offer_number: offer_number,
        };

        dispatch(
            p2pUserOfferDetailFetch(
                state && offer_number
                    ? payloadState
                    : startDate && endDate && offer_number
                    ? payloadDate
                    : state && startDate && endDate && offer_number
                    ? payloadFull
                    : payloadDefault
            )
        );
        setLoading(false);
    }, [dispatch, startDate, endDate, state, time_from, time_to, offer_number]);

    React.useEffect(() => {
        setData(offerDetail?.order);
        setSide(offerDetail?.offer?.side);
    }, [offerDetail]);

    return (
        <section className="pg-mobile-screen-p2p mobile-container">
            <div className="d-flex justify-content-between align-items-center mb-32 position-relative">
                <span onClick={() => history.goBack()} className="back">
                    <ArrowLeft className={'cursor-pointer'} />
                </span>
                <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Offer Detail</p>
                <span onClick={() => setShowFilter(!showFilter)}>
                    <MobileFilterIcon className={'cursor-pointer'} />
                </span>
            </div>
            <OfferP2PTableMobile type="detail" data={data} loading={loading} side={side} />
            <div id="off-canvas-filter" className={`position-fixed off-canvas-filter ${showFilter ? 'show' : ''}`}>
                <div className="fixed-bottom off-canvas-content-container-filter overflow-auto">
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
        </section>
    );
};
