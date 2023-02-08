import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Modal } from 'src/desktop/components';

export interface ExpiredSessionModalProps {
    title: string;
    buttonLabel: string;
    show: boolean;
    handleSubmitExpSessionModal: () => void;
    handleChangeExpSessionModalState: () => void;
}

export class ExpiredSessionModal extends React.Component<ExpiredSessionModalProps> {
    public render() {
        const { title, buttonLabel, show } = this.props;

        const renderModalLogin = () => {
            return (
                <React.Fragment>
                    <h1 className="text-xl white-text font-semibold mb-24">{title}</h1>
                    <div className="d-flex justify-content-between align-items-center gap-8 w-100">
                        <Button
                            block={true}
                            type="button"
                            onClick={this.props.handleSubmitExpSessionModal}
                            size="lg"
                            className="w-50"
                            variant="primary">
                            {buttonLabel}
                        </Button>
                        <Button
                            block={true}
                            type="button"
                            size="lg"
                            onClick={this.props.handleChangeExpSessionModalState}
                            variant="outline-secondary m-0 text-sm font-semibold"
                            style={{ height: '45px' }}
                            className="w-50">
                            Close
                        </Button>
                    </div>
                </React.Fragment>
            );
        };

        return <Modal show={true} content={renderModalLogin()} className="com-modal-expired-session" />;
    }
}
