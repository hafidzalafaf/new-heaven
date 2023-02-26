import * as React from 'react';
import { P2PBlockedUser, P2PFeedback, P2PPaymentMethod } from 'src/desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import {
    feedbackFetch,
    selectP2PFeedbackUser,
    p2pProfileFetch,
    P2PProfileFetchInterface,
    selectP2PProfile,
    selectUserLoggedIn,
} from 'src/modules';

export const P2PUserTable: React.FC = () => {
    const dispatch = useDispatch();
    const { uid = '' } = useParams<{ uid?: string }>();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const feedbacks = useSelector(selectP2PFeedbackUser);
    const userP2P: P2PProfileFetchInterface = useSelector(selectP2PProfile);

    React.useEffect(() => {
        dispatch(feedbackFetch());
        dispatch(p2pProfileFetch());
    }, [dispatch]);

    return (
        <React.Fragment>
            <div className="container-p2p-user-table">
                <Tabs
                    defaultActiveKey={isLoggedIn && uid == userP2P?.member?.uid ? 'payment' : 'feedback'}
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3">
                    {isLoggedIn && uid == userP2P?.member?.uid && (
                        <Tab eventKey="payment" title="Payment Methods P2P">
                            <P2PPaymentMethod />
                        </Tab>
                    )}
                    <Tab eventKey="feedback" title={`Feedback (${feedbacks?.length})`}>
                        <P2PFeedback />
                    </Tab>
                    {isLoggedIn && uid == userP2P?.member?.uid && (
                        <Tab eventKey="block" title="Blocked User">
                            <P2PBlockedUser />
                        </Tab>
                    )}
                </Tabs>
            </div>
        </React.Fragment>
    );
};
