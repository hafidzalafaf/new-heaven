import * as React from 'react';
import { History } from 'history';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { Decimal } from 'src/components';
import '../../../styles/colors.pcss';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    setMobileWalletUi,
    toggleMarketSelector,
    selectUserLoggedIn,
    logoutFetch,
    selectCurrencies,
    Currency,
    selectMarketTickers,
    changeColorTheme,
} from '../../../modules';
import { numberFormat } from '../../../helpers';
import { Logo } from '../../../assets/images/Logo';
import { IndonesianFlag, AmericanFlag } from '../../../assets/images/Flags';
import { MoonIcon, SunIcon } from 'src/assets/images/SwitchTheme';
import { Api, Dashboard, Logout, Referral, Security, Wallet } from '../../../assets/images/ProfileDropdown';

interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    isLoggedIn: boolean;
    currencies: Currency[];
    tickers: any;
}

interface OwnProps {
    history: History;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    logout: typeof logoutFetch;
    changeColorTheme: typeof changeColorTheme;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

export interface HeaderState {
    showLanguage: boolean;
    showProfileDropdown: boolean;
    showHeader: boolean;
}

const authHeader = ['/signin', '/signup', '/email-verification', '/forgot_password', '/password_reset', '/trading'];
const tradingHeader = ['/trading'];

type Props = ReduxProps & DispatchProps & IntlProps & LocationProps & OwnProps;

class Head extends React.Component<Props, HeaderState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showLanguage: false,
            showProfileDropdown: false,
            showHeader: false,
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const thisAuthHeader = authHeader.some((r) => location.pathname.includes(r)) && location.pathname !== '/';
        const thisTradingHeader = tradingHeader.some((r) => location.pathname.includes(r));

        const { showLanguage, showProfileDropdown } = this.state;
        const { isLoggedIn } = this.props;

        const logoutButton = async () => {
            await this.props.logout();
            this.setState({ showHeader: false });
            this.props.history.push('/trading');
        };

        const ProfileDropdown = [
            {
                name: 'Dashboard',
                desc: 'Dashboard summary profile',
                icon: <Dashboard />,
                url: '/profile',
            },
            {
                name: 'Wallet',
                desc: 'deposit and withdraw wallet',
                icon: <Wallet />,
                url: '/wallets',
            },
            {
                name: 'Security',
                desc: 'secure your account',
                icon: <Security />,
                url: '/profile/security',
            },
            {
                name: 'Refferal',
                desc: 'invite friend to reach bonus',
                icon: <Referral />,
                url: '/profile/referral',
            },
            {
                name: 'API Management',
                desc: 'api Management for your account',
                icon: <Api />,
                url: '/profile/api-key',
            },
        ];

        const LanguageDropdown = [
            {
                flag: <IndonesianFlag className="mr-2" />,
                name: 'Indonesia',
            },
            {
                flag: <AmericanFlag className="mr-2" />,
                name: 'American',
            },
        ];

        const currencyItem: Currency | any =
            this.props.currencies &&
            this.props.currencies.find((item) => item.id === this.props.currentMarket?.base_unit);

        const ticker = this.props.tickers[this.props.currentMarket?.id];

        // if (window.performance) {
        //     console.info('window.performance works fine on this browser');
        // }
        // console.info(performance.navigation.type);
        // if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        //     console.info('This page is reloaded');
        // } else {
        //     console.info('This page is not reloaded');
        // }

        if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            localStorage.setItem('showProfileDropdown', 'false');
            localStorage.setItem('showLanguage', 'false');
        }

        return (
            <React.Fragment>
                <nav
                    className={`navbar navbar-expand-lg py-2 px-24 ${
                        thisTradingHeader ? 'dark-bg-accent' : 'dark-bg-accent'
                    }`}>
                    <Link
                        onClick={() => {
                            localStorage.setItem('showProfileDropdown', 'false');
                            localStorage.setItem('showLanguage', 'false');
                        }}
                        to="/"
                        className="navbar-brand">
                        <Logo />
                    </Link>
                    <div className="d-flex align-items-center">
                        {this.state.showHeader && isLoggedIn && (
                            <li className="nav-item dropdown avatar profile-menu px-3">
                                <div
                                    className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm"
                                    onClick={() => this.setState({ showProfileDropdown: !showProfileDropdown })}>
                                    <img src="/img/avatar.png" className="avatar-image" alt="" />
                                </div>
                                {showProfileDropdown ? (
                                    <div
                                        className="dropdown-menu dark-bg-accent p-3 radius-sm"
                                        aria-labelledby="navbarDropdownMenuLink">
                                        {ProfileDropdown.map((item, index) => (
                                            <div
                                                key={index}
                                                className="dropdown-wallets-item"
                                                onClick={() => {
                                                    this.setState({ showProfileDropdown: false });
                                                    this.setState({ showHeader: false });
                                                }}>
                                                <Link to={item.url} className="d-flex">
                                                    {item.icon}
                                                    <div className="pl-3">
                                                        <p className="mb-0 text-sm font-bold white-text">{item.name}</p>
                                                        <span className="text-xs grey-text-accent font-normal">
                                                            {item.desc}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                        <div
                                            className="dropdown-wallets-item cursor-pointer"
                                            onClick={() => this.setState({ showProfileDropdown: false })}>
                                            <div className="d-flex" onClick={logoutButton}>
                                                <Logout />
                                                <div className="pl-3">
                                                    <p className="mb-0 text-sm font-bold white-text">
                                                        {this.translate('page.header.navbar.logout')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </li>
                        )}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon">
                                <img
                                    src={this.state.showHeader ? '/img/humburger-show.png' : '/img/humburger.png'}
                                    className="humberger-icon"
                                    alt="humberger icon"
                                    onClick={() => this.setState({ showHeader: !this.state.showHeader })}
                                />
                            </span>
                        </button>
                    </div>
                    <div
                        className={`collapse ${
                            this.state.showHeader && 'show'
                        } navbar-collapse justify-content-between`}
                        id="navbarNavDropdown">
                        <div
                            onClick={() => {
                                localStorage.setItem('showProfileDropdown', 'false');
                                localStorage.setItem('showLanguage', 'false');
                            }}>
                            {!thisAuthHeader ? (
                                <React.Fragment>
                                    <ul className="navbar-nav main-navbar">
                                        <li
                                            className={`nav-item ${
                                                (location.pathname == '/profile' || location.pathname == '/') &&
                                                'active'
                                            }`}
                                            onClick={() => this.setState({ showHeader: false })}>
                                            <Link to={'/'} className="nav-link px-3 text-sm font-bold">
                                                {this.translate('page.header.navbar.home')}
                                            </Link>
                                        </li>
                                        <li
                                            className={`nav-item ${location.pathname == '/markets' && 'active'}`}
                                            onClick={() => this.setState({ showHeader: false })}>
                                            <Link to={'/markets'} className="nav-link px-3 text-sm font-bold">
                                                {this.translate('page.header.navbar.market')}
                                            </Link>
                                        </li>
                                        <li
                                            className={`nav-item ${location.pathname == '/p2p' && 'active'}`}
                                            onClick={() => this.setState({ showHeader: false })}>
                                            <Link to={'/p2p'} className="nav-link px-3 text-sm font-bold">
                                                P2P
                                            </Link>
                                        </li>
                                        <li
                                            className={`nav-item ${location.pathname == '/faq' && 'active'}`}
                                            onClick={() => this.setState({ showHeader: false })}>
                                            <Link to={'/faq'} className="nav-link px-3 text-sm font-bold">
                                                {this.translate('page.header.navbar.support')}
                                            </Link>
                                        </li>
                                        <li
                                            className={`nav-item ${location.pathname == '/announcement' && 'active'}`}
                                            onClick={() => this.setState({ showHeader: false })}>
                                            <Link to={'/announcement'} className="nav-link px-3 text-sm font-bold">
                                                {this.translate('page.header.navbar.announcement')}
                                            </Link>
                                        </li>
                                    </ul>
                                </React.Fragment>
                            ) : thisTradingHeader ? (
                                <React.Fragment>
                                    <ul className="navbar-nav main-navbar trading-header align-items-center">
                                        <li className="nav-item dropdown market-dropdown ">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={currencyItem && currencyItem.icon_url}
                                                    alt="coin"
                                                    className="small-coin-icon mr-8"
                                                />
                                                <h2 className="white-text text-md m-0 p-0">
                                                    {this.props.currentMarket?.name}
                                                </h2>
                                            </div>
                                        </li>
                                        <li className="nav-item nav-large-display">
                                            <div className="nav-link px-12">
                                                <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">
                                                    {this.translate('page.header.navbar.trade.24change')}
                                                </p>
                                                <p
                                                    className={`font-bold mb-0 text-sm ${
                                                        ticker?.price_change_percent.includes('+')
                                                            ? 'contrast-text'
                                                            : 'danger-text'
                                                    }`}>
                                                    {ticker?.price_change_percent}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="nav-item nav-large-display">
                                            <div className="nav-link px-12">
                                                <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">Price</p>
                                                <p className=" font-bold mb-0 white-text text-sm">
                                                    {Decimal.format(
                                                        +ticker?.last,
                                                        this.props.currentMarket?.price_precision
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="nav-item nav-large-display">
                                            <div className="nav-link px-12">
                                                <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">
                                                    {this.translate('page.header.navbar.trade.24high')}
                                                </p>
                                                <p className=" font-bold mb-0 white-text text-sm">
                                                    {Decimal.format(
                                                        +ticker?.high,
                                                        this.props.currentMarket?.price_precision
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="nav-item nav-large-display">
                                            <div className="nav-link px-12">
                                                <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">
                                                    {this.translate('page.header.navbar.trade.24low')}
                                                </p>
                                                <p className=" font-bold mb-0 white-text text-sm">
                                                    {Decimal.format(
                                                        +ticker?.low,
                                                        this.props.currentMarket?.price_precision
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="nav-item nav-large-display">
                                            <div className="nav-link px-12">
                                                <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">
                                                    {this.translate('page.header.navbar.trade.24volume')}
                                                </p>
                                                <p className=" font-bold mb-0 white-text text-sm">
                                                    {Decimal.format(
                                                        +ticker?.volume,
                                                        this.props.currentMarket?.amount_precision
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </React.Fragment>
                            ) : (
                                ''
                            )}
                        </div>

                        {/* right navbar */}
                        {this.state.showHeader && <div className="devider"></div>}
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item dropdown px-3">
                                <a
                                    className="nav-link dropdown-toggle grey-text-accent text-sm"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    // onClick={() =>
                                    //     this.setState({ showLanguage: !showLanguage, showProfileDropdown: false })
                                    // }
                                    onClick={() => {
                                        if (localStorage.getItem('showLanguage') == 'false') {
                                            localStorage.setItem('showProfileDropdown', 'false');
                                            localStorage.setItem('showLanguage', 'true');
                                        } else {
                                            localStorage.setItem('showLanguage', 'false');
                                        }
                                    }}>
                                    EN/USD
                                </a>
                                {localStorage.getItem('showLanguage') == 'true' ? (
                                    <div
                                        className="dropdown-menu dark-bg-accent p-3 radius-sm"
                                        aria-labelledby="navbarDropdownMenuLink">
                                        <div className="d-flex">
                                            <div className="language">
                                                <p className="text-xs font-bold mb-3 grey-text-accent">
                                                    {this.translate('page.header.navbar.dropdown.language')}
                                                </p>
                                                {LanguageDropdown.map((item, key) => (
                                                    <div
                                                        key={`language-${key}`}
                                                        onClick={() => this.setState({ showLanguage: false })}
                                                        className="dropdown-item grey-text-accent text-sm active cursor-pointer">
                                                        {item.flag} {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="line"></div>
                                            <div
                                                className="currency"
                                                onClick={() => this.setState({ showLanguage: false })}>
                                                <p className="text-xs font-bold mb-3 grey-text-accent">
                                                    {this.translate('page.header.navbar.dropdown.currency')}
                                                </p>
                                                <div className="dropdown-item grey-text-accent text-sm active cursor-pointer">
                                                    <div className="dots" />
                                                    {this.translate('page.header.navbar.dropdown.language.usd')}
                                                </div>
                                                <div className="dropdown-item grey-text-accent text-sm cursor-pointer">
                                                    <div className="dots" />
                                                    {this.translate('page.header.navbar.dropdown.language.idr')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </li>

                            {isLoggedIn ? (
                                <li className="nav-item dropdown avatar px-3">
                                    <a
                                        className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm"
                                        href="#"
                                        id="navbarDropdownMenuProfile"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        // onClick={() =>
                                        //     this.setState({
                                        //         showProfileDropdown: !showProfileDropdown,
                                        //         showLanguage: false,
                                        //     })
                                        // }

                                        onClick={() => {
                                            if (localStorage.getItem('showProfileDropdown') == 'false') {
                                                localStorage.setItem('showProfileDropdown', 'true');
                                                localStorage.setItem('showLanguage', 'false');
                                            } else {
                                                localStorage.setItem('showProfileDropdown', 'false');
                                            }
                                        }}>
                                        <img src="/img/avatar.png" className="avatar-image" alt="" />
                                    </a>
                                    {localStorage.getItem('showProfileDropdown') == 'true' ? (
                                        <div
                                            className="dropdown-menu dark-bg-accent p-3 radius-sm"
                                            aria-labelledby="navbarDropdownMenuProfile">
                                            {ProfileDropdown.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-wallets-item"
                                                    onClick={() => this.setState({ showProfileDropdown: false })}>
                                                    <Link to={item.url} className="d-flex">
                                                        {item.icon}
                                                        <div className="pl-3">
                                                            <p className="mb-0 text-sm font-bold white-text">
                                                                {item.name}
                                                            </p>
                                                            <span className="text-xs grey-text-accent font-normal">
                                                                {item.desc}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                            <div
                                                className="dropdown-wallets-item cursor-pointer"
                                                onClick={() => this.setState({ showProfileDropdown: false })}>
                                                <div className="d-flex" onClick={logoutButton}>
                                                    <Logout />
                                                    <div className="pl-3">
                                                        <p className="mb-0 text-sm font-bold white-text">
                                                            {this.translate('page.header.navbar.logout')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </li>
                            ) : (
                                <React.Fragment>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signin'} className="gradient-text text-sm font-bold mr-3">
                                            {this.translate('page.header.navbar.signIn')}
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signup'} className="btn btn-primary">
                                            {this.translate('page.header.navbar.signUp')}
                                        </Link>
                                    </li>
                                </React.Fragment>
                            )}

                            {/* <span
                                className="cursor-pointer"
                                onClick={(e) =>
                                    this.handleChangeCurrentStyleMode(
                                        this.props.colorTheme === 'light' ? 'dark' : 'light'
                                    )
                                }>
                                {this.props.colorTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            </span> */}
                        </ul>

                        {this.state.showHeader && !isLoggedIn && (
                            <div
                                className="d-flex align-items-center px-24 w-100 justify-content-between"
                                onClick={() => this.setState({ showHeader: false })}>
                                <Link to={'/signin'} className="btn btn-primary mx-2 btn-sm btn-block">
                                    {this.translate('page.header.navbar.signIn')}
                                </Link>
                                <Link to={'/signup'} className="btn btn-primary mx-2 my-0 btn-outline btn-sm btn-block">
                                    {this.translate('page.header.navbar.signUp')}
                                </Link>
                            </div>
                        )}

                        {isLoggedIn && this.state.showHeader && (
                            <div className="logout" onClick={() => this.setState({ showHeader: false })}>
                                <p className="nav-link px-3 text-sm white-text font-bold" onClick={logoutButton}>
                                    <Logout /> {this.translate('page.header.navbar.logout')}
                                </p>
                            </div>
                        )}
                    </div>
                </nav>
            </React.Fragment>
        );
    }

    private handleChangeCurrentStyleMode = (value: string) => {
        this.props.changeColorTheme(value);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currencies: selectCurrencies(state),
    tickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    logout: () => dispatch(logoutFetch()),
    changeColorTheme: (payload) => dispatch(changeColorTheme(payload)),
});

export const Header = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Head) as React.ComponentClass;
