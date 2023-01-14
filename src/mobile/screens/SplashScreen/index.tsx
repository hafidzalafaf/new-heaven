import React from 'react';
import LogoSplash from 'src/mobile/assets/LogoSplash';
import './splashscreen.pcss';

const SplashScreenMobile: React.FC = () => {
    return (
        <section className="splashscreen-mobile-screen dark-bg-main">
            <LogoSplash />
        </section>
    );
};

export { SplashScreenMobile };
