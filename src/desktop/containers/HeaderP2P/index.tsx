import * as React from 'react';
import { Link } from 'react-router-dom';
import { HeaderOrderIcon, HeaderProfileIcon, HeaderGuideIcon, HeaderOthersIcon } from '../../../assets/images/P2PIcon';

export const HeaderP2P = () => {
    return (
        <React.Fragment>
            <div className="com-header-p2p d-flex justify-content-between align-items-center">
                <h1 className="white-text text-md">P2P Trading</h1>

                <div className="d-flex justify-content-between align-items-center">
                    <Link
                        to={'/p2p/order'}
                        className="d-flex justify-content-center align-content-center mr-24 cursor-pointer">
                        <span className="mr-8">
                            <HeaderOrderIcon fillColor={'var(--text-secondary-color)'} />
                        </span>
                        <p className="m-0 p-0 white-text text-ms">My Order</p>
                    </Link>

                    <Link
                        to={'/p2p/profile'}
                        className="d-flex justify-content-center align-content-center mr-24 cursor-pointer">
                        <span className="mr-8">
                            <HeaderProfileIcon fillColor={'var(--text-secondary-color)'} />
                        </span>
                        <p className="m-0 p-0 white-text text-ms">Profile P2P</p>
                    </Link>

                    <Link to={'/'} className="d-flex justify-content-center align-content-center mr-24 cursor-pointer">
                        <span className="mr-8">
                            <HeaderGuideIcon fillColor={'var(--text-secondary-color)'} />
                        </span>
                        <p className="m-0 p-0 white-text text-ms">User Guide</p>
                    </Link>

                    <Link to={'/'} className="d-flex justify-content-center align-content-center cursor-pointer">
                        <span className="mr-8">
                            <HeaderOthersIcon fillColor={'var(--text-secondary-color)'} />
                        </span>
                        <p className="m-0 p-0 white-text text-ms">Others</p>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};
