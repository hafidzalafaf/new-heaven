import moment from 'moment';
import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { LikeSuccessIcon, NoDataIcon, UnLikeDangerIcon } from 'src/assets/images/P2PIcon';
import { feedbackFetch, p2pMerchantDetailFetch, selectP2PFeedbackUser, selectP2PMerchantDetail } from 'src/modules';

import './P2PFeedbackTab.pcss'

const P2PFeedbackTab = ({uid, myProfile}) => {
    const dispatch = useDispatch();


    const feedbacks = useSelector(selectP2PFeedbackUser);
    const merchants = useSelector(selectP2PMerchantDetail);
    const [tab, setTab] = React.useState('all');
    const [feedback, setFeedback] = React.useState<any>();
    const [merchant, setMerchant] = React.useState<any>();

    console.log(feedback)
    const handleSelect = (k) => {
        setTab(k);
    };
    React.useEffect(() => {
        dispatch(feedbackFetch());
        dispatch(p2pMerchantDetailFetch({ uid }));
    }, [dispatch, uid]);
    
    React.useEffect(() => {
        if (uid === myProfile?.uid) {
            setFeedback(
                tab == 'positive'
                    ? feedbacks?.filter((item) => item.assesment == 'positive')
                    : tab == 'negative'
                    ? feedbacks?.filter((item) => item.assesment == 'negative')
                    : feedbacks
            );
        } else {
            setMerchant(
                tab == 'positive'
                    ? merchants?.feedbacks?.filter((item) => item.assesment == 'positive')
                    : tab == 'negative'
                    ? merchants?.feedbacks?.filter((item) => item.assesment == 'negative')
                    : merchants?.feedbacks
            );
        }
    }, [myProfile, merchants, uid, tab, feedbacks]);

    const renderData = (data) => {
        return data?.map((item, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-16 p-10 data-row">
                <div className="d-flex align-items-start justify-content-start gap-8">
                    <div className="d-flex justify-content-center align-items-center grey-text-accent text-xxs font-bold ava-container">
                        {item?.member?.email?.slice(0, 1).toUpperCase()}
                    </div>
    
                    <div className="d-flex flex-column gap-4">
                        <p className="m-0 p-0 text-xxs font-bold grey-text-accent">{item?.member?.email}</p>
                        <p className="m-0 p-0 text-xxs font-bold grey-text">
                            {moment(item?.date_transaction_start).format('YYYY-MM-DD')}
                            {'  '}|{'  '}Bank Transfer
                        </p>
                        <p className="m-0 p-0 text-xxs font-bold white-text">{item?.comment}</p>
                    </div>
                </div>
    
                <div>
                    <p className="grey-text font-bold m-0 p-0 text-xxs">{item?.timer}</p>
                </div>
                <div key={i} className="label-bank">
                    <img src="/dummy" alt="this is a test" />
                </div>
    
                <span>{item.assesment == 'positive' ? <LikeSuccessIcon /> : <UnLikeDangerIcon />}</span>
            </div>
        ));
    };


  return (
    <React.Fragment>
        <div className='mobile-p2p-feedback'>
            <Tabs
                defaultActiveKey="all"
                activeKey={tab}
                onSelect={(k) => handleSelect(k)}
                transition={false}
                id="noanim-tab-example"
                className="mb-3 flex-nowrap">
                <Tab eventKey="all" title="All">
                { 
                    (uid === myProfile?.uid ? !feedback || !feedback[0] : !merchant || !merchant[0]) ? (
                        <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                            <NoDataIcon />
                            <p className="m-0 p-0 grey-text text-sm font-bold">No Comments</p>
                        </div>) :
                    (renderData(uid === myProfile?.uid ? feedback : merchant))
                }
                </Tab>
                <Tab eventKey="positive" title="Positive">
                { 
                    (uid === myProfile?.uid ? !feedback || !feedback[0] : !merchant || !merchant[0]) ? (
                        <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                            <NoDataIcon />
                            <p className="m-0 p-0 grey-text text-sm font-bold">No Comments</p>
                        </div>) :
                    (renderData(uid === myProfile?.uid ? feedback : merchant))
                }
                </Tab>
                <Tab eventKey="negative" title="Negative">
                { 
                    (uid === myProfile?.uid ? !feedback || !feedback[0] : !merchant || !merchant[0]) ? (
                        <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                            <NoDataIcon />
                            <p className="m-0 p-0 grey-text text-sm font-bold">No Comments</p>
                        </div>) :
                    (renderData(uid === myProfile?.uid ? feedback : merchant))
                }
                </Tab>
            </Tabs>
        </div>
    </React.Fragment>
  )
}

export {P2PFeedbackTab}