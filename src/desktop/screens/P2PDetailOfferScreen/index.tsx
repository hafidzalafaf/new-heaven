import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P, BannerP2P, OfferP2PTable } from 'src/desktop/containers';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import {
    p2pFiatFetch,
    selectP2PFiatsData,
    p2pUserOfferFetch,
    selectP2PUserAccountOffer,
    selectP2PUserAccountOfferDetail,
    p2pUserOfferDetailFetch,
    P2PUserOfferDetail,
} from 'src/modules';

export const P2PDetailOfferScreen: React.FC = () => {
    useDocumentTitle('P2P || Detail Offer');
    const dispatch = useDispatch();
    const { offer_number = '' } = useParams<{ offer_number?: string }>();

    const fiats = useSelector(selectP2PFiatsData);
    const offer = useSelector(selectP2PUserAccountOffer);
    const offerDetail: P2PUserOfferDetail = useSelector(selectP2PUserAccountOfferDetail);

    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();
    const [fiat, setFiat] = React.useState('');
    const [side, setSide] = React.useState('');
    const [state, setState] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const time_from = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const time_to = Math.floor(new Date(endDate).getTime() / 1000).toString();
    const ordersFromOfferDetail = offerDetail.order;

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        dispatch(
            p2pUserOfferFetch({
                currency: '',
                amount: '',
                max_amount: '',
                min_price: '',
                max_price: '',
                side: '',
            })
        );
        dispatch(
            p2pUserOfferDetailFetch({
                offer_number: offer_number,
            })
        );
    }, [dispatch]);
    const handleChangeFiat = (e: string) => {
        setFiat(e);
    };

    const handleChangeState = (e: string) => {
        setState(e);
    };

    const handleChangeSide = (e: string) => {
        setSide(e);
    };

    const handleChangeStartDate = (e: string) => {
        setStartDate(e);
    };

    const handleChangeEndDate = (e: string) => {
        setEndDate(e);
    };

    return (
        <React.Fragment>
            <div className="pg-screen-p2p">
                <div>
                    <BannerP2P />
                </div>

                <div className="com-content-order-p2p-container">
                    <div className="mb-24">
                        <HeaderP2P />
                    </div>
                    <OfferP2PTable
                        type="detail"
                        fiat={fiat}
                        state={state}
                        side={side}
                        startDate={startDate}
                        endDate={endDate}
                        data={offerDetail?.order}
                        fiats={fiats}
                        loading={loading}
                        handleChangeFiat={handleChangeFiat}
                        handleChangeState={handleChangeState}
                        handleChangeSide={handleChangeSide}
                        handleChangeStartDate={handleChangeStartDate}
                        handleChangeEndDate={handleChangeEndDate}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
