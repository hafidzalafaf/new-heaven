import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Modal, OfferForm } from '..';
import { Tabs, Tab } from 'react-bootstrap';
import {
    selectP2POffers,
    p2pFiatFetch,
    selectP2PFiatsData,
    p2pCurrenciesFetch,
    selectP2PCurrenciesData,
    p2pOfferCreate,
} from 'src/modules';

export interface ModalCreateOfferPost {
    showModalCreateOffer: boolean;
    onCloseModal?: () => void;
    side?: string;
}

export const ModalCreateOffer: React.FunctionComponent<ModalCreateOfferPost> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();
    const list = useSelector(selectP2POffers);
    const fiats = useSelector(selectP2PFiatsData);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    // const [showModalCreateOffer, setShowModalCreateOffer] = React.useState(props.showModalCreateOffer);
    const { showModalCreateOffer, onCloseModal, side } = props;
    const [currencies, setCurrencies] = React.useState([]);
    const [payments, setPayments] = React.useState([]);

    /* ============== STATE CREATE OFFER  START ============== */
    const [currency, setCurrency] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [price, setPrice] = React.useState('');
    const [fiat, setFiat] = React.useState('IDR');
    const [trade_amount, setTradeAmount] = React.useState('');
    const [min_order, setMinOrder] = React.useState('');
    const [max_order, setMaxOrder] = React.useState('');
    const [payment, setPayment] = React.useState([]);
    const [payment_limit, setPaymentLimit] = React.useState('');
    const [term_of_condition, setTermOfCondition] = React.useState('');
    const [auto_replay, setAutoReplay] = React.useState('');
    /* ============== STATE CREATE OFFER  END ============== */

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat, currency, price]);

    React.useEffect(() => {
        setCurrencies(currenciesData?.currency);
        setPayments(currenciesData?.payment);
    }, [currenciesData]);

    const handleCreateOffer = () => {
        const payload = {
            currency: currency,
            price: price,
            fiat: fiat,
            trade_amount: trade_amount,
            min_order: min_order,
            max_order: max_order,
            payment: payment,
            payment_limit: payment_limit,
            term_of_condition: term_of_condition,
            auto_replay: auto_replay,
            side: side,
        };

        dispatch(p2pOfferCreate(payload));
        onCloseModal;
    };

    const optionFiats = fiats?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.name}</p>, value: item.name };
    });

    const optionCurrency = currencies?.map((item) => {
        return {
            label: <p className="m-0 text-sm grey-text-accent">{item?.currency?.toUpperCase()}</p>,
            value: item.currency,
        };
    });

    const optionPayment = payments?.map((item) => {
        return { label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>, value: item.payment_user_id };
    });

    const handleChangeFiat = (e: string) => {
        setFiat(e);
    };

    const handleChangeCurrency = (e: string) => {
        setCurrency(e);
    };

    const handleChangePayment = (e: string) => {
        setPayment([e]);
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

    const handleChangePaymentLimit = (e: string) => {
        setPaymentLimit(e);
    };

    const handleChangeTermOfCondition = (e: string) => {
        setTermOfCondition(e);
    };

    const handleChangeAutoReplay = (e: string) => {
        setAutoReplay(e);
    };

    const renderContentModalCreateOffer = () => {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="buy" id="justify-tab-example" className="mb-3 " justify>
                    <Tab eventKey="buy" title="Buy" className="mb-32">
                        <OfferForm
                            onCloseModal={onCloseModal}
                            optionCurrency={optionCurrency}
                            optionFiats={optionFiats}
                            optionPayment={optionPayment}
                            price={price}
                            currency={currency}
                            fiat={fiat}
                            trade_amount={trade_amount}
                            min_order={min_order}
                            max_order={max_order}
                            payment={payment}
                            payment_limit={payment_limit}
                            term_of_condition={term_of_condition}
                            auto_replay={auto_replay}
                            handleChangeFiat={handleChangeFiat}
                            handleChangeCurrency={handleChangeCurrency}
                            handleChangePayment={handleChangePayment}
                            handleChangeAutoReplay={handleChangeAutoReplay}
                            handleChangeMaxOrder={handleChangeMaxOrder}
                            handleChangeMinOrder={handleChangeMinOrder}
                            handleChangePaymentLimit={handleChangePaymentLimit}
                            handleChangePrice={handleChangePrice}
                            handleChangeTermOfCondition={handleChangeTermOfCondition}
                            handleChangeTradeAmount={handleChangeTradeAmount}
                            handleCreateOffer={handleCreateOffer}
                        />
                    </Tab>
                    <Tab eventKey="sell" title="Sell" className="mb-32">
                        <OfferForm
                            onCloseModal={onCloseModal}
                            optionCurrency={optionCurrency}
                            optionFiats={optionFiats}
                            optionPayment={optionPayment}
                            price={price}
                            currency={currency}
                            fiat={fiat}
                            trade_amount={trade_amount}
                            min_order={min_order}
                            max_order={max_order}
                            payment={payment}
                            payment_limit={payment_limit}
                            term_of_condition={term_of_condition}
                            auto_replay={auto_replay}
                            handleChangeFiat={handleChangeFiat}
                            handleChangeCurrency={handleChangeCurrency}
                            handleChangePayment={handleChangePayment}
                            handleChangeAutoReplay={handleChangeAutoReplay}
                            handleChangeMaxOrder={handleChangeMaxOrder}
                            handleChangeMinOrder={handleChangeMinOrder}
                            handleChangePaymentLimit={handleChangePaymentLimit}
                            handleChangePrice={handleChangePrice}
                            handleChangeTermOfCondition={handleChangeTermOfCondition}
                            handleChangeTradeAmount={handleChangeTradeAmount}
                            handleCreateOffer={handleCreateOffer}
                        />
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {showModalCreateOffer && (
                <Modal
                    className="com-modal-create-offer-p2p"
                    show={showModalCreateOffer}
                    content={renderContentModalCreateOffer()}
                />
            )}
        </React.Fragment>
    );
};
