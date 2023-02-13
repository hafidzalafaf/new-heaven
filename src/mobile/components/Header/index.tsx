import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { selectUserLoggedIn, selectUserInfo, logoutFetch, alertPush } from '../../../modules';
import { LogoIcon } from '../../assets/Logo';
import { ScanIcon } from '../../assets/ScanIcon';
import { UserIcon } from '../../assets/UserIcon';
import { ArrowLeft, ArrowRight } from '../../assets/Arrow';
import { CopyableTextField } from '../../../components';
import {
    Announcement,
    ApiManagement,
    Dashboard,
    Faq,
    MarketOrder,
    Referral,
    Security,
    TradeHistory,
    Wallet,
    SettingProfile,
} from '../../assets/Sidebar';
import { CalendarIcon } from '../../assets/CalendarIcon';
const HeaderComponent: React.FC = () => {
    const [showSidebar, setShowSidebar] = React.useState(false);
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => {
        await dispatch(logoutFetch());
        history.push('/trading');
        setShowSidebar(false);
    };

    const sidebarMenu = [
        { icon: <Dashboard />, name: 'Dashboard', path: '/profile', showNotLoggedin: false },
        { icon: <Wallet />, name: 'Wallet', path: '/wallets', showNotLoggedin: false },
        { icon: <TradeHistory />, name: 'Trade History', path: '/trade-history', showNotLoggedin: false },
        {
            icon: <CalendarIcon />,
            name: 'Transaction History',
            path: '/history-transaction',
            showNotLoggedin: false,
        },
        { icon: <Security />, name: 'Security', path: '/security', showNotLoggedin: false },
        // { icon: <SettingProfile />, name: 'Setting', path: '/setting', showNotLoggedin: false },
        { icon: <Referral />, name: 'Referral', path: '/referral', showNotLoggedin: false },
        { icon: <ApiManagement />, name: 'Api Management', path: '/api-key', showNotLoggedin: false },
        { icon: <Announcement />, name: 'Announcement', path: '/announcements', showNotLoggedin: true },
        { icon: <Faq />, name: 'Faq', path: '/faq', showNotLoggedin: true },
    ];
    return (
        <div>
            <div className="px-24 dark-bg-main navbar-mobile-container">
                <nav className="navbar-mobile container py-3 dark-bg-main">
                    <Link to="/" className="navbar-brand">
                        <LogoIcon className={''} />
                    </Link>
                    <div className="d-flex align-items-center">
                        {/* <div className="mr-2">
                            <ScanIcon className={''} />
                        </div> */}
                        <div className="cursor-pointer" onClick={() => setShowSidebar(true)}>
                            <UserIcon className={'cursor-pointer'} />
                        </div>
                    </div>
                </nav>
                <div id="sidebar" className={`sidebar-offcanvas dark-bg-accent ${showSidebar ? 'show' : 'hide'}`}>
                    <div className="sidebar d-flex justify-content-between align-items-start w-100 pb-5">
                        <div className="sidebar-container w-100">
                            <div className="sidebar-head mb-24 px-24" onClick={() => setShowSidebar(false)}>
                                <ArrowLeft className={'cursorPointer'} />
                            </div>
                            {userLoggedIn ? (
                                <Link to={'/profile'} onClick={() => setShowSidebar(false)}>
                                    <div className="card-user-info d-flex align-items-center px-24 mb-24">
                                        <img src="/img-mobile/avatar.png" className="avatar-image" alt="ava" />
                                        <div className="user-info d-flex justify-content-between align-items-center ml-2 w-100">
                                            <div>
                                                <div className="user-name d-flex align-items-center">
                                                    <h1 className="gradient-text text-md font-bold mb-2">
                                                        Hi,{' '}
                                                        {user && user.username !== null
                                                            ? user.username
                                                            : 'The Awesome Member'}
                                                    </h1>
                                                    <p className="badge badge-warning white-text mb-0 ml-3">
                                                        Unverifed
                                                    </p>
                                                </div>
                                                <div className="user-id d-flex align-items-center">
                                                    <h3 className="text-sm grey-text d-flex align-items-center">
                                                        UID :{' '}
                                                        <span
                                                            onClick={() =>
                                                                dispatch(
                                                                    alertPush({
                                                                        message: [`UID copied`],
                                                                        type: 'success',
                                                                    })
                                                                )
                                                            }>
                                                            <CopyableTextField
                                                                value={user && user.uid}
                                                                className="ml-3"
                                                                fieldId="referral-code"
                                                            />
                                                        </span>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to={'/signin'} onClick={() => setShowSidebar(false)}>
                                    <div className="card-user-info d-flex align-items-center px-24 mb-24">
                                        <div className="user-info d-flex justify-content-between align-items-center w-100">
                                            <div className="login-user d-flex flex-column">
                                                <h1 className="gradient-text text-md font-bold">Login</h1>
                                                <h3 className="grey-text text-sm font-normal">
                                                    Welcome to Heaven Exchange
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {sidebarMenu &&
                                sidebarMenu.map((item, key) => (
                                    <div key={key}>
                                        {userLoggedIn ? (
                                            <React.Fragment>
                                                {key % 3 == 0 && <div className="divider" />}
                                                <Link to={item.path} key={key} onClick={() => setShowSidebar(false)}>
                                                    <div
                                                        className={`sidebar-item w-100 px-24 py-3 d-flex justify-content-between align-items-center cursor-pointer ${
                                                            location.pathname.includes(item.path) ? 'active' : ''
                                                        }`}>
                                                        <div className={`card-menu-name d-flex align-items-center `}>
                                                            {item.icon}
                                                            <h3
                                                                className={`text-sm font-bold mb-0 ml-2 ${
                                                                    location.pathname.includes(item.path)
                                                                        ? 'white-text'
                                                                        : 'grey-text'
                                                                }`}>
                                                                {item.name}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </React.Fragment>
                                        ) : item.showNotLoggedin ? (
                                            <Link to={item.path} key={key} onClick={() => setShowSidebar(false)}>
                                                <div className=" w-100 px-24 py-3 d-flex justify-content-between align-items-center cursor-ointer">
                                                    <div className="card-menu-name d-flex align-items-center">
                                                        {item.icon}
                                                        <h3 className="text-sm grey-text font-bold mb-0 ml-2">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                ))}

                            {userLoggedIn && (
                                <div className="px-24 mt-5 pb-3">
                                    <button
                                        onClick={handleLogout}
                                        type="button"
                                        className="btn btn-primary btn-mobile btn-block btn-outline">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Header = React.memo(HeaderComponent);
