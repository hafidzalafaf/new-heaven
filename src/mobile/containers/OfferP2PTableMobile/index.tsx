import * as React from 'react';
import '../../../styles/colors.pcss';
import moment from 'moment';
import { NoData } from '../../../desktop/components';
import { Loading } from '../../../components';
import { MobileMoreArrow } from '../../../assets/images/P2PIcon';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from 'src/helpers';
import './OrderP2PTableMobile.pcss';

export interface OfferP2PTableMobileProps {
    type: string;
    data: any;
    loading?: boolean;
    side?: string;
    handleShowCancelOffer?: (id: string) => void;
}

export const OfferP2PTableMobile: React.FC<OfferP2PTableMobileProps> = (props) => {
    const { type, data, loading, side, handleShowCancelOffer } = props;

    function renderContent() {
        switch (type) {
            case 'offer':
                return <FilterredItem data={data} />;
            case 'detail':
                return <FilterredItemDetail data={data} />;
            default:
                return null;
        }
    }

    const FilterredItem = ({ data }) => {
        return (
            <React.Fragment>
                {data && data[0] ? (
                    data?.map((item) => (
                        <div className="d-flex flex-column com-mobile-card-order-list gap-20 border-b-1 p-2 grey-text">
                            <div className="d-flex flex-row justify-content-between my-1 gap-4">
                                <div>
                                    <span className={item?.side === `buy` ? `contrast-text` : `danger-text`}>
                                        {capitalizeFirstLetter(item?.side)}{' '}
                                    </span>
                                    <span className="grey-text-accent font-bold">
                                        {item?.currency?.name?.toUpperCase()}
                                    </span>
                                </div>

                                <Link to={`/p2p/offer/${item?.offer_number}`}>
                                    <span className={item?.state === 'active' ? `gradient-text` : 'danger-text'}>
                                        {capitalizeFirstLetter(item?.state)}
                                    </span>
                                    <MobileMoreArrow className={''} />
                                </Link>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Coin</span>
                                <div className="d-flex flex-row align-items-center">
                                    <img height={24} width={24} src={item?.fiat.icon_url} alt={item?.fiat.name} />
                                    <span className="white-text font-bold ml-1">{item?.fiat.name}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Date</span>
                                <span>{moment(item?.created_at).format('YYYY-MM-DD hh:mm:ss')}</span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Amount</span>
                                <span>{item?.available_amount}</span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Sale</span>
                                <span>
                                    {item?.side == 'sell' ? item?.stats_offer?.bought : item?.stats_offer?.sold}
                                </span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Available</span>
                                <span>
                                    {item?.side == 'sell'
                                        ? +item?.available_amount - +item?.stats_offer?.bought
                                        : +item?.available_amount - +item?.stats_offer?.sold}
                                </span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Offer ID</span>
                                <span>{item?.offer_number}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleShowCancelOffer(item?.offer_number)}
                                className="btn-secondary radius-lg my-2">
                                Cancel
                            </button>
                        </div>
                    ))
                ) : (
                    <NoData text="No Offer Found" />
                )}
            </React.Fragment>
        );
    };

    const FilterredItemDetail = ({ data }) => {
        return (
            <React.Fragment>
                {data && data[0] ? (
                    data?.map((item) => (
                        <div className="d-flex flex-column com-mobile-card-order-list gap-20 border-b-1 p-2 grey-text">
                            <div className="d-flex flex-row justify-content-between gap-4 my-1">
                                <div>
                                    <span className={side === `buy` ? `contrast-text` : `danger-text`}>
                                        {capitalizeFirstLetter(side)}{' '}
                                    </span>
                                    <span className="grey-text-accent font-bold">
                                        {item?.currency?.name?.toUpperCase()}
                                    </span>
                                </div>

                                <Link to={`/p2p/offer/${item?.offer_number}`}>
                                    <span
                                        className={
                                            item?.state == 'success' || item?.state == 'accepted'
                                                ? 'contrast-text'
                                                : item?.state?.includes('waiting')
                                                ? 'warning-text'
                                                : item?.state == 'prepare'
                                                ? 'blue-text'
                                                : 'danger-text'
                                        }>
                                        {capitalizeFirstLetter(item?.state)}
                                    </span>
                                    <MobileMoreArrow className={''} />
                                </Link>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Coin</span>
                                <div className="d-flex flex-row align-items-center">
                                    <img height={24} width={24} src={item?.fiat.icon_url} alt={item?.fiat.name} />
                                    <span className="white-text font-bold ml-1">{item?.fiat.name}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Date</span>
                                <span>{moment(item?.created_at).format('YYYY-MM-DD hh:mm:ss')}</span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Amount</span>
                                <span>{item?.price}</span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Crypto Amount</span>
                                <span>{item?.amount}</span>
                            </div>
                            <div className="d-flex flex-row justify-content-between my-1">
                                <span>Order ID</span>
                                <span>{item?.order_number}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <NoData text="No Offer Found" />
                )}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="com-order-p2p-table">
                <div className="d-flex justify-content-between align-items-start mb-24">
                    <div className="position-relative w-100">{loading ? <Loading /> : renderContent()}</div>
                </div>
            </div>
        </React.Fragment>
    );
};
