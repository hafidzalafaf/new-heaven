import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { MobileFilterIcon } from 'src/assets/images/P2PIcon'
import { P2PPaymentMethodProps } from 'src/desktop/components'
import { capitalizeFirstLetter } from 'src/helpers'
import { ArrowLeft, ArrowRight } from 'src/mobile/assets/Arrow'
import { ModalFullScreenMobile } from 'src/mobile/components'
import { p2pCurrenciesFetch, p2pPaymentUserFetch, p2pProfileFetch, selectLoadingAbilities, selectP2PCurrenciesData, selectP2PPaymentUser, selectP2PPaymentUserDeleteSuccess } from 'src/modules'

import './P2PPaymentMethodMobileScreen.pcss'

export const P2PPaymentMethodMobileScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const paymentMethods: P2PPaymentMethodProps[] = useSelector(selectP2PPaymentUser);
    const deleteSuccess = useSelector(selectP2PPaymentUserDeleteSuccess);
    const currenciesData = useSelector(selectP2PCurrenciesData);

    const [loading, setLoading] = React.useState(true);
    const [showChooseBankType, setShowChooseBankType] = React.useState(false);
    const [fiat, setFiat] = React.useState('IDR');

    React.useEffect(() => {
      dispatch(p2pPaymentUserFetch());
      dispatch(p2pProfileFetch());
      setLoading(false)
  }, [dispatch, deleteSuccess]);

  React.useEffect(() => {
    dispatch(p2pCurrenciesFetch({ fiat }));
}, [dispatch, fiat]);

    console.log(paymentMethods);
    console.log(currenciesData, 'currData');

  const AvailableBankForPaymentMethod = () =>{
    return (
      <section>
        <div className="d-flex justify-content-start align-items-center mb-32">
            <div  onClick={()=> setShowChooseBankType(false)}>
            <ArrowLeft className={'cursor-pointer'} />
            </div>
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Select Payment Methods</p>
        </div>
        <div className='d-flex flex-column gap-16'>
          {
            currenciesData.payment.map((bank)=>
            <Link to={`/p2p/payment-method/create/${bank.symbol}`} className='bg-soft p-3 radius-lg d-flex flex-row justify-content-between align-items-center grey-text-accent'>
              <div className='d-flex flex-row gap-16 align-items-center'>
                <img
                  src={bank.logo}
                  alt={bank.symbol}
                  width='auto'
                  height={bank.symbol === "BTN" ? `50` : `20`}
                  />
                  <span>{bank.symbol}</span>
              </div>
              <ArrowRight className={''}/>
            </Link>
            )
          }
        </div>
      </section>
    )
  }


  const PaymentMethodList = ({data}) => {
    console.log(data, 'data');
    return (
      <div className='d-flex flex-column gap-16 payment-method-list'>
        {
          data.map((item, i) => 
          <div
          // onClick={() => handleChangePaymentMethod(bank)}
          key={i}
          className="modal-bank-info-container cursor-pointer bg-soft p-3 radius-lg">
          <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center gap-4">
                  <div className="label-payment"></div>
                  <p className="m-0 p-0 grey-text-accent text-ms">{capitalizeFirstLetter(item?.tipe)}</p>
              </div>

              <Link to={`/p2p/payment-method/edit/${item.payment_user_uid}`} className="d-flex align-items-center gap-16">
                  <img src={item?.logo} alt="logo" width={40} className="h-auto" />
                  <ArrowRight className={''} />
              </Link>
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
      <ModalFullScreenMobile show={showChooseBankType} content={<AvailableBankForPaymentMethod/>}/>
        <div className="d-flex justify-content-start align-items-center mb-32">
            <div  onClick={() => history.goBack()}>
            <ArrowLeft className={'cursor-pointer'} />
            </div>
            <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Payment Methods</p>
        </div>
        <PaymentMethodList data={paymentMethods}/>
        { !loading && <button onClick={()=> setShowChooseBankType(true)} className='bottom-fixed-button btn-primary position-sticky'>Add New Payment Method</button>}
    </section>
  )
}