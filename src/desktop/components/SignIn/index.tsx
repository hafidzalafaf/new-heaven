import React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CustomInput } from '../../components';
import { captchaLogin } from '../../../api';
import { EMAIL_REGEX } from '../../../helpers';
import { GeetestCaptchaResponse } from '../../../modules';
import { selectMobileDeviceState } from '../../../modules/public/globalSettings';

export interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading?: boolean;
    signInLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    classNameEmail?: string;
    classNamePassword?: string;
    email: string;
    emailError: string;
    password: string;
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

const SignIn: React.FC<SignInProps> = ({
    email,
    emailError,
    emailPlaceholder,
    password,
    passwordError,
    passwordPlaceholder,
    isLoading,
    signInLoading,
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
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();
    const [selectTab, setSelectTab] = React.useState('email');

    const isValidForm = React.useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }, [email, password]);

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
        () => <div onClick={() => onForgotPassword(email)}>{forgotPasswordLabel || 'Forgot your password?'}</div>,
        [forgotPasswordLabel, onForgotPassword, email]
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

    return (
        <React.Fragment>
            <div>
                <CustomInput
                    type="email"
                    label={emailLabel || 'Email'}
                    placeholder={emailPlaceholder}
                    defaultLabel="Email"
                    handleChangeInput={handleChangeEmail}
                    inputValue={email}
                    handleFocusInput={() => handleFieldFocus('email')}
                    classNameLabel="form-label white-text text-sm"
                    autoFocus={!isMobileDevice}
                    labelVisible
                    classNameInput={classNameEmail}
                />
                {emailError && <div className={'invalid-feedback'}>{emailError}</div>}
            </div>

            <div>
                <CustomInput
                    type="password"
                    label={passwordLabel || 'Password'}
                    placeholder={passwordPlaceholder}
                    defaultLabel="Password"
                    handleChangeInput={handleChangePassword}
                    inputValue={password}
                    handleFocusInput={() => handleFieldFocus('password')}
                    classNameLabel="form-label white-text text-sm"
                    autoFocus={false}
                    labelVisible
                    classNameInput={classNamePassword}
                />
                {passwordError && <div className={'invalid-feedback'}>{passwordError}</div>}
            </div>

            <div className="mt-2 mb-2">{captchaLogin() && renderCaptcha}</div>
            <div className="mt-4">
                <Button
                    block={true}
                    type="button"
                    disabled={isLoading || !email.match(EMAIL_REGEX) || !password || isButtonDisabled || signInLoading}
                    onClick={handleClick as any}
                    size="lg"
                    variant="primary">
                    {isLoading ? 'Loading...' : labelSignIn ? labelSignIn : 'Sign in'}
                </Button>
            </div>
            <div className="position-relative mt-2">
                <div className="text-xs grey-text position-absolute right-position cursor-pointer">
                    {renderForgotButton}
                </div>
            </div>
        </React.Fragment>
    );
};

export const SignInComponent = React.memo(SignIn);
