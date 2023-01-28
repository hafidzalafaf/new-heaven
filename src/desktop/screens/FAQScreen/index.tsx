import React, { FC, ReactElement } from 'react';
import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { Logo } from '../../../assets/images/Logo';
import { useSelector } from 'react-redux';
import { selectBlogs } from 'src/modules';
import moment from 'moment';

export const FAQScreen: FC = (): ReactElement => {
    useDocumentTitle('FAQ');
    useBlogsFetch('faq');
    const [faq, setFaq] = React.useState<any[]>([]);
    const [support, setSupport] = React.useState<any>([]);

    const blogs = useSelector(selectBlogs);

    React.useEffect(() => {
        if (blogs) {
            let tempFaq = [...blogs].filter((item) => item.slug !== 'support');
            let tempSupport = [...blogs].filter((item) => item.slug == 'support');
            setFaq(tempFaq);
            setSupport(tempSupport);
        }
    }, [blogs]);

    return (
        <React.Fragment>
            <div className="content-wrapper no-sidebar faq-screen dark-bg-accent pb-5">
                <div
                    className="overflow-auto py-lg-5 background"
                    style={{ backgroundImage: `url('img/background-landing.png')` }}>
                    <div className="d-flex flex-column justify-content-center align-items-center py-5">
                        <h3 className="title-1 white-text font-bold mb-24">Heaven Exchange FAQ</h3>

                        <div className="d-flex justify-content-center align-content-center gap-8">
                            {support.map((item, i) => (
                                <a
                                    key={i}
                                    href={item?.excerpt}
                                    target="__blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary cursor-pointer">
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
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
