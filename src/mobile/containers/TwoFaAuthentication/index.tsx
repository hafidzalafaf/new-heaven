import * as React from 'react';
import { ArrowLeft } from '../../assets/Arrow';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signInRequire2FA } from '../../../modules';
import PinInput from 'react-pin-input';

export interface TwoFactorAuthProps {
    isLoading?: boolean;
    onSubmit: () => void;
    title: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    handleOtpCodeChange: (e: any) => void;
    handleClose2fa: () => void;
    signInLoading: boolean;
}

const TwoFaAuthenticationMobile: React.FC<TwoFactorAuthProps> = ({
    isLoading,
    otpCode,
    buttonLabel,
    onSubmit,
    handleOtpCodeChange,
    signInLoading,
}) => {
    const dispatch = useDispatch();

    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && otpCode.length >= 6) {
                event.preventDefault();
                onSubmit();
            }
        },
        [onSubmit, otpCode]
    );

    const handleRemoveRequire2Fa = React.useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);
    return (
        <React.Fragment>
            <Link to={''}>
                <ArrowLeft className={'back'} />
            </Link>
            <h1 className="mt-4 font-extrabold text-md grey-text-accent mb-3">Authentication Code</h1>
            <p className="text-sm grey-text">Enter the code we just sent you on your email address</p>
            <div className="mb-2">
                <PinInput
                    length={6}
                    onChange={(e) => handleOtpCodeChange(e)}
                    onComplete={(e) => handleOtpCodeChange(e)}
                    type="numeric"
                    inputMode="number"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                    }}
                    inputStyle={{
                        background: '#15191D',
                        borderRadius: '4px',
                        borderColor: '#15191D',
                        fontSize: '20px',
                        color: ' #DEDEDE',
                    }}
                    inputFocusStyle={{ fontSize: '20px', color: 'color: #23262F' }}
                    autoSelect={true}
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
            </div>
            <div className="d-flex justify-content-end mb-3">
                <Link to={'/lost-two-fa'} className="w-100 text-right contrast-text text-xs ">
                    Lost Two-Factor Authentication Code?
                </Link>
            </div>
            <button
                type="button"
                disabled={isLoading || otpCode.length < 6 || signInLoading}
                onClick={onSubmit}
                className="btn btn-primary btn-block btn-mobile px-4 mb-3">
                {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Login'}
            </button>
            <div className="continue-with mb-3">
                <span>or continue with</span>
            </div>
            <button
                onClick={handleRemoveRequire2Fa}
                type="button"
                className="btn btn-primary btn-outline btn-mobile btn-block px-4">
                Login with another account
            </button>
        </React.Fragment>
    );
};

export { TwoFaAuthenticationMobile };
