import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { p2pOfferCreate } from 'src/modules/user/p2pOffer';

export const P2PCreateOfferMobileScreen: React.FC = () => {
    useDocumentTitle('P2P || Create Offer');
    const dispatch = useDispatch();
    const history = useHistory();

    const [side, setSide] = React.useState('buy');
    const [currency, setCurrency] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [fiat, setFiat] = React.useState('');
    const [trade_amount, setTradeAmount] = React.useState('');
    const [min_order, setMinOrder] = React.useState('');
    const [max_order, setMaxOrder] = React.useState('');
    const [paymentValue, setPaymentValue] = React.useState([]);
    const [term_of_condition, setTermOfCondition] = React.useState('');
    const [auto_replay, setAutoReplay] = React.useState('');
    const [paymentOffer, setPaymentOffer] = React.useState([]);

    const handleConfirmOffer = () => {
        const payload = {
            currency: currency,
            price: price,
            fiat: fiat,
            trade_amount: trade_amount,
            min_order: min_order,
            max_order: max_order,
            payment: paymentOffer,
            payment_limit: '',
            term_of_condition: term_of_condition,
            auto_replay: auto_replay,
            side: side,
        };

        dispatch(p2pOfferCreate(payload));
        setTradeAmount('');
        setMinOrder('');
        setMaxOrder('');
        setPaymentValue([]);
        setTermOfCondition('');
        setAutoReplay('');
        setPrice('');
        setCurrency('');
    };

    const handleChangeCurrency = (e: string) => {
        setCurrency(e);
    };

    const handleChangePrice = (e: string) => {
        setPrice(e);
    };

    const handleChangeTradeAmount = (e: string) => {
        setTradeAmount(e);
    };

    const handleChangeMinOrder = (e: string) => {
        setMinOrder(e);
    };

    const handleChangeMaxOrder = (e: string) => {
        setMaxOrder(e);
    };

    const handleChangeTermOfCondition = (e: string) => {
        setTermOfCondition(e);
    };

    const handleChangeAutoReplay = (e: string) => {
        setAutoReplay(e);
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p-create-offer mobile-container dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-24">
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Create Offers</p>
                    <span onClick={() => history.goBack()} className="back position-absolute">
                        <ArrowLeft className={'cursor-pointer'} />
                    </span>
                </div>

                <div className="d-flex align-items-center gap-16 mb-16">
                    <button
                        onClick={() => setSide('buy')}
                        type="button"
                        className={`btn-transparent py-10 w-auto ${side == 'buy' && 'active'}`}>
                        <span className={` ${side == 'buy' ? 'gradient-text' : 'grey-text'}`}>Buy</span>
                    </button>

                    <button
                        onClick={() => setSide('sell')}
                        type="button"
                        className={`btn-transparent py-10 w-auto ${side == 'sell' && 'active'}`}>
                        <span className={` ${side == 'sell' ? 'gradient-text' : 'grey-text'}`}>Sell</span>
                    </button>
                </div>

                <form className="form-crete-offer"></form>
            </div>
        </React.Fragment>
    );
};
