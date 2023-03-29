import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { MobileFilterIcon } from 'src/assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { PaginationMobile } from 'src/mobile/components';
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile';
import {
    selectP2PUserAccountOffer,
    selectP2PFiatsData,
    selectP2PUserAccountOfferCancelSuccess,
    p2pFiatFetch,
    p2pUserOfferFetch,
    orderFetch,
    selectP2PUserAccountOfferNextPageExists,
    p2pUserOfferCancel,
    selectCurrencies,
} from 'src/modules';
import { ModalMobile } from 'src/mobile/components';
import { CloseIconFilter } from 'src/assets/images/CloseIcon';
import { CustomStylesSelect } from 'src/desktop/components';
import Select from 'react-select';

const P2PMyOfferMobileScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const offer = useSelector(selectP2PUserAccountOffer);
    const fiats = useSelector(selectP2PFiatsData);
    const currencies: any = useSelector(selectCurrencies);
    const cancelOfferSuccess = useSelector(selectP2PUserAccountOfferCancelSuccess);
    const nextPageExists = useSelector(selectP2PUserAccountOfferNextPageExists);

    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [side, setSide] = React.useState('');
    const [state, setState] = React.useState('');
    const [orderLoading, setOrderLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [limit, setLimit] = React.useState(5);
    const [idCancel, setIdCancel] = React.useState('');
    const [showCancel, setShowCancel] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);

    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        dispatch(
            p2pUserOfferFetch({
                currency: fiat,
                amount: '',
                max_amount: '',
                min_price: '',
                max_price: '',
                side: side,
                state: state,
                pageIndex: currentPage,
                limit: 5,
            })
        );
        if (cancelOfferSuccess) {
            setShowCancel(false);
        }
    }, [dispatch, side, cancelOfferSuccess, state, fiat, currentPage]);

    React.useEffect(() => {
        setOrderLoading(true);
        setTimeout(() => {
            setOrderLoading(false);
        }, 3000);
    }, []);

    React.useEffect(() => {
        const payload = {
            currency: fiat,
            side: side,
            state: state,
            limit: 5,
            page: currentPage,
        };

        const payloadWithDate = {
            currency: fiat,
            side: side,
            state: state,
            limit: 5,
            page: currentPage,
            from: +time_from,
            to: +time_to,
        };

        dispatch(orderFetch(startDate && endDate ? payloadWithDate : payload));
        const fetchInterval = setInterval(() => {
            dispatch(orderFetch(startDate && endDate ? payloadWithDate : payload));
        }, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dispatch, startDate, endDate, state, fiat, side, time_from, time_to]);

    const handleCancelPayment = () => {
        dispatch(p2pUserOfferCancel({ payment_user_uid: idCancel }));
    };

    const optionFiats = currencies?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.id?.toUpperCase()}</p>, value: item.id };
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

    const handleShowCancelOffer = (id: string) => {
        setShowCancel(!showCancel);
        setIdCancel(id);
    };

    const renderModalCancel = () => {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center gap-16 w-100">
                <div className="d-flex align-items-end justify-content-end w-100">
                    <span className="cursor-pointer" onClick={() => setShowCancel(!showCancel)}>
                        <CloseIconFilter />
                    </span>
                </div>
                <div className="d-flex w-100 align-items-center justify-content-center">
                    <img src="/img/modal-alert.png" alt="cancel" />
                </div>
                <p className="m-0 p-0 text-ms contrast-text font-extrabold">Cancel Order</p>
                <p className="m-0 p-0 grey-text text-sm">Are you sure want to cancel?</p>
                <button
                    type="button"
                    onClick={handleCancelPayment}
                    disabled={!idCancel}
                    className="btn-primary w-100 white-text font-normal text-ms">
                    Cancel
                </button>
            </div>
        );
    };

    return (
        <section className="pg-mobile-screen-my-offer dark-bg-main mobile-container">
            <div className="d-flex justify-content-between align-items-center mb-32">
                <div onClick={history.goBack}>
                    <ArrowLeft className={'cursor-pointer'} />
                </div>
                <p className="m-0 p-0 grey-text-accent text-md font-extrabold">My Offers</p>
                <span onClick={() => setShowFilter(!showFilter)}>
                    <MobileFilterIcon className={'cursor-pointer'} />
                </span>
            </div>
            <OfferP2PTableMobile
                type="offer"
                data={offer}
                loading={orderLoading}
                handleShowCancelOffer={handleShowCancelOffer}
            />
            {!loading && (
                <PaginationMobile
                    firstElementIndex={currentPage * limit}
                    lastElementIndex={currentPage * limit}
                    page={currentPage}
                    onClickPrevPage={() => setCurrentPage(currentPage - 1)}
                    onClickNextPage={() => setCurrentPage(currentPage + 1)}
                    nextPageExists={nextPageExists}
                />
            )}

            <ModalMobile show={showCancel} content={renderModalCancel()} />

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

export { P2PMyOfferMobileScreen };
