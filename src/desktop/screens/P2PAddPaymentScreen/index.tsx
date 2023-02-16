import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P } from '../../../desktop/containers';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectP2PCurrenciesData,
    p2pCurrenciesFetch,
    p2pPaymentUserCreate,
    selectP2PPaymentUserCreateSuccess,
} from 'src/modules';
import Select from 'react-select';
import { CustomStylesSelect } from '../../../desktop/components';
import { InfoWarningIcon, QRIcon } from '../../../assets/images/P2PIcon';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';

interface Bank {
    payment: string;
}

export const P2PAddPaymentScreen: React.FC = () => {
    useDocumentTitle('P2P || Add Payment');
    const dispatch = useDispatch();
    const history = useHistory();
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const createPaymentSuccess = useSelector(selectP2PPaymentUserCreateSuccess);

    const [type, setType] = React.useState('bank');
    const [inputFile, setInputFile] = React.useState(null);
    const [fileName, setFileName] = React.useState('');
    const [fiat, setFiat] = React.useState('IDR');

    const [account_number, setAccountNumber] = React.useState('');
    const [full_name, setFullName] = React.useState('');
    const [bankData, setBankData] = React.useState([]);
    const [bankName, setBankName] = React.useState<any>();
    const bank: Bank = useParams();

    const replacedDash = bank.payment.replace(/-/g, ' ');
    const renderedWord = replacedDash.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [dispatch, fiat]);

    React.useEffect(() => {
        setBankData(currenciesData?.payment);
        setBankName(currenciesData?.payment?.find((item) => item.id == bank.payment));
    }, [currenciesData]);

    React.useEffect(() => {
        if (createPaymentSuccess) {
            history.push('/p2p/profile');
        }
    }, [createPaymentSuccess]);

    const handleCreatePayment = () => {
        const payload = { account_number, full_name, payment_method: bank.payment };

        dispatch(p2pPaymentUserCreate(payload));
    };

    //post data to backend
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append('file', inputFile);
    //     formData.append('type', type);
    //     formData.append('name', renderedWord);
    // };

    return (
        <React.Fragment>
            <div className="pg-screen-p2p-add-payment">
                <div className="container mb-16">
                    <HeaderP2P />
                </div>

                <div className="container">
                    <form className="form-container">
                        <div className="tips-add-payment d-flex align-items-center p-16 gap-8 radius-sm mb-24">
                            <InfoWarningIcon />
                            <p className="m-0 p-0 grey-text-accent text-xxs ">
                                Tips : The added payment method will be shown to the buyer during the transaction to
                                accept fiat transfers. Please ensure that the information is correct, real, and matches
                                your KYC Information on Heaven.
                            </p>
                        </div>

                        <div className="mb-24">
                            <label className="m-0 p-0 mb-16 white-text text-ms">Payment Method</label>
                            <input
                                type="text"
                                className="custom-input-add-payment w-100 white-text"
                                value={bankName?.bank_name}
                                disabled
                            />
                        </div>

                        {type === 'bank' ? (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Full Name</label>
                                <input
                                    value={full_name}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    placeholder="Enter Full Name"
                                    className="custom-input-add-payment w-100 white-text"
                                />
                            </div>
                        ) : (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Full Name"
                                    className="custom-input-add-payment w-100 white-text"
                                />
                            </div>
                        )}

                        {type === 'bank' ? (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Account Number</label>
                                <input
                                    value={account_number}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    placeholder="Enter Account Number"
                                    className="custom-input-add-payment w-100 white-text"
                                />
                            </div>
                        ) : (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">QR Code (Optional)</label>
                                <input
                                    id="custom-input-file"
                                    type="file"
                                    // value={inputFile}
                                    onChange={(e) => {
                                        setInputFile(e.target.files[0]);
                                        setFileName(e.target.files[0].name);
                                    }}
                                    placeholder="Enter Full Name"
                                    className="custom-input-add-payment w-100 white-text d-none"
                                />
                                <label
                                    htmlFor="custom-input-file"
                                    className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <QRIcon />
                                        <p className="m-0 p-0 text-xxs grey-text">{fileName ? fileName : 'Upload'}</p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="mb-24 position-relative">
                            <label className="m-0 p-0 mb-16 white-text text-ms">Phone Number Verification Code</label>
                            <input
                                type="text"
                                placeholder="Enter Verfication Code"
                                className="custom-input-add-payment w-100 mb-24 white-text"
                            />
                            <label className="input-label-right text-sm grey-text position-absolute cursor-pointer">
                                Get Code
                            </label>

                            <p className="m-0 p-0 grey-text text-xxs font-normal text-right">
                                Enter the 6 digit code send 199*****2300
                            </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-24">
                            <Link to={`/p2p/profile`} type="button" className="btn-secondary w-49 radius-sm">
                                Cancel
                            </Link>
                            <button type="button" onClick={handleCreatePayment} className="btn-primary w-49">
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};
