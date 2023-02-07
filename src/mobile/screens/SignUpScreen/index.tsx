import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { CustomInput, PasswordStrengthMeter } from '../../../desktop/components';
import { passwordMinEntropy, captchaType, isUsernameEnabled } from '../../../api/config';
import { ArrowLeft } from '../../assets/Arrow';
import { Close } from '../../assets/Closeicon';
import { DropdownSmall } from '../../assets/Dropdown';
import { ModalFullScreenMobile } from '../../components';
import { Captcha } from '../../../components';
import {
    resetCaptchaState,
    selectCaptchaResponse,
    selectCurrentLanguage,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
    selectCurrentPasswordEntropy,
    entropyPasswordFetch,
} from '../../../modules';
import {
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
    PASSWORD_REGEX,
    USERNAME_REGEX,
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    setDocumentTitle,
} from '../../../helpers';

const SignUpMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<{ search?: string }>();
    const intl = useIntl();

    const myRef = React.createRef<HTMLInputElement>();
    const passwordWrapper = React.createRef<HTMLDivElement>();

    const [usernameValue, setUsernamevalue] = React.useState('');
    const [emailValue, setEmailValue] = React.useState('');
    const [passwordValue, setPasswordvalue] = React.useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = React.useState('');
    const [referralValue, setReferralValue] = React.useState('');

    const [usernameError, setUsernameError] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
    const [referralError, setReferralError] = React.useState('');

    const [usernameFocus, setUsernameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [referralFocus, setReferralFocus] = React.useState(false);

    const [showReferral, setShowReferral] = React.useState(false);
    const [showTos, setShowTos] = React.useState(false);

    const [hasConfirmed, setHasConfirmed] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);

    const translate = (key: string) => intl.formatMessage({ id: key });

    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);
    const i18n = useSelector(selectCurrentLanguage);
    const requireVerification = useSelector(selectSignUpRequireVerification);
    const signUpError = useSelector(selectSignUpError);
    const captcha_response = useSelector(selectCaptchaResponse);
    const reCaptchaSuccess = useSelector(selectRecaptchaSuccess);
    const geetestCaptchaSuccess = useSelector(selectGeetestCaptchaSuccess);

    const handleChangeUsername = (value: string) => {
        setUsernamevalue(value.replace(/[^A-Za-z0-9]+/g, '').toLowerCase());
    };

    const handleChangeEmail = (value: string) => {
        setEmailValue(value);
    };

    const handleChangePassword = (value: string) => {
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

        setPasswordvalue(value);
        setTimeout(() => {
            dispatch(entropyPasswordFetch({ password: value }));
        }, 100);
    };

    const handleChangeConfirmPassword = (value: string) => {
        setConfirmPasswordValue(value);
        setConfirmPasswordFocus(true);
    };

    const handleChangeReferral = (value: string) => {
        setReferralValue(value);
    };

    const handleFocusUsername = () => {
        setUsernameFocus(!usernameFocus);
    };

    const handleFocusEmail = () => {
        setEmailFocus(!emailFocus);
    };

    const handleFocusPassword = () => {
        setPasswordFocus(!passwordFocus);
        setPasswordPopUp(!passwordPopUp);
    };

    const handleFocusConfirmPassword = () => {
        setConfirmPasswordFocus(!confirmPasswordFocus);
    };

    const handleFocusReferral = () => {
        setReferralFocus(!referralFocus);
    };

    const isValidForm = () => {
        if (
            !passwordErrorFirstSolved ||
            !passwordErrorSecondSolved ||
            !passwordErrorThirdSolved ||
            !usernameValue.match(USERNAME_REGEX) ||
            !emailValue.match(EMAIL_REGEX) ||
            !passwordValue.match(PASSWORD_REGEX) ||
            passwordError === confirmPasswordValue
        ) {
            return true;
        }
    };

    const handleSignUp = () => {
        const payload = {
            email: emailValue,
            password: passwordValue,
            data: JSON.stringify({
                language: i18n,
            }),
            ...(isUsernameEnabled() && { username: usernameValue }),
            ...(referralValue && { refid: referralValue }),
            ...(captchaType() !== 'none' && { captcha_response }),
        };

        dispatch(signUp(payload));
        dispatch(resetCaptchaState());
    };

    const extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    const handleValidateForm = () => {
        const isEmailValid = emailValue.match(EMAIL_REGEX);
        const isPasswordValid = passwordValue.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = passwordValue === confirmPasswordValue;

        if (!isEmailValid && !isPasswordValid) {
            setConfirmPasswordError('');
            setEmailError(intl.formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError(intl.formatMessage({ id: ERROR_INVALID_PASSWORD }));
            setHasConfirmed(false);
            return;
        }

        if (!isEmailValid) {
            setConfirmPasswordError('');
            setEmailError(intl.formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError('');
            setHasConfirmed(false);
            return;
        }

        if (!isPasswordValid) {
            setConfirmPasswordError('');
            setEmailError('');
            setPasswordError(intl.formatMessage({ id: ERROR_INVALID_PASSWORD }));
            setHasConfirmed(false);
            return;
        }

        if (!isConfirmPasswordValid) {
            setConfirmPasswordError(intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }));
            setEmailError('');
            setPasswordError('');
            setHasConfirmed(false);
            return;
        }
    };

    const handleSubmitForm = React.useCallback(() => {
        handleSignUp();
        setShowTos(false);
    }, [handleSignUp]);

    const clearFields = () => {
        setConfirmPasswordError('');
        setEmailError('');
        setPasswordError('');
    };

    const handleOutsideClick = (event) => {
        const wrapperElement = passwordWrapper.current;

        if (wrapperElement && !wrapperElement.contains(event.target)) {
            setPasswordPopUp(false);
        }
    };

    const handleCheckboxClick = (event) => {
        if (event) {
            event.preventDefault();
            setHasConfirmed(!hasConfirmed);
            clearFields();
        }
    };

    const handleClick = React.useCallback(
        (e?: React.FormEvent<HTMLInputElement>) => {
            if (e) {
                e.preventDefault();
            }

            if (!isValidForm()) {
                handleValidateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, isValidForm, handleValidateForm]
    );

    const handleCheck = () => {
        if (hasConfirmed === false) {
            setHasConfirmed(true);
        }
        setHasConfirmed(false);
    };

    const handleSubmit = async (e: any) => {
        await handleClick(e);
        await handleCheck();
        await handleCheckboxClick(e);
        await handleSubmitForm();
    };

    React.useEffect(() => {
        setDocumentTitle('Sign Up');

        const localReferralCode = localStorage.getItem('referralCode');
        const refId = extractRefID(location.search);
        const referralCode = refId || localReferralCode || '';
        setReferralValue(referralCode);
        if (refId && refId !== localReferralCode) {
            localStorage.setItem('referralCode', referralCode);
        }

        document.addEventListener('click', handleOutsideClick, false);
    }, []);

    React.useEffect(() => {
        if (requireVerification) {
            history.push('/email-verification', { email: emailValue });
        }
    }, [requireVerification, history]);

    React.useEffect(() => {
        return () => {
            document.removeEventListener('click', handleOutsideClick, false);
        };
    }, [handleOutsideClick]);

    const disableButton = React.useMemo((): boolean => {
        const captchaTypeValue = captchaType();

        if (
            // !hasConfirmed ||
            !passwordErrorFirstSolved ||
            !passwordErrorSecondSolved ||
            !passwordErrorThirdSolved ||
            !emailValue.match(EMAIL_REGEX) ||
            confirmPasswordValue !== passwordValue ||
            !passwordValue ||
            !confirmPasswordValue ||
            (isUsernameEnabled() && !usernameValue.match(USERNAME_REGEX))
        ) {
            return true;
        }

        if (captchaTypeValue === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (captchaTypeValue === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
    }, [
        captchaType,
        confirmPasswordValue,
        usernameValue,
        emailValue,
        geetestCaptchaSuccess,
        hasConfirmed,
        passwordValue,
        reCaptchaSuccess,
    ]);

    const renderCaptcha = () => {
        const error = signUpError || confirmPasswordError || emailError;

        return <Captcha error={error} />;
    };

    const renderTosHeader = () => (
        <div className="d-flex flex-row justify-content-between align-items-center">
            <h5 className="text-md font-bold white-text">Term of Service</h5>
            <Close className={'cursor-pointer'} onClick={() => setShowTos(false)} />
        </div>
    );

    const renderTosContent = () => (
        <React.Fragment>
            <div className="showTos-wrapper">
                <p className="grey-text-accent">GENERAL TERMS AND CONDITIONS</p>
                <p className="grey-text-accent">
                    HEAVEN EXCHANGE General Terms and Conditions (hereinafter referred to as "SKU") are provisions that
                    contain terms and conditions regarding the use of products, services, technology, features services
                    provided by HEAVEN EXCHANGE including, but not limited to the use of the Website, Indonesian Bitcoin
                    Wallet and HEAVEN EXCHANGE Trading Platform (Trading App) (hereinafter referred to as the "HEAVEN
                    EXCHANGE Platform"). hereinafter referred to as the "HEAVEN EXCHANGE Platform") to the extent not
                    specifically regulated as set out in the HEAVEN EXCHANGE Account registration section which is made
                    on the day and date listed in the Account registration section https://heavenexchange.io,
                    constitutes an integral and inseparable unity and approval of this GTC. By registering to become
                    Member/Verified Member, you declare that you have READ, UNDERSTAND, AGREE and FOLLOW the Terms and
                    Conditions below. You are advised to read all terms and conditions carefully before using the HEAVEN
                    EXCHANGE platform services or any services that are provided, and together with this you agree and
                    bind yourself to all activities in this GTC with the terms and conditions as follows in this GTC
                    with the following terms and conditions: DEFINITIONS as long as the context sentence does not
                    determine otherwise, the terms or definitions in the GTC have the following meanings :
                </p>
                <p className="grey-text-accent">
                    Website refers to an online site with the address https://heavenexchange.io. This website is managed
                    by HEAVEN EXCHANGE, with no limitation to its owners, investors, employees and related parties.
                    parties associated with HEAVEN EXCHANGE. Depending on the context, "Website" may also refer to other
                    services, products, sites, content or services provided by HEAVEN EXCHANGE. Crypto Assets are
                    digital commodities that use the principle of decentralized technology based on a peer-to-peer
                    network (interface) or referred to as a Blockchain Network that is traded on the Blockchain platform
                    is an open distributed ledger that can record transactions. ledger that can record transactions
                    between two parties efficiently and in a permanently verifiable manner. that can be permanently
                    verified. Registration is the process of registering to become a Member in the HEAVEN EXCHANGE
                    platform which is the initial verification process to obtain information, statements in the use of
                    platform services Member is a person (individual), business entity, or legal entity that has
                    registered on the HEAVEN EXCHANGE platform, so as to obtain authorization from the HEAVEN EXCHANGE
                    platform to carry out
                </p>
                <div className=" d-flex flex-row justify-content-between align-items-center w-100">
                    <button
                        type="button"
                        className="btn btn-primary btn-mobile w-50 mx-2"
                        onClick={(e) => handleSubmit(e)}>
                        Accept
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-outline btn-mobile w-50 mx-2"
                        data-dismiss="modal"
                        onClick={() => setShowTos(false)}>
                        Close
                    </button>
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className="mobile-container no-header dark-bg-main">
                <Link to={''}>
                    <ArrowLeft className={'back'} />
                </Link>
                <h2 className="mt-4 font-extrabold text-md grey-text-accent mb-3">Create Personal Account</h2>
                <form
                    className="form-sign-up tab-pane fade show active"
                    id="nav-username"
                    role="tabpanel"
                    aria-labelledby="nav-username-tab">
                    <div>
                        <CustomInput
                            defaultLabel="Username"
                            label="Username"
                            placeholder="Your Username"
                            type="text"
                            classNameLabel="white-text text-sm"
                            classNameInput={`text-ms input-mobile ${
                                usernameFocus && !usernameValue.match(USERNAME_REGEX) && 'error'
                            }`}
                            inputValue={usernameValue}
                            handleChangeInput={handleChangeUsername}
                            handleFocusInput={handleFocusUsername}
                            labelVisible
                        />
                        {usernameFocus && !usernameValue.match(USERNAME_REGEX) && (
                            <p className="text-xs danger-text m-0 mb-24">
                                Username must be at least 4 characters long and maximum 12 characters
                            </p>
                        )}
                    </div>

                    <div>
                        <CustomInput
                            defaultLabel="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                            classNameLabel="white-text text-sm"
                            classNameInput={`text-ms input-mobile ${
                                emailFocus && !emailValue.match(EMAIL_REGEX) && 'error'
                            }`}
                            handleChangeInput={handleChangeEmail}
                            inputValue={emailValue}
                            handleFocusInput={handleFocusEmail}
                            labelVisible
                        />
                        {emailFocus && !emailValue.match(EMAIL_REGEX) && (
                            <p className="text-xs danger-text m-0 mb-24">Enter a valid email address</p>
                        )}
                    </div>

                    <div>
                        <CustomInput
                            defaultLabel="Password "
                            label="Password"
                            placeholder="Password"
                            type="password"
                            labelVisible
                            inputValue={passwordValue}
                            handleChangeInput={handleChangePassword}
                            handleFocusInput={handleFocusPassword}
                            classNameLabel="white-text text-sm"
                            classNameInput={`input-mobile ${
                                passwordFocus &&
                                (!passwordErrorFirstSolved ||
                                    !passwordErrorSecondSolved ||
                                    !passwordErrorThirdSolved) &&
                                'error'
                            }`}
                            autoFocus={false}
                        />

                        {passwordFocus &&
                            (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) && (
                                <p className="danger-text m-0 mb-24 text-xs">Password Strength must be GOOD</p>
                            )}
                    </div>

                    <div>
                        <PasswordStrengthMeter
                            minPasswordEntropy={passwordMinEntropy()}
                            currentPasswordEntropy={currentPasswordEntropy}
                            passwordExist={passwordValue !== ''}
                            passwordErrorFirstSolved={passwordErrorFirstSolved}
                            passwordErrorSecondSolved={passwordErrorSecondSolved}
                            passwordErrorThirdSolved={passwordErrorThirdSolved}
                            passwordPopUp={passwordPopUp}
                            translate={translate}
                        />
                    </div>

                    <div>
                        <CustomInput
                            defaultLabel="Confirm Password"
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            type="password"
                            labelVisible
                            classNameLabel="white-text text-sm"
                            classNameInput={`input-mobile ${
                                confirmPasswordFocus && confirmPasswordValue !== passwordValue && 'error'
                            }`}
                            autoFocus={false}
                            inputValue={confirmPasswordValue}
                            handleChangeInput={handleChangeConfirmPassword}
                            handleFocusInput={handleFocusConfirmPassword}
                        />

                        {confirmPasswordFocus && confirmPasswordValue !== passwordValue && (
                            <p className="text-xs danger-text m-0 mb-24">Password Confirmation doesn't match</p>
                        )}
                    </div>

                    <div className="group mb-3">
                        <label
                            className="text-sm white-text font-normal"
                            onClick={() => setShowReferral(!showReferral)}>
                            Referral ID (Optional) <DropdownSmall className={showReferral ? 'rotate-180' : ''} />
                        </label>
                        {showReferral && (
                            <CustomInput
                                defaultLabel="Referral ID"
                                label="Referral ID"
                                placeholder="Referral ID"
                                type="text"
                                classNameLabel="white-text text-sm d-none"
                                classNameInput="text-ms input-mobile"
                                inputValue={referralValue}
                                handleChangeInput={handleChangeReferral}
                                handleFocusInput={handleFocusReferral}
                                labelVisible={false}
                            />
                        )}
                    </div>

                    <div className="my-3">{renderCaptcha()}</div>

                    <button
                        type="button"
                        className="btn btn-primary btn-block btn-mobile my-3"
                        disabled={disableButton}
                        onClick={() => setShowTos(true)}>
                        Create Account
                    </button>
                    <p className="create-account text-xs text-center font-semibold grey-text-accent mt-3">
                        Already have an Account?{' '}
                        <Link to={'/signin'} className="contrast-text">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            <ModalFullScreenMobile content={renderTosContent()} header={renderTosHeader()} show={showTos} />
        </React.Fragment>
    );
};

export { SignUpMobileScreen };
