import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    feedbackFetch,
    selectP2PFeedbackUser,
    p2pMerchantDetailFetch,
    selectP2PMerchantDetail,
    selectUserInfo,
} from 'src/modules';
import { useParams } from 'react-router';
import { NoDataIcon, LikeSuccessIcon, UnLikeDangerIcon } from '../../../assets/images/P2PIcon';
import { Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

export const P2PFeedback: React.FC = () => {
    const dispatch = useDispatch();
    const { uid = '' } = useParams<{ uid?: string }>();

    const feedbacks = useSelector(selectP2PFeedbackUser);
    const merchants = useSelector(selectP2PMerchantDetail);
    const myProfile = useSelector(selectUserInfo);

    const [feedback, setFeedback] = React.useState<any>();
    const [merchant, setMerchant] = React.useState<any>();
    const [tab, setTab] = React.useState('all');

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

    const handleSelect = (k) => {
        setTab(k);
    };

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
            <div className="com-p2p-feedback">
                <div className="d-flex justify-content-between align-items-center mb-16">
                    <p className="m-0 p-0 grey-text text-ms">Feedback</p>
                    <p className="m-0 p-0 grey-text text-ms">
                        {uid === myProfile?.uid ? feedback?.length : merchant?.length} Review
                    </p>
                </div>

                {(uid === myProfile?.uid ? !feedback || !feedback[0] : !merchant || !merchant[0]) ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No Comments</p>
                    </div>
                ) : (
                    <Tabs
                        defaultActiveKey="all"
                        activeKey={tab}
                        onSelect={(k) => handleSelect(k)}
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-3">
                        <Tab eventKey="all" title="All">
                            {renderData(uid === myProfile?.uid ? feedback : merchant)}
                        </Tab>
                        <Tab eventKey="positive" title="Positive">
                            {renderData(uid === myProfile?.uid ? feedback : merchant)}
                        </Tab>
                        <Tab eventKey="negative" title="Negative">
                            {renderData(uid === myProfile?.uid ? feedback : merchant)}
                        </Tab>
                    </Tabs>
                )}
            </div>
        </React.Fragment>
    );
};
