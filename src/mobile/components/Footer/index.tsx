import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomeIcon, MarketIcon, OrderIcon, TradingIcon, WalletIcon } from '../../assets/SnakeBar';
import { selectCurrentMarket } from 'src/modules';
import { useMarketsFetch, useMarketsTickersFetch } from 'src/hooks';

const FooterComponent: React.FC = () => {
    useMarketsFetch();
    useMarketsTickersFetch();
    const { pathname } = useLocation();
    const intl = useIntl();
    const currentMarket = useSelector(selectCurrentMarket);
    const [menuActive, setMenuActive] = React.useState('');
    const [id, setId] = React.useState('');

    React.useEffect(() => {
        if (currentMarket) {
            setId(currentMarket?.id);
        }
    }, [currentMarket]);

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
            path: `/trading/${id}`,
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
            <div className="footer-mobile-container dark-bg-accent">
                <nav className="container d-flex justify-content-between align-items-center">
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
            </div>
        </React.Fragment>
    );
};

export const Footer = React.memo(FooterComponent);
