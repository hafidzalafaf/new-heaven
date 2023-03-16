import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { HeaderP2P } from '../../../desktop/containers';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectP2PCurrenciesData,
    p2pCurrenciesFetch,
    p2pPaymentUserCreate,
    selectP2PPaymentUserCreateSuccess,
    selectUserInfo,
    selectP2PPaymentUser,
    p2pPaymentUserFetch,
    P2PPaymentUserFetchSingle,
    p2pPaymentUserUpdate,
    selectP2PPaymentUserSingle,
} from 'src/modules';
import Select from 'react-select';
import { CustomStylesSelect } from '../../../desktop/components';
import { InfoWarningIcon, QRIcon } from '../../../assets/images/P2PIcon';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';

export const P2PEditPaymentScreen: React.FC = () => {
    useDocumentTitle('P2P || Edit Payment');
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(selectUserInfo);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const currentPaymentData = useSelector(selectP2PPaymentUser)
    const createPaymentSuccess = useSelector(selectP2PPaymentUserCreateSuccess);
    const currentEditedData = useSelector(selectP2PPaymentUserSingle);
    const {payment_user_uid = ''}  = useParams<{payment_user_uid?: string}>();
    
    const [inputFile, setInputFile] = React.useState(null);
    const [fileName, setFileName] = React.useState('');
    const [fiat, setFiat] = React.useState('IDR');
    const [account_number, setAccountNumber] = React.useState('');
    const [bankData, setBankData] = React.useState<any>();
    const [image, setImage] = React.useState<File | null>(null);
    const profiles = user.profiles.slice(-1);
    // const replacedDash = bank.payment.replace(/-/g, ' ');
    // const renderedWord = replacedDash.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

    React.useEffect(()=>{
        dispatch(P2PPaymentUserFetchSingle({payment_user_uid}))
    }, [dispatch])

    React.useEffect(()=>{
        setAccountNumber(currentEditedData[0]?.account_number);
    }, [currentEditedData])
    
    React.useEffect(() => {
        if (createPaymentSuccess) {
            history.push('/p2p/profile');
        }
    }, [createPaymentSuccess]);

    console.log(currentEditedData);

    const handleEditPayment = () => {

        const formData = new FormData()
        formData.append('payment_id', payment_user_uid);
        formData.append('account_number', account_number);
        formData.append('full_name', profiles[0]?.first_name);
        formData.append('payment_method', currentEditedData[0].symbol);
        formData.append('qrcode', image)
        const payment_id = formData.get('payment_id').toString();
        dispatch(p2pPaymentUserUpdate(formData, payment_id));
    };

    const handleChangeAccountNumber = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAccountNumber(value);
    };


    const handleConfirmPayment = async () => {
        handleEditPayment();
        history.goBack();
    }
    const disabledButton = () => {
        if (!profiles[0]?.first_name || !bankData?.symbol || !account_number) {
            return true;
        } else {
            return false;
        }
    };

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
                                defaultValue={currentEditedData[0]?.symbol}
                                readOnly
                                disabled
                            />
                        </div>

                        {currentEditedData[0]?.tipe === 'bank' ? (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Full Name</label>
                                <input
                                    readOnly
                                    disabled
                                    defaultValue={profiles[0]?.first_name}
                                    type="text"
                                    placeholder="Enter Full Name"
                                    className="custom-input-add-payment w-100 white-text"
                                />
                            </div>
                        ) : (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Phone Number</label>
                                <input
                                    value={account_number}
                                    onChange={(e) => handleChangeAccountNumber(e.target.value)}
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    className="custom-input-add-payment w-100 white-text"
                                />
                            </div>
                        )}

                        {currentEditedData[0]?.tipe === 'bank' ? (
                            <div className="mb-24">
                                <label className="m-0 p-0 mb-16 white-text text-ms">Account Number</label>
                                <input
                                    value={account_number}
                                    onChange={(e) => handleChangeAccountNumber(e.target.value)}
                                    type="text"
                                    placeholder="Enter Account Number"
                                    className="custom-input-add-payment w-100 white-text"
                                    defaultValue={currentEditedData[0].account_number}
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
                                        setImage(e.target.files[0])
                                    }}
                                    placeholder="Enter Full Name"
                                    className="custom-input-add-payment w-100 white-text d-none"
                                />
                                <label
                                    htmlFor="custom-input-file"
                                    className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <QRIcon />
                                        <p className="m-0 p-0 text-xxs grey-text">{image?.name ? image?.name : 'Upload'}</p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="mb-24 position-relative">
                            <label className="m-0 p-0 mb-16 white-text text-ms">2FA Code</label>
                            <input
                                type="text"
                                placeholder="Enter Verfication Code"
                                className="custom-input-add-payment w-100 mb-24 white-text"
                            />

                            <p className="m-0 p-0 grey-text text-xxs font-normal text-right">
                                Enter the 6 digit code send 199*****2300
                            </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-24">
                            <Link
                                to={`/p2p/profile`}
                                type="button"
                                className="btn-secondary w-49 radius-sm text-center">
                                Cancel
                            </Link>
                            <button
                                type="button"
                                // disabled={disabledButton()}
                                onClick={handleConfirmPayment}
                                className="btn-primary w-49">
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};
