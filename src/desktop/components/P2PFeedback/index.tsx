import * as React from 'react';
import { NoDataIcon, LikeSuccessIcon, UnLikeDangerIcon } from '../../../assets/images/P2PIcon';
import { Tabs, Tab } from 'react-bootstrap';
import { truncateMiddle } from '../../../helpers';
import moment from 'moment';

export const P2PFeedback: React.FC = () => {
    const data = [
        { id: 1, positive: true, name: 'Nusatech Exchange' },
        { id: 2, positive: false, name: 'Nusatech Exchange' },
    ];

    const dataPositive = data.filter((item) => item.positive === true);
    const dataNegative = data.filter((item) => item.positive === false);

    const renderData = (data) => {
        return data.map((item, i) => (
            <div key={i} className="d-flex justify-content-between align-item-center mb-16 p-10 data-row">
                <div className="d-flex align-items-start justify-content-start gap-8">
                    <div className="d-flex justify-content-center align-items-center grey-text-accent text-xxs font-bold ava-container">
                        {item.name?.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="d-flex flex-column gap-4">
                        <p className="m-0 p-0 text-xxs font-bold grey-text-accent">
                            {truncateMiddle(item.name, 10, '****')}
                        </p>
                        <p className="m-0 p-0 text-xxs font-bold grey-text">
                            2022-12-28{'  '}|{'  '}Bank Transfer
                        </p>
                        <p className="m-0 p-0 text-xxs font-bold white-text">Transaksi cepat, Sopan dan Ramah</p>
                    </div>
                </div>

                <span>{item.positive ? <LikeSuccessIcon /> : <UnLikeDangerIcon />}</span>
            </div>
        ));
    };

    return (
        <React.Fragment>
            <div className="com-p2p-feedback">
                <div className="d-flex justify-content-between align-items-center mb-16">
                    <p className="m-0 p-0 grey-text text-ms">Feedback</p>
                    <p className="m-0 p-0 grey-text text-ms">{data?.length} Review</p>
                </div>

                {!data[0] ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No Comments</p>
                    </div>
                ) : (
                    <Tabs defaultActiveKey="all" transition={false} id="noanim-tab-example" className="mb-3">
                        <Tab eventKey="all" title="All">
                            {renderData(data)}
                        </Tab>
                        <Tab eventKey="positie" title="Positive">
                            {renderData(dataPositive)}
                        </Tab>
                        <Tab eventKey="negative" title="Negative">
                            {renderData(dataNegative)}
                        </Tab>
                    </Tabs>
                )}
            </div>
        </React.Fragment>
    );
};
