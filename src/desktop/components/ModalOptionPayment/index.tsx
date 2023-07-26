import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectUserInfo } from 'src/modules';
import { Modal } from '../Modal';
import { Link } from 'react-router-dom';
import { FilterInput } from '../FilterInput';
import { CloseModalIcon, WarningModalIcon } from 'src/assets/images/P2PIcon';

export interface ModalOptionPaymentProps {
    show: boolean;
    showSelectedPayment: boolean;
    onClose: () => void;
    handleSelectPayment: () => void;
    handleConfirmSelectedPayment: () => void;
    handleCancelSelectedPayment: () => void;
}

export const ModalOptionPayment: React.FunctionComponent<ModalOptionPaymentProps> = (props) => {
    const {
        show,
        showSelectedPayment,
        onClose,
        handleSelectPayment,
        handleCancelSelectedPayment,
        handleConfirmSelectedPayment,
    } = props;
    const intl = useIntl();
    const history = useHistory();
    const { formatMessage } = useIntl();
    const user = useSelector(selectUserInfo);

    const renderModalOptionPayment = () => {
        return (
            <React.Fragment>
                <div className="position-relative">
                    <h1 className="white-text text-lg mb-32 text-center">Select Payment Method</h1>
                    <span className="position-absolute close-icon cursor-pointer" onClick={onClose}>
                        <CloseModalIcon />
                    </span>
                </div>

                {showSelectedPayment ? (
                    <div>
                        <div className="d-flex align-items-center warning-container gap-16 p-12 bg-warning radius-lg mb-24">
                            <WarningModalIcon />
                            <p className="m-0 p-0 white-text text-sm">
                                Tips: The added payment method will be shown to the buyer during the transaction to
                                accept fiat transfers. Please ensure that the information is correct, real, and matches
                                your KYC information on Binance.
                            </p>
                        </div>

                        <div className="label-bank mb-24">
                            <img src={'/img/logo-bca.png'} alt={'bca'} />
                        </div>

                        <div className="d-flex flex-column mb-24">
                            <label htmlFor="" className="white-text text-sm mb-8">
                                Account Number
                            </label>
                            <input type="number" placeholder="Bank Account Number" className="text-sm" />
                        </div>

                        <div className="d-flex flex-column mb-24">
                            <label htmlFor="" className="white-text text-sm mb-8">
                                Full Name
                            </label>
                            <p className="m-0 p-0 white-text text-md font-normal">Syaripun Al Buqhori</p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-24 w-100">
                            <button type="button" onClick={handleCancelSelectedPayment} className="btn-secondary w-50">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmSelectedPayment} className="btn-primary w-50">
                                Confirm
                            </button>
                        </div>
                    </div>
                ) : (
                    <div onClick={handleSelectPayment}>
                        <h3 className="white-text text-ms font-extrabold mb-16">Recomend Payment</h3>

                        <div className="d-flex flex-wrap justify-content-start align-items-center label-bank-container gap-16 border-b-1 mb-24">
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            {/* {item?.payment[0]
                            ? item?.payment?.map((bank, i) => (
                                  <div key={i} className="label-bank">
                                      <img src={bank?.logo} alt={bank?.bank_name} />
                                  </div>
                              ))
                            : '-'} */}
                        </div>

                        <h3 className="white-text text-ms font-extrabold mb-12">All Payment Method</h3>
                        <div className="mb-24">
                            <FilterInput
                                // data={[]}
                                // onFilter={{}}
                                // filter={searchFilter}
                                placeholder={`Search Payment`}
                                className="w-100"
                            />
                        </div>

                        <div className="d-flex flex-wrap justify-content-start align-items-center label-bank-container gap-16">
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            <div className="label-bank">
                                <img src={'/img/logo-bca.png'} alt={'bca'} />
                            </div>
                            {/* {item?.payment[0]
                            ? item?.payment?.map((bank, i) => (
                                  <div key={i} className="label-bank">
                                      <img src={bank?.logo} alt={bank?.bank_name} />
                                  </div>
                              ))
                            : '-'} */}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Modal show={show} content={renderModalOptionPayment()} className="com-modal-option-payment" />
        </React.Fragment>
    );
};
