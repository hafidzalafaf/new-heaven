import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { compose } from 'redux';
import { ModalComingSoon } from '../../../components';
import {
    Market,
    RootState,
    Currency,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectCurrencies,
    setMobileWalletUi,
    toggleMarketSelector,
} from '../../../modules';
import {
    AddUserIcon,
    AnalysIcon,
    AnnouncementIcon,
    ApiIcon,
    CalendarIcon,
    FaqIcon,
    SecurityIcon,
    SettingIcon,
    UserIcon,
    WalletIcon,
    DropdownIcon,
} from '../../../assets/images/sidebar';
import { TradeHistory } from '../../../assets/images/sidebar/TradeHistory';
import './Sidebar.pcss';
import '../../../styles/colors.pcss';

interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    currencies: Currency | any;
}

interface DispatchProps {
    setMobileWalletUi?: typeof setMobileWalletUi;
}

interface LocationProps extends RouterProps {
    location?: {
        pathname: string;
    };
    history: History;
}

export interface SidebarState {
    dataProfile: any;
    showModalComingSoon: boolean;
    expandWallet: boolean;
}

const sidebarProfile = [
    '/profile',
    '/profile/referral',
    '/profile/api-key',
    '/orders',
    '/security/2fa',
    '/wallets',
    '/history-transaction',
    '/trade-history',
    'change-email',
];

type Props = DispatchProps & LocationProps;

class Side extends React.Component<Props, SidebarState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dataProfile: [],
            showModalComingSoon: false,
            expandWallet: false,
        };
    }

    componentDidMount() {
        this.setState({
            dataProfile: [
                {
                    name: 'Dashboard',
                    path: '/profile',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Wallet',
                    path: '/wallets',
                    comingsoon: false,
                    submenu: [
                        {
                            name: 'Spot Wallet',
                            path: '/wallets',
                            comingsoon: false,
                        },
                        { name: 'P2P Wallet', path: '/p2p/wallets', comingsoon: false },
                    ],
                },
                {
                    name: 'Market Order',
                    path: '/orders',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Trade History',
                    path: '/trade-history',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Transaction History',
                    path: '/history-transaction',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Security',
                    path: '/profile/security',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Referral',
                    path: '/profile/referral',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'API Management',
                    path: '/profile/api-key',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'Announcement',
                    path: '/announcement',
                    comingsoon: false,
                    submenu: [],
                },
                {
                    name: 'FAQ',
                    path: '/faq',
                    comingsoon: false,
                    submenu: [],
                },
            ],
        });
    }

    public render() {
        const thisSidebarProfile = sidebarProfile.some(
            (r) =>
                location.pathname.includes(r) &&
                !location.pathname.includes('deposit') &&
                !location.pathname.includes('withdraw') &&
                !location.pathname.includes('/p2p/profile')
        );

        return (
            <React.Fragment>
                {thisSidebarProfile && (
                    <div className="sidebar dark-bg-accent border-r-1">
                        <div className="sticky-sidebar">
                            <ul className="border-b-0">
                                {this.state.dataProfile.map((el, i) => (
                                    <React.Fragment>
                                        <li
                                            key={i}
                                            onClick={() => {
                                                if (el.comingsoon) {
                                                    this.setState({
                                                        showModalComingSoon: !this.state.showModalComingSoon,
                                                    });
                                                } else if (el.submenu.length) {
                                                    this.setState({ expandWallet: !this.state.expandWallet });
                                                    this.props.history.push(el.path);
                                                } else {
                                                    this.props.history.push(el.path);
                                                }
                                            }}
                                            className="d-flex align-items-center cursor-pointer ">
                                            <div className="mr-8">
                                                {el.name === 'Dashboard' ? (
                                                    <UserIcon
                                                        strokeColor={
                                                            location.pathname == '/profile' ||
                                                            location.pathname == '/profile/kyc'
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Wallet' ? (
                                                    <WalletIcon
                                                        fillColor={
                                                            location.pathname.includes('wallets')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Market Order' ? (
                                                    <AnalysIcon
                                                        fillColor={
                                                            location.pathname.includes('orders')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Trade History' ? (
                                                    <TradeHistory
                                                        fillColor={
                                                            location.pathname.includes('trade-history')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Transaction History' ? (
                                                    <CalendarIcon
                                                        fillColor={
                                                            location.pathname.includes('history-transaction')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Profile Setting' ? (
                                                    <SettingIcon
                                                        fillColor={
                                                            location.pathname.includes('setting')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Security' ? (
                                                    <SecurityIcon
                                                        fillColor={
                                                            location.pathname.includes('security')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Referral' ? (
                                                    <AddUserIcon
                                                        fillColor={
                                                            location.pathname.includes('referral')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'API Management' ? (
                                                    <ApiIcon
                                                        fillColor={
                                                            location.pathname.includes('api')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'Announcement' ? (
                                                    <AnnouncementIcon
                                                        fillColor={
                                                            location.pathname.includes('announcement')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : el.name === 'FAQ' ? (
                                                    <FaqIcon
                                                        fillColor={
                                                            location.pathname.includes('faq')
                                                                ? 'var(--sicebar-active-color)'
                                                                : 'var(--text-secondary-color)'
                                                        }
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <p
                                                className={`font-semibold text-sm mb-0 ${
                                                    (location.pathname == '/profile' ||
                                                        location.pathname == '/profile/kyc') &&
                                                    location.pathname.includes(el.path)
                                                        ? 'gradient-text'
                                                        : el.path != '/profile' && location.pathname.includes(el.path)
                                                        ? 'gradient-text'
                                                        : el.name === 'Wallet' && location.pathname.includes(el.path)
                                                        ? 'gradient-text'
                                                        : 'grey-text'
                                                }`}>
                                                {el.name}
                                            </p>

                                            {el.name === 'Wallet' && (
                                                <div
                                                    className={`ml-auto mr-0 ${
                                                        this.state.expandWallet ? 'rotate-180' : 'rotate-0'
                                                    }`}>
                                                    <DropdownIcon fillColor={'var(--text-secondary-color)'} />
                                                </div>
                                            )}
                                        </li>

                                        {this.state.expandWallet &&
                                            el.name === 'Wallet' &&
                                            el.submenu.map((item, i) => (
                                                <ul className="border-b-0">
                                                    <li
                                                        key={i}
                                                        onClick={() => {
                                                            this.props.history.push(item.path);
                                                        }}
                                                        className="d-flex align-items-center cursor-pointer border-b-0">
                                                        <p
                                                            className={`font-bold text-sm mb-0 ${
                                                                location.pathname.includes('/wallets') &&
                                                                item.path == '/wallets' &&
                                                                !location.pathname.includes('p2p/')
                                                                    ? 'gradient-text'
                                                                    : location.pathname.includes('/p2p/wallets') &&
                                                                      item.path == '/p2p/wallets'
                                                                    ? 'gradient-text'
                                                                    : 'grey-text'
                                                            }`}>
                                                            {item.name}
                                                        </p>
                                                    </li>
                                                </ul>
                                            ))}
                                    </React.Fragment>
                                ))}
                            </ul>
                            {/* <ul>
                                {this.state.dataProfile.slice(5).map((el, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            if (el.comingsoon) {
                                                this.setState({ showModalComingSoon: !this.state.showModalComingSoon });
                                            } else {
                                                this.props.history.push(el.path);
                                            }
                                        }}
                                        className="d-flex align-items-center cursor-pointer">
                                        <div className="mr-8">
                                            {el.name === 'Profile Setting' ? (
                                                <SettingIcon
                                                    fillColor={
                                                        location.pathname.includes('setting')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : el.name === 'Security' ? (
                                                <SecurityIcon
                                                    fillColor={
                                                        location.pathname.includes('security')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : el.name === 'Referral' ? (
                                                <AddUserIcon
                                                    fillColor={
                                                        location.pathname.includes('referral')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : el.name === 'API Management' ? (
                                                <ApiIcon
                                                    fillColor={
                                                        location.pathname.includes('api')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : el.name === 'Announcement' ? (
                                                <AnnouncementIcon
                                                    fillColor={
                                                        location.pathname.includes('announcement')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : el.name === 'FAQ' ? (
                                                <FaqIcon
                                                    fillColor={
                                                        location.pathname.includes('faq')
                                                            ? 'var(--sicebar-active-color)'
                                                            : 'var(--text-secondary-color)'
                                                    }
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <p
                                            className={`font-bold text-sm mb-0 ${
                                                location.pathname.includes(el.path) ? 'gradient-text' : 'grey-text'
                                            }`}>
                                            {el.name}
                                        </p>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                    </div>
                )}

                {!thisSidebarProfile && <React.Fragment />}

                {this.state.showModalComingSoon && (
                    <ModalComingSoon
                        onClose={() => this.setState({ showModalComingSoon: false })}
                        show={this.state.showModalComingSoon}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
});

export const Sidebar = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Side) as React.ComponentClass;
