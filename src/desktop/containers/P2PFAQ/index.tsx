import * as React from 'react';
import { PlusIcon } from 'src/assets/images/P2PIcon';
import { useBlogsFetch } from 'src/hooks';
import { useSelector } from 'react-redux';
import { selectBlogs } from 'src/modules';
import { NoData } from 'src/desktop/components';

export const P2PFAQ: React.FC = () => {
    useBlogsFetch({ tag: 'faq' });
    const blogs = useSelector(selectBlogs);
    const [blog, setBlog] = React.useState<any>([]);

    React.useEffect(() => {
        if (blogs) {
            setBlog(blogs);
        }
    }, [blogs]);

    return (
        <div className="container-faq-p2p">
            <div>
                {!blogs || !blogs[0]
                    ? ''
                    : blog?.map((el, i) => (
                          <>
                              <h1 className="m-0 p-0 white-text text-ms font-bold mb-16">FAQ</h1>
                              <div key={i} className="d-flex align-content-center mb-16">
                                  <span className="mr-16">
                                      <PlusIcon />
                                  </span>
                                  <a
                                      key={i}
                                      href={el?.url}
                                      target="__blank"
                                      rel="noopener noreferrer"
                                      className="m-0 p-0 white-text text-sm">
                                      {el.title}
                                  </a>
                              </div>
                          </>
                      ))}
            </div>
        </div>
    );
};
