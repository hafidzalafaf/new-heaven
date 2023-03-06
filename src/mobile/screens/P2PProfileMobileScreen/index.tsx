import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { RenameIcon, VerificationIcon, ShareIcon, CheckFillIcon, MobileFeedback, MobileCompletionRate, MobileLastMonthTrade } from 'src/assets/images/P2PIcon'
import { useDocumentTitle } from 'src/hooks'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { selectUserLoggedIn, selectP2PMerchantDetail, selectP2PPaymentUser, P2PProfileFetchInterface, selectP2PProfile, selectP2PProfileBlockMerchantLoading, selectP2PProfileBlockMerchantSuccess, selectP2PProfileChangeUsernameSuccess, selectUserInfo, p2pPaymentUserFetch, p2pProfileFetch } from 'src/modules'

const P2PProfileMobileScreen :React.FC = () => {
  useDocumentTitle('P2P || Profile');
  const dispatch = useDispatch();
  const history = useHistory();
  const { uid = '' } = useParams<{ uid?: string }>();

  const isLoggedIn = useSelector(selectUserLoggedIn);
  const merchants = useSelector(selectP2PMerchantDetail);
  const userP2PPayment = useSelector(selectP2PPaymentUser);
  const userP2P: P2PProfileFetchInterface = useSelector(selectP2PProfile);
  const blockMerchantLoading = useSelector(selectP2PProfileBlockMerchantLoading);
  const blockMerchantSuccess = useSelector(selectP2PProfileBlockMerchantSuccess);
  const changeUsernameSuccess = useSelector(selectP2PProfileChangeUsernameSuccess);
  const myProfile = useSelector(selectUserInfo);

  const [data, setData] = React.useState<any>();



  React.useEffect(()=>{
    dispatch(p2pProfileFetch());
    dispatch(p2pPaymentUserFetch());
  }, [dispatch])

  React.useEffect(()=>{
    setData(userP2P)
  }, [myProfile, userP2P])

  console.log(data);

  return (
    <div className="mobile-container no-header dark-bg-main">
        <Link to={'/wallets'} className="cursor-pointer">
          <ArrowLeft className={'back'} />
        </Link>
        <section className='mt-5 p-3 container-p2p-user-info'>
        <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-start align-items-center user-info-header-container gap-8 mb-16">
                        <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                        {data?.trader_name?.slice(0, 1).toUpperCase()}
                        </div>
                        <p className="m-0 p-0 text-ms font-extrabold grey-text-accent">
                          {
                            data?.trader_name
                          }
                        </p>
                            <RenameIcon
                            className={``}
                            onClick={()=>console.log('clicked')}

                            />
                        <div className="cursor-pointer">
                            <ShareIcon />
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-4 mr-12 my-2">
                            <VerificationIcon />

                            <p className="m-0 p-0 grey-text text-xxs font-semibold">Verified Merchant</p>
                        </div>
                <div className="d-flex align-items-center gap-16 mb-16">
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Email</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">SMS</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">KYC</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <CheckFillIcon />
                        <p className="m-0 p-0 text-xxs font-semibold grey-text">Address</p>
                    </div>
                </div>
        </section>
        <section className='mt-5 p-3 d-flex flex-row justify-content-between'>
          <div className='d-flex flex-column items-center justify-content-between'>
          <MobileFeedback />
          <p className='text-xxs mt-2'>Received Feedbacks</p>
          <p className='text-xs text-center'>90% (1,419)</p>
          </div>
          <div className='d-flex flex-column items-center justify-content-between'>
          <MobileCompletionRate/>
          <p className='text-xxs mt-2'>Received Feedbacks</p>
          <p className='text-xs text-center'>90% (1,419)</p>
          </div>          
          <div className='d-flex flex-column items-center justify-content-between'>
          <MobileLastMonthTrade/>
          <p className='text-xxs mt-2'>Received Feedbacks</p>
          <p className='text-xs text-center'>90% (1,419)</p>
          </div>
        </section>
    </div>
  )
}

export {P2PProfileMobileScreen}

                    {/* {isLoggedIn && uid !== userP2P?.member?.uid && (
                        <button
                            onClick={() => setShowModalBlockAlert(!showModalBlockAlert)}
                            type="button"
                            className="btn btn-secondary">
                            Block
                        </button>
                    )} */}