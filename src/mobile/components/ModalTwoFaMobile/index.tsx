import React from 'react';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import { CustomInput } from 'src/desktop/components';
import { ModalFullScreenMobile } from '../ModalFullScreen';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import PinInput from 'react-pin-input';

export interface ModalTwoFaProps {
    show: boolean;
    onSubmit: () => void;
    closeModal: () => void;
    onChangeValue: (value: string) => void;
    twoFaValue: string;
}

const ModalTwoFaMobileComponent: React.FC<ModalTwoFaProps> = ({
    show,
    onSubmit,
    closeModal,
    onChangeValue,
    twoFaValue,
}) => {
    const isInvalid = () => {
        if (twoFaValue.length < 6) {
            return true;
        }
    };

    // ===== Modal 2FA ===========
    const modalTwoFaContent = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-3">Two-factor Authentication</h6>
                <p className="text-sm grey-text">
                    To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily unavailable
                    for 24 hours after changing the security settings.
                </p>
                <div className="form">
                    <div className="form-group mb-24">
                        <PinInput
                            length={6}
                            onChange={onChangeValue}
                            onComplete={onChangeValue}
                            type="numeric"
                            inputMode="number"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                            }}
                            inputStyle={{
                                background: '#15191D',
                                borderRadius: '4px',
                                borderColor: '#15191D',
                                fontSize: '20px',
                                color: ' #DEDEDE',
                            }}
                            inputFocusStyle={{ fontSize: '20px', color: 'color: #23262F' }}
                            autoSelect={true}
                            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                        />
                    </div>
                    <button
                        disabled={isInvalid()}
                        type="button"
                        className="btn btn-primary btn-block"
                        data-dismiss="modal"
                        onClick={onSubmit}>
                        Next
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const modalTwoFaHeader = () => {
        return (
            <React.Fragment>
                <div className="d-flex pt-3" onClick={closeModal}>
                    <ArrowLeft className="" />
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <ModalFullScreenMobile content={modalTwoFaContent()} header={modalTwoFaHeader()} show={show} />
        </React.Fragment>
    );
};

export const ModalTwoFaMobile = React.memo(ModalTwoFaMobileComponent);
