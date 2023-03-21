import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentLanguage,
    changeLanguage,
    changeUserDataFetch,
    selectUserInfo,
    selectUserLoggedIn,
} from 'src/modules';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { ArrowRight } from 'src/mobile/assets/Arrow';
import { GlobeIcon } from 'src/mobile/assets/GlobeIcon';
import { ModalFullScreenMobile } from 'src/mobile/components';
import { CheckSmall } from 'src/mobile/assets/CheckSmall';

const SettingProfileMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const currentLanguage = useSelector(selectCurrentLanguage);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const user = useSelector(selectUserInfo);
    const [showLanguage, setShowLanguage] = React.useState(false);
    const dataUser = user && user?.data && JSON.parse(user.data);
    const currentLang = dataUser != undefined ? dataUser.language : 'en';
    const [langActive, setLangActive] = React.useState(currentLang);

    const handleChangeLanguage = (language: string) => {
        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                dispatch(changeUserDataFetch({ user: payload }));
            }
        } else {
            localStorage.setItem('lang_code', language);
        }

        dispatch(changeLanguage(language));
    };

    const renderModalContentLanguage = () => {
        return (
            <React.Fragment>
                <div className="head-container position-relative mb">
                    <div onClick={() => setShowLanguage(!showLanguage)} className="cursor-pointer position-absolute">
                        <ArrowLeft className={'back'} />
                    </div>
                    <h1 className="text-center text-md grey-text-accent font-bold">Language</h1>
                </div>
                <div className="divider mb-24" />

                <div
                    onClick={() => {
                        handleChangeLanguage('en');
                        setLangActive('en');
                    }}
                    className="d-flex justify-content-between align-items-center card-menu cursor-pointer">
                    <p className="m-0 p-0 grey-text text-sm font-bold">English</p>
                    {currentLanguage == 'en' && <CheckSmall />}
                </div>
                <div
                    onClick={() => {
                        handleChangeLanguage('ru');
                        setLangActive('ru');
                    }}
                    className="d-flex justify-content-between align-items-center card-menu cursor-pointer">
                    <p className="m-0 p-0 grey-text text-sm font-bold">Russian</p>
                    {currentLanguage == 'ru' && <CheckSmall />}
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="mobile-container setting-profile-mobile no-header home-screen dark-bg-accent">
            <div className="head-container position-relative mb">
                <Link to={'/profile'} className="cursor-pointer position-absolute">
                    <ArrowLeft className={'back'} />
                </Link>
                <h1 className="text-center text-md grey-text-accent font-bold">Setting</h1>
            </div>
            <div className="divider mb-24" />

            <div className="d-flex justify-content-between align-items-center card-menu">
                <div className="d-flex align-items-center gap-8">
                    <GlobeIcon />
                    <p className="m-0 p-0 grey-text text-sm font-bold">Language</p>
                </div>
                <div
                    onClick={() => setShowLanguage(!showLanguage)}
                    className="d-flex align-items-center gap-8 cursor-pointer">
                    <p className="m-0 p-0 grey-text text-sm font-bold">
                        {currentLanguage == 'en' ? 'English' : 'Russian'}
                    </p>

                    <ArrowRight className={''} />
                </div>
            </div>

            <ModalFullScreenMobile show={showLanguage} content={renderModalContentLanguage()} />
        </div>
    );
};

export { SettingProfileMobileScreen };
