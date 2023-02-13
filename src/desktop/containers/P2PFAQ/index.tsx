import * as React from 'react';
import { PlusIcon } from 'src/assets/images/P2PIcon';
import { useBlogsFetch } from 'src/hooks';
import { useSelector } from 'react-redux';
import { selectBlogs } from 'src/modules';

export const P2PFAQ: React.FC = () => {
    useBlogsFetch({ tag: 'faq' });
    const blogs = useSelector(selectBlogs);
    const [blog, setBlog] = React.useState<any>([]);

    React.useEffect(() => {
        if (blogs) {
            setBlog(blogs);
        }
    }, [blogs]);

    const data = [
        { faq: 'How do I make a payment?' },
        { faq: 'Is it safe to make payment to the seller？' },
        { faq: 'What should I look out for during the payment transfer?' },
        { faq: 'What do I do if the payment failed?' },
        { faq: 'What if I do not want to trade anymore?' },
        { faq: 'Does the seller charge a transaction fee？' },
    ];
    return (
        <div className="container-faq-p2p">
            <h1 className="m-0 p-0 white-text text-ms font-bold mb-16">FAQ</h1>

            <div>
                {blog?.map((el, i) => (
                    <div key={i} className="d-flex align-content-center mb-16">
                        <span className="mr-16">
                            <PlusIcon />
                        </span>
                        {/* <p className="m-0 p-0 white-text text-sm">{el.title}</p> */}
                        <a
                            key={i}
                            href={el?.url}
                            target="__blank"
                            rel="noopener noreferrer"
                            className="m-0 p-0 white-text text-sm">
                            {el.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
