import * as React from 'react';
import { P2PBlockedUser, P2PFeedback, P2PPaymentMethod } from 'src/desktop/components';
import { Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { feedbackFetch, selectP2PFeedbackUser } from 'src/modules';

export const P2PUserTable: React.FC = () => {
    const dispatch = useDispatch();
    const feedbacks = useSelector(selectP2PFeedbackUser);

    React.useEffect(() => {
        dispatch(feedbackFetch());
    }, [dispatch]);

    return (
        <React.Fragment>
            <div className="container-p2p-user-table">
                <Tabs defaultActiveKey="payment" transition={false} id="noanim-tab-example" className="mb-3">
                    <Tab eventKey="payment" title="Payment Methods P2P">
                        <P2PPaymentMethod />
                    </Tab>
                    <Tab eventKey="feedback" title={`Feedback (${feedbacks?.length})`}>
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
