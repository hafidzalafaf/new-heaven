import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { passwordMinEntropy } from '../../../api/config';
import { ArrowLeft } from '../../assets/Arrow';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../../helpers';
import { forgotPassword, resetCaptchaState, selectCaptchaResponse } from '../../../modules';
import { captchaType } from '../../../api/config';
import { Modal as ModalBS } from 'react-bootstrap';
import { Modal } from 'src/desktop/components';
import { CustomInput } from 'src/desktop/components';
import { PasswordStrengthMeter } from 'src/desktop/components';
import PinInput from 'react-pin-input';
import { useLocation } from 'react-router-dom';
import { Captcha } from 'src/components';
import { KeyConfirmation } from 'src/mobile/assets/KeyConfirmation';

export const ResetPasswordMobile = (props) => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [newPasswordFocus, setNewPasswordFocus] = React.useState(false);
    const [confirmationPassword, setConfirmationPassword] = React.useState('');
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [showModalConfirmation, setShowModalConfirmation] = React.useState(false);
    const [showModalResendCode, setShowModalResendCode] = React.useState(false);
    const location: { state: { email: string } } = useLocation();
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    const captcha_response = useSelector(selectCaptchaResponse);

    const handleChangePassword = () => {
        const payload = props.hideOldPassword
            ? {
                  password: newPassword,
                  confirm_password: confirmationPassword,
              }
            : {
                  old_password: oldPassword,
                  new_password: newPassword,
                  confirm_password: confirmationPassword,
              };

        props.handleChangePassword(payload);

        setCode('');
        setOldPassword('');
        setNewPassword('');
        setConfirmationPassword('');
        setConfirmPasswordFocus(false);
        setShowModalConfirmation(false);
    };

    const handleChangeOTP = (e) => {
        setCode(e);
        props.handleChangePin(e);
    };

    const handleChangeNewPassword = (value: string) => {
        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(true);
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(false);
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(true);
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(false);
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(true);
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(false);
        }

        setNewPassword(value);
        setTimeout(() => {
            props.fetchCurrentPasswordEntropy({ password: value });
        }, 500);
    };

    const handleFocusNewPassword = () => {
        setPasswordPopUp(!passwordPopUp);
        setNewPasswordFocus(!newPasswordFocus);
    };

    const translate = (key: string) => intl.formatMessage({ id: key });

    const isValidForm = () => {
        const isNewPasswordValid =
            newPassword.match(PASSWORD_REGEX) &&
            passwordErrorFirstSolved &&
            passwordErrorSecondSolved &&
            passwordErrorThirdSolved;
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        const isOldPasswordValid = (!props.hideOldPassword && oldPassword) || true;

        return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    };

    const handleResendCode = () => {
        const email = location.state.email;

        switch (captchaType()) {
            case 'recaptcha':
            case 'geetest':
                dispatch(forgotPassword({ email, captcha_response }));
                break;
            default:
                dispatch(forgotPassword({ email }));
                break;
        }

        setShowModalResendCode(!showModalResendCode);
        dispatch(resetCaptchaState());
    };

    const renderHeaderModalConfirmation = () => {
        return (
            <div className="text-center w-100">
                <h6 className="text-md white-text m-0">Reset Password</h6>
            </div>
        );
    };

    const renderContentModalConfirmation = () => {
        return (
            <React.Fragment>
                <p className="grey-text-accent text-center m-0 mb-24">
                    Are you sure you want to change your password? ,make sure you remember your new password
                </p>

                <div className="d-flex justify-content-center p-0 border-none rounded-bottom-10">
                    <Button type="button" className="btn-danger mr-24" onClick={() => setShowModalConfirmation(false)}>
                        Close
                    </Button>
                    <Button className="btn-primary" onClick={handleChangePassword}>
                        Continue
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    const renderHeaderModalResendCode = () => {
        return (
            <div className="text-center">
                <h6 className="text-md white-text m-0">Resend Code</h6>
            </div>
        );
    };

    const renderContentModalResendCode = () => {
        const { error, success } = props;

        return (
            <React.Fragment>
                <div className="mb-24">
                    <Captcha error={error} success={success} />
                </div>
                <div>
                    <button
                        className="btn-primary btn btn-block"
                        disabled={!captcha_response ? true : false}
                        onClick={handleResendCode}>
                        Resend
                    </button>
                    <button
                        type="button"
                        className="btn-danger btn btn-block mr-24"
                        onClick={() => setShowModalResendCode(!showModalResendCode)}>
                        Close
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const renderForm = () => {
        return (
            <React.Fragment>
                <div className="mobile-container no-header dark-bg-main">
                    <div onClick={() => history.push('/signin')}>
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="mt-4 font-extrabold text-md grey-text-accent mb-3">Change Password</h1>
                    <p className="text-sm grey-text">
                        Change your password and by entering the code that has been sent previously
                    </p>

                    <p className="white-text text-sm mb-8">Pin Code</p>
                    <PinInput
                        length={6}
                        onChange={(e) => handleChangeOTP(e)}
                        onComplete={(e) => handleChangeOTP(e)}
                        type="numeric"
                        inputMode="number"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                        }}
                        inputStyle={{
                            background: 'transparent',
                            borderRadius: '4px',
                            borderColor: '#23262F',
                            fontSize: '20px',
                            color: '#F2F0FF',
                        }}
                        inputFocusStyle={{ fontSize: '20px', color: '#F2F0FF' }}
                        autoSelect={true}
                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                    <div className="w-25 ml-auto">
                        <p
                            onClick={() => setShowModalResendCode(!showModalResendCode)}
                            className="text-right text-sm grey-text cursor-pointer">
                            Resend Code
                        </p>
                    </div>
                    <div>
                        <CustomInput
                            type="password"
                            label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
                            placeholder={intl.formatMessage({
                                id: 'page.body.profile.header.account.content.password.new',
                            })}
                            defaultLabel="New password"
                            handleChangeInput={handleChangeNewPassword}
                            inputValue={newPassword}
                            handleFocusInput={handleFocusNewPassword}
                            classNameLabel="white-text text-sm mb-8"
                            classNameInput={`${
                                newPasswordFocus &&
                                (!passwordErrorFirstSolved ||
                                    !passwordErrorSecondSolved ||
                                    !passwordErrorThirdSolved) &&
                                'error'
                            }`}
                            autoFocus={false}
                            labelVisible
                        />
                        {newPasswordFocus &&
                            (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) && (
                                <p className="danger-text m-0 mb-24 text-xs">Password Strength must be GOOD</p>
                            )}
                    </div>
                    <div>
                        <PasswordStrengthMeter
                            minPasswordEntropy={passwordMinEntropy()}
                            currentPasswordEntropy={props.currentPasswordEntropy}
                            passwordExist={newPassword !== ''}
                            passwordErrorFirstSolved={passwordErrorFirstSolved}
                            passwordErrorSecondSolved={passwordErrorSecondSolved}
                            passwordErrorThirdSolved={passwordErrorThirdSolved}
                            passwordPopUp={passwordPopUp}
                            translate={translate}
                        />
                    </div>
                    <div className="mt-3">
                        <CustomInput
                            type="password"
                            label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
                            placeholder={intl.formatMessage({
                                id: 'page.body.profile.header.account.content.password.conf',
                            })}
                            defaultLabel="Password confirmation"
                            handleChangeInput={setConfirmationPassword}
                            inputValue={confirmationPassword}
                            handleFocusInput={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                            classNameLabel="white-text text-sm mb-8"
                            classNameInput={`${
                                confirmPasswordFocus &&
                                (!passwordErrorFirstSolved ||
                                    !passwordErrorSecondSolved ||
                                    !passwordErrorThirdSolved) &&
                                'error'
                            }`}
                            autoFocus={false}
                            labelVisible
                        />

                        {confirmPasswordFocus && confirmationPassword !== newPassword && (
                            <p className="text-xs danger-text m-0 mb-24">Password Confirmation doesn't match</p>
                        )}
                    </div>

                    <div className="form-button-group mt-4">
                        <div className="footer-section">
                            <Button
                                block={true}
                                disabled={!isValidForm()}
                                onClick={() => setShowModalConfirmation(true)}
                                size="lg"
                                variant="primary">
                                {intl.formatMessage({
                                    id: 'page.body.profile.header.account.content.password.button.change',
                                })}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ========== Show Modal Confirmation Change Password ========= */}
                {showModalConfirmation && (
                    <ModalBS show={showModalConfirmation} onHide={() => setShowModalConfirmation(false)}>
                        <section className="container dark-bg-main p-3">
                            <div className="d-flex justify-content-center my-2">
                                <KeyConfirmation />
                            </div>
                            <div className="text-center">
                                <p className="gradient-text mb-3">Change Password Confirmation</p>
                                <p className="text-secondary text-sm">
                                    Are you sure you want to change your password? ,make sure you remember your new
                                    password
                                </p>
                            </div>
                            <div className="">
                                <Button className="btn btn-primary btn-block" onClick={handleChangePassword}>
                                    Continue
                                </Button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-block"
                                    onClick={() => setShowModalConfirmation(false)}>
                                    Close
                                </button>
                            </div>
                        </section>
                    </ModalBS>
                )}

                {showModalResendCode && (
                    <Modal
                        show={showModalResendCode}
                        header={renderHeaderModalResendCode()}
                        content={renderContentModalResendCode()}
                    />
                )}
            </React.Fragment>
        );
    };

    return <React.Fragment>{renderForm()}</React.Fragment>;
};

export const ChangePasswordMobile = React.memo(ResetPasswordMobile);
