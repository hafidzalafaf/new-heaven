import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { useRangerConnectFetch, useSetMobileDevice } from './hooks';
import * as mobileTranslations from './mobile/translations';
import { configsFetch, selectCurrentLanguage, selectMobileDeviceState } from './modules';
import { languageMap } from './translations';

const gaKey = gaTrackerKey();
const browserHistory = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    browserHistory.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

/* Mobile components */
const AlertsMobileContainer = React.lazy(() =>
    import('./containers/AlertsMobile').then(({ AlertsMobile }) => ({ default: AlertsMobile }))
);
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));
const MobileFooter = React.lazy(() => import('./mobile/components/Footer').then(({ Footer }) => ({ default: Footer })));

/* Desktop components */
const HeaderContainer = React.lazy(() =>
    import('./desktop/containers/Header').then(({ Header }) => ({ default: Header }))
);
const FooterContainer = React.lazy(() =>
    import('./desktop/containers/Footer').then(({ Footer }) => ({ default: Footer }))
);
const SidebarContainer = React.lazy(() =>
    import('./desktop/containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar }))
);

const getTranslations = (lang: string, isMobileDevice: boolean) => {
    if (isMobileDevice) {
        return {
            ...languageMap[lang],
            ...mobileTranslations[lang],
        };
    }
    return languageMap[lang];
};

const RenderDeviceContainers = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    if (!isMobileDevice) {
        return (
            <React.Fragment>
                <HeaderContainer />
                <AlertsContainer />
                <div className="pg-container">
                    <SidebarContainer />
                    <LayoutContainer />
                </div>
                <FooterContainer />
            </React.Fragment>
        );
    }

    return (
        <div className="pg-mobile-app">
            <MobileHeader />
            <AlertsMobileContainer />
            <LayoutContainer />
            <MobileFooter />
        </div>
    );
};

export const App = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(configsFetch());
    }, []);

    useSetMobileDevice();
    const lang = useSelector(selectCurrentLanguage);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    useRangerConnectFetch();

    return (
        <IntlProvider locale={lang} messages={getTranslations(lang, isMobileDevice)} key={lang}>
            <Router history={browserHistory}>
                <ErrorWrapper>
                    <React.Suspense fallback={null}>
                        <RenderDeviceContainers />
                    </React.Suspense>
                </ErrorWrapper>
            </Router>
        </IntlProvider>
    );
};
