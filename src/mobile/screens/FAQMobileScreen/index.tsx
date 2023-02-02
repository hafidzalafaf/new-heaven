import * as React from 'react'
import { ArrowLeft } from 'src/mobile/assets/Arrow'
import { useHistory } from 'react-router-dom'
import { useDocumentTitle, useBlogsFetch } from 'src/hooks';
import { Logo } from '../../../assets/images/Logo';
import { useSelector } from 'react-redux';
import { selectBlogs } from 'src/modules';
import moment from 'moment';

 const FAQMobileScreen:React.FC = () => {
  const history = useHistory()
  useDocumentTitle('FAQ');
  useBlogsFetch({ tag: 'faq' });
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
    <section className="mobile-container home-screen dark-bg-main">
      <div className="head-container position-relative">
        <div onClick={() => history.goBack()} className="cursor-pointer position-absolute">
            <ArrowLeft className={'back'} />
        </div>
        <h1 className="text-center text-md grey-text-accent font-bold">FAQ</h1>
      </div>
      
      <div
        style={{ backgroundImage: `url('img/background-landing.png')` }}>
      
        <h5 className='text-white text-center mt-5'>Heaven Exchange FAQ</h5>
        <div className="d-flex justify-content-center align-content-center mt-3 gap-8">
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
        <div className="container">
            <div className="articles">
                <div className="row justify-content-center">
                    <div className="col-xl-11">
                        <div className="row">
                            {faq &&
                                faq.map((item, key) => (
                                    <div key={key} className="col-md-4 col-sm-6 col- my-3">
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
    </section>
  )
}

export {FAQMobileScreen}