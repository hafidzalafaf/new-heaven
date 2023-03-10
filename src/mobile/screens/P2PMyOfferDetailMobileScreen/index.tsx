import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile';
import { P2PUserOfferDetail, p2pUserOfferDetailFetch, selectP2PUserAccountOfferDetail } from 'src/modules'

interface offer_number {
  uid: string;
}

export const P2PMyOfferDetailMobileScreen = () => {

  const [data, setData] = useState([])
  const [side, setSide] = useState('')
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  const history = useHistory();
  const offer_number : offer_number = useParams();
  const offerDetail: P2PUserOfferDetail = useSelector(selectP2PUserAccountOfferDetail);

  React.useEffect(()=>{
    dispatch(
      p2pUserOfferDetailFetch({
          offer_number: offer_number.uid,
      })
  );
    setLoading(false)
  }, [dispatch])
  
  React.useEffect(()=>{
    setData(offerDetail.order)
    setSide(offerDetail.offer.side)
  }, [offerDetail])

  return (
      <section className='pg-mobile-screen-p2p mobile-container'>
        <div onClick={()=> history.goBack()} className="d-flex justify-content-between align-items-center mb-32">
            <ArrowLeft className={'cursor-pointer'} />
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Offer Detail</p>
            <MobileFilterIcon className={''}/>
        </div>
        <OfferP2PTableMobile
          type='detail'
          data={data}
          loading={loading}
          side={side}
        />
      </section>
  )
}