import React, { FC, ReactElement } from 'react';
import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { selectBlogs, faqsFetch, selectFaqs } from 'src/modules';
import { CardPrivacy } from 'src/desktop/components';

export const PrivacyScreen: FC = (): ReactElement => {
    useDocumentTitle('Privacy Policy');
    useBlogsFetch({ tag: 'news' });

    const dispatch = useDispatch();
    const blogs = useSelector(selectBlogs);
    const faqs = useSelector(selectFaqs);

    const [faq, setFaq] = React.useState<any[]>([]);
    const [news, setNews] = React.useState<any[]>([]);

    React.useEffect(() => {
        dispatch(faqsFetch());
    }, []);

    React.useEffect(() => {
        if (blogs) {
            setNews(blogs);
        }

        if (faqs) {
            setFaq(faqs);
        }
    }, [blogs, faqs]);

    return (
        <div className="privacy-screen pb-5 d-flex align-items-start justify-content-between w-100 container gap-24">
            <div className="w-70">
                <h1 className="white-text text-title-2 mb-24">Term of Conditions</h1>
                <p className="m-0 p-0 text-ms grey-text-accent">
                    GENERAL TERMS AND CONDITIONS
                    <br />
                    HEAVEN EXCHANGE General Terms and Conditions (hereinafter referred to as "SKU") are provisions that
                    contain terms and conditions regarding the use of products, services, technology, features services
                    provided by HEAVEN EXCHANGE including, but not limited to the use of the Website, Indonesian Bitcoin
                    Wallet and HEAVEN EXCHANGE Trading Platform (Trading App) (hereinafter referred to as the "HEAVEN
                    EXCHANGE Platform"). hereinafter referred to as the "HEAVEN EXCHANGE Platform" to the extent not
                    specifically regulated as set out in the HEAVEN EXCHANGE Account registration section which is made
                    on the day and date listed in the Account registration section https://www.heavenexchange.io,
                    constitutes an integral and inseparable unity and approval of this GTC. By registering to become
                    Member/Verified Member, you declare that you have READ, UNDERSTAND, AGREE and FOLLOW the Terms and
                    Conditions below. You are advised to read all terms and conditions carefully before using the HEAVEN
                    EXCHANGE platform services or any services that are provided, and together with this you agree and
                    bind yourself to all activities in this GTC with the terms and conditions as follows in this GTC
                    with the following terms and conditions: DEFINITIONS as long as the context sentence does not
                    determine otherwise, the terms or definitions in the GTC have the following meanings : Website
                    refers to an online site with the address https://www.heavenexchange.io. This website is managed by
                    HEAVEN EXCHANGE, with no limitation to its owners, investors, employees and related parties. parties
                    associated with HEAVEN EXCHANGE. Depending on the context, "Website" may also refer to other
                    services, products, sites, content or services provided by HEAVEN EXCHANGE. Crypto Assets are
                    digital commodities that use the principle of decentralized technology based on a peer-to-peer
                    network (interface) or referred to as a Blockchain Network that is traded on the Blockchain platform
                    is an open distributed ledger that can record transactions. ledger that can record transactions
                    between two parties efficiently and in a permanently verifiable manner. that can be permanently
                    verified. Registration is the process of registering to become a Member in the HEAVEN EXCHANGE
                    platform which is the initial verification process to obtain information, statements in the use of
                    platform services Member is a person (individual), business entity, or legal entity that has
                    registered on the HEAVEN EXCHANGE platform, so as to obtain authorization from the HEAVEN EXCHANGE
                    platform to carry out
                </p>
            </div>
            <div className="w-30 d-flex flex-column gap-24">
                <CardPrivacy title="FAQ" data={faq} />
                <CardPrivacy title="Announcement" data={news} />
            </div>
        </div>
    );
};
