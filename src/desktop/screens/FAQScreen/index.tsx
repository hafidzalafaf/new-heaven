import React, { FC, ReactElement } from 'react';
import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { Logo } from '../../../assets/images/Logo';
import { useSelector } from 'react-redux';
import { selectBlogs } from 'src/modules';
import moment from 'moment';
import { FAQHeader } from 'src/desktop/containers';

export const FAQScreen: FC = (): ReactElement => {
    useDocumentTitle('FAQ');
    useBlogsFetch({ tag: 'faq' });
    const [faq, setFaq] = React.useState<any[]>([]);

    const blogs = useSelector(selectBlogs);

    React.useEffect(() => {
        if (blogs) {
            setFaq(blogs);
        }
    }, [blogs]);

    return (
        <React.Fragment>
            <div className="content-wrapper no-sidebar faq-screen dark-bg-accent pb-5">
                <FAQHeader />
                <div className="container">
                    <div className="articles">
                        <div className="row justify-content-center">
                            <div className="col-xl-11">
                                <div className="row">
                                    {faq &&
                                        faq.map((item, key) => (
                                            <div key={key} className="col-md-4 col-sm-6 col-12 mb-4">
                                                <div className="article-item p-4 radius-md dark-bg-main">
                                                    <Logo className="mb-24" />
                                                    <p className="grey-text-accent text-md mb-12">FAQ </p>
                                                    <h6 className="title mb-24">
                                                        <a
                                                            href={item.url}
                                                            target="__blank"
                                                            rel="noopener noreferrer"
                                                            className="white-text font-normal text-md">
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
