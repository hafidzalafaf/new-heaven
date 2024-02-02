import React, { FC, ReactElement } from 'react';

import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { selectBlogs } from 'src/modules';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import moment from 'moment';

export const AnnouncementScreen: FC = (): ReactElement => {
    const [news, setNews] = React.useState<any[]>([]);
    const [blog, setBlog] = React.useState<any[]>([]);

    useDocumentTitle('Announcement');
    useBlogsFetch({ tag: 'news' });

    const blogs = useSelector(selectBlogs);

    React.useEffect(() => {
        if (blogs) {
            setNews(blogs);
            setBlog(blogs);
        }
    }, [blogs]);

    blog.sort(function (a, b) {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    return (
        <React.Fragment>
            <div className="announcement-screen no-sidebar dark-bg-accent pb-5">
                <div className="container">
                    <div className="articles">
                        <div className="row justify-content-center">
                            <div className="col-xl-11">
                                <div className="row">
                                    {news &&
                                        news.map((item, key) => (
                                            <div key={key} className="col-md-4 col-sm-6 col-12 mb-4">
                                                <div className="article-item">
                                                    <img
                                                        src={
                                                            item.feature_image !== null
                                                                ? item.feature_image
                                                                : '/img/landing-card.png'
                                                        }
                                                        className="w-100 rounded-lg announcement-img"
                                                        alt={item.title}
                                                    />
                                                    <p className="blue-text mb-12">PexBank Exchange</p>
                                                    <h6 className="title mb-24">
                                                        <a
                                                            href={item.url}
                                                            target="__blank"
                                                            rel="noopener noreferrer"
                                                            className="grey-text-accent">
                                                            {item.title}
                                                        </a>
                                                    </h6>
                                                    <div className="d-flex">
                                                        <span className="grey-text">
                                                            {moment(item.published_at).startOf('day').fromNow()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
