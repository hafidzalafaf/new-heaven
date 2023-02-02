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
            ...(isUsernameEnabled() && { usernameValue }),
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
                <p className="grey-text">SYARAT – SYARAT DAN KETENTUAN UMUM </p>
                <p className="grey-text text-xs">
                    Syarat – Syarat dan Ketentuan Umum (selanjutnya disebut sebagai “SKU”) HEAVEN EXCHANGE adalah
                    ketentuan yang berisikan syarat dan ketentuan mengenai penggunaan produk, jasa, teknologi, fitur
                    layanan yang diberikan oleh HEAVEN EXCHANGE termasuk, namun tidak terbatas pada penggunaan Website,
                    Dompet Bitcoin Indonesia dan HEAVEN EXCHANGE Trading Platform (Trading App) (untuk selanjutnya
                    disebut sebagai “Platform HEAVEN EXCHANGE”) sepanjang tidak diatur secara khusus sebagaimana
                    tercantum pada bagian registrasi Akun HEAVEN EXCHANGE yang dibuat pada hari dan tanggal yang
                    tercantum dalam bagian registrasi Akun https://heavenexchange.com, merupakan satu kesatuan tidak
                    terpisahkan dan persetujuan atas SKU ini. Dengan mendaftar menjadi Member/Verified Member, Anda
                    menyatakan telah MEMBACA, MEMAHAMI, MENYETUJUI dan MEMATUHI Persyaratan dan Ketentuan di bawah. Anda
                    disarankan membaca semua persyaratan dan ketentuan secara seksama sebelum menggunakan layanan
                    platform HEAVEN EXCHANGE atau segala layanan yang diberikan, dan bersama dengan ini Anda setuju dan
                    mengikatkan diri terhadap seluruh kegiatan dalam SKU ini dengan persyaratan dan ketentuan sebagai
                    berikut : DEFINISI sepanjang konteks kalimatnya tidak menentukan lain, istilah atau definisi dalam
                    SKU memiliki arti sebagai berikut :
                </p>
                <p className="grey-text text-xs">
                    Website mengacu pada situs online dengan alamat https://heavenexchange.com. Website ini dikelola
                    oleh HEAVEN EXCHANGE, dengan tidak terbatas pada para pemilik, investor, karyawan dan pihak-pihak
                    yang terkait dengan HEAVEN EXCHANGE. Tergantung pada konteks, “Website” dapat juga mengacu pada
                    jasa, produk, situs, konten atau layanan lain yang disediakan oleh HEAVEN EXCHANGE. Aset Kripto
                    adalah komoditas digital yang menggunakan prinsip teknologi desentralisasi berbasiskan jaringan
                    peer-to-peer (antar muka)atau disebut dengan Jaringan Blockchain yang diperdagangkan di dalam
                    platform Blockchain adalah sebuah buku besar terdistribusi (distributed ledger) terbuka yang dapat
                    mencatat transaksi antara dua pihak secara efisien dan dengan cara yang dapat diverifikasi secara
                    permanen. Registrasi adalah proses pendaftaran menjadi Member dalam platform HEAVEN EXCHANGE yang
                    merupakan proses verifikasi awal untuk memperoleh keterangan, pernyataan dalam penggunaan layanan
                    platform Member adalah orang (perseorangan), badan usaha, maupun badan hukum yang telah melakukan
                    registrasi pada platform HEAVEN EXCHANGE, sehingga memperoleh otorisasi dari platform HEAVEN
                    EXCHANGE untuk melakukan{' '}
                </p>
                <p className="grey-text text-xs">
                    Syarat – Syarat dan Ketentuan Umum (selanjutnya disebut sebagai “SKU”) HEAVEN EXCHANGE adalah
                    ketentuan yang berisikan syarat dan ketentuan mengenai penggunaan produk, jasa, teknologi, fitur
                    layanan yang diberikan oleh HEAVEN EXCHANGE termasuk, namun tidak terbatas pada penggunaan Website,
                    Dompet Bitcoin Indonesia dan HEAVEN EXCHANGE Trading Platform (Trading App) (untuk selanjutnya
                    disebut sebagai “Platform HEAVEN EXCHANGE”) sepanjang tidak diatur secara khusus sebagaimana
                    tercantum pada bagian registrasi Akun HEAVEN EXCHANGE yang dibuat pada hari dan tanggal yang
                    tercantum dalam bagian registrasi Akun https://heavenexchange.com, merupakan satu kesatuan tidak
                    terpisahkan dan persetujuan atas SKU ini. Dengan mendaftar menjadi Member/Verified Member, Anda
                    menyatakan telah MEMBACA, MEMAHAMI, MENYETUJUI dan MEMATUHI Persyaratan dan Ketentuan di bawah. Anda
                    disarankan membaca semua persyaratan dan ketentuan secara seksama sebelum menggunakan layanan
                    platform HEAVEN EXCHANGE atau segala layanan yang diberikan, dan bersama dengan ini Anda setuju dan
                    mengikatkan diri terhadap seluruh kegiatan dalam SKU ini dengan persyaratan dan ketentuan sebagai
                    berikut : DEFINISI sepanjang konteks kalimatnya tidak menentukan lain, istilah atau definisi dalam
                    SKU memiliki arti sebagai berikut :
                </p>
                <p className="grey-text text-xs">
                    Website mengacu pada situs online dengan alamat https://heavenexchange.com. Website ini dikelola
                    oleh HEAVEN EXCHANGE, dengan tidak terbatas pada para pemilik, investor, karyawan dan pihak-pihak
                    yang terkait dengan HEAVEN EXCHANGE. Tergantung pada konteks, “Website” dapat juga mengacu pada
                    jasa, produk, situs, konten atau layanan lain yang disediakan oleh HEAVEN EXCHANGE. Aset Kripto
                    adalah komoditas digital yang menggunakan prinsip teknologi desentralisasi berbasiskan jaringan
                    peer-to-peer (antar muka)atau disebut dengan Jaringan Blockchain yang diperdagangkan di dalam
                    platform Blockchain adalah sebuah buku besar terdistribusi (distributed ledger) terbuka yang dapat
                    mencatat transaksi antara dua pihak secara efisien dan dengan cara yang dapat diverifikasi secara
                    permanen. Registrasi adalah proses pendaftaran menjadi Member dalam platform HEAVEN EXCHANGE yang
                    merupakan proses verifikasi awal untuk memperoleh keterangan, pernyataan dalam penggunaan layanan
                    platform Member adalah orang (perseorangan), badan usaha, maupun badan hukum yang telah melakukan
                    registrasi pada platform HEAVEN EXCHANGE, sehingga memperoleh otorisasi dari platform HEAVEN
                    EXCHANGE untuk melakukan{' '}
                </p>
                <p className="grey-text text-xs">
                    SYARAT DAN KETENTUAN UMUM DAN RISIKO PERDAGANGAN MEMBER/VERIFIED MEMBER HEAVEN EXCHANGE.COM INI
                    TELAH DISESUAIKAN DENGAN KETENTUAN PERATURAN PERUNDANG-UNDANGAN YANG BERLAKU.
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
