import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CodeVerification } from '../../components';
import { signInRequire2FA } from '../../../modules';

export interface TwoFactorAuthProps {
    isMobile?: boolean;
    isLoading?: boolean;
    signInLoading?: boolean;
    onSubmit: () => void;
    title: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    handleOtpCodeChange: (otp: string) => void;
    handleClose2fa: () => void;
}

export const TwoFactorAuthComponent: React.FC<TwoFactorAuthProps> = ({
    isMobile,
    isLoading,
    otpCode,
    buttonLabel,
    signInLoading,
    onSubmit,
    handleOtpCodeChange,
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

    const handleRemoveRequire2Fa = useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <form>
                <CodeVerification
                    code={otpCode}
                    onChange={handleOtpCodeChange}
                    onSubmit={handleEnterPress}
                    codeLength={6}
                    type="text"
                    placeholder="X"
                    inputMode="decimal"
                    showPaste2FA={false}
                    isMobile={isMobile}
                />
                <Link to={`/lost-two-fa`}>
                    <div className="w-100 mb-24 text-right text-xs grey-text">Lost Your 2FA?</div>
                </Link>

                <Button
                    disabled={isLoading || signInLoading || otpCode.length < 6}
                    onClick={onSubmit}
                    size="lg"
                    variant="primary"
                    block>
                    {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Sign in'}
                </Button>
            </form>
            <div className="mt-3">
                <button
                    type="button"
                    onClick={handleRemoveRequire2Fa}
                    className="cursor-pointer btn btn-primary btn-outline btn-block">
                    <span className="gradient-text">+ Sign In With Another Account</span>
                </button>
            </div>
        </React.Fragment>
    );
};

export const TwoFactorAuth = React.memo(TwoFactorAuthComponent);
