import React, { FC, ReactElement, useState, useEffect } from 'react';
import { ProfileAuthDetails } from '../../containers';
import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { Link, useHistory } from 'react-router-dom';
import { Notification } from '../../../assets/images/Notification';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import {
    ApiProfileIcon,
    EmailProfileIcon,
    GoogleProfileIcon,
    KycProfileIcon,
    PhoneProfileIcon,
    SecurityProfileIcon,
    CheckIcon,
    DocsIcon,
} from '../../../assets/images/ProfileIcon';
import { ProfileDeviceTable } from '../../containers';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserInfo,
    toggle2faFetch,
    selectVerifyPhoneSuccess,
    sendCode,
    resendCode,
    verifyPhone,
    selectBlogs,
} from '../../../modules';
import { selectApiKeys } from 'src/modules/user/apiKeys/selectors';
import { Modal, CustomInput } from '../../components';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import moment from 'moment';

export const ProfileScreen: FC = (): ReactElement => {
    useDocumentTitle('Profile');
    useBlogsFetch({ tag: 'faq' });
    const user = useSelector(selectUserInfo);
    const apiKeys = useSelector(selectApiKeys);
    const blogs = useSelector(selectBlogs);

    const verifyPhoneSuccess = useSelector(selectVerifyPhoneSuccess);
    const history = useHistory();
    const dispatch = useDispatch();

    const [showModal2FaGoogle, setShowModal2FAGoogle] = useState(false);
    const [showModalChangePhone, setShowModalChangePhone] = useState(false);
    const [twoFaGoogleValue, setTwoFaGoogleValue] = useState('');
    const [newPhoneValue, setNewPhoneValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isChangeNumber, setIsChangeNumber] = useState(false);
    const [resendCodeActive, setResendCodeActive] = useState(false);
    const [news, setNews] = React.useState<any[]>([]);

    const [seconds, setSeconds] = useState(30000);
    const [timerActive, setTimerActive] = useState(false);
    const [accountVerified, setAccountVerified] = useState(false);
    const [kycStatus, setKycStatus] = useState('');
    const [profilekycStatus, setProfileKycStatus] = useState('');
    const phone = user.phones.slice(-1);
    const kyc = user.profiles.slice(-1);
    const label = user.labels;

    const labelPhone = [...label].find((item) => item.key === 'phone');

    React.useEffect(() => {
        if (blogs) {
            setNews(blogs);
        }
    }, [blogs]);

    useEffect(() => {
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

    useEffect(() => {
        const kycData = user?.labels[0];
        if (kycData.key == 'document') {
            const kycStatus = kycData.value;
            setKycStatus(kycStatus);
        } else {
            setKycStatus('');
        }

        setProfileKycStatus(user.profiles[0]?.state);
    }, []);

    const handleFetchTwoFaPhone = async () => {
        user.otp ? setShowModalChangePhone(!showModalChangePhone) : history.push('/two-fa-activation');
    };

    const handleSendCodePhone = () => {
        if (phone[0]?.validated_at === null && !isChangeNumber) {
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
        if (phone[0]?.validated_at === null && !isChangeNumber) {
            dispatch(verifyPhone({ phone_number: `+${phone[0].number}`, verification_code: verificationCode }));
        } else {
            dispatch(verifyPhone({ phone_number: newPhoneValue, verification_code: verificationCode }));
        }
    };

    useEffect(() => {
        if (verifyPhoneSuccess) {
            setShowModalChangePhone(false);
        }
    }, [verifyPhoneSuccess]);

    const handleFetchTwoFaGoogle = () => {
        user.otp ? setShowModal2FAGoogle(!showModal2FaGoogle) : history.push('/two-fa-activation');
    };

    const handleDisableTwoFactor = async () => {
        await dispatch(toggle2faFetch({ code: twoFaGoogleValue, enable: false }));
        setShowModal2FAGoogle(!showModal2FaGoogle);
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

    useEffect(() => {
        if (user?.labels[2]?.key == 'otp') {
            if (
                user?.labels[0]?.value == 'verified' &&
                user?.labels[1]?.value == 'verified' &&
                user?.labels[3]?.value == 'verified' &&
                user?.labels[4]?.value == 'verified'
            ) {
                setAccountVerified(true);
            } else {
                setAccountVerified(false);
            }
        } else {
            if (
                user?.labels[0]?.value == 'verified' &&
                user?.labels[1]?.value == 'verified' &&
                user?.labels[2]?.value == 'verified' &&
                user?.labels[3]?.value == 'verified'
            ) {
                setAccountVerified(true);
            } else {
                setAccountVerified(false);
            }
        }
    }, [user]);

    const handleChangeVerificationCodeValue = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setVerificationCode(value);
    };

    const handleChangePhoneValue = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setNewPhoneValue(value);
    };

    const handleChangeTwoFaGoogleValue = (e) => {
        const value = e.replace(/[^0-9+\.]/g, '');
        setTwoFaGoogleValue(value);
    };

    // Render phone modal
    const modalPhoneContent = () => {
        return (
            <React.Fragment>
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

                <div className="form">
                    {(isChangeNumber || !phone[0] || phone[0]?.validated_at !== null) && (
                        <div className="form-group mb-24">
                            <CustomInput
                                defaultLabel={`${!phone[0] ? '' : 'New'} Phone Number`}
                                inputValue={newPhoneValue}
                                label={`${!phone[0] ? '' : 'New'} Phone Number`}
                                placeholder="+6281902912921"
                                type="text"
                                labelVisible
                                classNameLabel="white-text text-sm"
                                handleChangeInput={(e) => handleChangePhoneValue(e)}
                                isDisabled={user.phones.length === 4}
                            />
                        </div>
                    )}

                    <div className="form-group mb-24">
                        <label className="white-text text-sm">Verification Code</label>
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

                        <p className={`text-right text-xs cursor-pointer ${timerActive ? 'white-text' : 'grey-text'}`}>
                            {moment(seconds).format('mm:ss')}
                        </p>

                        {(!isChangeNumber || !user.phones[0]) && phone[0]?.validated_at === null && (
                            <p
                                onClick={() => {
                                    setIsChangeNumber(true);
                                    setTimerActive(false);
                                    setVerificationCode('');
                                }}
                                className="text-right white-text text-xs cursor-pointer">
                                Change Phone
                            </p>
                        )}
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
                            : phone[0] && phone[0].validated_at === null
                            ? 'Verify'
                            : isChangeNumber
                            ? 'Change'
                            : ''}
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const modalPhoneHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">
                    {!user.phones[0]
                        ? 'Add Phone Number'
                        : phone[0] && phone[0].validated_at === null && !isChangeNumber
                        ? 'Verify Phone Number'
                        : isChangeNumber
                        ? 'Change Phone Number'
                        : ''}
                </h6>
                <ModalCloseIcon
                    className="cursor-pointer ml-4"
                    onClick={() => {
                        setShowModalChangePhone(false);
                        setIsChangeNumber(false);
                        setVerificationCode('');
                        setNewPhoneValue('');
                    }}
                />
            </React.Fragment>
        );
    };

    // modal google two fa
    const modalTwoFaGoogleContent = () => {
        return (
            <React.Fragment>
                <p className="text-sm grey-text mb-24">
                    To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily unavailable
                    for 24 hours after changing the security settings.
                </p>
                <div className="form">
                    <div className="form-group mb-24">
                        <CustomInput
                            defaultLabel="two-fa"
                            inputValue={twoFaGoogleValue}
                            label="2FA Code"
                            placeholder="______"
                            type="text"
                            labelVisible
                            classNameInput="text-center spacing-10"
                            classNameLabel="white-text text-sm"
                            handleChangeInput={(e) => handleChangeTwoFaGoogleValue(e)}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-block"
                        data-dismiss="modal"
                        onClick={handleDisableTwoFactor}>
                        Disable
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const modalTwoFaGoogleHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">2FA Verification</h6>
                <ModalCloseIcon className="cursor-pointer" onClick={() => setShowModal2FAGoogle(false)} />
            </React.Fragment>
        );
    };

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
            <div className="profile-screen">
                <div
                    className="content-wrapper dark-bg-accent pb-5"
                    style={{ backgroundImage: `url('img/background-landing.png')` }}>
                    <ProfileAuthDetails />

                    <div className="profile-menu px-24 mb-24">
                        <div className="row">
                            <div className="col-6 col-lg-8">
                                {accountVerified ? (
                                    ''
                                ) : (
                                    <div className="notification-warning alert show text-ms white-text font-normal position-relative mb-24">
                                        <Notification className="mr-2" />
                                        Complete your identity verify to start trading with heaven exchange
                                        <div className="close-icon">
                                            <CloseIcon fill="#F2F0FF" className="ml-2" />
                                        </div>
                                    </div>
                                )}
                                <div className="main-menu">
                                    <div className="menu-item py-24 mb-4">
                                        <div className="d-flex align-items-center position-relative">
                                            <div className="icon-bg">
                                                <EmailProfileIcon />
                                            </div>
                                            <div className="ml-3 mr-3">
                                                <p className="mb-1 text-ms font-normal white-text">Email</p>
                                                <span className="d-block text-xs grey-text-accent font-normal ">
                                                    {user.email}
                                                </span>
                                                <span className="text-xs contrast-text font-normal">Verified</span>
                                            </div>
                                            <div className="check">
                                                <CheckIcon />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="menu-item py-24 mb-4">
                                        <Link to={kycStatus == 'verified' ? '/profile' : '/profile/kyc'}>
                                            <div className="d-flex align-items-center position-relative">
                                                <div className="icon-bg">
                                                    <KycProfileIcon />
                                                </div>
                                                <div className="ml-3 mr-3">
                                                    <p className="mb-1 text-ms font-normal white-text">
                                                        KYC Verification
                                                    </p>

                                                    {renderKycStatus()}
                                                </div>
                                                {kycStatus === 'verified' && (
                                                    <div className="check">
                                                        <CheckIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="menu-item py-24 mb-4">
                                        <button className="btn-transparent" onClick={handleFetchTwoFaPhone}>
                                            <div className="d-flex align-items-center position-relative">
                                                <div className="icon-bg">
                                                    <PhoneProfileIcon />
                                                </div>
                                                <div className="ml-3 mr-3">
                                                    <p className="mb-1 text-ms font-normal white-text text-left">
                                                        Phone
                                                    </p>
                                                    <span className="d-block text-xs grey-text-accent font-normal ">
                                                        {phone[0] && phone[0].number && `+ ${phone[0].number}`}
                                                    </span>
                                                    <span
                                                        className={`d-block text-left text-xs  font-normal ${
                                                            labelPhone?.value === 'verified'
                                                                ? 'contrast-text'
                                                                : 'danger-text'
                                                        }`}>
                                                        {labelPhone?.value === 'verified' ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </div>
                                                {labelPhone?.value === 'verified' && (
                                                    <div className="check">
                                                        <CheckIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                    <div className="menu-item py-24 mb-4">
                                        <Link to={'/profile/security'}>
                                            <div className="d-flex align-items-center position-relative">
                                                <div className="icon-bg">
                                                    <SecurityProfileIcon />
                                                </div>
                                                <div className="ml-3 mr-3">
                                                    <p className="mb-1 text-ms font-normal white-text">Security</p>
                                                    <span
                                                        className={`d-block text-left text-xs font-normal ${
                                                            !user.phones[0] ||
                                                            (user.phones &&
                                                                user.phones[0] &&
                                                                user.phones[0].validated_at === null) ||
                                                            !user.otp
                                                                ? 'danger-text'
                                                                : 'contrast-text'
                                                        }`}>
                                                        {!user.phones[0] ||
                                                        (user.phones &&
                                                            user.phones[0] &&
                                                            user.phones[0].validated_at === null) ||
                                                        !user.otp
                                                            ? 'Disabled'
                                                            : 'Enabled'}
                                                    </span>
                                                </div>
                                                {user.phones &&
                                                    user.phones[0] &&
                                                    user.phones[0].validated_at !== null &&
                                                    user.otp && (
                                                        <div className="check">
                                                            <CheckIcon />
                                                        </div>
                                                    )}
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="menu-item py-24 mb-4">
                                        <button className="btn-transparent" onClick={handleFetchTwoFaGoogle}>
                                            <div className="d-flex align-items-center position-relative">
                                                <div className="icon-bg">
                                                    <GoogleProfileIcon />
                                                </div>
                                                <div className="ml-3 mr-3">
                                                    <p className="mb-1 text-ms font-normal white-text">Google Auth</p>
                                                    <span
                                                        id="two-fa-text"
                                                        className={`d-block text-left text-xs font-normal ${
                                                            user.otp ? 'contrast-text' : 'danger-text'
                                                        }`}>
                                                        {user.otp ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </div>
                                                {user.otp && (
                                                    <div className="check">
                                                        <CheckIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                    <div className="menu-item py-24 mb-4">
                                        <Link to={'/profile/api-key'}>
                                            <div className="d-flex align-items-center position-relative">
                                                <div className="icon-bg">
                                                    <ApiProfileIcon />
                                                </div>
                                                <div className="ml-3 mr-3">
                                                    <p className="mb-1 text-ms font-normal white-text">API</p>
                                                    <span className="d-block text-xs grey-text font-normal ">
                                                        {apiKeys && apiKeys.length} API enabled
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-4">
                                <div className="explore position-relative">
                                    <h6 className="text-ms white-text font-semibold mb-3">Explore</h6>
                                </div>
                                <div className="document">
                                    {news &&
                                        news.slice(0, 5).map((item, i) => (
                                            <a href={item.url} key={i} target="__blank" rel="noopener noreferrer">
                                                <div className="doc-item">
                                                    <div className="mr-2">
                                                        <DocsIcon />
                                                    </div>
                                                    <p className="text-sm grey-text font-normal mb-0">{item.title}</p>
                                                </div>
                                            </a>
                                        ))}
                                </div>

                                <div className="d-flex justify-content-center mt-3">
                                    <Link to="/faq" className="font-bold text-center gradient-text text-sm">
                                        View More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProfileDeviceTable />
                </div>
            </div>

            {/* modal */}
            <Modal content={modalTwoFaGoogleContent()} header={modalTwoFaGoogleHeader()} show={showModal2FaGoogle} />
            <Modal content={modalPhoneContent()} header={modalPhoneHeader()} show={showModalChangePhone} />
        </React.Fragment>
    );
};
