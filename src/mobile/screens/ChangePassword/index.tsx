import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { CustomInput, PasswordStrengthMeter } from '../../../desktop/components';
import { ArrowLeft } from '../../assets/Arrow';
import { passwordMinEntropy } from '../../../api/config';
import { useHistory } from 'react-router';
import {
    toggle2faFetch,
    selectChangePasswordSuccess,
    changePasswordFetch,
    selectUserInfo,
    User,
    userFetch,
    RootState,
    entropyPasswordFetch,
    selectCurrentPasswordEntropy,
    sendCode,
    verifyPhone,
} from '../../../modules';
import {
    setDocumentTitle,
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../../helpers';

const ChangePasswordMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    const [oldPasswordValue, setOldPasswordValue] = React.useState('');
    const [newPasswordValue, setNewPasswordValue] = React.useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = React.useState('');

    const [passwordNewFocus, setPasswordNewFocus] = React.useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);

    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);
    const [passwordMatch, setPasswordMatch] = React.useState(true);
    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);

    const translate = (key: string) => intl.formatMessage({ id: key });

    const handleChangeOldPassword = (value: string) => {
        setOldPasswordValue(value);
    };

    const handleChangeNewPassword = (value: string) => {
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

        setNewPasswordValue(value);
        setTimeout(() => {
            dispatch(entropyPasswordFetch({ password: value }));
        }, 100);
    };

    const handleChangeConfirmPassword = (value: string) => {
        setConfirmPasswordValue(value);
        setConfirmPasswordFocus(true);
    };

    const handleFocusNewPassword = () => {
        setPasswordPopUp(!passwordPopUp);
        setPasswordNewFocus(!passwordNewFocus);
    };

    const handleFocusConfirmPassword = () => {
        setConfirmPasswordFocus(!confirmPasswordFocus);
    };

    const isValidForm = () => {
        if (
            !passwordErrorFirstSolved ||
            !passwordErrorSecondSolved ||
            !passwordErrorThirdSolved ||
            !oldPasswordValue ||
            !newPasswordValue ||
            !confirmPasswordValue ||
            !newPasswordValue.match(PASSWORD_REGEX) ||
            newPasswordValue !== confirmPasswordValue
        ) {
            return true;
        }
    };

    const handleChangePassword = () => {
        dispatch(
            changePasswordFetch({
                old_password: oldPasswordValue,
                new_password: newPasswordValue,
                confirm_password: confirmPasswordValue,
            })
        );

        history.push('/profile');
    };

    React.useEffect(() => {
        if (newPasswordValue == confirmPasswordValue) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    }, [confirmPasswordValue]);

    React.useEffect(() => {
        setDocumentTitle('Change Password');
    }, []);

    return (
        <React.Fragment>
            <div className="mobile-container change-password no-header home-screen dark-bg-main">
                <div className="head-container position-relative">
                    <Link to={'/profile'} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </Link>
                    <h1 className="text-center text-md grey-text-accent font-bold">Profile Setting</h1>
                </div>
                <div className="divider" />
                <form>
                    <p className="text-sm grey-text">
                        Change your password and by entering the code that has been sent previously
                    </p>
                    <div>
                        <CustomInput
                            defaultLabel="Old Password"
                            inputValue={oldPasswordValue}
                            label="Old Password"
                            placeholder="Old password"
                            type="password"
                            classNameLabel="white-text text-sm"
                            classNameInput="text-ms input-mobile"
                            handleChangeInput={handleChangeOldPassword}
                            labelVisible
                        />
                        <CustomInput
                            defaultLabel="Set New Password "
                            label="Set New Password"
                            placeholder="Set New Password"
                            type="password"
                            labelVisible
                            classNameLabel="white-text text-sm"
                            classNameInput={`input-mobile ${
                                passwordNewFocus &&
                                (!passwordErrorFirstSolved ||
                                    !passwordErrorSecondSolved ||
                                    !passwordErrorThirdSolved) &&
                                'error'
                            }`}
                            inputValue={newPasswordValue}
                            autoFocus={false}
                            handleFocusInput={handleFocusNewPassword}
                            handleChangeInput={handleChangeNewPassword}
                        />

                        {passwordNewFocus &&
                            (!passwordErrorFirstSolved || !passwordErrorSecondSolved || !passwordErrorThirdSolved) && (
                                <p className="danger-text m-0 mb-24 text-xs">Password Strength must be GOOD</p>
                            )}
                        <div>
                            <PasswordStrengthMeter
                                minPasswordEntropy={passwordMinEntropy()}
                                currentPasswordEntropy={currentPasswordEntropy}
                                passwordExist={newPasswordValue !== ''}
                                passwordErrorFirstSolved={passwordErrorFirstSolved}
                                passwordErrorSecondSolved={passwordErrorSecondSolved}
                                passwordErrorThirdSolved={passwordErrorThirdSolved}
                                passwordPopUp={passwordPopUp}
                                translate={translate}
                            />
                        </div>
                        <CustomInput
                            defaultLabel="Confirm New Password"
                            label="Confirm New Password"
                            placeholder="Confirm New password"
                            type="password"
                            classNameLabel="white-text text-sm"
                            classNameInput={`text-ms input-mobile ${
                                confirmPasswordFocus && confirmPasswordValue !== newPasswordValue && 'error'
                            }`}
                            autoFocus={false}
                            inputValue={confirmPasswordValue}
                            handleFocusInput={handleFocusConfirmPassword}
                            handleChangeInput={handleChangeConfirmPassword}
                            labelVisible
                        />

                        {confirmPasswordFocus && confirmPasswordValue !== newPasswordValue && (
                            <p className="text-xs danger-text m-0 mb-24">Password Confirmation doesn't match</p>
                        )}

                        <button
                            type="button"
                            className="btn-primary btn-block btn-mobile cursor-pointer"
                            onClick={handleChangePassword}
                            disabled={isValidForm()}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export { ChangePasswordMobileScreen };
