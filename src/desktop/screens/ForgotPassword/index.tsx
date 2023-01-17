import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { captchaType } from '../../../api/config';
import { Captcha } from '../../../components';
import { EmailForm } from '../../components';
import { EMAIL_REGEX, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../../helpers';
import { IntlProps } from '../../../index';
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
import { CommonError } from '../../../modules/types';

interface ReduxProps {
    success: boolean;
    error?: CommonError;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    errorForgotPassword: any;
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
    resetCaptchaState: typeof resetCaptchaState;
}

interface ForgotPasswordState {
    email: string;
    emailError: string;
    emailFocused: boolean;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            emailError: '',
            emailFocused: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Forgot password');
    }

    public renderCaptcha = () => {
        const { error, success } = this.props;

        return <Captcha error={error} success={success} />;
    };

    public render() {
        const { email, emailFocused, emailError } = this.state;
        const { captcha_response, reCaptchaSuccess, geetestCaptchaSuccess } = this.props;
        return (
            <React.Fragment>
                <div className="row sign-up-screen ">
                    <div className="col-md-5 dark-bg-accent min-h-full px-0">
                        <div className="bg-auth" style={{ backgroundImage: `url('img/bg-auth1.png')` }}></div>
                    </div>
                    <div className="col-md-7 dark-bg-main min-h-full position-relative">
                        <div className="text-to-signup mb-24">
                            <span>
                                <p className="white-text font-bold">
                                    Already have an account?
                                    <Link to="/signin">
                                        <span className="contrast-text ml-1 cursor-pointer">Sign In</span>{' '}
                                    </Link>
                                </p>
                            </span>
                        </div>
                        <div className="main-wrapper d-flex align-items-center">
                            <div className="main-form position-relative">
                                <div onKeyPress={this.handleEnterPress}>
                                    <EmailForm
                                        OnSubmit={this.handleChangePassword}
                                        title={this.props.intl.formatMessage({ id: 'page.forgotPassword' })}
                                        emailLabel={this.props.intl.formatMessage({ id: 'page.forgotPassword.email' })}
                                        buttonLabel={this.props.intl.formatMessage({ id: 'page.forgotPassword.send' })}
                                        email={email}
                                        emailFocused={emailFocused}
                                        emailError={emailError}
                                        message={this.props.intl.formatMessage({ id: 'page.forgotPassword.message' })}
                                        validateForm={this.validateForm}
                                        handleInputEmail={this.handleInputEmail}
                                        handleFieldFocus={this.handleFocusEmail}
                                        handleReturnBack={this.handleComeBack}
                                        captchaType={captchaType()}
                                        renderCaptcha={this.renderCaptcha()}
                                        reCaptchaSuccess={reCaptchaSuccess}
                                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                                        captcha_response={captcha_response}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private handleChangePassword = () => {
        const { email } = this.state;
        const { captcha_response, errorForgotPassword } = this.props;

        switch (captchaType()) {
            case 'recaptcha':
            case 'geetest':
                this.props.forgotPassword({ email, captcha_response });
                break;
            default:
                this.props.forgotPassword({ email });
                break;
        }

        this.props.history.push({
            pathname: '/accounts/password_reset',
            state: {
                email: this.state.email,
            },
        });

        this.props.resetCaptchaState();
    };

    private handleFocusEmail = () => {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    };

    private handleInputEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private validateForm = () => {
        const { email } = this.state;

        const isEmailValid = email ? email.match(EMAIL_REGEX) : true;

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
            });

            return;
        }
    };

    private handleComeBack = () => {
        this.props.history.goBack();
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleChangePassword();
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    success: selectForgotPasswordSuccess(state),
    errorForgotPassword: selectForgotPasswordError(state),
    i18n: selectCurrentLanguage(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    forgotPasswordError: (error) => dispatch(forgotPasswordError(error)),
    forgotPassword: (credentials) => dispatch(forgotPassword(credentials)),
    resetCaptchaState: () => dispatch(resetCaptchaState()),
});

export const ForgotPasswordScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(ForgotPasswordComponent) as React.ComponentClass;
