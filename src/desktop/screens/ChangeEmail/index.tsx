import React, { FC, ReactElement, useState } from 'react';
import { useDocumentTitle } from 'src/hooks';
import { CustomInput, CodeVerification, Modal } from '../../components';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { alertPush, selectUserInfo } from '../../../modules';

export const ChangeEmail: FC = (): ReactElement => {
    useDocumentTitle('ChangeEmail');
    const [emailCode, setEmailCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [code2Fa, setCode2Fa] = useState('');
    const [step, setStep] = useState(1);
    const [newEmail, setNewEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);

    const renderModalContent = () => (
        <React.Fragment>
            <div className="header">
                <p className="white-text text-md font-semibold">Change Email</p>
            </div>
            <div className="body mb-24">
                <p className="text-ms grey-text mb-0">
                    1.To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily
                    unavailable for 24 hours after changing or unbinding an email.
                </p>
                <p className="text-ms grey-text mb-0">
                    2.Emails that have been unbound or changed in the past 30 days cannot be used to register new
                    accounts
                </p>
            </div>
            <div className="footer">
                <button type="button" className="btn btn-danger sm mx-2" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary sm mx-2" onClick={handleChangeEmail}>
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );

    const handleChangeEmail = () => {
        history.push('/profile');
        dispatch(alertPush({ message: ['success change email'], type: 'success' }));
    };

    const disableButton = (buttonActive) => {
        switch (buttonActive) {
            case 'continue':
                if (user.otp) {
                    return emailCode == '' || code2Fa == '';
                } else {
                    return emailCode == '';
                }
            case 'submit':
                return newEmail == '' || verificationCode == '';
        }
    };

    return (
        <React.Fragment>
            <div className="change-email-screen dark-bg-accent pb-5">
                <div className="header dark-bg-accent py-4 px-24 mb-24">
                    <h2 className="mb-0 text-xl white-text font-bold pt-2">Change Email</h2>
                </div>
                <div className="px-24">
                    <div className="dark-bg-main d-inline-block radius-md">
                        <div className="timeline px-3">
                            <div className="timeline-item">
                                <div className="rounded">
                                    <div className="bg-blue">1</div>
                                </div>
                                <h6 className="text-sm white-text font-normal">Security Verification</h6>
                                <p className="text-xs grey-text-accent font-normal">
                                    Emails that have been unbound or changed in the past 30 days cannot be used to
                                    register new accounts.
                                </p>
                            </div>
                            <div className="timeline-item">
                                <div className="rounded">
                                    <div className="bg-blue">2</div>
                                </div>
                                <h6 className="text-sm white-text font-normal">Change Email</h6>
                                <p className="text-xs grey-text-accent font-normal">
                                    Change the email and send verification code
                                </p>
                            </div>
                            <div className="timeline-item">
                                <div className="rounded">
                                    <div className="bg-blue">3</div>
                                </div>
                                <h6 className="text-sm white-text font-normal">Done</h6>
                                <p className="text-xs grey-text-accent font-normal">Email Changed</p>
                            </div>
                        </div>
                    </div>
                    <h6 className="text-ms white-text font-semibold px-3">Security Verification</h6>
                    <form action="" className="change-email-form px-3">
                        <div className={`mb-24 step ${step == 1 ? ' show' : 'hide'}`} id="step-one">
                            <div className="d-flex align-items-center justify-content-between mb-24">
                                <label
                                    className="input-label text-ms white-text pr-4 font-normal text-nowrap"
                                    htmlFor="">
                                    Email Verification Code
                                </label>

                                <div className="d-flex input-classname">
                                    <CustomInput
                                        defaultLabel=""
                                        label=""
                                        labelVisible={false}
                                        inputValue={emailCode}
                                        placeholder="Email Code"
                                        type="text"
                                        classNameLabel="d-none"
                                        handleChangeInput={(e) => setEmailCode(e)}
                                        classNameGroup="mb-0 w-100"
                                    />
                                    <button type="button" className="btn btn-primary no-wrap ml-2 text-nowrap">
                                        Send Code
                                    </button>
                                </div>
                            </div>
                            {user && user.otp ? (
                                <div className="d-flex align-items-center justify-content-between mb-24">
                                    <label className="input-label text-ms white-text pr-4 font-normal" htmlFor="">
                                        2FA Code
                                    </label>
                                    <div className="input-classname">
                                        <CodeVerification
                                            code={code2Fa}
                                            codeLength={6}
                                            onChange={(e) => setCode2Fa(e)}
                                            placeholder="______"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary px-5"
                                    id="next-step"
                                    disabled={disableButton('continue')}
                                    onClick={() => setStep(2)}>
                                    Continue
                                </button>
                            </div>
                        </div>
                        <div className={`mb-24 step ${step == 2 ? ' show' : 'hide'}`} id="step-two">
                            <div className="d-flex align-items-center mb-24">
                                <label className="input-label text-ms white-text pr-4 font-normal" htmlFor="">
                                    New Email
                                </label>
                                <CustomInput
                                    defaultLabel=""
                                    label=""
                                    labelVisible={false}
                                    inputValue={newEmail}
                                    placeholder="youremail@example.com"
                                    type="email"
                                    classNameLabel="d-none"
                                    handleChangeInput={(e) => setNewEmail(e)}
                                    classNameGroup="mb-0  input-classname"
                                />
                            </div>
                            <div className="d-flex align-items-center mb-24">
                                <label
                                    className="input-label text-ms white-text pr-4 font-normal text-nowrap"
                                    htmlFor="">
                                    Verification Code
                                </label>

                                <div className="d-flex input-classname">
                                    <CustomInput
                                        defaultLabel=""
                                        label=""
                                        labelVisible={false}
                                        inputValue={verificationCode}
                                        placeholder="Email Code"
                                        type="text"
                                        classNameLabel="d-none"
                                        handleChangeInput={(e) => setVerificationCode(e)}
                                        classNameGroup="mb-0 w-100"
                                    />
                                    <button type="button" className="btn btn-primary no-wrap ml-2 text-nowrap">
                                        Send Code
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-primary px-5"
                                    disabled={disableButton('submit')}
                                    onClick={() => setShowModal(true)}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Modal content={renderModalContent()} show={showModal} />
        </React.Fragment>
    );
};
