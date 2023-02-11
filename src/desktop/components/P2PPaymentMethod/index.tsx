import * as React from 'react';
import { Link } from 'react-router-dom';
import { NoDataIcon } from '../../../assets/images/P2PIcon';
import { p2pPaymentMethodsFetch } from 'src/modules';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export const P2PPaymentMethod: React.FC = () => {
    const data = [{ id: 1 }, { id: 2 }];
    const [expandPayment, setExpandPayment] = React.useState(false);
    const [bankData, setBankData] = React.useState([]);
    const banks = [
        { name: 'Bank Transfer', path: 'bank-transfer' },
        { name: 'Permata Me', path: 'permata-me' },
        { name: 'Mandiri Pay', path: 'mandiri-pay' },
        { name: 'DANA', path: 'dana' },
        { name: 'OVO', path: 'ovo' },
        { name: 'Gopay', path: 'gopay' },
        { name: 'Bank BCA', path: 'bank-bca' },
    ];
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(p2pPaymentMethodsFetch());
    }, [dispatch]);


    const getDummy = async () => {
        try {
            const response = await axios.get('http://dev.heavenexchange.io/api/v2/p2p/public/payments/idr');
            console.log(response);
            setBankData(response.data);
        }
        catch (error) {
            console.log(error);
    }
}
    getDummy();
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
                                onClick={() => setExpandPayment(!expandPayment)}
                                type="button"
                                className="btn-primary w-100">
                                + Add a payment method
                            </button>

                            {expandPayment && (
                                <div className="position-absolute dropdown-payment w-100 dark-bg-main p-16 radius-lg">
                                    {bankData.map((bank, i) => (
                                        <Link
                                            to={`/p2p/payment-method/${bank.id}`}
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

                {!data[0] ? (
                    <div className="d-flex flex-column justify-content-center align-items-center gap-24 no-data-container">
                        <NoDataIcon />
                        <p className="m-0 p-0 grey-text text-sm font-bold">No payment method yet</p>
                    </div>
                ) : (
                    <div className="data-container d-flex flex-column align-items-center justify-content-center gap-16">
                        {data?.map((bank, i) => (
                            <div className="p-16 radius-sm data-row w-100">
                                <div className="d-flex justify-content-between align-items- mb-16">
                                    <div className="d-flex align-items-center gap-16">
                                        <img src="/img/logo-bca.png" alt="logo" />
                                        <p className="m-0 p-0 grey-text text-ms">Bank Transfer BCA</p>
                                    </div>

                                    <div className="d-flex align-items-center gap-16">
                                        <p className="m-0 p-0 cursor-pointer grey-text text-ms">Edit</p>
                                        <p className="m-0 p-0 cursor-pointer grey-text text-ms">Delete</p>
                                    </div>
                                </div>

                                <div className="data-row-body w-100">
                                    <div className="w-50">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="m-0 p-0 grey-text text-ms">Name</p>
                                                <p className="m-0 p-0 grey-text text-ms">Nusatech Exchange</p>
                                            </div>

                                            <div>
                                                <p className="m-0 p-0 grey-text text-ms">Account Number</p>
                                                <p className="m-0 p-0 grey-text text-ms">68809090001</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};
