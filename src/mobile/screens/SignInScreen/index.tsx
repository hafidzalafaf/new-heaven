import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import {
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
    selectSignInLoading,
} from '../../../modules';
import { useHistory } from 'react-router';
import { useReduxSelector } from 'src/hooks';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../../helpers';
import { captchaType, captchaLogin } from 'src/api';
import { Captcha } from '../../../components';
import { SignInMobile, TwoFaAuthenticationMobile } from '../../containers';

const SignInMobileScreen: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    const isLoggedIn = useReduxSelector(selectUserLoggedIn);
    const loading = useReduxSelector(selectUserFetching);
    const require2FA = useReduxSelector(selectSignInRequire2FA);
    const requireEmailVerification = useReduxSelector((x) => x.user.auth.requireVerification);
    const errorSignIn = useReduxSelector(selectSignInError);
    const reCaptchaSuccess = useReduxSelector(selectRecaptchaSuccess);
    const geetestCaptchaSuccess = useReduxSelector(selectGeetestCaptchaSuccess);
    const captcha_response = useReduxSelector(selectCaptchaResponse);
    const signInLoading = useReduxSelector(selectSignInLoading);

    const [emailValue, setEmailvalue] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [emailFocused, setEmailFocused] = React.useState(false);
    const [passwordValue, setPasswordvalue] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [passwordFocused, setPasswordFocused] = React.useState(false);
    const [emailClassname, setEmailClassname] = React.useState('');
    const [passwordClassname, setPasswordClassname] = React.useState('');
    const [otpCode, setOtpCode] = React.useState('');

    React.useEffect(() => {
        if (errorSignIn && errorSignIn.message[0] != '') {
            setEmailClassname('error');
            setPasswordClassname('error');
        }
    }, [errorSignIn]);

    React.useEffect(() => {
        setDocumentTitle('Sign In');
        dispatch(signInError({ code: 0, message: [''] }));
        dispatch(signUpRequireVerification({ requireVerification: false }));

        return () => {
            dispatch(resetCaptchaState());
        };
    }, []);

    React.useEffect(() => {
        if (requireEmailVerification) {
            setEmailClassname('');
            setPasswordClassname('');
            history.push('/email-verification', { email: emailValue });
        }
    }, [requireEmailVerification, history]);

    React.useEffect(() => {
        if (isLoggedIn) {
            history.push('/wallets');
        }
    }, [isLoggedIn, history]);

    React.useEffect(() => {
        if (captchaType() !== 'none' && captchaLogin() && errorSignIn && !require2FA) {
            dispatch(resetCaptchaState());
        }
    }, [errorSignIn, captchaType(), captchaLogin()]);

    const refreshError = React.useCallback(() => {
        setEmailError('');
        setPasswordError('');
    }, []);

    const handleOtpCodeChange = React.useCallback((e: any) => {
        setOtpCode(e);
    }, []);

    const handleSignIn = React.useCallback(() => {
        dispatch(
            signIn({
                email: emailValue,
                password: passwordValue,
                ...(captchaType() !== 'none' && captchaLogin() && { captcha_response }),
            })
        );
    }, [dispatch, emailValue, passwordValue, captcha_response, captchaType()]);

    const handle2FASignIn = React.useCallback(() => {
        if (otpCode) {
            dispatch(
                signIn({
                    email: emailValue,
                    password: passwordValue,
                    otp_code: otpCode,
                    ...(captchaType() !== 'none' && captchaLogin() && { captcha_response }),
                })
            );
        }
    }, [dispatch, otpCode, emailValue, passwordValue, captchaType(), captchaLogin()]);

    const handleSignUp = React.useCallback(() => {
        history.push('/signup');
    }, [history]);

    const forgotPassword = React.useCallback(() => {
        setEmailClassname('');
        setPasswordClassname('');
        history.push('/forgot_password');
    }, [history]);

    const handleFieldFocus = React.useCallback(
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

    const validateForm = React.useCallback(() => {
        const isEmailValid = emailValue.match(EMAIL_REGEX);

        if (!isEmailValid) {
            setEmailError(formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError('');
            return;
        }
        if (!passwordValue) {
            setEmailError('');
            setPasswordError(formatMessage({ id: ERROR_EMPTY_PASSWORD }));
            return;
        }
    }, [emailValue, passwordValue, formatMessage]);

    const handleChangeEmailValue = React.useCallback((value: string) => {
        setEmailvalue(value);
    }, []);

    const handleChangePasswordValue = React.useCallback((value: string) => {
        setPasswordvalue(value);
    }, []);

    const handleClose = React.useCallback(() => {
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

    const handleRemoveRequire2Fa = React.useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);
    return (
        <React.Fragment>
            <div className="mobile-container no-header dark-bg-main">
                {require2FA ? (
                    <TwoFaAuthenticationMobile
                        isLoading={loading}
                        onSubmit={handle2FASignIn}
                        title={formatMessage({ id: 'page.password2fa' })}
                        buttonLabel={formatMessage({ id: 'page.header.signIn' })}
                        message={formatMessage({ id: 'page.password2fa.message' })}
                        otpCode={otpCode}
                        handleOtpCodeChange={handleOtpCodeChange}
                        handleClose2fa={handleClose}
                        signInLoading={signInLoading}
                    />
                ) : (
                    <SignInMobile
                        emailValue={emailValue}
                        emailError={emailError}
                        emailFocused={emailFocused}
                        emailPlaceholder={formatMessage({ id: 'page.header.signIn.email' })}
                        passwordValue={passwordValue}
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
                        signInLoading={signInLoading}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export { SignInMobileScreen };
