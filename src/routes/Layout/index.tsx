import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, RouterProps, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { minutesUntilAutoLogout, sessionCheckInterval, showLanding, wizardStep } from '../../api';
import { ExpiredSessionModal, UpdateAppModal } from '../../components';
import { WalletsFetch } from '../../containers';
import { applyCustomizationSettings, toggleColorTheme } from '../../helpers';
import {
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMobileDeviceState,
    selectPlatformAccessStatus,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
    userFetch,
    walletsReset,
    AbilitiesInterface,
    selectAbilities,
    getLatestVersionFetch,
    selectLatestVersion,
} from '../../modules';

import {
    SignInMobileScreen,
    SignUpMobileScreen,
    EmailVerificationMobileScreen,
    ForgotPasswordMobileScreen,
    ResetPasswordMobileScreen,
    HomeMobileScreen,
    ProfileMobileScreen,
    TwoFaActivationMobileScreen,
    TwoFaMobileScreen,
    ChangePasswordMobileScreen,
    ApiListMobileScreen,
    ChangePhoneMobileScreen,
    CreateApiMobileScreen,
    ReferralMobileScreen,
    MarketDetailMobileScreen,
    MarketListlMobileScreen,
    TwoFaAuthenticationMobileScreen,
    WalletListMobileScreen,
    WalletDetailMobileScreen,
    MarketOrderMobileScreen,
    HistoryTransactionMobileScreen,
    TradingMobileScreen,
    TradingFutureMobileScreen,
    InternalTransferMobileScreen,
    WalletDepositMobileScreen,
    LostTwoFaMobileScreen,
    WalletWithdrawMobileScreen,
    KycMobileScreen,
    SecurityMobileScreen,
    DeviceManagementMobileScreen,
    OrderHistoryMobileScreen,
    AnnouncementMobileScreen,
    FAQMobileScreen,
    P2PMobileScreen,
    P2PDetailOrderMobileScreen,
    P2PWalletOrderMobileScreen,
    P2PWalletMobileScreen,
    P2PWalletDetailMobileScreen,
    P2PCreateOfferMobileScreen,
    P2PProfileMobileScreen,
    P2PMyOrderMobileScreen,
    P2PMyOfferMobileScreen,
    P2PMyOfferDetailMobileScreen,
    P2PPaymentMethodMobileScreen,
    P2PAddPaymentMethodMobileScreen,
    P2PEditPaymentMethodMobileScreen,
    P2PFAQMobileScreen,
    PrivacyMobileScreen,
    SettingProfileMobileScreen,
} from '../../mobile/screens';

import {
    LandingScreen,
    SignInScreen,
    SignUpScreen,
    WalletsScreen,
    WalletDeposit,
    WalletWitdrawal,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    PasswordResetScreen,
    ProfileScreen,
    ReferralScreen,
    ApiKeyScreen,
    ProfileTwoFactorAuthScreen,
    Lost2FAScreen,
    TwoFaActivationScreen,
    KycScreen,
    MarketListScreen,
    HistoryTransactionScreen,
    Security,
    MarketDetailScreen,
    MarketOpen,
    TradingFutureScreen,
    TradingScreen,
    HistoryTrade,
    AnnouncementScreen,
    FAQScreen,
    ChangeEmail,
    ProfileSetting,
    P2PScreen,
    P2PProfileScreen,
    P2POrderScreen,
    P2PWalletScreen,
    P2PAddPaymentScreen,
    P2PWalletOrderScreen,
    P2PEditPaymentScreen,
    P2PMyOfferScreen,
    P2PDetailOfferScreen,
    PrivacyScreen,
} from '../../desktop/screens';
import { LatestVersion } from 'src/modules/public/latestVersion/types';
import { CURRENT_VERSION, GOOGLE_PLAY_LINK } from 'src/config';
import { Capacitor } from '@capacitor/core';

interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
    user: User;
    isLoggedIn: boolean;
    isMobileDevice: boolean;
    userLoading?: boolean;
    platformAccessStatus: string;
    abilities: AbilitiesInterface;
    latestVersionState: LatestVersion;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
    latestVersionFetch: typeof getLatestVersionFetch;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

interface LayoutState {
    isShownExpSessionModal: boolean;
    isShownUpdater: boolean;
}

interface OwnProps {
    toggleChartRebuild: typeof toggleChartRebuild;
}

export type LayoutProps = ReduxProps & DispatchProps & LocationProps & IntlProps & OwnProps;

const renderLoader = () => (
    <div className="pg-loader-container">
        <Spinner animation="border" variant="primary" />
    </div>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = (props) => <CustomComponent {...props} />;

    if (isLogged) {
        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        return (
            <Route {...rest}>
                <Redirect to={'/wallets'} />
            </Route>
        );
    }

    const renderCustomerComponent = (props) => <CustomComponent {...props} />;

    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    public static eventsListen = ['click', 'keydown', 'scroll', 'resize', 'mousemove', 'TabSelect', 'TabHide'];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
            isShownUpdater: false,
        };
    }

    public componentDidMount() {
        if (
            !(
                this.props.location.pathname.includes('/magic-link') ||
                this.props.location.pathname.includes('/maintenance') ||
                this.props.location.pathname.includes('/restriction')
            )
        ) {
            switch (this.props.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    const token = localStorage.getItem('csrfToken');
                    this.props.latestVersionFetch()

                    if (token) {
                        this.props.userFetch();
                        this.initInterval();
                        this.check();
                    }
            }
        }

        applyCustomizationSettings(null, this.props.toggleChartRebuild);
    }

    public componentWillReceiveProps(nextProps: LayoutProps) {
        this.checkLatestVersion()
        if (
            !(
                nextProps.location.pathname.includes('/magic-link') ||
                nextProps.location.pathname.includes('/restriction') ||
                nextProps.location.pathname.includes('/maintenance')
            ) ||
            this.props.platformAccessStatus !== nextProps.platformAccessStatus
        ) {
            switch (nextProps.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    break;
            }
        }

        if (!this.props.user.email && nextProps.user.email) {
            this.props.userFetch();
        }

        if (!this.props.isLoggedIn && nextProps.isLoggedIn && !this.props.user.email) {
            this.initInterval();
            this.check();
        }
    }

    public componentDidUpdate(prevProps: LayoutProps) {
        const { isLoggedIn, userLoading } = this.props;

        if (!isLoggedIn && prevProps.isLoggedIn && !userLoading) {
            this.props.walletsReset();

            if (!this.props.location.pathname.includes('/trading/ethusdt')) {
                this.props.history.push('/trading/ethusdt');
            }
        }

        if (
            this.props.location.pathname === '/wallets/deposit' ||
            this.props.location.pathname === '/wallets/withdraw'
        ) {
            this.props.history.push('/wallets');
        }
    }

    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({ id: key });

    public render() {
        const { colorTheme, isLoggedIn, isMobileDevice, userLoading, location, platformAccessStatus } = this.props;
        const { isShownExpSessionModal } = this.state;
        const desktopCls = classnames('container-fluid p-0 pg-layout', {
            'trading-layout': location.pathname.includes('/trading'),
        });
        const mobileCls = classnames(' pg-layout pg-layout--mobile', {
            'pg-layout--mobile-setup': location.pathname.includes('/setup'),
        });
        toggleColorTheme(colorTheme);

        if (!platformAccessStatus.length) {
            return renderLoader();
        }

        if (isMobileDevice) {
            return (
                <div className={mobileCls}>
                    <Switch>
                        <Route loading={userLoading} isLogged={isLoggedIn} path="/faq" component={FAQMobileScreen} />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/signin"
                            component={SignInMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/signup"
                            component={SignUpMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/email-verification"
                            component={EmailVerificationMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/profile/kyc"
                            component={KycMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/security"
                            component={SecurityMobileScreen}
                        />

                        <PublicRoute loading={userLoading} path="/setting" component={SettingProfileMobileScreen} />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/profile"
                            component={ProfileMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/forgot-password"
                            component={ForgotPasswordMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/reset-password"
                            component={ResetPasswordMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            path="/change-password"
                            component={ChangePasswordMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/two-fa-activation"
                            component={TwoFaActivationMobileScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/lost-two-fa"
                            component={LostTwoFaMobileScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/two-fa"
                            component={TwoFaMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/change-phone"
                            component={ChangePhoneMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/api-key"
                            component={ApiListMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/referral"
                            component={ReferralMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/device-management"
                            component={DeviceManagementMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/create-api"
                            component={CreateApiMobileScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets/:currency/transfer"
                            component={InternalTransferMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets/:currency/withdraw"
                            component={WalletWithdrawMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets/:currency/deposit"
                            component={WalletDepositMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets/:currency/detail"
                            component={WalletDetailMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/wallets"
                            component={WalletListMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            path="/markets/detail/:currency"
                            component={MarketDetailMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            path="/trading-future/:currency"
                            component={TradingFutureMobileScreen}
                        />

                        <PublicRoute loading={userLoading} path="/trading/:currency" component={TradingMobileScreen} />
                        <PublicRoute loading={userLoading} path="/markets" component={MarketListlMobileScreen} />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/two-fa-authentication"
                            component={TwoFaAuthenticationMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/trade-history"
                            component={OrderHistoryMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            path="/p2p/profile/:uid"
                            component={P2PProfileMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/order"
                            component={MarketOrderMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/history-transaction"
                            component={HistoryTransactionMobileScreen}
                        />

                        <PublicRoute loading={userLoading} path="/announcements" component={AnnouncementMobileScreen} />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/faq"
                            component={P2PFAQMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/create-offer"
                            component={P2PCreateOfferMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/payment-method/edit/:payment_user_uid"
                            component={P2PEditPaymentMethodMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/payment-method/create/:bank"
                            component={P2PAddPaymentMethodMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/payment-method"
                            component={P2PPaymentMethodMobileScreen}
                        />
                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/offer/:offer_number"
                            component={P2PMyOfferDetailMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/offer"
                            component={P2PMyOfferMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/order/detail/:order_number"
                            component={P2PWalletOrderMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            path="/p2p/order/:offer_number"
                            component={P2PDetailOrderMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/order"
                            component={P2PMyOrderMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/wallets/:currency/detail"
                            component={P2PWalletDetailMobileScreen}
                        />

                        <PrivateRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/p2p/wallets"
                            component={P2PWalletMobileScreen}
                        />

                        <PublicRoute loading={userLoading} path="/p2p" component={P2PMobileScreen} />

                        {/* <PublicRoute loading={userLoading} path="/trading" component={TradingMobileScreen} />    */}
                        <PublicRoute loading={userLoading} path="/privacy" component={PrivacyMobileScreen} />
                        <PublicRoute loading={userLoading} path="/" component={HomeMobileScreen} />

                        <Route path="**">
                            <Redirect to="/markets" />
                        </Route>
                    </Switch>
                    {isLoggedIn && <WalletsFetch />}
                    {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
                    {this.state.isShownUpdater && this.handleUpdater()}
                </div>
            );
        }

        return (
            <div className={desktopCls}>
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets/:currency/deposit"
                        component={WalletDeposit}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets/:currency/withdraw"
                        component={WalletWitdrawal}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets"
                        component={WalletsScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/email-verification"
                        component={EmailVerificationScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/forgot_password"
                        component={ForgotPasswordScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/accounts/password_reset"
                        component={PasswordResetScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/lost-two-fa"
                        component={Lost2FAScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/referral"
                        component={ReferralScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/api-key"
                        component={ApiKeyScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/two-fa-activation"
                        component={TwoFaActivationScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/kyc"
                        component={KycScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/security"
                        component={Security}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/setting"
                        component={ProfileSetting}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile"
                        component={ProfileScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/security/2fa"
                        component={ProfileTwoFactorAuthScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        path="/markets/detail/:currency"
                        component={MarketDetailScreen}
                    />

                    <PublicRoute
                        loading={userLoading}
                        path="/markets/trading-future/:currency"
                        component={TradingFutureScreen}
                    />
                    <PublicRoute loading={userLoading} path="/markets/trading/:currency" component={TradingScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/markets-open"
                        component={MarketOpen}
                    />

                    <PublicRoute loading={userLoading} path="/markets" component={MarketListScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/history-transaction"
                        component={HistoryTransactionScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/trade-history"
                        component={HistoryTrade}
                    />

                    <PublicRoute loading={userLoading} path="/announcement" component={AnnouncementScreen} />
                    <PublicRoute loading={userLoading} path="/faq" component={FAQScreen} />
                    <PublicRoute loading={userLoading} path="/privacy" component={PrivacyScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/change-email"
                        component={ChangeEmail}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/payment-method/edit/:payment_user_uid"
                        component={P2PEditPaymentScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/payment-method/create/:payment"
                        component={P2PAddPaymentScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/order/detail/:order_number"
                        component={P2PWalletOrderScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/order"
                        component={P2POrderScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/wallets"
                        component={P2PWalletScreen}
                    />
                    <PublicRoute loading={userLoading} path="/p2p/profile/:uid" component={P2PProfileScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/offer/:offer_number"
                        component={P2PDetailOfferScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/p2p/offer"
                        component={P2PMyOfferScreen}
                    />
                    <PublicRoute loading={userLoading} path="/p2p" component={P2PScreen} />
                    <Route exact={true} path="/" component={LandingScreen} />
                    <Route path="**">
                        <Redirect to="/markets/" />
                    </Route>
                </Switch>
                {isLoggedIn && <WalletsFetch />}
                {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
            </div>
        );
    }

    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }

        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, parseFloat(sessionCheckInterval()));
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;

        if (isTimeout && user.email) {
            if (user.state === 'active') {
                this.handleChangeExpSessionModalState();
            }

            this.props.logout();
            clearInterval(this.timer);
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            show={this.state.isShownExpSessionModal}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
    };

    private checkLatestVersion = () => {
        const { latestVersionState } = this.props
        const currentVersion = CURRENT_VERSION
        const platform = Capacitor.getPlatform()
        if (platform === 'android' && latestVersionState.value !== currentVersion) {
            this.setState({
                isShownUpdater: true,
            })
        }
    }

    private handleUpdaterModalState = () => {
        this.setState({
            isShownUpdater: !this.state.isShownUpdater
        })
    }

    private handleUpdateApp = () => {
        this.handleUpdaterModalState();
        window.location.href = GOOGLE_PLAY_LINK
    }

    private handleUpdater = () => (
        <UpdateAppModal
            title={'New App Version is Live'}
            buttonLabel={'Update'}
            show={this.state.isShownUpdater}
            handleChangeUpdateAppModalState={this.handleUpdaterModalState}
            handleSubmitUpdateAppModal={this.handleUpdateApp}
        />
    );
}


const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
    userLoading: selectUserFetching(state),
    platformAccessStatus: selectPlatformAccessStatus(state),
    abilities: selectAbilities(state),
    latestVersionState: selectLatestVersion(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => ({
    logout: () => dispatch(logoutFetch()),
    toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
    latestVersionFetch: () => dispatch(getLatestVersionFetch())
});

export const Layout = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(LayoutComponent) as any;
