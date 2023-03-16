import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { MobileFilterIcon } from 'src/assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile';
import { P2PUserOfferDetail, p2pUserOfferDetailFetch, selectP2PFiatsData, selectP2PUserAccountOfferDetail } from 'src/modules';
import { CustomStylesSelect } from 'src/desktop/components';
import Select from 'react-select';
interface offer_number {
    uid: string;
}

export const P2PMyOfferDetailMobileScreen = () => {
    const [data, setData] = useState([]);
    const [side, setSide] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [state, setState] = React.useState('');



    const dispatch = useDispatch();
    const history = useHistory();
    const offer_number: offer_number = useParams();
    const offerDetail: P2PUserOfferDetail = useSelector(selectP2PUserAccountOfferDetail);
    const fiats = useSelector(selectP2PFiatsData);


    const optionFiats = fiats?.map((item) => {
      return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
  });

    const optionState = [
      { label: <p className="m-0 text-sm grey-text-accent">All Status</p>, value: '' },
      { label: <p className="m-0 text-sm grey-text-accent">Active</p>, value: 'active' },
      { label: <p className="m-0 text-sm grey-text-accent">Canceled</p>, value: 'canceled' },
    ];

    const optionSide = [
      { label: <p className="m-0 text-sm grey-text-accent">Buy</p>, value: 'buy' },
      { label: <p className="m-0 text-sm grey-text-accent">Sell</p>, value: 'sell' },
  ];

    React.useEffect(() => {
        dispatch(
            p2pUserOfferDetailFetch({
                offer_number: offer_number?.uid,
            })
        );
        setLoading(false);
    }, [dispatch]);

    React.useEffect(() => {
        setData(offerDetail?.order);
        setSide(offerDetail?.offer?.side);
    }, [offerDetail]);

    return (
        <section className="pg-mobile-screen-p2p mobile-container">
            <div
                className="d-flex justify-content-between align-items-center mb-32 position-relative">
                <span
                onClick={() => history.goBack()}
                className="back">
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
        </section>
    );
};
