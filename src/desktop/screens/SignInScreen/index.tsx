import cx from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { captchaType, captchaLogin } from '../../../api';
import { Captcha } from '../../../components';
import { SignInComponent, TwoFactorAuth } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../../helpers';
import { useReduxSelector } from '../../../hooks';
import {
    selectMobileDeviceState,
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
    signInRequire2FA,
    signUpRequireVerification,
    selectSignInError,
    selectRecaptchaSuccess,
    selectGeetestCaptchaSuccess,
    selectCaptchaResponse,
    resetCaptchaState,
    selectCaptchaDataObjectLoading,
} from '../../../modules';

export const SignInScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [emailClassname, setEmailClassname] = useState('');
    const [passwordClassname, setPasswordClassname] = useState('');

    const isLoggedIn = useReduxSelector(selectUserLoggedIn);
    const loading = useReduxSelector(selectUserFetching);
    const require2FA = useReduxSelector(selectSignInRequire2FA);
    const requireEmailVerification = useReduxSelector((x) => x.user.auth.requireVerification);
    const errorSignIn = useReduxSelector(selectSignInError);
    const reCaptchaSuccess = useReduxSelector(selectRecaptchaSuccess);
    const geetestCaptchaSuccess = useReduxSelector(selectGeetestCaptchaSuccess);
    const captcha_response = useReduxSelector(selectCaptchaResponse);
    const isMobileDevice = useReduxSelector(selectMobileDeviceState);

    useEffect(() => {
        if (errorSignIn && errorSignIn.message[0] != '') {
            setEmailClassname('error');
            setPasswordClassname('error');
        }
    }, [errorSignIn]);

    useEffect(() => {
        setDocumentTitle('Sign In');
        dispatch(signInError({ code: 0, message: [''] }));
        dispatch(signUpRequireVerification({ requireVerification: false }));

        return () => {
            dispatch(resetCaptchaState());
        };
    }, []);

    useEffect(() => {
        if (requireEmailVerification) {
            setEmailClassname('');
            setPasswordClassname('');
            history.push('/email-verification', { email: email });
        }
    }, [requireEmailVerification, history]);

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/wallets');
        }
    }, [isLoggedIn, history]);

    useEffect(() => {
        if (captchaType() !== 'none' && captchaLogin() && errorSignIn && !require2FA) {
            dispatch(resetCaptchaState());
        }
    }, [errorSignIn, captchaType(), captchaLogin()]);

    const refreshError = useCallback(() => {
        setEmailError('');
        setPasswordError('');
    }, []);

    const handleChangeOtpCode = useCallback((value: string) => {
        setOtpCode(value);
    }, []);

    const handleSignIn = useCallback(() => {
        dispatch(
            signIn({
                email,
                password,
                ...(captchaType() !== 'none' && captchaLogin() && { captcha_response }),
            })
        );

        localStorage.setItem('sidebar', 'Wallet');
    }, [dispatch, email, password, captcha_response, captchaType()]);

    const handle2FASignIn = useCallback(() => {
        if (otpCode) {
            dispatch(
                signIn({
                    email,
                    password,
                    otp_code: otpCode,
                    ...(captchaType() !== 'none' && captchaLogin() && { captcha_response }),
                })
            );
        }
    }, [dispatch, otpCode, email, password, captchaType(), captchaLogin()]);

    const handleSignUp = useCallback(() => {
        history.push('/signup');
    }, [history]);

    const forgotPassword = useCallback(() => {
        setEmailClassname('');
        setPasswordClassname('');
        history.push('/forgot_password');
    }, [history]);

    const handleFieldFocus = useCallback(
        (field: string) => {
            switch (field) {
                case 'email':
                    setEmailFocused(!emailFocused);
                    break;
                case 'password':
                    setPasswordFocused(!passwordFocused);
                    break;
                default:
                    break;
            }
        },
        [emailFocused, passwordFocused]
    );

    const validateForm = useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            setEmailError(formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError('');
            return;
        }
        if (!password) {
            setEmailError('');
            setPasswordError(formatMessage({ id: ERROR_EMPTY_PASSWORD }));
            return;
        }
    }, [email, password, formatMessage]);

    const handleChangeEmailValue = useCallback((value: string) => {
        setEmail(value);
    }, []);

    const handleChangePasswordValue = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleClose = useCallback(() => {
        setOtpCode('');
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    const renderCaptcha = React.useMemo(() => <Captcha error={errorSignIn || emailError} />, [errorSignIn, emailError]);

    const renderRegister = React.useMemo(
        () => (
            <span>
                <p className="white-text font-bold">
                    Don't have an account?
                    <span className="contrast-text ml-1 cursor-pointer" onClick={() => history.push('/signup')}>
                        Sign Up
                    </span>
                </p>
            </span>
        ),
        [formatMessage, history]
    );

    const handleRemoveRequire2Fa = useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <div className="row sign-in-screen">
                <div className="col-md-5 dark-bg-accent min-h-full px-0">
                    <div className="bg-auth" style={{ backgroundImage: `url('img/bg-auth2.png')` }}></div>
                </div>
                <div className="col-md-7 dark-bg-main min-h-full position-relative">
                    <div className="text-to-signin">
                        <div className="mt-4">{renderRegister}</div>
                    </div>
                    <div className="main-wrapper d-flex align-items-center">
                        <div className="main-form position-relative">
                            {require2FA ? (
                                <React.Fragment>
                                    <h2 className="title-2 white-text font-semibold">Two Factor Autentication</h2>
                                    <p className="text-sm grey-text mb-24">
                                        {formatMessage({ id: 'page.password2fa.message' })}
                                    </p>

                                    <TwoFactorAuth
                                        isMobile={isMobileDevice}
                                        isLoading={loading}
                                        onSubmit={handle2FASignIn}
                                        title={formatMessage({ id: 'page.password2fa' })}
                                        buttonLabel={formatMessage({ id: 'page.header.signIn' })}
                                        message={formatMessage({ id: 'page.password2fa.message' })}
                                        otpCode={otpCode}
                                        handleOtpCodeChange={handleChangeOtpCode}
                                        handleClose2fa={handleClose}
                                    />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <h2 className="title-2 white-text font-semibold">Sign In</h2>
                                    <SignInComponent
                                        email={email}
                                        emailError={emailError}
                                        emailFocused={emailFocused}
                                        emailPlaceholder={formatMessage({ id: 'page.header.signIn.email' })}
                                        password={password}
                                        passwordError={passwordError}
                                        passwordFocused={passwordFocused}
                                        passwordPlaceholder={formatMessage({ id: 'page.header.signIn.password' })}
                                        labelSignIn={formatMessage({ id: 'page.header.signIn' })}
                                        labelSignUp={formatMessage({ id: 'page.header.signUp' })}
                                        emailLabel={formatMessage({ id: 'page.header.signIn.email' })}
                                        passwordLabel={formatMessage({ id: 'page.header.signIn.password' })}
                                        receiveConfirmationLabel={formatMessage({
                                            id: 'page.header.signIn.receiveConfirmation',
                                        })}
                                        forgotPasswordLabel={formatMessage({
                                            id: 'page.header.signIn.forgotPassword',
                                        })}
                                        isLoading={loading}
                                        onForgotPassword={forgotPassword}
                                        onSignUp={handleSignUp}
                                        onSignIn={handleSignIn}
                                        handleChangeFocusField={handleFieldFocus}
                                        isFormValid={validateForm}
                                        refreshError={refreshError}
                                        changeEmail={handleChangeEmailValue}
                                        changePassword={handleChangePasswordValue}
                                        renderCaptcha={renderCaptcha}
                                        reCaptchaSuccess={reCaptchaSuccess}
                                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                                        captcha_response={captcha_response}
                                        classNameEmail={emailClassname}
                                        classNamePassword={passwordClassname}
                                        // captchaLoading={captchaLoading}
                                    />
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
