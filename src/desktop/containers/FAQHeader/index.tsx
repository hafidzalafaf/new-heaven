import React, { FC, ReactElement } from 'react';
import { useBlogsFetch, useContactsFetch } from 'src/hooks';
import { useSelector } from 'react-redux';
import { selectContact, selectBlogs } from 'src/modules';

export const FAQHeader: FC = (): ReactElement => {
    useContactsFetch();
    // useBlogsFetch({ tag: 'contact' });
    const [support, setSupport] = React.useState<any>([]);

    // const blogs = useSelector(selectBlogs);
    const contacts = useSelector(selectContact);

    React.useEffect(() => {
        if (contacts) {
            setSupport(contacts);
        }
    }, [contacts]);

    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};
