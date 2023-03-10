import React from 'react'
import { useHistory } from 'react-router'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { OfferP2PTable } from 'src/desktop/containers'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { OfferP2PTableMobile } from 'src/mobile/containers/OfferP2PTableMobile'

const P2PMyOfferMobileScreen = () => {
  const history = useHistory()
  return (
    <section className='pg-mobile-screen-p2p mobile-container'>
      <div className="d-flex justify-content-between align-items-center mb-32">
        <div  onClick={history.goBack}>
        <ArrowLeft className={'cursor-pointer'} />
        </div>
        <p className="m-0 p-0 grey-text-accent text-md font-extrabold">My Offers</p>
        <MobileFilterIcon className={''}/>
      </div>
      <OfferP2PTableMobile/>
    </section>
  )
}

export {P2PMyOfferMobileScreen}