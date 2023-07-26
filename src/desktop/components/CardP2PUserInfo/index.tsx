import * as React from 'react';
import { FeedbackIcon } from 'src/assets/images/P2PIcon';

export interface CardP2PUserInfoProps {
    title: string;
    type: string;
    percent?: string;
    amount?: string;
    time?: string;
    minutes?: string;
}

export const CardP2PUserInfo: React.FunctionComponent<CardP2PUserInfoProps> = (props) => {
    const { title, type, percent, amount, time, minutes } = props;

    return (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center justify-content-center p-16 gap-16 radius-sm com-card-p2p-user-info">
                <FeedbackIcon />
                <p className="m-0 p-0 text-xxxs grey-text">{title}</p>
                <p className="m-0 p-0 text-xs grey-text">
                    {type == 'feedback'
                        ? `${percent} (${amount})`
                        : type === 'all trade'
                        ? amount
                        : type === 'trade'
                        ? time
                        : type === 'completion'
                        ? percent
                        : type === 'release'
                        ? minutes
                        : type === 'pay'
                        ? minutes
                        : ''}
                </p>
            </div>
        </React.Fragment>
    );
};
