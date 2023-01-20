import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { selectMarkets, selectMarketTickers, selectCurrencies, selectBlogs } from '../../../modules';
import { useMarketsFetch, useDocumentTitle, useBlogsFetch } from '../../../hooks';
import { Decimal } from '../../../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { SplashScreenMobile } from '../SplashScreen';
import { BgCardSmall } from '../../assets/BackgroundCard';
import { Table } from '../../../components';
import { ArrowRight } from '../../assets/Arrow';
import { ChartLandingMobile } from 'src/mobile/components';
import { ChartEmpty } from 'src/mobile/assets/ChartEmpty';
import moment from 'moment';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const HomeMobileScreen: React.FC = () => {
    useDocumentTitle('Home');
    useBlogsFetch('News');
    useMarketsFetch();

    const [loading, setLoading] = React.useState(true);
    const { formatMessage } = useIntl();
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);

    const [news, setNews] = React.useState([]);
    const [blog, setBlog] = React.useState([]);

    const blogs = useSelector(selectBlogs);

    const [type, setType] = React.useState('all');

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    React.useEffect(() => {
        if (blogs) {
            setBlog(blogs);
            setNews(blogs);
        }
    }, [blogs]);

    const marketList = markets
        .map((market) => ({
            ...market,
            last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
            open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
            price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
            high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.amount_precision),
            currency: currencies.find((cur) => cur.id == market.base_unit),
            volume: Decimal.format(Number((marketTickers[market.id] || defaultTicker).volume), market.price_precision),
        }))
        .map((market) => ({
            ...market,
            change: Decimal.format(
                (+market.last - +market.open).toFixed(market.price_precision),
                market.price_precision
            ),
        }));

    /**
     * Filter tranding coin market list by volume
     */
    const dataTranding = [...marketList].sort((a, b) => Number(b.volume) - Number(a.volume));

    /**
     * Filter for coin or token that has experienced a significant increase in value.
     */
    const dataGainers = [...marketList]
        .filter((data) => data.price_change_percent.includes('+'))
        .sort((a, b) => Number(b.price_change_percent.slice(1, -1)) - Number(a.price_change_percent.slice(1, -1)));

    /**
     * Filter for coin or token that has decreased in value
     */
    const dataLosers = [...marketList]
        .filter((data) => data.price_change_percent.includes('-'))
        .sort((a, b) => Number(b.price_change_percent.slice(1, -1)) - Number(a.price_change_percent.slice(1, -1)));

    blog.sort(function (a, b) {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    const handleChangeType = (type) => {
        setType(type);
    };

    /**
     * React slick customize configuration
     * @see https://react-slick.neostack.com/docs/api
     */
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
    };

    const settings2 = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 375,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3,
                },
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const renderDataTable = (data) => {
        return data.map((item) => [
            <Link
                to={item && item.type == 'spot' ? `/trading/${item && item.id}` : `/trading-future/${item && item.id}`}
                className="d-flex align-items-center text-sm">
                <img src={item && item.currency && item.currency.icon_url} alt="coin" className="small-coin-icon" />
                <p className="mb-0 white-text text-sm ml-2">{item && item.currency && item.currency.name}</p>
                <p className="mb-0 grey-text text-xs ml-2">
                    {item && item.currency && item.currency.id && item.currency.id.toUpperCase()}
                </p>
            </Link>,
            <>
                <ChartLandingMobile
                    borderColor={
                        parseFloat(item && item.price_change_percent) <= 0 ? 'rgba(255,68,69, 1)' : 'rgba(2,195,189, 1)'
                    }
                    backgroundGradient={
                        parseFloat(item && item.price_change_percent) <= 0 ? 'rgba(255,68,69, 1)' : 'rgba(2,195,189, 1)'
                    }
                    label={item.kline.map((e) => e[0])}
                    data={item.kline.map((e) => e[2])}
                    width={100}
                    height={70}
                />
            </>,
            <p
                className={`badge white-text font-bold ${
                    item.price_change_percent.includes('-') ? 'badge-danger' : 'badge-plus'
                }`}>
                {item && item.price_change_percent}
            </p>,
        ]);
    };

    return (
        <>
            {loading ? (
                <SplashScreenMobile />
            ) : (
                <div className="mobile-container home-screen dark-bg-main">
                    <div>
                        <div id="heros" className="content-container w-100 mb-3">
                            <Slider {...settings}>
                                {news &&
                                    news.map((item, key) => (
                                        <div className="heroid" key={key}>
                                            <a
                                                href={item.url}
                                                target="__blank"
                                                rel="noopener noreferrer"
                                                className="slider-ite">
                                                <img
                                                    src={
                                                        item?.feature_image === null
                                                            ? '/img/announcement-big.png'
                                                            : item.feature_image
                                                    }
                                                    alt={item.title}
                                                    className="banner-image rounded-lg"
                                                />
                                            </a>
                                        </div>
                                    ))}
                            </Slider>
                        </div>
                        <div className="beginner-wrapper mb-3">
                            <h5 className="text-ms font-bold grey-text-accent">For Beginners</h5>
                            <h6 className="mb-3 text-xs grey-text font-normal">
                                Most popular and widely known coin for early investment
                            </h6>
                            <Slider {...settings2}>
                                {blog &&
                                    blog.map((item, key) => (
                                        <a
                                            href={item.url}
                                            target="__blank"
                                            rel="noopener noreferrer"
                                            className="slider-ite"
                                            key={key}>
                                            <div className="card-item position-relative">
                                                <div className="small-thumbnail-cover mb-8">
                                                    <img
                                                        src={
                                                            item?.feature_image === null
                                                                ? '/img/announcement-big.png'
                                                                : item.feature_image
                                                        }
                                                        alt="card"
                                                        className="small-thumbnail"
                                                    />
                                                </div>
                                                <div className="cover-thumbnail d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <p className="text-xxs grey-text mb-0">
                                                            {moment(item.published_at).startOf('day').fromNow()}
                                                        </p>
                                                        <h5 className="text-xxs white-text font-bold mb-0">
                                                            {item.title}
                                                        </h5>
                                                    </div>
                                                    <ArrowRight className={''} />
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                            </Slider>
                        </div>
                        <Tabs
                            defaultActiveKey="all"
                            id="controlled-tab-example"
                            onSelect={(e) => handleChangeType(e)}
                            className="mb-3">
                            <Tab eventKey="all" title="All" className="mb-3">
                                {!marketList[0] || marketList === null ? (
                                    <div className="empty-chart-data">
                                        <ChartEmpty className="icon-empty text-secondary mb-2" />
                                        <h6 className="text-secondary">No data show</h6>
                                    </div>
                                ) : (
                                    <Table data={renderDataTable(marketList)} />
                                )}
                            </Tab>
                            <Tab eventKey="tranding" title="Tranding" className="mb-3">
                                {!dataTranding[0] || dataTranding === null ? (
                                    <div className="empty-chart-data">
                                        <ChartEmpty className="icon-empty text-secondary mb-2" />
                                        <h6 className="text-secondary">There is no market data</h6>
                                    </div>
                                ) : (
                                    <Table data={renderDataTable(dataTranding)} />
                                )}
                            </Tab>
                            <Tab eventKey="gainers" title="Gainers" className="mb-3">
                                {!dataGainers[0] || dataGainers === null ? (
                                    <div className="empty-chart-data">
                                        <ChartEmpty className="icon-empty text-secondary mb-2" />
                                        <h6 className="text-secondary">There is no market data</h6>
                                    </div>
                                ) : (
                                    <Table data={renderDataTable(dataGainers)} />
                                )}
                            </Tab>

                            <Tab eventKey="loser" title="Loser" className="mb-3">
                                <div className="table-mobile-wrapper">
                                    {!dataLosers[0] || dataLosers === null ? (
                                        <div className="empty-chart-data">
                                            <ChartEmpty className="icon-empty text-secondary mb-2" />
                                            <h6 className="text-secondary">There is no market data</h6>
                                        </div>
                                    ) : (
                                        <Table data={renderDataTable(dataLosers)} />
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            )}
        </>
    );
};

export { HomeMobileScreen };
