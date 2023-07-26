import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { Modal, OfferForm } from '..';
import { Tabs, Tab } from 'react-bootstrap';

export interface ModalCreateOfferPost {
    showModalCreateOffer: boolean;
    onCloseModal?: () => void;
    handleConfirmOffer: () => void;
    handleCreateOffer: () => void;
    handleChangeFiat: (e: string) => void;
    handleChangeCurrency: (e: string) => void;
    handleChangePayment: (e: any) => void;
    handleChangeTradeAmount: (e: string) => void;
    handleChangePrice: (e: string) => void;
    handleChangeMinOrder: (e: string) => void;
    handleChangeMaxOrder: (e: string) => void;
    handleChangePaymentLimit: (e: string) => void;
    handleChangeTermOfCondition: (e: string) => void;
    handleChangeAutoReplay: (e: string) => void;
    handleChangeSide: (e: string) => void;
    currency: any;
    price: string;
    fiat: string;
    trade_amount: string;
    min_order: string;
    max_order: string;
    paymentValue: any;
    payment: any;
    payment_limit: string;
    term_of_condition: string;
    auto_replay: string;
    side: string;
    fiats: any;
    currencies: any;
    payments: any;
    loading: boolean;
}

export const ModalCreateOffer: React.FunctionComponent<ModalCreateOfferPost> = (props) => {
    const {
        showModalCreateOffer,
        onCloseModal,
        handleChangeAutoReplay,
        handleChangeCurrency,
        handleChangeFiat,
        handleChangeMaxOrder,
        handleChangeMinOrder,
        handleChangePaymentLimit,
        handleChangePayment,
        handleChangePrice,
        handleChangeSide,
        handleChangeTermOfCondition,
        handleChangeTradeAmount,
        handleConfirmOffer,
        handleCreateOffer,
        auto_replay,
        currency,
        fiat,
        max_order,
        min_order,
        payment,
        paymentValue,
        payment_limit,
        price,
        side,
        term_of_condition,
        trade_amount,
        currencies,
        fiats,
        payments,
        loading,
    } = props;

    const history = useHistory();
    const intl = useIntl();
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
        return {
            label: <p className="m-0 text-sm grey-text-accent">{item.bank_name}</p>,
            value: item.payment_user_uid,
        };
    });

    const isDisabled = () => {
        if (
            !currency ||
            !fiat ||
            !max_order ||
            !min_order ||
            !payment ||
            !price ||
            !trade_amount ||
            !term_of_condition ||
            !side ||
            loading
        ) {
            return true;
        }
    };

    const renderContentModalCreateOffer = () => {
        return (
            <React.Fragment>
                <Tabs
                    defaultActiveKey="buy"
                    onSelect={(e) => handleChangeSide(e)}
                    id="justify-tab-example"
                    className="mb-3 "
                    justify>
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
                            paymentValue={paymentValue}
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
                            isDisabled={isDisabled}
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
                            paymentValue={paymentValue}
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
                            isDisabled={isDisabled}
                        />
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Modal
                className="com-modal-create-offer-p2p"
                show={showModalCreateOffer}
                content={renderContentModalCreateOffer()}
            />
        </React.Fragment>
    );
};
