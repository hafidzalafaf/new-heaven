import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { P2PPaymentMethodProps } from 'src/desktop/components'
import { ArrowLeft, ArrowRight } from 'src/mobile/assets/Arrow'
import { p2pPaymentUserFetch, p2pProfileFetch, selectP2PPaymentUser, selectP2PPaymentUserDeleteSuccess } from 'src/modules'

import './P2PPaymentMethodMobileScreen.pcss'

export const P2PPaymentMethodMobileScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const paymentMethods: P2PPaymentMethodProps[] = useSelector(selectP2PPaymentUser);
    const deleteSuccess = useSelector(selectP2PPaymentUserDeleteSuccess);

    React.useEffect(() => {
      dispatch(p2pPaymentUserFetch());
      dispatch(p2pProfileFetch());
  }, [dispatch, deleteSuccess]);

    console.log(paymentMethods);


  const PaymentMethodList = ({data}) => {
    console.log(data, 'data');
    return (
      <div className='d-flex flex-column gap-16'>
        {
          data.map((item, i) => 
          <div
          // onClick={() => handleChangePaymentMethod(bank)}
          key={i}
          className="modal-bank-info-container cursor-pointer bg-soft p-3 radius-lg">
          <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center gap-4">
                  <div className="label-payment"></div>
                  <p className="m-0 p-0 grey-text-accent text-ms">{item?.tipe}</p>
              </div>

              <div className="d-flex align-items-center gap-16">
                  <img src={item?.logo} alt="logo" width={40} className="h-auto" />

                  <ArrowRight className={''} />
              </div>
          </div>

          <p className="m-0 p-0 grey-text-accent text-ms">{item?.account_name}</p>
          <p className="m-0 p-0 grey-text-accent text-ms font-bold">{item?.account_number}</p>
          <p className="m-0 p-0 grey-text text-ms">{item?.symbol}</p>
      </div>
          )
        }
      </div>
    )}


  return (
    <section className='pg-mobile-screen-p2p mobile-container position-relative'>
        <div className="d-flex justify-content-start align-items-center mb-32">
            <div  onClick={history.goBack}>
            <ArrowLeft className={'cursor-pointer'} />
            </div>
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Payment Methods</p>
        </div>
        <PaymentMethodList data={paymentMethods}/>
        <button className='bottom-fixed-button btn-primary position-absolute'>Add New Payment Method</button>
    </section>
  )
}