import React, { FC, ReactElement } from 'react';

export const FAQHeader: FC = (): ReactElement => {
    return (
        <React.Fragment>
            <div
                className="overflow-auto py-lg-5 background"
                style={{ backgroundImage: `url('img/background-landing.png')` }}>
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                    <h3 className="title-1 white-text font-bold mb-24">Heaven Exchange FAQ</h3>

                    <div className="d-flex justify-content-center align-content-center gap-8">
                        <a
                            href="https://t.me/heavenexchange"
                            target="__blank"
                            rel="noopener noreferrer"
                            className="btn-primary cursor-pointer">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
