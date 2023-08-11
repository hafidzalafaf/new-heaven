import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Modal } from 'src/desktop/components';

export interface UpdateAppModalProps {
    title: string;
    buttonLabel: string;
    show: boolean;
    handleSubmitUpdateAppModal: () => void;
    handleChangeUpdateAppModalState: () => void;
}

export class UpdateAppModal extends React.Component<UpdateAppModalProps> {
    public render() {
        const { title, buttonLabel, show } = this.props;

        const renderModalUpdater = () => {
            return (
                <React.Fragment>
                    <h1 className="text-lg white-text font-semibold mb-32">{title}</h1>

                    <Button
                        block={true}
                        type="button"
                        onClick={this.props.handleSubmitUpdateAppModal}
                        size="lg"
                        className="w-full"
                        variant="primary">
                        {buttonLabel}
                    </Button>
                </React.Fragment>
            );
        };

        return <Modal show={true} content={renderModalUpdater()} className="" />;
    }
}
