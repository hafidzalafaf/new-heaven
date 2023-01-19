import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useReduxSelector } from 'src/hooks';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../../helpers';
import { captchaType, captchaLogin } from 'src/api';
import { CustomInput } from '../../../desktop/components';
import { ModalMobile } from '../../components';
import { ArrowLeft } from '../../assets/Arrow';
import { UnlockIcon } from '../../assets/UnlockIcon';
import { ModalCheck } from '../../assets/Modal';
import { GeetestCaptchaResponse } from '../../../modules';

export interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    classNameEmail?: string;
    classNamePassword?: string;
    emailValue: string;
    emailError: string;
    passwordValue: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}

const SignInMobile: React.FC<SignInProps> = ({
    emailValue,
    emailError,
    emailPlaceholder,
    passwordValue,
    passwordError,
    passwordPlaceholder,
    isLoading,
    onSignUp,
    labelSignIn,
    labelSignUp,
    emailLabel,
    passwordLabel,
    emailFocused,
    passwordFocused,
    onForgotPassword,
    forgotPasswordLabel,
    refreshError,
    onSignIn,
    isFormValid,
    handleChangeFocusField,
    changePassword,
    changeEmail,
    captchaType,
    geetestCaptchaSuccess,
    reCaptchaSuccess,
    renderCaptcha,
    classNameEmail,
    classNamePassword,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [showModal, setShowModal] = React.useState(false);

    const isValidForm = React.useCallback(() => {
        const isEmailValid = emailValue.match(EMAIL_REGEX);

        return emailValue && isEmailValid && passwordValue;
    }, [emailValue, passwordValue]);

    const handleChangeEmail = React.useCallback(
        (value: string) => {
            changeEmail(value);
        },
        [changeEmail]
    );

    const handleChangePassword = React.useCallback(
        (value: string) => {
            changePassword(value);
        },
        [changePassword]
    );

    const handleFieldFocus = React.useCallback(
        (field: string) => {
            handleChangeFocusField(field);
        },
        [handleChangeFocusField]
    );

    const isButtonDisabled = React.useMemo(
        () => !!(captchaLogin() && captchaType !== 'none' && !(reCaptchaSuccess || geetestCaptchaSuccess)),
        [reCaptchaSuccess, geetestCaptchaSuccess]
    );

    const handleSubmitForm = React.useCallback(() => {
        refreshError();
        onSignIn();
    }, [onSignIn, refreshError]);

    const handleValidateForm = React.useCallback(() => {
        isFormValid();
    }, [isFormValid]);

    const handleClick = React.useCallback(
        (e?: MouseEvent) => {
            if (e) {
                e.preventDefault();
            }
            if (!isValidForm()) {
                handleValidateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, handleValidateForm, isValidForm]
    );

    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                handleClick();
            }
        },
        [handleClick]
    );

    const renderForgotButton = React.useMemo(
        () => <div onClick={() => onForgotPassword(emailValue)}>{forgotPasswordLabel || 'Forgot your password?'}</div>,
        [forgotPasswordLabel, onForgotPassword, emailValue]
    );

    const renderRegister = React.useMemo(
        () => (
            <span>
                {formatMessage({ id: 'page.header.signIN.noAccountYet' })}
                <span onClick={() => history.push('/signup')}>
                    {formatMessage({ id: 'page.body.landing.header.button3' })}
                </span>
            </span>
        ),
        [formatMessage, history]
    );

    const renderModal = () => (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <ModalCheck className={''} />
            </div>
            <h5 className="text-md font-extrabold contrast-text text-center mb-3">Forgot Password?</h5>
            <p className="text-center text-sm grey-text">
                Don’t worry it happens, Please click continue to associated with your account
            </p>
            <Link to={'/forgot-password'} className="btn btn-primary btn-mobile btn-block mb-3">
                Continue
            </Link>
            <button className="btn btn-success btn-mobile btn-outline w-100" onClick={() => setShowModal(false)}>
                Close
            </button>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Link to={''}>
                <ArrowLeft className={'back'} />
            </Link>
            <h1 className="mt-4 font-extrabold text-md grey-text-accent mb-3">Heaven Exchange Login</h1>
            <div className="d-flex justify-content-start align-items-center mb-4">
                <UnlockIcon className={'mr-2'} />
                <p className="text-xs grey-text font-bold mb-0">https://www.heavenexchange.io/signin</p>
            </div>
            <form
                className="form-sign-up tab-pane fade show active"
                id="nav-email"
                role="tabpanel"
                aria-labelledby="nav-email-tab">
                <div>
                    <CustomInput
                        defaultLabel="email"
                        inputValue={emailValue}
                        label={emailLabel || 'Email'}
                        handleFocusInput={() => handleFieldFocus('email')}
                        placeholder={emailPlaceholder}
                        type="email"
                        classNameLabel="white-text text-sm"
                        classNameInput="text-ms input-mobile"
                        handleChangeInput={handleChangeEmail}
                        labelVisible
                    />
                    {emailError && <div className={'invalid-feedback'}>{emailError}</div>}
                </div>

                <div>
                    <CustomInput
                        defaultLabel="Password"
                        inputValue={passwordValue}
                        label={passwordLabel || 'Password'}
                        placeholder={passwordPlaceholder}
                        handleFocusInput={() => handleFieldFocus('password')}
                        type="password"
                        classNameLabel="white-text text-sm"
                        classNameInput="text-ms input-mobile"
                        handleChangeInput={handleChangePassword}
                        labelVisible
                    />
                    {passwordError && <div className={'invalid-feedback'}>{passwordError}</div>}

                    <div className="">
                        <p className="ml-auto  w-max-content contrast-text text-sm" onClick={() => setShowModal(true)}>
                            Forgot Password?
                        </p>
                    </div>
                </div>

                <div className="mt-2 mb-2">{captchaLogin() && renderCaptcha}</div>

                <button
                    className="btn btn-primary btn-block btn-mobile"
                    disabled={isLoading || !emailValue.match(EMAIL_REGEX) || !passwordValue || isButtonDisabled}
                    onClick={handleClick as any}>
                    Login
                </button>

                <p className="create-account text-xs text-center font-semibold grey-text-accent mt-3">
                    Create Heaven Exchange account?{' '}
                    <Link to={'/signup'} className="contrast-text">
                        Sign up
                    </Link>
                </p>
            </form>

            <ModalMobile content={renderModal()} show={showModal} />
        </React.Fragment>
    );
};

export { SignInMobile };
