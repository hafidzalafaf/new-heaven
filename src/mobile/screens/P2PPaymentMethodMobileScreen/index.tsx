import React from 'react'
import { useHistory } from 'react-router'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { ArrowLeft } from 'src/mobile/assets/Arrow'

export const P2PPaymentMethodMobileScreen = () => {
    const history = useHistory()
  return (
    <section className='pg-mobile-screen-p2p mobile-container'>
        <div className="d-flex justify-content-start align-items-center mb-32">
            <div  onClick={history.goBack}>
            <ArrowLeft className={'cursor-pointer'} />
            </div>
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Payment Methods</p>
        </div>
    </section>
  )
}