import * as React from 'react';
import '../../../styles/colors.pcss';

export const BannerP2P = () => {
    return (
        <React.Fragment>
            <div className="com-banner-p2p">
                <div className="mb-24">
                    <h1 className="white-text text-xl mb-12">P2P Heaven Exchange</h1>

                    <p className="p-0 m-0 text-ms grey-text-accent">
                        Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
                    </p>
                </div>

                <div className="d-flex justify-content-between align-items-center overflow-x-scroll">
                    <img src="/img/landing-card.png" alt="adsense" className="px-6" />
                    <img src="/img/landing-card.png" alt="adsense" className="px-6" />
                    <img src="/img/landing-card.png" alt="adsense" className="px-6" />
                </div>
            </div>
        </React.Fragment>
    );
};
