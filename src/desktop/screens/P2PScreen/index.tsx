import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import { useBlogsFetch } from '../../../hooks';
import { HeaderP2P, BannerP2P, TableListP2P } from '../../containers';
import { selectUserLoggedIn, selectBlogs } from 'src/modules';
import { Modal } from 'src/desktop/components';
import { Form } from 'react-bootstrap';
import { p2pProfileFetch } from 'src/modules/user/p2pProfile';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const P2PScreen: React.FC = () => {
    useDocumentTitle('P2P');
    useBlogsFetch({ tag: 'news' });

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const blogs = useSelector(selectBlogs);
    const [showModalAnnouncement, setShowModalAnnouncement] = React.useState(false);
    const [blog, setBlog] = React.useState<any[]>([]);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
    }, [dispatch]);

    React.useEffect(() => {
        if (blogs) {
            setBlog(blogs);
        }
    }, [blogs]);

    React.useEffect(() => {
        setTimeout(() => {
            setShowModalAnnouncement(true);
        }, 3000);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    const renderModalAnnouncement = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-content-center w-100">
                    <img src="/img/p2pannounce.png" alt="warning" width={129} height={122} className="mb-24" />
                </div>
                <h1 className="text-xl white-text font-extrabold mb-24 text-center">Announcement</h1>
                <p className="text-sm white-text mb-24 text-justify">
                    To Avoid Becoming A Victim Of Scammers, Never Transfer Cryptocurrency Before Actually Receiving
                    Payment! Don't Trust Anyone Who Claims To Be Customer Support And Convinces You To Complete A
                    Transaction Before You Receive Your Payment- They Are Scammers. After The Seller Confirms The Order
                    And Transfers The Asset To The Buyer, The Transaction Is Considered Complete And Cannot Be
                    Contested. Heaven Is Not Responsible For Transactions Made Outside The Platform.
                </p>

                <div className="d-flex align-items-center gap-8 mb-24">
                    <Form.Check
                        type="checkbox"
                        custom
                        id="nonZeroSelected"
                        readOnly={true}
                        className="text-sm grey-text-accent m-0 d-flex justify-content-center align-items-center"
                    />
                    <p className="m-0 p-0 grey-text-accent text-sm">I have read and agree to the above content</p>
                </div>

                <button type="button" onClick={() => setShowModalAnnouncement(false)} className="btn-primary w-100">
                    Continue
                </button>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-screen-p2p">
                <div className="header-container">
                    <HeaderP2P />
                </div>

                <div>
                    <BannerP2P />
                </div>

                <div className="com-content-table-list-p2p-container">
                    <div className="d-flex justify-content-between align-items-center overflow-x-scroll mb-48">
                        <Slider {...settings}>
                            {blog?.map((item, key) => (
                                <div className="px-6 radius-md" key={key}>
                                    <a
                                        href={item.url}
                                        target="__blank"
                                        rel="noopener noreferrer"
                                        className="slider-item p-3">
                                        <img
                                            src={
                                                item.feature_image !== null
                                                    ? item.feature_image
                                                    : '/img/landing-card.png'
                                            }
                                            alt={item.title}
                                            className="w-100 rounded-lg announcement-slider-img"
                                        />
                                    </a>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <TableListP2P />
                </div>

                {isLoggedIn && <Modal show={showModalAnnouncement} content={renderModalAnnouncement()} />}
            </div>
        </React.Fragment>
    );
};
