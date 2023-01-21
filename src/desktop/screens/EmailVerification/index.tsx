import * as React from 'react';
import { History } from 'history';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { captchaType } from '../../../api/config';
import { IntlProps } from '../../../';
import { Captcha } from '../../../components';
import { EMAIL_REGEX, setDocumentTitle } from '../../../helpers';
import {
    emailVerificationFetch,
    GeetestCaptchaResponse,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectCurrentLanguage,
    selectGeetestCaptchaSuccess,
    selectMobileDeviceState,
    selectRecaptchaSuccess,
    selectSendEmailVerificationError,
    selectSendEmailVerificationLoading,
    selectSendEmailVerificationSuccess,
    selectUserInfo,
    User,
    createConfirmationCodeFetch,
    selectConfirmationCodeCreateSuccess,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Link } from 'react-router-dom';
import PinInput from 'react-pin-input';
import moment from 'moment';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
    success: boolean;
    error?: CommonError;
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
    resetCaptchaState: typeof resetCaptchaState;
    createConfirmationCodeFetch: typeof createConfirmationCodeFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
    isMobileDevice: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    user: User;
    ConfirmationCodeCreateSuccess: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

interface EmailVerificationState {
    code: string;
    resendCodeActive: boolean;
    seconds: number;
    timerActive: boolean;
    timer: any;
}

class EmailVerificationComponent extends React.Component<Props, EmailVerificationState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            code: '',
            resendCodeActive: false,
            seconds: 3000,
            timerActive: false,
            timer: null,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Email verification');
        if (!this.props.location.state) {
            this.props.history.push('/signin');
        }
    }

    public componentDidUpdate(previousProps, previousState) {
        const { history, ConfirmationCodeCreateSuccess } = this.props;
        if (ConfirmationCodeCreateSuccess === true) {
            history.push('/signin');
        }

        console.log(previousState);

        let time = null;
        if (previousState.timerActive !== this.state.timerActive) {
            time = setInterval(() => {
                this.setState({ seconds: this.state.seconds - 1000 });

                if (this.state.seconds === 0) {
                    this.setState({ timerActive: false, seconds: 3000 });
                }
            }, 1000);
            this.setState({ timer: time });
        }

        // if (previousState.seconds === 0) {
        //     this.setState({ timerActive: false });
        // }

        // if (previousState.seconds === 0) {
        //     this.setState({ seconds: 0 });
        // }
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
        // this.setState({ timerActive: false, seconds: 3000 });
        // clearInterval(this.state.seconds);
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public renderCaptcha = () => {
        const { error, success } = this.props;

        return <Captcha error={error} success={success} />;
    };

    public render() {
        const { emailVerificationLoading } = this.props;

        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <React.Fragment>
                <div className="row verif-screen">
                    <div className="col-md-5 dark-bg-accent min-h-full px-0">
                        <div className="bg-auth" style={{ backgroundImage: `url('img/bg-auth2.png')` }}></div>
                    </div>
                    <div className="col-md-7 dark-bg-main min-h-full position-relative">
                        <div className="text-to-signup mb-24 text-right">
                            <span>
                                <p className="white-text font-bold">
                                    Already have an account?
                                    <Link to="/signin">
                                        <span className="contrast-text ml-1 cursor-pointer decoration-none">
                                            Sign In
                                        </span>{' '}
                                    </Link>
                                </p>
                            </span>
                        </div>
                        <div className="main-wrapper">
                            <div className="main-form">
                                <h3 className="title-2 white-text font-semibold mb-8">Activate Account</h3>
                                <h5 className="mb-24 text-xs font-normal grey-text">
                                    We sent a code to {this.props.location.state?.email}, to confirm your registration
                                </h5>
                                <div className="mb-24">
                                    <div className="mb-8 text-xs font-normal white-text">Verification Code</div>
                                    <PinInput
                                        length={6}
                                        onChange={this.handleChangeConfirmChange}
                                        onComplete={this.handleChangeConfirmChange}
                                        type="numeric"
                                        inputMode="number"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px',
                                        }}
                                        inputStyle={{
                                            background: '#F2F0FF',
                                            borderRadius: '4px',
                                            fontSize: '20px',
                                            color: 'color: #23262F',
                                        }}
                                        inputFocusStyle={{ fontSize: '20px', color: 'color: #23262F' }}
                                        autoSelect={true}
                                        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                    />
                                    <div className="text-right">
                                        {emailVerificationLoading ? (
                                            <Spinner animation="border" variant="primary" />
                                        ) : (
                                            <button
                                                className="btn-send-again text-sm grey-text border-none bg-transparent cursor-pointer p-0"
                                                onClick={this.handleClick}>
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                    <p
                                        className={`text-right text-xs cursor-pointer ${
                                            this.state.timerActive ? 'white-text' : 'grey-text'
                                        }`}>
                                        {moment(this.state.seconds).format('mm:ss')}
                                    </p>
                                    <div className="mt-4 mb-2">{this.renderCaptcha()}</div>
                                </div>
                                <Button
                                    block={true}
                                    type="button"
                                    disabled={this.disableButton()}
                                    onClick={this.codeConfirm}
                                    size="lg"
                                    className="button registration__button mb-8"
                                    variant="primary">
                                    Activate Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeConfirmChange = (value: string) => {
        this.setState({
            code: value,
        });
    };

    private codeConfirm = () => {
        const payload = {
            email: this.props.location.state.email,
            code: this.state.code,
        };
        this.props.createConfirmationCodeFetch(payload);
    };

    private handleClick = () => {
        const { captcha_response } = this.props;

        if (this.props.location.state.email && this.props.captcha_response) {
            this.setState({ timerActive: !this.state.timerActive });
        }

        switch (captchaType()) {
            case 'recaptcha':
            case 'geetest':
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                    captcha_response,
                });
                break;
            default:
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                });
                break;
        }

        this.props.resetCaptchaState();
    };

    private disableButton = (): boolean => {
        const { location, geetestCaptchaSuccess, reCaptchaSuccess } = this.props;
        const captchaTypeValue = captchaType();

        if (location.state && location.state.email && !location.state.email.match(EMAIL_REGEX)) {
            return true;
        }

        if (this.state.code.length < 6) {
            return true;
        }

        if (captchaTypeValue === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (captchaTypeValue === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        if (this.state.timerActive) {
            return true;
        }

        return false;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
    error: selectSendEmailVerificationError(state),
    success: selectSendEmailVerificationSuccess(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
    user: selectUserInfo(state),
    ConfirmationCodeCreateSuccess: selectConfirmationCodeCreateSuccess(state),
});

const mapDispatchToProps = {
    emailVerificationFetch,
    resetCaptchaState,
    createConfirmationCodeFetch,
};

export const EmailVerificationScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(EmailVerificationComponent) as React.ComponentClass;
