import React from 'react'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { NotifMobileIcon, HamburgerMobileIcon } from 'src/mobile/assets/P2PMobileIcon'
import { OrderP2PTableMobile } from 'src/mobile/containers/OrderP2PTableMobile'

const P2PMyOrderMobileScreen = () => {
  return (
    <section className='pg-mobile-screen-p2p mobile-container'>
        <div className="d-flex justify-content-between align-items-center mb-32">
            <ArrowLeft className={'cursor-pointer'} />
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Order History</p>
            <MobileFilterIcon className={''}/>
        </div>
        <OrderP2PTableMobile/>
    </section>
  )
}

export {P2PMyOrderMobileScreen}