import { History } from 'history';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouteProps, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import {
    changeLanguage,
    changeUserDataFetch,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    selectCurrentMarket,
    Market,
} from '../../../modules';
import { Logo } from '../../../assets/images/Logo';
import { Facebook, Linkedin, Youtube } from '../../../assets/images/SocialMedia';
import './Footer.pcss'

interface State {
    isOpenLanguage: boolean;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
}

interface ReduxProps {
    lang: string;
    colorTheme: string;
    isLoggedIn: boolean;
    user: User;
    currentMarket: Market;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
    location: {
        pathnname: string;
    };
    changeUserDataFetch: typeof changeUserDataFetch;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps & IntlProps;

class FooterContainer extends React.Component<Props, State> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const { isLoggedIn, lang, currentMarket } = this.props;
        const date = new Date();
        let year = date.getFullYear();

        return (
            <React.Fragment>
                <footer className=" pt-5">
                    <div className="container pb-5">
                        <div className="d-flex justify-content-between flex-wrap">
                            <Link to={`/`} className="name px-3">
                                <Logo className="mb-3" />
                            </Link>
                            <div className="link px-3">
                                <p className="text-lg gradient-text mb-36">
                                    {this.translate('page.body.landing.footer.links').toUpperCase()}
                                </p>

                                <Link
                                    to={`/markets/trading/${currentMarket?.id}`}
                                    className="mb-8 d-block text-ms grey-text-accent">
                                    Trade
                                </Link>
                                <Link to="/markets" className="mb-8 d-block text-ms grey-text-accent">
                                    Markets
                                </Link>
                                <Link to="/markets" className="mb-8 d-block text-ms grey-text-accent">
                                    Futures
                                </Link>
                                <Link to="/announcement" className="mb-8 d-block text-ms grey-text-accent">
                                    Announcement
                                </Link>
                                {/* <a href="#" className="mb-8 d-block text-ms grey-text-accent">
                                    {this.translate('page.body.landing.footer.links.how')}
                                </a>
                                <a href="#" className="mb-8 d-block text-ms grey-text-accent">
                                    {this.translate('page.body.landing.footer.links.cryptos')}
                                </a>
                                <a href="#" className="mb-8 d-block text-ms grey-text-accent">
                                    {this.translate('page.body.landing.footer.links.features')}
                                </a>
                                <a href="#" className="mb-8 d-block text-ms grey-text-accent">
                                    {this.translate('page.body.landing.footer.links.testimonial')}
                                </a>
                                <a href="#" className="mb-8 d-block text-ms grey-text-accent">
                                    {this.translate('page.body.landing.footer.links.blogs')}
                                </a> */}
                            </div>
                            <div className="legal px-3">
                                <p className="text-lg gradient-text mb-36">
                                    SUPPORT
                                    {/* {this.translate('page.body.landing.footer.legal').toUpperCase()} */}
                                </p>

                                <a
                                    href="https://t.me/heavenexchange"
                                    target="__blank"
                                    rel="noopener noreferrer"
                                    className="mb-8 d-block text-ms grey-text-accent">
                                    Help Center
                                </a>
                                <Link to="/faq" className="mb-8 d-block text-ms grey-text-accent">
                                    FAQ
                                </Link>
                                <Link to="/privacy" className="mb-8 d-block text-ms grey-text-accent">
                                    Privacy Policy
                                </Link>
                                {/* <a href="#" className="mb-8 text-ms d-block grey-text-accent">
                                    {this.translate('page.body.landing.footer.legal.tos')}
                                </a>
                                <a href="#" className="mb-8 text-ms d-block grey-text-accent">
                                    {this.translate('page.body.landing.footer.legal.toc')}
                                </a>
                                <a href="#" className="mb-8 text-ms d-block grey-text-accent">
                                    {this.translate('page.body.landing.footer.legal.privacy')}
                                </a>
                                <a href="#" className="mb-8 text-ms d-block grey-text-accent">
                                    {this.translate('page.body.landing.footer.legal.cookie')}
                                </a> */}
                            </div>
                            <div className="newsletter px-3">
                                <p className="text-lg gradient-text mb-36">
                                    {this.translate('page.body.landing.footer.newsletter').toUpperCase()}
                                </p>
                                <p className="mb-12 text-ms d-block grey-text">Over 25000 people have subscribed</p>
                                <div className="input-group mb-0">
                                    <input
                                        type="text"
                                        className="form-control newsletter-input footer-input"
                                        placeholder="Enter Your Email"
                                    />
                                    <label htmlFor="newslatter" className=" newsletter-input-label">
                                        {this.translate('page.body.landing.footer.subscribe')}
                                    </label>
                                </div>
                                <span className=" text-sm grey-text-accent">
                                    {this.translate('page.body.landing.footer.email')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="container pb-5">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="mr-2">
                                <a
                                    href="https://t.me/heavenexchange"
                                    target="__blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-normal white-text">
                                    Privacy &amp; Terms Contact
                                </a>
                            </div>
                            <p className="text-sm font-normal white-text mb-0">Copyright @ {year} Heaven Exchange</p>
                            <div className="d-flex">
                                <a href="">
                                    <div className="mx-1">
                                        <Facebook />
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mx-1">
                                        <Linkedin />
                                    </div>
                                </a>
                                <a href="">
                                    <div className="mx-1">
                                        <Youtube />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </React.Fragment>
        );
    }

    private handleClick = () => {
        alert('ini untuk footer');
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    changeLanguage: (payload) => dispatch(changeLanguage(payload)),
    changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
});

export const Footer = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(FooterContainer) as React.ComponentClass;
