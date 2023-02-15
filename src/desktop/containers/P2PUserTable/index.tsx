import * as React from 'react';
import { P2PBlockedUser, P2PFeedback, P2PPaymentMethod } from 'src/desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { p2pProfileFetch, P2PProfileFetchInterface, selectP2PProfile, feedbackFetch } from 'src/modules';

export const P2PUserTable: React.FC = () => {
    const dispatch = useDispatch();
    const userP2P: P2PProfileFetchInterface = useSelector(selectP2PProfile);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(feedbackFetch());
    }, [dispatch]);

    return (
        <React.Fragment>
            <div className="container-p2p-user-table">
                <Tabs defaultActiveKey="payment" transition={false} id="noanim-tab-example" className="mb-3">
                    <Tab eventKey="payment" title="Payment Methods P2P">
                        <P2PPaymentMethod />
                    </Tab>
                    <Tab eventKey="feedback" title={`Feedback (${userP2P.positif_feedback.total})`}>
                        <P2PFeedback />
                    </Tab>
                    <Tab eventKey="block" title="Blocked User">
                        <P2PBlockedUser />
                    </Tab>
                </Tabs>
            </div>
        </React.Fragment>
    );
};
