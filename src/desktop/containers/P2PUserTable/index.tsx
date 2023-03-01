import * as React from 'react';
import { P2PBlockedUser, P2PFeedback, P2PPaymentMethod } from 'src/desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router';
import {
    feedbackFetch,
    selectP2PFeedbackUser,
    p2pProfileFetch,
    selectUserLoggedIn,
    selectUserInfo,
    p2pMerchantDetailFetch,
    selectP2PMerchantDetail,
} from 'src/modules';

export const P2PUserTable: React.FC = () => {
    const dispatch = useDispatch();
    const { uid = '' } = useParams<{ uid?: string }>();
    const location: { state: { types: string } } = useLocation();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const feedbacks = useSelector(selectP2PFeedbackUser);
    const merchants = useSelector(selectP2PMerchantDetail);
    const myProfile = useSelector(selectUserInfo);

    React.useEffect(() => {
        dispatch(feedbackFetch());
        dispatch(p2pProfileFetch());
        dispatch(p2pMerchantDetailFetch({ uid }));
    }, [dispatch, uid]);

    return (
        <React.Fragment>
            <div className="container-p2p-user-table">
                <Tabs
                    defaultActiveKey={
                        isLoggedIn && uid == myProfile?.uid
                            ? 'payment'
                            : isLoggedIn && location?.state?.types
                            ? location?.state?.types
                            : 'feedback'
                    }
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3">
                    {isLoggedIn && uid == myProfile?.uid && (
                        <Tab eventKey="payment" title="Payment Methods P2P">
                            <P2PPaymentMethod />
                        </Tab>
                    )}
                    <Tab
                        eventKey="feedback"
                        title={`Feedback (${
                            uid === myProfile?.uid ? feedbacks?.length : merchants?.feedbacks?.length
                        })`}>
                        <P2PFeedback />
                    </Tab>
                    {isLoggedIn && uid == myProfile?.uid && (
                        <Tab eventKey="block" title="Blocked User">
                            <P2PBlockedUser />
                        </Tab>
                    )}
                </Tabs>
            </div>
        </React.Fragment>
    );
};
