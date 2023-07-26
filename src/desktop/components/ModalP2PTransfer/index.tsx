import React from 'react';
import { Modal } from '../../components';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';

export interface ModalP2PTransferProps {
    show: boolean;
    onSubmit: () => void;
    closeModal: () => void;
    onChangeValue: (value: string) => void;
}

const ModalP2PTransferComponent: React.FC<ModalP2PTransferProps> = ({ show, onSubmit, closeModal, onChangeValue }) => {
    // render two fa  modal
    const modalTwoFaContent = () => {
        return (
            <React.Fragment>
                <p className="text-sm grey-text mb-24">
                    To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily unavailable
                    for 24 hours after changing the security settings.
                </p>
            </React.Fragment>
        );
    };

    const modalTwoFaHeader = () => {
        return (
            <React.Fragment>
                <div className="w-full  align-items-center">
                    <h6 className="text-xl font-bold white-text mb-0">Transfer Assets</h6>
                    <ModalCloseIcon className="cursor-pointer" onClick={closeModal} />
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Modal content={modalTwoFaContent()} header={modalTwoFaHeader()} show={show} />
        </React.Fragment>
    );
};

export const ModalP2PTransfer = React.memo(ModalP2PTransferComponent);
