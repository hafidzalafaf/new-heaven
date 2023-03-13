import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { OfferP2PTable } from 'src/desktop/containers'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile'
import { selectP2POrder, selectP2PUserAccountOffer, selectP2PFiatsData, selectP2PUserAccountOfferCancelSuccess, p2pFiatFetch, p2pUserOfferFetch, orderFetch } from 'src/modules'

const P2PMyOfferMobileScreen = () => {
  const history = useHistory()

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


  return (
    <section className='pg-mobile-screen-p2p mobile-container'>
      <div className="d-flex justify-content-between align-items-center mb-32">
        <div  onClick={history.goBack}>
        <ArrowLeft className={'cursor-pointer'} />
        </div>
        <p className="m-0 p-0 grey-text-accent text-md font-extrabold">My Offers</p>
        <MobileFilterIcon className={''}/>
      </div>
      <OfferP2PTableMobile 
        type='offer' 
        data={offer} 
        loading={orderLoading}
      />
    </section>
  )
}

export {P2PMyOfferMobileScreen}