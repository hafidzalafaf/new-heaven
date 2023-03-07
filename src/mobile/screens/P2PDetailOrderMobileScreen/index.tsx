import * as React from 'react';
import { useDocumentTitle, useWalletsFetch } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserLoggedIn,
    p2pOfferFetch,
    offersFetch,
    selectP2PAccountOffer,
    selectP2POffers,
    selectP2PFiatsData,
    p2pFiatFetch,
    P2PFiat,
    selectP2POffersAccountLoading,
    selectP2POffersFetchLoading,
    selectWallets,
} from 'src/modules';
import { p2pProfileFetch } from 'src/modules/user/p2pProfile';
import { useLocation, useHistory, useParams } from 'react-router';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { capitalizeFirstLetter } from 'src/helpers';
import { RefreshMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { Spinner } from 'react-bootstrap';

export const P2PDetailOrderMobileScreen: React.FC = () => {
    useDocumentTitle('P2P Detail Order');
    useWalletsFetch();

    const dispatch = useDispatch();
    const history = useHistory();
    const { offer_number = '' } = useParams<{ offer_number?: string }>();
    const location = useLocation<{ side?: string; fiat?: string; currency?: string }>();
    const side = location?.state?.side;
    const fiat = location?.state?.fiat;
    const currency = location?.state?.currency;

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const publicOffer = useSelector(selectP2POffers);
    const privateOffer = useSelector(selectP2PAccountOffer);
    const publicLoading = useSelector(selectP2POffersFetchLoading);
    const privateLoading = useSelector(selectP2POffersAccountLoading);
    const wallets = useSelector(selectWallets);
    const fiats: P2PFiat[] = useSelector(selectP2PFiatsData);

    const [detail, setDetail] = React.useState<any>();
    const [loading, setLoading] = React.useState(false);

    const fiatData = fiats?.find((item) => item?.name == fiat);

    React.useEffect(() => {
        if (isLoggedIn) {
            setDetail(privateOffer?.find((item) => item?.offer_number == offer_number));
            setLoading(privateLoading);
        } else {
            setDetail(publicOffer?.find((item) => item?.offer_number == offer_number));
            setLoading(publicLoading);
        }
    }, [isLoggedIn, publicOffer, privateOffer, privateLoading, publicLoading]);

    React.useEffect(() => {
        dispatch(p2pProfileFetch());
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(p2pOfferFetch({ side: side, fiat: fiat, currency: currency }));
        }
        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(offersFetch({ side: side, fiat: fiat, currency: currency }));
        }
    }, [currency, fiat, side, dispatch]);

    const handleRefresh = () => {
        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(p2pOfferFetch({ side: side, fiat: fiat, currency: currency }));
        }
        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(offersFetch({ side: side, fiat: fiat, currency: currency }));
        }
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p-detail-offer mobile-container dark-bg-main">
                <div className="position-relative">
                    <div className="d-flex justify-content-center align-items-center position-relative mb-24">
                        <p className="m-0 p-0 grey-text-accent text-md font-extrabold">
                            {capitalizeFirstLetter(side)} {detail?.currency?.toUpperCase()}
                        </p>
                        <span onClick={() => history.goBack()} className="back position-absolute">
                            <ArrowLeft className={'cursor-pointer'} />
                        </span>
                    </div>

                    <div>
                        <div className="d-flex align-item-center gap-8">
                            <p className="m-0 p-0 grey-text text-sm">Price</p>
                            <p className="m-0 p-0 green-text text-sm">
                                {fiatData?.symbol} {detail?.price}
                            </p>

                            {loading ? (
                                <Spinner animation="border" variant="secondary" size="sm" />
                            ) : (
                                <span onClick={handleRefresh} className="cursor-pointer m-0 p-0">
                                    <RefreshMobileIcon />
                                </span>
                            )}
                        </div>

                        <div className="d-flex align-item-center gap-8 mb-24">
                            <p className="m-0 p-0 grey-text text-sm">Limit</p>
                            <p className="m-0 p-0 white-text text-sm">
                                {fiatData?.symbol} {detail?.min_order} - {fiatData?.symbol} {detail?.max_order}
                            </p>
                        </div>

                        <form className="form-container">
                            <div>
                                <label className="white-text text-ms mb-16">I want to pay</label>

                                <div className="d-flex align-items-center w-100">
                                    <div className="w-80">
                                        <input
                                            type="text"
                                            placeholder="Enter amount"
                                            className="input-filter-fiat w-100 filter-input"
                                        />
                                    </div>
                                    <div className="w-20">
                                        <button className="btn-secondary w-100">All</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
