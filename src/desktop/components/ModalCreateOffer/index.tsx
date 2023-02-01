import * as React from 'react';
import { Modal, OfferForm } from '..';
import { Tabs, Tab } from 'react-bootstrap';

export interface ModalCreateOfferPost {
    showModalCreateOffer: boolean;
    onCloseModal?: () => void;
}

export const ModalCreateOffer: React.FunctionComponent<ModalCreateOfferPost> = (props) => {
    // const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(props.showModalCreateOffer);
    const { showModalCreateOffer, onCloseModal } = props;

    const renderContentModalCreateOffer = () => {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="buy" id="justify-tab-example" className="mb-3 " justify>
                    <Tab eventKey="buy" title="Buy" className="mb-32">
                        <OfferForm onCloseModal={onCloseModal} />
                    </Tab>
                    <Tab eventKey="sell" title="Sell" className="mb-32">
                        <OfferForm onCloseModal={onCloseModal} />
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {showModalCreateOffer && (
                <Modal
                    className="com-modal-create-offer-p2p"
                    show={showModalCreateOffer}
                    content={renderContentModalCreateOffer()}
                />
            )}
        </React.Fragment>
    );
};
