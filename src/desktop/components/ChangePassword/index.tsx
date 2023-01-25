import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { passwordMinEntropy } from '../../../api/config';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../../helpers';
import { forgotPassword, resetCaptchaState, selectCaptchaResponse } from '../../../modules';
import { captchaType } from '../../../api/config';
import { CustomInput } from '../CustomInput';
import { Modal } from '../Modal';
import { PasswordStrengthMeter } from '../index';
import PinInput from 'react-pin-input';
import { useLocation } from 'react-router-dom';
import { Captcha } from 'src/components';
import moment from 'moment';

export const ChangePasswordComponent = (props) => {
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
    const [seconds, setSeconds] = React.useState(30000);
    const [timerActive, setTimerActive] = React.useState(true);

    const location: { state: { email: string } } = useLocation();
    const dispatch = useDispatch();
    const intl = useIntl();

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

    React.useEffect(() => {
        let timer = null;
        if (timerActive) {
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1000);

                if (seconds === 0) {
                    setTimerActive(false);
                    setSeconds(30000);
                }
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    });

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
                setTimerActive(true);
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
            <div className="text-center w-100">
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
                <div className="d-flex justify-content-center p-0 border-none rounded-bottom-10">
                    <Button
                        type="button"
                        className="btn-danger mr-24"
                        onClick={() => setShowModalResendCode(!showModalResendCode)}>
                        Close
                    </Button>
                    <Button
                        className="btn-primary"
                        disabled={!captcha_response ? true : false}
                        onClick={handleResendCode}>
                        Resend
                    </Button>
                </div>
            </React.Fragment>
        );
    };

    const renderForm = () => {
        return (
            <React.Fragment>
                <h3 className="mb-8 title-2 white-text font-semibold">Reset Password</h3>
                <h5 className="mb-24 text-sm grey-text">
                    We send an email to your address, please check your inbox and find the confirmation code we've sent
                    you
                </h5>

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
                    autoSelect={false}
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
                <button
                    onClick={() => setShowModalResendCode(!showModalResendCode)}
                    disabled={timerActive}
                    className={`text-right text-sm cursor-pointer m-0 p-0 btn-transparent ${
                        timerActive ? 'grey-text' : 'gradient-text'
                    }`}>
                    Resend Code
                </button>
                <p className={`text-right text-xs cursor-pointer ${timerActive ? 'white-text' : 'grey-text'}`}>
                    {moment(seconds).format('mm:ss')}
                </p>
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
                            (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) &&
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
                            (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) &&
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

                {showModalConfirmation && (
                    <Modal
                        show={showModalConfirmation}
                        header={renderHeaderModalConfirmation()}
                        content={renderContentModalConfirmation()}
                    />
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

export const ChangePassword = React.memo(ChangePasswordComponent);
