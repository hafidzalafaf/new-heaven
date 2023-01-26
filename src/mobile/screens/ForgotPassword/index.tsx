import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { captchaType } from '../../../api';
import { useHistory } from 'react-router';
import { ArrowLeft } from '../../assets/Arrow';
import { CustomInput } from '../../../desktop/components';
import { Captcha } from '../../../components';
import { EMAIL_REGEX, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../../helpers';
import {
    forgotPassword,
    forgotPasswordError,
    GeetestCaptchaResponse,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectCurrentLanguage,
    selectForgotPasswordError,
    selectForgotPasswordSuccess,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
} from '../../../modules';

export interface CaptchaProps {
    captchaType?: 'recaptcha' | 'geetest' | 'none';
}

const ForgotPasswordMobileScreen: React.FC<CaptchaProps> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const success = useSelector(selectForgotPasswordSuccess);
    const error = useSelector(selectForgotPasswordError);
    const i18n = useSelector(selectCurrentLanguage);
    const captcha_response = useSelector(selectCaptchaResponse);
    const reCaptchaSuccess = useSelector(selectRecaptchaSuccess);
    const geetestCaptchaSuccess = useSelector(selectGeetestCaptchaSuccess);
    const errorForgotPassword = useSelector(forgotPasswordError);

    const [emailValue, setEmailValue] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleChangePassword = () => {
        switch (captchaType()) {
            case 'recaptcha':
            case 'geetest':
                dispatch(forgotPassword({ email: emailValue, captcha_response }));
                break;
            default:
                dispatch(forgotPassword({ email: emailValue }));
                break;
        }

        history.push({
            pathname: '/reset-password',
            state: {
                email: emailValue,
            },
        });

        resetCaptchaState();
    };

    const handleFocusEmail = () => {
        setEmailFocus(!emailFocus);
    };

    const handleChangeEmail = (value: string) => {
        setEmailValue(value);
    };

    const handleComeBack = () => {
        history.goBack();
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            handleChangePassword();
        }
    };

    const renderCaptcha = () => {
        return <Captcha error={error} success={success} />;
    };

    const isButtonDisabled = (): boolean => {
        if (loading || !emailValue.match(EMAIL_REGEX)) {
            return true;
        }

        // if (props.captchaType === 'recaptcha' && !reCaptchaSuccess) {
        //     return true;
        // }

        if (!geetestCaptchaSuccess) {
            return true;
        }
    };

    const handleForgotPassword = () => {
        history.push('/reset-password');
    };

    React.useEffect(() => {
        setDocumentTitle('Forgot Password');
    }, []);

    return (
        <React.Fragment>
            <div className="mobile-container  no-header dark-bg-main">
                <div onClick={() => history.push('/signin')}>
                    <ArrowLeft className={'back'} />
                </div>
                <h1 className="mt-4 font-extrabold text-md grey-text-accent mb-3">Forgot Password</h1>
                <p className="text-sm grey-text">
                    Please enter your email address or phone. You will receive a code to create a new password{' '}
                </p>
                <CustomInput
                    defaultLabel="email"
                    label="Email"
                    placeholder="your email address"
                    type="email"
                    classNameLabel="white-text text-sm"
                    classNameInput={`text-ms input-mobile ${emailFocus && !emailValue.match(EMAIL_REGEX) && 'error'}`}
                    handleChangeInput={handleChangeEmail}
                    inputValue={emailValue}
                    handleFocusInput={handleFocusEmail}
                    labelVisible
                />
                {emailFocus && !emailValue.match(EMAIL_REGEX) && (
                    <p className="text-xs danger-text m-0 mb-24">Enter a valid email address</p>
                )}

                <div className="mb-24">{renderCaptcha()}</div>

                <button
                    type="button"
                    className="btn btn-primary btn-block btn-mobile"
                    disabled={isButtonDisabled()}
                    onClick={handleChangePassword}>
                    Submit
                </button>
            </div>
        </React.Fragment>
    );
};

export { ForgotPasswordMobileScreen };
