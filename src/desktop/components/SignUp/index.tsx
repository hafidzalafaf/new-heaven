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
                    <p className="grey-text-accent">SYARAT – SYARAT DAN KETENTUAN UMUM</p>
                    <p className="grey-text-accent">
                        Syarat – Syarat dan Ketentuan Umum (selanjutnya disebut sebagai “SKU”) HEAVEN EXCHANGE adalah
                        ketentuan yang berisikan syarat dan ketentuan mengenai penggunaan produk, jasa, teknologi, fitur
                        layanan yang diberikan oleh HEAVEN EXCHANGE termasuk, namun tidak terbatas pada penggunaan
                        Website, Dompet Bitcoin Indonesia dan HEAVEN EXCHANGE Trading Platform (Trading App) (untuk
                        selanjutnya disebut sebagai “Platform HEAVEN EXCHANGE”) sepanjang tidak diatur secara khusus
                        sebagaimana tercantum pada bagian registrasi Akun HEAVEN EXCHANGE yang dibuat pada hari dan
                        tanggal yang tercantum dalam bagian registrasi Akun https://HEAVEN EXCHANGE.com, merupakan satu
                        kesatuan tidak terpisahkan dan persetujuan atas SKU ini. Dengan mendaftar menjadi
                        Member/Verified Member, Anda menyatakan telah MEMBACA, MEMAHAMI, MENYETUJUI dan MEMATUHI
                        Persyaratan dan Ketentuan di bawah. Anda disarankan membaca semua persyaratan dan ketentuan
                        secara seksama sebelum menggunakan layanan platform HEAVEN EXCHANGE atau segala layanan yang
                        diberikan, dan bersama dengan ini Anda setuju dan mengikatkan diri terhadap seluruh kegiatan
                        dalam SKU ini dengan persyaratan dan ketentuan sebagai berikut : DEFINISI sepanjang konteks
                        kalimatnya tidak menentukan lain, istilah atau definisi dalam SKU memiliki arti sebagai berikut
                        :
                    </p>
                    <p className="grey-text-accent">
                        Website mengacu pada situs online dengan alamat https://HEAVEN EXCHANGE.com. Website ini
                        dikelola oleh HEAVEN EXCHANGE, dengan tidak terbatas pada para pemilik, investor, karyawan dan
                        pihak-pihak yang terkait dengan HEAVEN EXCHANGE. Tergantung pada konteks, “Website” dapat juga
                        mengacu pada jasa, produk, situs, konten atau layanan lain yang disediakan oleh HEAVEN EXCHANGE.
                        Aset Kripto adalah komoditas digital yang menggunakan prinsip teknologi desentralisasi
                        berbasiskan jaringan peer-to-peer (antar muka)atau disebut dengan Jaringan Blockchain yang
                        diperdagangkan di dalam platform Blockchain adalah sebuah buku besar terdistribusi (distributed
                        ledger) terbuka yang dapat mencatat transaksi antara dua pihak secara efisien dan dengan cara
                        yang dapat diverifikasi secara permanen. Registrasi adalah proses pendaftaran menjadi Member
                        dalam platform HEAVEN EXCHANGE yang merupakan proses verifikasi awal untuk memperoleh
                        keterangan, pernyataan dalam penggunaan layanan platform Member adalah orang (perseorangan),
                        badan usaha, maupun badan hukum yang telah melakukan registrasi pada platform HEAVEN EXCHANGE,
                        sehingga memperoleh otorisasi dari platform HEAVEN EXCHANGE untuk melakukan{' '}
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
