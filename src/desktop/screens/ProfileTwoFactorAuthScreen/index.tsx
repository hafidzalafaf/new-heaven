import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { CopyableTextField } from '../../../components';
import { CustomInput } from '../../components';
import { copy, setDocumentTitle } from '../../../helpers';
import { alertPush, RootState, selectMobileDeviceState } from '../../../modules';
import {
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from '../../../modules/user/profile';

interface RouterProps {
    history: History;
}

interface ReduxProps {
    barcode: string;
    qrUrl: string;
    success?: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    fetchSuccess: typeof alertPush;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

interface State {
    otpCode: string;
}

class ToggleTwoFactorAuthComponent extends React.Component<Props, State> {
    public state = {
        otpCode: '',
    };

    public componentDidMount() {
        setDocumentTitle('Two factor authentication');
        const enable2fa = this.get2faAction();
        if (enable2fa) {
            this.props.generateQR();
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (!this.props.success && next.success) {
            this.handleNavigateToProfile();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    public render() {
        const enable2fa = this.get2faAction();
        return (
            <div className="pg-profile-two-factor-auth">
                {this.renderToggle2fa(enable2fa)}
            </div>
        );
    }

    private renderToggle2fa = (enable2fa: boolean) => {
        const {
            barcode,
            qrUrl,
        } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;

        return (
            <React.Fragment>
                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.header')} 

                {enable2fa && (
                    <div>
                        <div>
                            <span>1   </span>
                            <span>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.1')}</span>
                            <a target="_blank" rel="noopener noreferrer" href="https://apps.apple.com/app/google-authenticator/id388497605?mt=8">AppStore</a>
                            <span> {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.or')}</span>
                            <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl">Google play</a>
                        </div>
                        <div className="d-inline">
                            <span>2    </span>
                            <span>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.2')}</span>
                            <br />
                            <span>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.3')}</span>
                        </div>
                    </div>
                )}


                {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                {enable2fa && secret && this.renderSecret(secret)}
                <div>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.4')}</div>
                <CustomInput
                    handleChangeInput={this.handleOtpCodeChange}
                    type="tel"
                    inputValue={otpCode}
                    placeholder={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                    onKeyPress={this.handleEnterPress}
                    label={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                    defaultLabel=""
                />
                <Button
                        onClick={submitHandler}
                        size="lg"
                        variant="primary"
                        type="button"
                        block={true}
                    >
                        {enable2fa ? 'Enable' : 'Disable'}
                </Button>
            </React.Fragment>
        );
    };

    private renderTwoFactorAuthQR = (barcode: string) => {
        const src = `data:image/png;base64,${barcode}`;

        return barcode.length > 0 && <img alt="s" className="pg-profile-two-factor-auth__qr" src={src} />;
    };

    private renderSecret = (secret: string) => {
        return (
            <div>
                <legend>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.mfa')}</legend>
                <fieldset onClick={this.doCopy}>
                    {secret && <CopyableTextField
                      value={secret}
                      fieldId="secret-2fa"
                      label=""
                    />
                    }
                </fieldset>
            </div>
        );
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const enable2fa = this.get2faAction();
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;
        if (event.key === 'Enter') {
            event.preventDefault();
            submitHandler();
        }
    };

    private handleEnable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: true,
        });
    };

    private handleDisable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: false,
        });
    };

    private handleNavigateToProfile = () => {
        this.props.history.push('/profile');
    };

    private get2faAction = () => {
        const routingState = this.props.history.location.state as any;

        return routingState ? routingState.enable2fa : false;
    };

    private goBack = () => {
        window.history.back();
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, Props, RootState> = state => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

export const ProfileTwoFactorAuthScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ToggleTwoFactorAuthComponent) as React.ComponentClass;
