import React from 'react';
import './Lost2FAStep.pcss';

export const Lost2FAStep: React.FC = (): React.ReactElement => {
    return (
        <React.Fragment>
            <div className="tabs-item" id="tabs-three">
                <div className="__three  show">
                    <div className="d-flex justify-content-center mb-24">
                        <img src="/img/lost-two-fa.png" alt="lost two fa icon" />
                    </div>
                    <h3 className="white-text text-center mb-24">Please Contact Support Admin</h3>
                    <p className=" grey-text-accent text-center">
                        please contact the heaven exchange admin to find out the procedure for getting your google two
                        factor authentication code back
                    </p>
                    <div className="d-flex justify-content-center">
                        <a
                            href="https://t.me/heavenexchange"
                            target="__blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
