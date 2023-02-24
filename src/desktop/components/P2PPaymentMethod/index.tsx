import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NoDataIcon } from '../../../assets/images/P2PIcon';
import {
    p2pPaymentUserData,
    p2pPaymentUserFetch,
    selectP2PPaymentUser,
    selectP2PCurrenciesData,
    p2pCurrenciesFetch,
    selectUserInfo,
} from 'src/modules';
import { useDispatch, useSelector } from 'react-redux';
import { ModalUserLevel } from '../../../desktop/components';

export interface P2PPaymentMethodProps {
    name: string;
    id: number;
    account_number: string;
    account_name: string;
    bank_name: string;
    payment_user_uid: string;
}

export const P2PPaymentMethod: React.FC = () => {
    const dispatch = useDispatch();
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const user = useSelector(selectUserInfo);
    const paymentMethods: P2PPaymentMethodProps[] = useSelector(selectP2PPaymentUser);

    const history = useHistory()

    const [expandPayment, setExpandPayment] = React.useState(false);
    const [fiat, setFiat] = React.useState('IDR');
    const [bankData, setBankData] = React.useState([]);
    const [showModalUserLevel, setShowModalUserLevel] = React.useState(false);

    React.useEffect(() => {
        dispatch(p2pPaymentUserFetch());
    }, [dispatch]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [dispatch, fiat]);

    React.useEffect(() => {
        setBankData(currenciesData?.payment);
    }, [currenciesData]);

    return (
        <React.Fragment>
            <div className="com-p2p-payment-method">
                <div className="d-flex justify-content-between align-items-center w-100 mb-16">
                    <div className="w-70">
                        <h3 className="m-0 p-0 white-text text-ms mb-16">P2P Payment Methods</h3>
                        <p className="m-0 p-0 grey-text text-ms">
                            P2P Payment Methods: When You Sell Cryptocurrencies, The Payment Method Added Will Be
                            Displayed To Buyer As Options To Accept Payment, Please Ensure That The Account Owner’s Name
                            Is Consistent With Your Verified Name On Binance. You Can Add Up To 20 Payment Methods.
                        </p>
                    </div>
                    <div className="w-20">
                        <div className="position-relative w-100">
                            <button
                                onClick={() => {
                                    if (user?.level < 3) {
                                        setShowModalUserLevel(true);
                                    } else {
                                        setExpandPayment(!expandPayment);
                                    }
                                }}
                                type="button"
                                className="btn-primary w-100">
                                + Add a payment method
                            </button>

                            {expandPayment && (
                                <div className="position-absolute dropdown-payment w-100 dark-bg-main p-16 radius-lg">
                                    {bankData.map((bank, i) => (
                                        <Link
                                            to={`/p2p/payment-method/create/${bank.symbol}`}
                                            key={i}
                                            className="bank-payment-container d-flex align-items-center gap-6 cursor-pointer">
                                            <p className="payment-label text-sm font-extrabold blue-text m-0 p-0">I</p>
                                            <p className="text-sm grey-text-accent m-0 p-0">{bank.bank_name}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {!paymentMethods[0] ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No payment method yet</p>
                    </div>
                ) : (
                    <div className="data-container d-flex flex-column align-items-center justify-content-center gap-16">
                        {paymentMethods?.map((bank, i) => (
                            <div key={i} className="p-16 radius-sm data-row w-100">
                                <div className="d-flex justify-content-between align-items- mb-16">
                                    <div className="d-flex align-items-center gap-16">
                                        <img src="/img/logo-bca.png" alt="logo" />
                                        <p className="m-0 p-0 grey-text text-ms">{bank?.bank_name}</p>
                                    </div>

                                    <div className="d-flex align-items-center gap-16">
                                        <p onClick={()=> history.push(`/p2p/payment-method/edit/${bank?.payment_user_uid}`)} className="m-0 p-0 cursor-pointer grey-text text-ms cursor-pointer">Edit</p>
                                        <p className="m-0 p-0 cursor-pointer grey-text text-ms">Delete</p>
                                    </div>
                                </div>

                                <div className="data-row-body w-100">
                                    <div className="w-50">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="m-0 p-0 grey-text text-ms">Name</p>
                                                <p className="m-0 p-0 grey-text text-ms">{bank?.account_name}</p>
                                            </div>

                                            <div>
                                                <p className="m-0 p-0 grey-text text-ms">Account Number</p>
                                                <p className="m-0 p-0 grey-text text-ms">{bank?.account_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModalUserLevel && (
                <ModalUserLevel
                    show={showModalUserLevel}
                    title={'Add Payment Method'}
                    onClose={() => setShowModalUserLevel(false)}
                />
            )}
        </React.Fragment>
    );
};
