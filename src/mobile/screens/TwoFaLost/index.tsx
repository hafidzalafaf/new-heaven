import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../assets/Arrow';

const LostTwoFaMobileScreen: React.FC = () => {
    return (
        <React.Fragment>
            <div className="mobile-container lost-two-fa-screen dark-bg-main">
                <div className="d-flex">
                    <Link to={'/signin'}>
                        <ArrowLeft className={'back'} />
                    </Link>
                    <h1 className=" font-extrabold text-md grey-text-accent text-center ml-4">Security Verification</h1>
                </div>
                <div className="main-content">
                    <img src="img-mobile/contact-support.png" alt="contact support icon" />
                    <p className="text-sm white-text text-center mt-2">
                        Please Contact Our Admin To Get New Code 2FA Verification
                    </p>
                </div>
                <Link to={'/faq'} className="btn btn-block btn-mobile btn-primary">
                    Get Support
                </Link>
            </div>
        </React.Fragment>
    );
};

export { LostTwoFaMobileScreen };
