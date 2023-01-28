import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { selectUserInfo, resendCode, sendCode, verifyPhone } from '../../../modules';
import { selectApiKeys } from 'src/modules/user/apiKeys/selectors';
import moment from 'moment';
import {
    EmailProfileIcon,
    KycProfileIcon,
    PhoneProfileIcon,
    GoogleProfileIcon,
    ApiProfileIcon,
    PasswordIcon,
} from '../../../assets/images/ProfileIcon';
import { ArrowLeft } from '../../assets/Arrow';
import { CheckIcon } from '../../../assets/images/ProfileIcon';
import { WarningIcon } from '../../assets/Nottification';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { ModalFullScreenMobile } from '../../components';
import { ModalResetPassword } from '../../assets/Modal';
import { titleCase, dateTo12HFormat } from 'src/helpers';
import { CustomInput } from 'src/desktop/components';
import { GearIcon } from 'src/mobile/assets/Gear';

// import { dateTo12HFormat } from 'src/helpers';

const ProfileMobileScreen: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const apiKey = useSelector(selectApiKeys);

    const TIME_RESEND = 30000;

    const [showModalEmail, setShowModalEmail] = React.useState(false);
    const [showModalPhone, setShowModalPhone] = React.useState(false);
    const [newPhoneValue, setNewPhoneValue] = React.useState('');
    const [isChangeNumber, setIsChangeNumber] = React.useState(false);
    const [resendCodeActive, setResendCodeActive] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [showModalLocked, setShowModalLocked] = React.useState(false);
    const [hideWarning, setHideWarning] = React.useState(false);
    const [seconds, setSeconds] = React.useState(TIME_RESEND);
    const [timerActive, setTimerActive] = React.useState(false);
    const [kycStatus, setKycStatus] = React.useState('');
    const [profilekycStatus, setProfileKycStatus] = React.useState('');

    React.useEffect(() => {
        let timer = null;
        if (timerActive) {
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1000);

                if (seconds === 0) {
                    setTimerActive(false);
                    setSeconds(0);
                }
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    });

    React.useEffect(() => {
        const kycData = user?.labels[0];
        if (kycData.key == 'document') {
            const kycStatus = kycData.value;
            setKycStatus(kycStatus);
        } else {
            setKycStatus('');
        }

        setProfileKycStatus(user.profiles[0]?.state);
    }, []);

    const phone = user.phones.slice(-1);

    const handleModalChangePhone = React.useCallback(() => {
        user.otp ? setShowModalPhone(true) : setShowModalLocked(!showModalLocked);
    }, []);

    const handleSendCodePhone = () => {
        if (user.phones[0] && !isChangeNumber) {
            dispatch(resendCode({ phone_number: `+${phone[0].number}` }));
            setTimerActive(true);
            setResendCodeActive(true);
        } else {
            dispatch(sendCode({ phone_number: newPhoneValue }));
            setTimerActive(true);
            setResendCodeActive(true);
        }
    };

    const handleChangePhone = () => {
        if (user.phones[0] && !isChangeNumber) {
            dispatch(verifyPhone({ phone_number: `+${phone[0].number}`, verification_code: verificationCode }));
        } else {
            dispatch(verifyPhone({ phone_number: newPhoneValue, verification_code: verificationCode }));
        }
    };

    const disabledButtonCode = () => {
        if (phone[0]?.validated_at === null && !isChangeNumber && !timerActive) {
            return false;
        }

        if (newPhoneValue === '') {
            return true;
        }

        if (timerActive) {
            return true;
        }
    };

    const disabledButton = () => {
        if (phone[0]?.validated_at === null && !isChangeNumber) {
            if (verificationCode.length < 5) {
                return true;
            }
        } else {
            if (verificationCode.length < 5) {
                return true;
            }

            if (!newPhoneValue) {
                return true;
            }
        }
    };

    const handleChangeVerificationCodeValue = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setVerificationCode(value);
    };

    const handleChangePhoneValue = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setNewPhoneValue(value);
    };

    const handleResetPassword = () => {
        history.push('/change-email');
    };

    const renderModal = () => (
        <React.Fragment>
            <div className="d-flex justify-content-center">
                <ModalResetPassword />
            </div>
            <h5 className="text-md font-extrabold contrast-text text-center mb-3">Change Password Confirmation</h5>
            <p className="text-center text-sm grey-text">
                1.To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily unavailable
                for 24 hours after changing or unbinding an email. <br /> 2.Emails that have been unbound or changed in
                the past 30 days cannot be used to register new accounts
            </p>
            <button onClick={handleResetPassword} className="btn btn-primary btn-mobile btn-block mb-3">
                Continue
            </button>
            <button className="btn btn-success btn-mobile btn-outline w-100" onClick={() => setShowModalEmail(false)}>
                Close
            </button>
        </React.Fragment>
    );

    const renderModalPhone = () => (
        <>
            <div className="mb-24">
                <div className="d-flex align-items-center mb-5">
                    <div
                        className="mr-3"
                        onClick={() => {
                            setShowModalPhone(!showModalPhone);
                            setIsChangeNumber(!isChangeNumber);
                            setNewPhoneValue('');
                            setVerificationCode('');
                        }}>
                        <ArrowLeft className={'cursor-pointer text-white'} />
                    </div>
                    <span className="text-secondary text-lg">Setting Phone Number</span>
                </div>
                <p className="text-sm grey-text mb-8">
                    {!user.phones[0] ? (
                        'Set Your Phone Number And Verified'
                    ) : user.phones[0] && user.phones[0].validated_at === null && !isChangeNumber ? (
                        'You already add phone number, please verify by click send code button to get OTP number'
                    ) : (user.phones[0] && isChangeNumber) || user.phones[0] !== null ? (
                        <p className="danger-text">
                            {user.phones.length === 4 && isChangeNumber
                                ? `Sorry, you run out of time for changing your phone number`
                                : user.phones.length < 4 && isChangeNumber
                                ? `You only have ${4 - user.phones.length} chances to change your phone number`
                                : `Please verify your phone number`}
                        </p>
                    ) : (
                        'Set Your New Phone Number And Verified'
                    )}
                </p>
                {user.phones[0] && !isChangeNumber && (
                    <p className="text-sm grey-text mb-24">{phone[0] && phone[0].number && `+ ${phone[0].number}`}</p>
                )}

                {/* Input change phone */}
                <div className="form">
                    {(isChangeNumber || !user.phones[0]) && (
                        <div className="form-group mb-24">
                            <CustomInput
                                defaultLabel={`${!user.phones[0] ? '' : 'New'} Phone Number`}
                                inputValue={newPhoneValue}
                                label={`${!user.phones[0] ? '' : 'New'} Phone Number`}
                                placeholder="+6281902912921"
                                type="text"
                                labelVisible
                                classNameLabel="white-text text-sm"
                                isDisabled={user.phones.length === 4}
                                handleChangeInput={(e) => handleChangePhoneValue(e)}
                            />
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="white-text">Verification Code</label>
                        <div className="d-flex align-items-center">
                            <CustomInput
                                defaultLabel=""
                                inputValue={verificationCode}
                                label=""
                                placeholder="_____"
                                type="text"
                                labelVisible={false}
                                classNameLabel="d-none"
                                classNameInput="spacing-10"
                                classNameGroup="mb-0 w-100"
                                isDisabled={isChangeNumber && user.phones.length === 4}
                                handleChangeInput={(e) => handleChangeVerificationCodeValue(e)}
                            />
                            <button
                                disabled={disabledButtonCode()}
                                onClick={handleSendCodePhone}
                                className="btn btn-primary ml-2 text-nowrap">
                                {(!isChangeNumber && phone && phone[0] && phone[0].validated_at === null) ||
                                resendCodeActive
                                    ? 'Resend Code'
                                    : 'Send Code'}
                            </button>
                        </div>
                        <div className="mt-2">
                            <p
                                className={`text-right text-xs cursor-pointer ${
                                    timerActive ? 'white-text' : 'grey-text'
                                }`}>
                                {moment(seconds).format('mm:ss')}
                            </p>
                            {(!isChangeNumber || !user.phones[0]) && (
                                <p
                                    onClick={() => {
                                        setIsChangeNumber(true);
                                        setTimerActive(false);
                                        setVerificationCode('');
                                    }}
                                    className="text-right white-text text-xs cursor-pointer text-underline">
                                    Change Phone
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={disabledButton()}
                        onClick={handleChangePhone}
                        className="btn btn-primary btn-block"
                        data-toggle="modal"
                        data-target="#change-phone"
                        data-dismiss="modal">
                        {!user.phones[0]
                            ? 'Add'
                            : user.phones[0].validated_at === null && !isChangeNumber
                            ? 'Veify'
                            : 'Change'}
                    </button>
                </div>
            </div>
        </>
    );

    const renderKycStatus = () => {
        if (kycStatus == '') {
            return <span className="d-block p-1 danger-text text-xs font-normal "> Unverified</span>;
        } else if (kycStatus == 'rejected') {
            return <span className="d-block p-1 danger-text text-xs font-normal "> Rejected</span>;
        } else if (kycStatus == 'verified') {
            return <span className="d-block p-1 contrast-text text-xs font-normal "> Verified</span>;
        } else if (kycStatus == 'pending') {
            return <span className="d-block p-1 grey-text text-xs font-normal ">Waiting Confirmation</span>;
        }
    };

    return (
        <React.Fragment>
            <div className="mobile-container profile-screen no-header dark-bg-main">
                <div className="mb-24">
                    <Link to="/">
                        <ArrowLeft className={'cursor-pointer'} />
                    </Link>
                </div>
                <div className="d-flex align-items-center mb-24">
                    <img src="img-mobile/avatar.png" className="avatar-image" alt="ava" />
                    <div className="ml-3 d-flex align-items-center">
                        <h1 className="gradient-text text-md font-bold mb-2 mr-3">
                            Hi, {user && user.username !== null ? user.username : 'The Awesome Member'}
                        </h1>
                        <p className="badge badge-warning white-text mb-0 ml-3">
                            {user &&
                                user.labels &&
                                user.labels[0] &&
                                user.labels[0].value &&
                                titleCase(user.labels[0].value)}
                        </p>
                    </div>
                </div>
                <div className="mb-5">
                    <div className="d-flex flex-column mb-12">
                        <h5 className="grey-text font-bold text-xs mb-0">User ID</h5>
                        <h3 className="grey-text-accent font-bold text-sm">{user && user.uid}</h3>
                    </div>

                    <div className="d-flex flex-column mb-12">
                        <h5 className="grey-text font-bold text-xs mb-0">Last Login</h5>
                        <h3 className="grey-text-accent font-bold text-sm">
                            {dateTo12HFormat(user && user.updated_at)}
                        </h3>
                    </div>

                    <div className="d-flex flex-column mb-12">
                        <h5 className="grey-text font-bold text-xs mb-0">IP Address</h5>
                        <h3 className="grey-text-accent font-bold text-sm">36.80.199.122</h3>
                    </div>
                </div>
                {!hideWarning && user.level < 3 && (
                    <div className="alert-mobile-warning px-2 py-3 alert d-flex align-items-center justify-content-between show text-xs warning-text font-normal position-relative mb-24">
                        <WarningIcon className="mr-2" />
                        <span className="text-xxs warning-text font-normal">
                            Complete your identity verify to start trading with heaven exchange
                        </span>
                        {user.level >= 3 && (
                            <div onClick={() => setHideWarning(true)} className="close-icon cursor-pointer">
                                <CloseIcon fill="#FF9533" className="ml-2" />
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <div
                        className=" d-flex align-items-center mb-24 cursor-pointer"
                        onClick={() => setShowModalEmail(true)}>
                        <div className="mr-3">
                            <EmailProfileIcon className="profile-icon" />
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div>
                                <h4 className="mb-0 text-sm font-bold grey-text-accent">Email</h4>
                                <p className="mb-0 text-xs grey-text">{user && user.email}</p>
                            </div>

                            {user && user.email && <CheckIcon className="check-icon" />}
                        </div>
                    </div>
                    <Link to={kycStatus == 'verified' ? '/profile' : '/profile/kyc'}>
                        <div className=" d-flex align-items-center mb-24 cursor-pointer">
                            <div className="mr-3">
                                <KycProfileIcon className="profile-icon" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-sm font-bold grey-text-accent">KYC Verification</h4>
                                    <p className="mb-0 text-xs green-text">{renderKycStatus()}</p>
                                </div>

                                {kycStatus === 'verified' && <CheckIcon className="check-icon" />}
                            </div>
                        </div>
                    </Link>
                    <div onClick={() => handleModalChangePhone()}>
                        <div className=" d-flex align-items-center mb-24 cursor-pointer">
                            <div className="mr-3">
                                <PhoneProfileIcon className="profile-icon" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-sm font-bold grey-text-accent">Phone</h4>
                                    <p
                                        className={`mb-0 text-xs ${
                                            !user.phones[0] ||
                                            (user.phones && user.phones[0] && user.phones[0].validated_at === null)
                                                ? 'danger-text'
                                                : 'contrast-text'
                                        }`}>
                                        {!user.phones[0] ||
                                        (user.phones && user.phones[0] && user.phones[0].validated_at === null)
                                            ? 'Unverified'
                                            : 'Verified'}
                                    </p>
                                </div>
                                {user.phones && user.phones[0] && user.phones[0].validated_at !== null && (
                                    <CheckIcon className="check-icon" />
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to={'/two-fa-activation'}>
                        <div className=" d-flex align-items-center mb-24 cursor-pointer">
                            <div className="mr-3">
                                <GoogleProfileIcon className="profile-icon" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-sm font-bold grey-text-accent">Google Authentication</h4>
                                    <p className={`mb-0 text-xs ${user && user.otp ? 'green-text' : 'danger-text'}`}>
                                        {user && user.otp ? 'Enable' : 'Disable'}
                                    </p>
                                </div>

                                {user && user.otp && <CheckIcon className="check-icon" />}
                            </div>
                        </div>
                    </Link>
                    <Link to={'/change-password'}>
                        <div className=" d-flex align-items-center mb-24 cursor-pointer">
                            <div className="mr-3">
                                <PasswordIcon className="profile-icon" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-sm font-bold grey-text-accent">Password</h4>
                                    <p className={`mb-0 text-xs grey-text`}>Set or change your password</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/api-key'}>
                        <div className=" d-flex align-items-center mb-24 cursor-pointer">
                            <div className="mr-3">
                                <ApiProfileIcon className="profile-icon" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div>
                                    <h4 className="mb-0 text-sm font-bold grey-text-accent">API</h4>
                                    <p className="mb-0 text-xs grey-text-accent">
                                        {apiKey && apiKey.length} API Enable
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <ModalFullScreenMobile content={renderModal()} show={showModalEmail} />
            <ModalFullScreenMobile content={renderModalPhone()} show={showModalPhone} />

            {/* ========= Show Modal Locked 2FA =========== */}

            {showModalLocked && (
                <Modal onHide={() => {}} show={showModalLocked}>
                    <section className="container p-3 dark-bg-main">
                        <div className="d-flex justify-content-center my-2">
                            <GearIcon />
                        </div>
                        <div className="text-center">
                            <p className="gradient-text mb-3">Two-factor Authentication Needed</p>
                            <p className="text-secondary text-sm">Please turn on Two-factor authentication</p>
                        </div>
                        <div className="mb-0">
                            <Link to={`/two-fa-activation`}>
                                <button type="button" className="btn btn-primary btn-block">
                                    Enable 2FA
                                </button>
                            </Link>
                            <div className="mt-3" onClick={() => setShowModalLocked(!showModalLocked)}>
                                <button type="button" className="btn btn-outline-primary btn-block">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </section>
                </Modal>
            )}
        </React.Fragment>
    );
};

export { ProfileMobileScreen };
