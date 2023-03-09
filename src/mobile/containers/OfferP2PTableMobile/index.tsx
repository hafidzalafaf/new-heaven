import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab, Dropdown } from 'react-bootstrap';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import moment from 'moment';
import { CustomStylesSelect, NoData } from '../../../desktop/components';
import { Loading, Table } from '../../../components';
import { HideIcon, GreyCheck, ActiveCheck, VerificationIcon, MobileMoreArrow } from '../../../assets/images/P2PIcon';
import { Link, useHistory } from 'react-router-dom';
import { orderFetch, selectP2POrder, selectP2POrderLoading, p2pFiatFetch, selectP2PFiatsData, selectP2PUserAccountOffer, p2pOfferFetch, p2pUserOfferFetch, selectP2PUserAccountOfferCancelSuccess } from 'src/modules';
import { capitalizeFirstLetter } from 'src/helpers';
import './OrderP2PTableMobile.pcss'

export const OfferP2PTableMobile = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const order = useSelector(selectP2POrder);
    const offer = useSelector(selectP2PUserAccountOffer);
    const fiats = useSelector(selectP2PFiatsData);
    const cancelPaymentSuccess = useSelector(selectP2PUserAccountOfferCancelSuccess);


    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [side, setSide] = React.useState('');
    const [state, setState] = React.useState('');
    const [tab, setTab] = React.useState('processing');
    const [data, setData] = React.useState([]);
    const [orderLoading, setOrderLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

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
                state: state
            })
        );
        if (cancelPaymentSuccess){
            console.log(cancelPaymentSuccess)
            // setShowModalCancelOffer(false)
        }
    }, [dispatch, side, cancelPaymentSuccess, state, fiat]);

    React.useEffect(() => {
        setOrderLoading(true);
        setTimeout(() => {
            setOrderLoading(false);
        }, 3000);
    }, []);

    React.useEffect(() => {
        const fiatDatePayload = {
            fiat,
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
            fiat,
            side,
            state,
            from: time_from,
            to: time_to,
        };
        dispatch(
            orderFetch(
                fiat
                    ? { fiat }
                    : side
                    ? { side }
                    : state
                    ? { state }
                    : startDate && endDate
                    ? { from: time_from, to: time_to }
                    : fiat && side
                    ? { fiat, side }
                    : fiat && state
                    ? { fiat, state }
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
                        ? { fiat }
                        : side
                        ? { side }
                        : state
                        ? { state }
                        : startDate && endDate
                        ? { from: time_from, to: time_to }
                        : fiat && side
                        ? { fiat, side }
                        : fiat && state
                        ? { fiat, state }
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
                ? order.filter((item) => item?.state == 'accepted' || item?.state == 'success')
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
    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
    });

    console.log(offer, 'offer')
    const FilterredItem = ({data}) => {
        console.log(data, 'data inside')
       return (
        <React.Fragment>
        {
        data?.map((item)=>
            <div className='d-flex flex-column com-mobile-card-order-list gap-20 border-bottom border-white p-2 grey-text'>
                {/* <div className='d-flex align-items-center gap-8 my-2'>
                    <div className='ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold'>{item.trades.username.slice(0, 1).toUpperCase()}</div>
                    <span className='m-0 p-0 text-ms grey-text-accent'>{item.trades.username}</span>
                    <span>
                    <VerificationIcon />
                    </span>
                </div> */}
                <div className='d-flex flex-row justify-content-between'>
                    <div>
                    <span className={item?.side === `buy` ? `contrast-text` : `danger-text`}>{capitalizeFirstLetter(item?.side)} </span>
                    <span className='grey-text-accent font-bold'>{item?.currency?.name?.toUpperCase()}</span>
                    </div>

                    <div>
                    <span className={item?.state === 'success' ? `gradient-text` : item?.state.includes('cancel') ? `danger-text` : ``}>{capitalizeFirstLetter(item?.state)}</span>
                    <MobileMoreArrow className={''}/>
                    </div>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <span>Coin</span>
                    <div className='d-flex flex-row align-items-center'>
                        <img 
                            height={24}
                            width={24}
                            src={item?.fiat.icon_url}
                            alt={item?.fiat.name}
                        />
                        <span className='grey-text-accent font-bold ml-1'>{item?.fiat.name}</span>
                    </div>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <span>Date</span>
                    <span>{moment(item?.created_at).format('DD/MM/YYYY')}</span>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <span>Amount</span>
                    <span>{item?.price}</span>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <span>Crypto Amount</span>
                    <span>{item?.amount}</span>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                    <span>Order ID</span>
                    <span>{item?.order_number}</span>
                </div>
                <button className='btn-secondary radius-lg my-2'>Cancel</button>
            </div>
    )}
    </React.Fragment>
)}

    return (
        <React.Fragment>
            <div className="com-order-p2p-table">
                <div className="d-flex justify-content-between align-items-start mb-24">
                    <div className="position-relative w-100">
                    {orderLoading ? (
                                    <Loading />
                                ) : (
                                    <FilterredItem data={offer}/>
                                )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
