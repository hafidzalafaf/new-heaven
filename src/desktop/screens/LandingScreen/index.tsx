import { LandingBlock } from '@openware/react-components';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { IntlProps } from '../../../';
import { MarketsTable } from '../../containers';
import { toggleColorTheme } from '../../../helpers';
import { RootState, selectCurrentColorTheme, selectUserLoggedIn, selectBlogs, blogsFetch } from '../../../modules';
import { BnbIcon, BtcIcon, DogeIcon, TronIcon } from '../../../assets/images/CoinIcon';
import { AndroidIcon, AppleStoreIcon, GooglePlayIcon, MacOsIcon, WindowsIcon } from '../../../assets/images/DeviceIcon';

interface ReduxProps {
    isLoggedIn: boolean;
    colorTheme: string;
    blogs: any;
}

interface DispatchProps {
    blogsFetch: typeof blogsFetch;
}

type Props = ReduxProps & RouteProps & IntlProps & DispatchProps;

class Landing extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
        this.props.blogsFetch({ tag: 'news' });
    }

    public componentWillReceiveProps(next: Props) {
        if (next.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
    }

    public componentWillUnmount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme(this.props.colorTheme);
        }
    }

    public render() {
        return (
            <div className="landing-screen dark-bg-accent">
                <div
                    className="content-wrapper no-sidebar "
                    style={{ backgroundImage: `url('img/background-landing.png')` }}>
                    <section className="hero position-relative">
                        <img src="img/Bitcoin.png" className="image-coin btc" alt="" />
                        <img src="img/Etherium.png" className="image-coin eth" alt="" />
                        <img src="img/LiteCoin.png" className="image-coin lite" alt="" />
                        <img src="img/Monero.png" className="image-coin monero" alt="" />
                        <div className="wrapper d-flex justify-content-around align-items-center flex-column index-2">
                            <div className="my-5">
                                <h1 className="text-main-title white-text text-center mb-24 max-w-lg">
                                    Crypto Increases, Money Saved For Better Life with{' '}
                                    <span className="gradient-text">HEX Exchange</span>
                                </h1>
                                <p className="text-md grey-text-accent text-center mb-24">
                                    Enjoy your arbitrage on the HEX platform
                                </p>
                                <div className="d-flex justify-content-center">
                                    <Link to={'/market'} className="btn btn-rounded btn-primary mx-3">
                                        Trade Now
                                    </Link>
                                    <a href="" className="btn btn-rounded btn-outline white-text font-bold mx-3">
                                        Download App
                                    </a>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="d-flex new-coin justify-content-center">
                                    <div className="new-coin-content">
                                        <p className="mb-0 text-md white-text font-semibold mb-24 text-center">
                                            New Coins
                                        </p>
                                        <div className="d-flex">
                                            <p className="mb-0 font-semibold white-text mr-4">
                                                <BtcIcon className="mr-2 small-coin-icon" />
                                                BTC
                                            </p>
                                            <p className="mb-0 font-semibold white-text mr-4">
                                                <BnbIcon className="mr-2 small-coin-icon" />
                                                BNB
                                            </p>
                                            <p className="mb-0 font-semibold white-text mr-4">
                                                <DogeIcon className="mr-2 small-coin-icon" />
                                                DOGE
                                            </p>
                                            <p className="mb-0 font-semibold white-text mr-4">
                                                <TronIcon className="mr-2 small-coin-icon" />
                                                TRX
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <MarketsTable />

                    <section className="feature-section position-relative py-5">
                        <img src="img/LiteCoin.png" className="image-coin feature lite" alt="" />
                        <img src="img/Bitcoin.png" className="image-coin feature btc" alt="" />
                        <div className="container index-2">
                            <h2 className="text-title-1 white-text text-center font-extrabold ">Attractive Features</h2>
                            <p className=" mb-24 text-md font-normal grey-text-accent text-center mb-36">
                                Trade will be enjoyfull and cheerfull
                            </p>
                            <div className="row">
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Up to Date Notification</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        We provide the most updated information about latest markets
                                    </p>
                                </div>
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features2.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Safe & Secure Trading Platform</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        Buy & Sell Assets with no worries with Heaven Exchange
                                    </p>
                                </div>
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features3.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Easy to Use</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        With a simple interface, crypto investing is easy for everyone
                                    </p>
                                </div>
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features4.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Withdraw Anytime & Anywhere</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        In anytime & anywhere you can withdraw your assets just one click away
                                    </p>
                                </div>
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features5.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Transaparent Transactions</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        With HEX Exchange you can track your transaction easily
                                    </p>
                                </div>
                                <div className="col-lg-4 col-sm-6 mb-24">
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="img/features6.png" alt="icon" width={65} height={65} />
                                        <p className="mb-0 ml-2 text-ms white-text">Stand by Support Team</p>
                                    </div>
                                    <p className="mb-0 text-ms grey-text-accent">
                                        Connect Through chat support with our customer service for your better
                                        experience
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="aplication-section py-5">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <img src={'img/application.png'} className="w-100" alt="" />
                                </div>
                                <div className="col-lg-6">
                                    <h4 className="mb-0 text-title-2 text-white font-extrabold">
                                        Trade Anytime, Anywhere
                                    </h4>
                                    <p className="text-ms grey-text-accent font-normal mb-24">
                                        Compatible with multiple devices, start trading with safety and convenience.
                                    </p>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mr-3 mb-3 d-flex flex-column justify-content-center align-items-center">
                                                <AndroidIcon className="icon-aplication" />
                                                <p className="text-ms white-text mt-2 mb-0">Android APK</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mr-3 mb-3 d-flex flex-column justify-content-center align-items-center">
                                                <AppleStoreIcon className="icon-aplication" />
                                                <p className="text-ms white-text mt-2 mb-0">App Store</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mr-3 mb-3 d-flex flex-column justify-content-center align-items-center">
                                                <GooglePlayIcon className="icon-aplication" />
                                                <p className="text-ms white-text mt-2 mb-0">Google Play</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mr-3 mb-3 d-flex flex-column justify-content-center align-items-center">
                                                <WindowsIcon className="icon-aplication" />
                                                <p className="text-ms white-text mt-2 mb-0">Windows</p>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mr-3 mb-3 d-flex flex-column justify-content-center align-items-center">
                                                <MacOsIcon className="icon-aplication" />
                                                <p className="text-ms white-text mt-2 mb-0">Mac Os</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="analysis-section position-relative py-5">
                        <img src="img/Etherium.png" className="image-coin analysis eth" alt="" />
                        <img src="img/Bitcoin.png" className="image-coin analysis btc" alt="" />
                        <img src="img/Monero.png" className="image-coin analysis monero" alt="" />
                        <div className="container index-2">
                            <h2 className="text-title-1 white-text text-center font-extrabold ">
                                Crypto Market Analysis
                            </h2>
                            <p className=" mb-24 text-md font-normal grey-text-accent text-center mb-36">
                                Analysis news about crypto market
                            </p>
                            <div className="row mt-5">
                                {this.props.blogs &&
                                    this.props.blogs.slice(0, 4).map((blog, i) => (
                                        <div key={i} className="col-lg-6 mb-24">
                                            <div className="d-flex align-items-start">
                                                <img
                                                    src={
                                                        blog.feature_image !== null
                                                            ? blog.feature_image
                                                            : '/img/image-blog.png'
                                                    }
                                                    className="image-analysis radius-md"
                                                    alt="image"
                                                />
                                                <div className="ml-4">
                                                    <p className="mb-8 text-lg white-text font-bold">{blog.title}</p>
                                                    <p className="mb-36 text-sm grey-text-accent">
                                                        {blog.excerpt?.slice(0, 50)}
                                                    </p>
                                                    <a
                                                        href={blog.url}
                                                        target="__blank"
                                                        rel="noopener noreferrer"
                                                        className="gradient-text text-ms ">
                                                        Learn more
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <Link to={`/announcement`} className="btn btn-primary lg">
                                    Show More
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    isLoggedIn: selectUserLoggedIn(state),
    colorTheme: selectCurrentColorTheme(state),
    blogs: selectBlogs(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    blogsFetch: (payload) => dispatch(blogsFetch(payload)),
});

export const LandingScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Landing) as React.ComponentClass;
