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
    selectCurrentLanguage,
    changeLanguage,
    Ticker,
    selectUserInfo,
    User,
    changeUserDataFetch,
} from '../../../modules';
import { Logo } from '../../../assets/images/Logo';
import { MoonIcon, SunIcon } from 'src/assets/images/SwitchTheme';
import { Api, Dashboard, Logout, Referral, Security, Wallet } from '../../../assets/images/ProfileDropdown';
import { Dropdown } from 'react-bootstrap';

interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    isLoggedIn: boolean;
    currencies: Currency[];
    tickers: Ticker | undefined | any;
    currentLanguage: string;
    user: User;
}

interface OwnProps {
    history: History;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    logout: typeof logoutFetch;
    changeColorTheme: typeof changeColorTheme;
    changeLanguange: typeof changeLanguage;
    changeUserDataFetch: typeof changeUserDataFetch;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

export interface HeaderState {
    showHeader: boolean;
    languageActive: string;
}

const authHeader = ['/signin', '/signup', '/email-verification', '/forgot_password', '/password_reset', '/trading'];
const tradingHeader = ['/trading'];

type Props = ReduxProps & DispatchProps & IntlProps & LocationProps & OwnProps;

class Head extends React.Component<Props, HeaderState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showHeader: false,
            languageActive: 'en',
        };
    }

    // public componentDidMount() {
    //     if (this.props.user?.data && !this.state.lang) {
    //         let data = this.props.user.data && JSON.parse(this.props.user.data);
    //         this.setState({ lang: data?.language });
    //     }
    // }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const thisAuthHeader = authHeader.some((r) => location.pathname.includes(r)) && location.pathname !== '/';
        const thisTradingHeader = tradingHeader.some((r) => location.pathname.includes(r));

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
                flag: <img src="/img/en.png" alt="en" className="mr-2" />,
                name: 'English',
                code: 'en',
            },
            {
                flag: <img src="/img/ru.png" alt="ru" className="mr-2" />,
                name: 'Russian',
                code: 'ru',
            },
        ];

        const currencyItem: Currency | any =
            this.props.currencies &&
            this.props.currencies.find((item) => item.id === this.props.currentMarket?.base_unit);

        const ticker = this.props.tickers[this.props.currentMarket?.id];

        return (
            <React.Fragment>
                <nav
                    className={`navbar navbar-expand-lg py-2 px-24 ${
                        thisTradingHeader ? 'dark-bg-accent' : 'dark-bg-accent'
                    }`}>
                    <Link to="/" className="navbar-brand">
                        <Logo />
                    </Link>
                    <div className="d-flex align-items-center">
                        {this.state.showHeader && isLoggedIn && (
                            <li className="nav-item dropdown avatar profile-menu px-3">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant=""
                                        id="dropdown-basic"
                                        className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm">
                                        <img src="/img/avatar.png" className="avatar-image" alt="ava" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-profile">
                                        {ProfileDropdown.map((item, index) => (
                                            <Dropdown.Item key={index} className="dark-bg-accent p-3 dropdown-profile">
                                                <Link to={item.url} className="d-flex">
                                                    {item.icon}
                                                    <div className="pl-3">
                                                        <p className="mb-0 text-sm font-bold white-text">{item.name}</p>
                                                        <span className="text-xs grey-text-accent font-normal">
                                                            {item.desc}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </Dropdown.Item>
                                        ))}
                                        <Dropdown.Item className="dark-bg-accent p-3 dropdown-profile cursor-pointer">
                                            <div className="dark-bg-accent p-3 dropdown-profile cursor-pointer">
                                                <div className="d-flex" onClick={logoutButton}>
                                                    <Logout />
                                                    <div className="pl-3">
                                                        <p className="mb-0 text-sm font-bold white-text">
                                                            {this.translate('page.header.navbar.logout')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
                                    className="icon"
                                    alt="icon"
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
                        <div>
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
                                                    src={this.props.currentMarket?.logo_url}
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
                                                        this.props.currentMarket?.price_precision,
                                                        this.props.currentMarket?.quote_unit == 'idr' ? ',' : '.'
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
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant=""
                                        className="nav-link dropdown-toggle grey-text-accent text-sm"
                                        id="dropdown-language">
                                        {!this.props.isLoggedIn
                                            ? `${
                                                  localStorage.getItem('lang_code') !== null
                                                      ? localStorage.getItem('lang_code').toUpperCase()
                                                      : 'EN'
                                              }`
                                            : `${
                                                  localStorage.getItem('lang_code') !== null
                                                      ? localStorage.getItem('lang_code').toUpperCase()
                                                      : 'EN'
                                              }`}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item className="bg-transparent border-none">
                                            <div className="d-flex dropdown-menu dark-bg-accent p-3 radius-sm">
                                                <div className="language">
                                                    <p className="text-xs font-bold mb-3 grey-text-accent">
                                                        {this.translate('page.header.navbar.dropdown.language')}
                                                    </p>
                                                    {LanguageDropdown.map((item, key) => (
                                                        <div
                                                            key={`language-${key}`}
                                                            onClick={() => {
                                                                this.handleChangeLanguage(item.code);
                                                                this.setState({ languageActive: item.code });
                                                            }}
                                                            className={`dropdown-item grey-text-accent text-sm cursor-pointer ${
                                                                localStorage.getItem('lang_code') !== null
                                                                    ? localStorage.getItem('lang_code') == item.code
                                                                        ? 'active'
                                                                        : ''
                                                                    : this.state.languageActive == item.code && 'active'
                                                            }`}>
                                                            {item.flag} {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>

                            {isLoggedIn ? (
                                <li className="nav-item dropdown avatar px-3">
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant=""
                                            id="dropdown-basic"
                                            className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm">
                                            <img src="/img/avatar.png" className="avatar-image" alt="ava" />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="dropdown-profile">
                                            {ProfileDropdown.map((item, index) => (
                                                <Dropdown.Item key={index} className="dark-bg-accent p-3">
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
                                                </Dropdown.Item>
                                            ))}
                                            <Dropdown.Item className="dark-bg-accent p-3 cursor-pointer border-none">
                                                <div className="dark-bg-accent p-3 cursor-pointer">
                                                    <div className="d-flex" onClick={logoutButton}>
                                                        <Logout />
                                                        <div className="pl-3">
                                                            <p className="mb-0 text-sm font-bold white-text">
                                                                {this.translate('page.header.navbar.logout')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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

    private handleChangeLanguage = (language: string) => {
        if (this.props.isLoggedIn) {
            const data = this.props.user.data && JSON.parse(this.props.user.data);

            if (data?.languange !== language) {
                const payload = {
                    ...this.props.user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                this.props.changeUserDataFetch({ user: payload });
            }
        } else {
            localStorage.setItem('lang_code', language);
        }

        this.props.changeLanguange(language);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currencies: selectCurrencies(state),
    tickers: selectMarketTickers(state),
    currentLanguage: selectCurrentLanguage(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    logout: () => dispatch(logoutFetch()),
    changeColorTheme: (payload) => dispatch(changeColorTheme(payload)),
    changeLanguange: (payload) => dispatch(changeLanguage(payload)),
    changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
});

export const Header = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Head) as React.ComponentClass;
