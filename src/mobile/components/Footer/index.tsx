import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MarketIcon, OrderIcon, TradingIcon, WalletIcon } from '../../assets/SnakeBar';

const FooterComponent: React.FC = () => {
    const { pathname } = useLocation();
    const intl = useIntl();
    const [menuActive, setMenuActive] = React.useState('');

    const menu = [
        {
            icon: (
                <HomeIcon
                    className={'mb-1'}
                    fillColor={menuActive == 'Home' || location.pathname == '/' ? '#fff' : '#6F6F6F'}
                />
            ),
            url: '/',
            name: 'home',
            path: '/',
        },
        {
            icon: (
                <MarketIcon
                    className={'mb-1'}
                    fillColor={menuActive == 'Market' || location.pathname.includes('market') ? '#fff' : '#6F6F6F'}
                />
            ),
            url: '/markets',
            name: 'market',
            path: '/markets',
        },
        {
            icon: (
                <TradingIcon
                    className={'mb-1'}
                    fillColor={menuActive == 'Trading' || location.pathname.includes('trading') ? '#fff' : '#6F6F6F'}
                />
            ),
            url: '/trading',
            name: 'trading',
            path: '/trading/ethusdt',
        },
        {
            icon: (
                <OrderIcon
                    className={'mb-1'}
                    fillColor={menuActive == 'Order' || location.pathname.includes('order') ? '#fff' : '#6F6F6F'}
                />
            ),
            url: '/order',
            name: 'order',
            path: '/order',
        },
        {
            icon: (
                <WalletIcon
                    className={'mb-1'}
                    fillColor={menuActive == 'Wallet' || location.pathname.includes('wallet') ? '#fff' : '#6F6F6F'}
                />
            ),
            url: '/wallets',
            name: 'wallet',
            path: '/wallets',
        },
    ];

    return (
        <React.Fragment>
            <nav className="fixed-bottom px-24 d-flex justify-content-between align-items-center dark-bg-accent">
                {menu &&
                    menu.map((item, key) => (
                        <Link
                            to={item.path}
                            key={key}
                            onClick={() => setMenuActive(item.name)}
                            className="d-flex flex-column py-2 justify-content-center align-items-center active">
                            {item.icon}
                            <p
                                className={`p-0 m-0 text-xs font-semibold text-capitalize ${
                                    location.pathname == '/' && location.pathname.includes(item.url)
                                        ? 'white-text'
                                        : item.url != '/' && location.pathname.includes(item.url)
                                        ? 'white-text'
                                        : 'grey-text'
                                }`}>
                                {item.name}
                            </p>
                        </Link>
                    ))}
            </nav>
        </React.Fragment>
    );
};

export const Footer = React.memo(FooterComponent);
