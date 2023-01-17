import * as React from 'react';
import { Modal } from '..';
import { Tabs, Tab } from 'react-bootstrap';

export interface ModalCreateOfferPost {
    showModalCreateOffer: boolean;
}

export const ModalCreateOffer: React.FunctionComponent<ModalCreateOfferPost> = (props) => {
    const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(props.showModalCreateOffer);

    const renderHeaderModalAddBeneficiary = () => {
        return (
            <React.Fragment>
                <h1>Header</h1>
            </React.Fragment>
        );
    };

    const renderContentModalAddBeneficiary = () => {
        return (
            <React.Fragment>
                <h1>Content</h1>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {showModalCreateOffer && (
                <Modal
                    show={showModalCreateOffer}
                    header={renderHeaderModalAddBeneficiary()}
                    content={renderContentModalAddBeneficiary()}
                />
            )}
        </React.Fragment>
    );
};
