import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { RenameIcon, VerificationIcon, ShareIcon, CheckFillIcon, MobileFeedback, MobileCompletionRate, MobileLastMonthTrade, MobileMoreArrow, MobileThumbsUp, MobileCreditCard, MobileNotification, MobileUserIcon } from 'src/assets/images/P2PIcon'
import { useDocumentTitle } from 'src/hooks'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { ModalFullScreenMobile } from 'src/mobile/components/ModalFullScreen'
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
  const [showModalMoreUserInfo, setShowModalMoreUserInfo] = React.useState(false);
  const [showModalUserFeedbackInfo, setShowModalUserFeedbackInfo] = React.useState(false);



  React.useEffect(()=>{
    dispatch(p2pProfileFetch());
    dispatch(p2pPaymentUserFetch());
  }, [dispatch])

  React.useEffect(()=>{
    setData(userP2P)
  }, [myProfile, userP2P])

  console.log(data);

  const ModalUserFeedbackInfo = () => {
    return (
      <section className='container-p2p-user-info'>
        <div className='grey-text d-flex flex-row'>
          <div onClick={()=> setShowModalUserFeedbackInfo(false)} className="cursor-pointer mr-2">
            <ArrowLeft className={'back'} />
          </div>
          <div className='font-semibold text-md mx-auto'>Received Feedbacks</div>
        </div>
        <section className='mt-3 p-3 grey-text'>
        <div className="d-flex justify-content-start align-items-center user-info-header-container gap-8 mb-16">
        <div className="ava-container d-flex justify-content-center align-items-center white-text text-ms font-extrabold">
                        {data?.trader_name?.slice(0, 1).toUpperCase()}
                        </div>
          <div>Nusatech Exchange</div>
</div>
        </section>
      </section>
    )
  }

  const ModalUserInfo = () => {
    return (
      <React.Fragment>
        <div className='grey-text d-flex flex-row'>
          <div onClick={()=> setShowModalMoreUserInfo(false)} className="cursor-pointer mr-2">
            <ArrowLeft className={'back'} />
          </div>
          <div className='font-semibold text-md mx-auto'>Nusatech Exchange</div>
        </div>
        <section className='grey-text p-3'>
          <div className='d-flex justify-content-between my-2'>
            <p>Received Feedbacks</p>
            <p>90% (1,419)</p>
          </div>
          <div className='d-flex justify-content-between my-2'>
            <p>All Trade</p>
            <p>1,419</p>
          </div>          
          <div className='d-flex justify-content-between my-2'>
            <p>30d Trade</p>
            <p>713 Time(s)</p>
          </div>
          <hr className='bg-grey my-2'/>          
          <div className='d-flex justify-content-between my-2'>
            <p>30d Completion Rate</p>
            <p>90%</p>
          </div>
          <div className='d-flex justify-content-between my-2'>
            <p>Avg. Release Time</p>
            <p>4.50 Minute(s)</p>
          </div>          
          <div className='d-flex justify-content-between my-2'>
            <p>30d Pay Time</p>
            <p>4.50 Minute(s)</p>
          </div>
        </section>
      </React.Fragment>
    )
  }

  return (
    <div className="mobile-container no-header dark-bg-main">
      <ModalFullScreenMobile show={showModalUserFeedbackInfo} content={ModalUserFeedbackInfo()}/>
      <ModalFullScreenMobile show={showModalMoreUserInfo} content={ModalUserInfo()}/>
        <Link to={'/wallets'} className="cursor-pointer">
          <ArrowLeft className={'back'} />
        </Link>
        <section className='mt-3 p-3 container-p2p-user-info'>
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
        <section className='mt-2 p-3'>
            <div className='d-flex flex-row justify-content-between'>
              <div className='d-flex flex-column items-center justify-content-between'>
                <MobileFeedback />
                <p className='text-xxs mt-2 grey-text'>Received Feedbacks</p>
                <p className='text-xs text-center text-light'>90% (1,419)</p>
              </div>
              <div className='d-flex flex-column items-center justify-content-between'>
                <MobileCompletionRate/>
                <p className='text-xxs mt-2 grey-text'>30d Completion Rate</p>
                <p className='text-xs text-center text-light'>90% (1,419)</p>
              </div>          
              <div className='d-flex flex-column items-center justify-content-between'>
                <MobileLastMonthTrade/>
                <p className='text-xxs mt-2 grey-text'>30d Trade</p>
                <p className='text-xs text-center text-light'>713 Time(s)</p>
              </div>
            </div>
            <div onClick={()=> setShowModalMoreUserInfo(true)} className='mx-auto w-25 d-flex flex-row items-center justify-content-center cursor-pointer'>
              <div className='grey-text'>More</div>
              <MobileMoreArrow className='mt-1 ml-1'/>
            </div>
        </section>
        <section className='p-3 grey-text'>
          <div onClick={()=> setShowModalUserFeedbackInfo(true)} className='d-flex flex-row justify-content-between my-1 cursor-pointer'>
            <div className='d-flex flex-row'>
              <MobileThumbsUp className='mt-1'/>
              <p className='ml-3'>Received Feedback</p>
            </div>
            <MobileMoreArrow className='mt-1 ml-1'/>
          </div>

          <div className='d-flex flex-row justify-content-between my-1 cursor-pointer'>
            <div className='d-flex flex-row'>
              <MobileCreditCard className='mt-1'/>
              <p className='ml-3'>Payment Methods</p>
            </div>
            <MobileMoreArrow className='mt-1 ml-1'/>
          </div>        

          <div className='d-flex flex-row justify-content-between my-1 cursor-pointer'>
            <div className='d-flex flex-row'>
              <MobileNotification className='mt-1'/>
              <p className='ml-3'>P2P Notification</p>
            </div>
            <MobileMoreArrow className='mt-1 ml-1'/>
          </div>

          <div className='d-flex flex-row justify-content-between my-1 cursor-pointer'>
            <div className='d-flex flex-row'>
              <MobileUserIcon className='mt-1'/>
              <p className='ml-3'>Blocked Users</p>
            </div>
            <MobileMoreArrow className='mt-1 ml-1'/>
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