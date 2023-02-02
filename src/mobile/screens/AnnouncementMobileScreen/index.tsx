import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { selectMarkets, selectMarketTickers, selectCurrencies, selectBlogs, RootState } from '../../../modules';
import {
    useMarketsFetch,
    useMarketsTickersFetch,
    useWalletsFetch,
    useDocumentTitle,
    useBlogsFetch,
} from '../../../hooks';
import { Decimal } from '../../../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { SplashScreenMobile } from '../SplashScreen';
import { BgCardSmall } from '../../assets/BackgroundCard';
import { Table } from '../../../components';
import { ArrowLeft, ArrowRight } from '../../assets/Arrow';
import moment from 'moment';
import { Pagination } from './Pagination';

const AnnouncementMobileScreen: React.FC = () => {
    const history = useHistory();

    const [news, setNews] = React.useState([]);
    const [blog, setBlog] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [postsPerPage] = React.useState(5);
    const indexOfLastRecord = currentPage * postsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - postsPerPage;

    const currentRecords = blog.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(blog.length / postsPerPage);

    useBlogsFetch({ tag: 'news' });
    const blogs = useSelector(selectBlogs);

    React.useEffect(() => {
        if (blogs) {
            setBlog(blogs);
            setNews(blogs);
        }
    }, [blogs]);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
    };
console.log(news, 'news')
    return (
        <>
            {news.length ? (
                <div className="mobile-container home-screen dark-bg-main">
                    <div className="head-container position-relative">
                        <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
                            <ArrowLeft className={'back'} />
                        </div>
                        <h1 className="text-center text-md grey-text-accent font-bold">Announcements</h1>
                    </div>
                    <div id="heros" className="content-container w-100 my-3">
                        <Slider {...settings}>
                            {news &&
                                news.map((item, key) => (
                                    <a href={item.url} className="heroid" key={key}>
                                        <div
                                            className="hero one w-100 d-flex align-items-center justify-content-start position-relative"
                                            style={{
                                                backgroundImage: `url(${item.background})`,
                                            }}>
                                            <a
                                                href={item.url}
                                                target="__blank"
                                                rel="noopener noreferrer"
                                                className="slider-ite">
                                                <img
                                                    src={item.feature_image}
                                                    alt={item.title}
                                                    className="w-100 h-100 rounded-lg"
                                                />
                                            </a>
                                        </div>
                                    </a>
                                ))}
                        </Slider>
                    </div>
                    <div className="beginner-wrapper mb-1">
                        <h5 className="text-ms font-bold grey-text-accent">For Beginners</h5>
                        <h6 className="mb-3 text-xs grey-text font-normal">
                            Most popular and widely known coin for early investment
                        </h6>
                        {currentRecords &&
                            currentRecords.map((item, key) => (
                                <a
                                    href={item.url}
                                    className="beginner-item d-flex align-items-center justify-content-between mb-3"
                                    key={key}>
                                    <div className="d-flex align-items-start justify-content-start">
                                        <img
                                            height={70}
                                            width={100}
                                            src={item.feature_image}
                                            alt={item.title}
                                            className="beginner-img rounded-lg"
                                        />
                                        <div className="beginner-text ml-2">
                                            <h6 className="text-xs font-bold grey-text-accent">{item.title}</h6>
                                            <h6 className="text-xxs grey-text font-normal">{item.meta_description}</h6>
                                            <h6 className="text-xxs grey-text font-normal">
                                                {moment(item.published_at).startOf('day').fromNow()}
                                            </h6>
                                        </div>
                                    </div>
                                </a>
                            ))}
                    </div>
                    <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            ) : (
                <SplashScreenMobile />
            )}
        </>
    );
};

export { AnnouncementMobileScreen };
