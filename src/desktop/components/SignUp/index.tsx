import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CustomInput, PasswordStrengthMeter } from '../';
import { isUsernameEnabled } from '../../../api';
import { captchaType, passwordMinEntropy } from '../../../api/config';
import {
    EMAIL_REGEX,
    ERROR_LONG_USERNAME,
    ERROR_SHORT_USERNAME,
    PASSWORD_REGEX,
    USERNAME_REGEX,
} from '../../../helpers';
import { GeetestCaptchaResponse } from '../../../modules';
import { selectMobileDeviceState } from '../../../modules/public/globalSettings';
import { ArrowDownIcon } from 'src/assets/images/ArrowDownIcon';
import { ArrowUpIcon } from 'src/assets/images/ArrowUpIcon';
import './SignUp.pcss';
import 'react-phone-input-2/lib/style.css';

export interface SignUpFormProps {
    isLoading?: boolean;
    title?: string;
    type?: string;
    onSignUp: () => void;
    onSignIn?: () => void;
    className?: string;
    image?: string;
    labelSignIn?: string;
    labelSignUp?: string;
    usernameLabel?: string;
    emailLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    referalCodeLabel?: string;
    termsMessage?: string;
    refId: string;
    password: string;
    username: string;
    email: string;
    confirmPassword: string;
    handleChangeUsername: (value: string) => void;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword: (value: string) => void;
    handleChangeRefId: (value: string) => void;
    hasConfirmed: boolean;
    clickCheckBox: (e: any) => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    confirmationError: string;
    handleFocusUsername: () => void;
    handleFocusEmail: () => void;
    handleFocusPassword: () => void;
    handleFocusConfirmPassword: () => void;
    handleFocusRefId: () => void;
    confirmPasswordFocused: boolean;
    refIdFocused: boolean;
    usernameFocused: boolean;
    emailFocused: boolean;
    passwordFocused: boolean;
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
    currentPasswordEntropy: number;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    myRef: any;
    passwordWrapper: any;
    translate: (id: string) => string;
}

const SignUpFormComponent: React.FC<SignUpFormProps> = ({
    username,
    email,
    type,
    confirmPassword,
    refId,
    onSignIn,
    image,
    isLoading,
    labelSignIn,
    labelSignUp,
    usernameLabel,
    emailLabel,
    confirmPasswordLabel,
    passwordFocused,
    referalCodeLabel,
    termsMessage,
    geetestCaptchaSuccess,
    hasConfirmed,
    reCaptchaSuccess,
    currentPasswordEntropy,
    passwordPopUp,
    password,
    passwordLabel,
    emailError,
    translate,
    confirmationError,
    usernameFocused,
    emailFocused,
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    confirmPasswordFocused,
    handleChangePassword,
    passwordErrorThirdSolved,
    handleFocusPassword,
    refIdFocused,
    validateForm,
    onSignUp,
    handleChangeUsername,
    handleFocusUsername,
    handleChangeEmail,
    handleFocusEmail,
    handleChangeConfirmPassword,
    handleFocusConfirmPassword,
    handleChangeRefId,
    handleFocusRefId,
    clickCheckBox,
    renderCaptcha,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const [expand, setExpand] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [showModalAddBeneficiary, setShowModalModalAddBeneficiary] = React.useState(false);
    const [showModalBeneficiaryList, setShowModalBeneficiaryList] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const disableButton = React.useMemo((): boolean => {
        const captchaTypeValue = captchaType();

        if (
            // !hasConfirmed ||
            !passwordErrorFirstSolved ||
            !passwordErrorSecondSolved ||
            !passwordErrorThirdSolved ||
            isLoading ||
            !email.match(EMAIL_REGEX) ||
            confirmPassword !== password ||
            !password ||
            !confirmPassword ||
            (isUsernameEnabled() && !username.match(USERNAME_REGEX))
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
        confirmPassword,
        username,
        email,
        geetestCaptchaSuccess,
        hasConfirmed,
        isLoading,
        password,
        reCaptchaSuccess,
    ]);

    const renderPasswordInput = React.useCallback(() => {
        return (
            <div>
                <CustomInput
                    type="password"
                    label={passwordLabel || 'Password'}
                    placeholder={passwordLabel || 'Password'}
                    defaultLabel="Password"
                    handleChangeInput={handleChangePassword}
                    inputValue={password}
                    handleFocusInput={handleFocusPassword}
                    classNameLabel="white-text text-sm"
                    classNameInput={`${
                        passwordFocused &&
                        (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) &&
                        'error'
                    }`}
                    autoFocus={false}
                    labelVisible
                />
                {passwordFocused &&
                    (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) && (
                        <p className="danger-text m-0 mb-24 text-xs">Password Strength must be GOOD</p>
                    )}
                {password ? (
                    <PasswordStrengthMeter
                        minPasswordEntropy={passwordMinEntropy()}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        translate={translate}
                    />
                ) : null}
            </div>
        );
    }, [
        currentPasswordEntropy,
        password,
        passwordFocused,
        passwordLabel,
        passwordPopUp,
        handleChangePassword,
        handleFocusPassword,
        passwordErrorFirstSolved,
        passwordErrorSecondSolved,
        passwordErrorThirdSolved,
        translate,
    ]);

    const handleSubmitForm = React.useCallback(() => {
        onSignUp();
    }, [onSignUp]);

    const isValidForm = React.useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return email && isEmailValid && password && isPasswordValid && confirmPassword && isConfirmPasswordValid;
    }, [confirmPassword, email, password]);

    const handleClick = React.useCallback(
        (e?: React.FormEvent<HTMLInputElement>) => {
            if (e) {
                e.preventDefault();
            }

            if (!isValidForm()) {
                validateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, isValidForm, validateForm]
    );

    const handleCheck = () => {
        if (hasConfirmed === false) {
            hasConfirmed = true;
        }
        hasConfirmed = false;
    };

    const handleSubmit = async (e) => {
        await handleClick(e as any);
        await handleCheck();
        await clickCheckBox(e);
        handleClose();
    };

    const renderUsernameError = (nick: string) => {
        return nick.length < 4 ? translate(ERROR_SHORT_USERNAME) : translate(ERROR_LONG_USERNAME);
    };

    return (
        <React.Fragment>
            <div className="field">
                <CustomInput
                    type="text"
                    label={usernameLabel || 'Username'}
                    placeholder={usernameLabel || 'Username'}
                    defaultLabel="Username"
                    handleChangeInput={handleChangeUsername}
                    inputValue={username}
                    handleFocusInput={handleFocusUsername}
                    classNameLabel="white-text text-sm"
                    classNameInput={`${usernameFocused && !username.match(USERNAME_REGEX) && 'error'}`}
                    autoFocus={!isMobileDevice}
                    labelVisible
                />
                {usernameFocused && !username.match(USERNAME_REGEX) && (
                    <p className="text-xs danger-text m-0 mb-24">
                        Username must be at least 4 characters long and maximum 12 characters
                    </p>
                )}
            </div>

            <div className="field">
                <CustomInput
                    type="email"
                    label={emailLabel || 'Email'}
                    placeholder={emailLabel || 'Email'}
                    defaultLabel="Email"
                    handleChangeInput={handleChangeEmail}
                    inputValue={email}
                    handleFocusInput={handleFocusEmail}
                    classNameLabel="white-text text-sm"
                    classNameInput={`${emailFocused && !email.match(EMAIL_REGEX) && 'error'}`}
                    autoFocus={!isUsernameEnabled() && !isMobileDevice}
                    labelVisible
                />
                {emailFocused && !email.match(EMAIL_REGEX) && (
                    <p className="text-xs danger-text m-0 mb-24">Enter a valid email address</p>
                )}
            </div>

            {renderPasswordInput()}

            <div className="field">
                <CustomInput
                    type="password"
                    label={confirmPasswordLabel || 'Confirm Password'}
                    placeholder={confirmPasswordLabel || 'Confirm Password'}
                    defaultLabel="Confirm Password"
                    handleChangeInput={handleChangeConfirmPassword}
                    inputValue={confirmPassword}
                    handleFocusInput={handleFocusConfirmPassword}
                    classNameLabel="white-text text-sm"
                    classNameInput={`rounded-sm m-0 ${
                        confirmPasswordFocused && confirmPassword !== password && 'error'
                    }`}
                    autoFocus={false}
                    labelVisible
                />
                {confirmPasswordFocused && confirmPassword !== password && (
                    <p className="text-xs danger-text m-0 mb-24">Password Confirmation doesn't match</p>
                )}
            </div>

            <div
                onClick={() => setExpand(!expand)}
                className={`label-referral cursor-pointer text-sm mb-8 ${expand ? 'white-text' : 'grey-text'}`}>
                Referral ID (Optional){' '}
                {expand ? (
                    <ArrowUpIcon fillColor={'#F2F0FF'} />
                ) : (
                    <ArrowDownIcon className={''} strokeColor={'#6f6f6f'} />
                )}
            </div>

            {expand && (
                <CustomInput
                    type="text"
                    label={''}
                    labelVisible={false}
                    placeholder={referalCodeLabel || 'Referral code'}
                    defaultLabel=""
                    handleChangeInput={handleChangeRefId}
                    inputValue={refId}
                    handleFocusInput={handleFocusRefId}
                    classNameLabel="d-none"
                    classNameInput="m-0"
                    autoFocus={false}
                />
            )}

            <div className="mt-4 mb-24">{renderCaptcha}</div>

            <Button
                block={true}
                type="button"
                disabled={disableButton}
                onClick={handleShow}
                size="lg"
                className="button registration__button"
                variant="primary">
                {isLoading ? 'Loading...' : labelSignUp ? labelSignUp : 'Sign up'}
            </Button>

            <Modal show={show} onHide={handleClose} className="w-100">
                <Modal.Header className="rounded-top-10 border-none">
                    <h6 className="text-lg grey-text-accent font-normal mb-24">Term of service</h6>
                </Modal.Header>
                <Modal.Body className="tos-content">
                    <p className="grey-text-accent">GENERAL TERMS AND CONDITIONS</p>
                    <p className="grey-text-accent">
                        HEAVEN EXCHANGE General Terms and Conditions (hereinafter referred to as "SKU") are provisions
                        that contain terms and conditions regarding the use of products, services, technology, features
                        services provided by HEAVEN EXCHANGE including, but not limited to the use of the Website,
                        Indonesian Bitcoin Wallet and HEAVEN EXCHANGE Trading Platform (Trading App) (hereinafter
                        referred to as the "HEAVEN EXCHANGE Platform"). hereinafter referred to as the "HEAVEN EXCHANGE
                        Platform") to the extent not specifically regulated as set out in the HEAVEN EXCHANGE Account
                        registration section which is made on the day and date listed in the Account registration
                        section https://heavenexchange.io, constitutes an integral and inseparable unity and approval of
                        this GTC. By registering to become Member/Verified Member, you declare that you have READ,
                        UNDERSTAND, AGREE and FOLLOW the Terms and Conditions below. You are advised to read all terms
                        and conditions carefully before using the HEAVEN EXCHANGE platform services or any services that
                        are provided, and together with this you agree and bind yourself to all activities in this GTC
                        with the terms and conditions as follows in this GTC with the following terms and conditions:
                        DEFINITIONS as long as the context sentence does not determine otherwise, the terms or
                        definitions in the GTC have the following meanings :
                    </p>
                    <p className="grey-text-accent">
                        Website refers to an online site with the address https://heavenexchange.io. This website is
                        managed by HEAVEN EXCHANGE, with no limitation to its owners, investors, employees and related
                        parties. parties associated with HEAVEN EXCHANGE. Depending on the context, "Website" may also
                        refer to other services, products, sites, content or services provided by HEAVEN EXCHANGE.
                        Crypto Assets are digital commodities that use the principle of decentralized technology based
                        on a peer-to-peer network (interface) or referred to as a Blockchain Network that is traded on
                        the Blockchain platform is an open distributed ledger that can record transactions. ledger that
                        can record transactions between two parties efficiently and in a permanently verifiable manner.
                        that can be permanently verified. Registration is the process of registering to become a Member
                        in the HEAVEN EXCHANGE platform which is the initial verification process to obtain information,
                        statements in the use of platform services Member is a person (individual), business entity, or
                        legal entity that has registered on the HEAVEN EXCHANGE platform, so as to obtain authorization
                        from the HEAVEN EXCHANGE platform to carry out
                    </p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between border-none rounded-bottom-10">
                    <Button type="button" className="btn-danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className="btn-success" onClick={(e) => handleSubmit(e)}>
                        {isLoading ? 'Loading...' : 'Accept'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export const SignUpForm = React.memo(SignUpFormComponent);
