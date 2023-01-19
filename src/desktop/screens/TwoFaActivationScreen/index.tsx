import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '../../../assets/images/ArrowLeftIcon';
import { CopyButton } from '../../../assets/images/CopyButton';
import QRCode from 'react-qr-code';
import { copy } from '../../../helpers';
import { CustomInput } from '../../components';
import { CopyableTextField } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
    alertPush,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
    generate2faQRFetch,
} from '../../../modules';

export const TwoFaActivationScreen: React.FC = () => {
    const [twoFaValue, setTwoFaValue] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    // const twoFactorBarcode = useSelector(selectTwoFactorAuthBarcode);
    const twoFactorAuthQr = useSelector(selectTwoFactorAuthQR);
    const twoFactorEnabledSucces = useSelector(selectTwoFactorAuthSuccess);

    const secretRegex = /secret=(\w+)/;
    const secretMatch = twoFactorAuthQr.match(secretRegex);
    const secret = secretMatch ? secretMatch[1] : null;

    useEffect(() => {
        dispatch(generate2faQRFetch());
    }, []);

    useEffect(() => {
        if (twoFactorEnabledSucces) {
            history.push('/profile');
        }
    }, [twoFactorEnabledSucces]);

    const handleTwoFactorAuth = () => {
        dispatch(toggle2faFetch({ code: twoFaValue, enable: true }));
    };

    const doCopy = () => {
        copy('referral-id');
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    };

    return (
        <React.Fragment>
            <div className="content-wrapper no-sidebar dark-bg-main two-fa-activation-screen">
                <div className="container">
                    <div className="pt-5">
                        <div className="__breadcrumb d-flex align-items-center pb-4">
                            <Link to={`/profile`} className="back-link cursor-pointer">
                                <ArrowLeftIcon className={'mr-3'} />
                                <span className="white-text text-lg font-bold">Activation 2FA</span>
                            </Link>
                        </div>
                        <div className="main-content mt-5">
                            <h6 className="mb-24 white-text text-md font-semibold">Google Authencticator Activation</h6>
                            <p className=" white-text text-ms mb-8">
                                1. Download and install Google Authenticator application from
                                <a href="https://www.apple.com/app-store/" target="_blank">
                                    <span className="text-ms warning-text"> AppStore </span>
                                </a>
                                or
                                <a href="https://play.google.com/" target="_blank">
                                    <span className="text-ms warning-text"> Google play </span>
                                </a>
                            </p>
                            <p className="text-ms white-text mb-8">
                                2. Scan QR code or use secret MFA code:* Save this secret in a secure location. This
                                code can be used to gain 2FA access from a different device.
                            </p>
                            <p className="text-ms white-text font-extrabold mb-24">
                                3. Please erase your old 2FA Verification in google authenticator application, if you
                                want to create new 2FA Verification Again.
                            </p>
                            <div className="d-flex flex-wrap">
                                <div>
                                    <div className="qr-code mt-3">
                                        <QRCode size={148} value={twoFactorAuthQr} />
                                    </div>
                                </div>
                                <div className="form mt-3">
                                    <p className="text-ms white-text mb-24">
                                        Scan The QR Code to get 2FA or Copy Keys below :
                                    </p>
                                    <div className="d-flex align-items-center mb-24">
                                        <label className="input-label font-bold" htmlFor="">
                                            MVA CODE
                                        </label>
                                        <fieldset onClick={doCopy}>
                                            {secret && (
                                                <CopyableTextField
                                                    value={secret}
                                                    fieldId="referral-id"
                                                    classNameInput="input-classname"
                                                />
                                            )}
                                        </fieldset>
                                    </div>
                                    <div className="d-flex align-items-center mb-24">
                                        <label className="input-label font-bold" htmlFor="">
                                            2FA Code
                                        </label>
                                        <CustomInput
                                            defaultLabel=""
                                            inputValue={twoFaValue}
                                            label=""
                                            placeholder="_____"
                                            type="text"
                                            labelVisible={false}
                                            classNameLabel="d-none"
                                            classNameInput="spacing-10 input-classname text-center"
                                            classNameGroup="mb-0"
                                            handleChangeInput={(e) => setTwoFaValue(e)}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="twofa-button">
                                            <button
                                                type="submit"
                                                onClick={handleTwoFactorAuth}
                                                className="btn btn-primary btn-block">
                                                Enable 2FA Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
