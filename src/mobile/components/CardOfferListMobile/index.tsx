import * as React from 'react';
import { VerificationIcon } from 'src/assets/images/P2PIcon';
import { capitalizeFirstLetter } from 'src/helpers';
import { Link } from 'react-router-dom';

export interface CardOfferListMobileProps {
    side: string;
    offer: any;
    symbol: string;
}

export const CardOfferListMobile: React.FC<CardOfferListMobileProps> = (props) => {
    const { side, offer, symbol } = props;

    return (
        <div className="d-flex flex-column gap-8 p-16 radius-xl dark-bg-accent com-mobile-card-offer-list">
            <div className="d-flex align-items-center gap-8">
                <div className="ava-container d-flex justify-content-center align-items-center white-text text-xxs font-bold">
                    {offer?.trader?.email?.toUpperCase()?.slice(0, 1)}
                </div>
                <p className="m-0 p-0 text-ms grey-text-accent">{offer?.trader?.email}</p>

                <span>
                    <VerificationIcon />
                </span>
            </div>

            <p className="m-0 p-0 text-xxs grey-text">
                Trade(s) {offer?.trader?.offer} Completion {offer?.trader?.success_rate}%
            </p>

            <div className="d-flex align-items-start gap-12">
                <p className="m-0 p-0 text-xxs grey-text-accent">{symbol}</p>
                <p className="m-0 p-0 text-md font-extrabold grey-text-accent">{offer?.price}</p>
            </div>

            <div className="text-xxs grey-text">
                <p className="m-0 p-0">
                    Quantity {offer?.available_amount} {offer?.currency?.toUpperCase()}
                </p>
                <p className="m-0 p-0">
                    Limit {offer?.min_order} - {offer?.max_order}
                </p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <div className="payment-container d-flex align-items-center flex-wrap gap-8">
                    {offer?.payment?.map((pay, i) => (
                        <div key={i} className="payment d-flex align-items-center gap-4">
                            <div className="payment-label"></div>
                            <p className="m-0 p-0 text-xxs grey-text">{pay?.name}</p>
                        </div>
                    ))}
                </div>
                <Link to={`/p2p/order/${offer?.offer_number}`} className="btn-primary text-ms font-normal">
                    {capitalizeFirstLetter(side)}
                </Link>
            </div>
        </div>
    );
};
