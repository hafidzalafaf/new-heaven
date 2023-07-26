import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
    BlueWarningIcon,
    InfoWarningIcon,
    MobileFilterIcon,
    QRIcon,
    TrashBinMobileIcon,
} from 'src/assets/images/P2PIcon';
import { P2PPaymentMethodProps } from 'src/desktop/components';
import { capitalizeFirstLetter } from 'src/helpers';
import { ArrowLeft, ArrowRight } from 'src/mobile/assets/Arrow';
import { ModalFullScreenMobile } from 'src/mobile/components';
import {
    p2pCurrenciesFetch,
    p2pPaymentUserCreate,
    p2pPaymentUserDelete,
    p2pPaymentUserFetch,
    P2PPaymentUserFetchSingle,
    p2pPaymentUserUpdate,
    p2pProfileFetch,
    selectLoadingAbilities,
    selectP2PCurrenciesData,
    selectP2PPaymentUser,
    selectP2PPaymentUserCreateSuccess,
    selectP2PPaymentUserDeleteSuccess,
    selectP2PPaymentUserSingle,
    selectP2PPaymentUserUpdateSuccess,
    selectUserInfo,
} from 'src/modules';

import './P2PEditPaymentMethodMobileScreen.pcss';

interface Bank {
    payment_uid: string;
}

export const P2PEditPaymentMethodMobileScreen = () => {
    const { payment_user_uid = '' } = useParams<{payment_user_uid?: string}>();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const paymentMethods: any = useSelector(selectP2PPaymentUser);
    const deleteSuccess = useSelector(selectP2PPaymentUserDeleteSuccess);
    const currentPaymentData: any = useSelector(selectP2PPaymentUserSingle);
    const createPaymentSuccess = useSelector(selectP2PPaymentUserCreateSuccess);
    const editPaymentSuccess = useSelector(selectP2PPaymentUserUpdateSuccess);

    const [loading, setLoading] = React.useState(true);
    const [fiat, setFiat] = React.useState('IDR');
    const [bankData, setBankData] = React.useState<any>();
    const [editPaymentItem, setEditPaymentItem] = React.useState<any>();
    const [inputAccountNumberAutoFocus, setInputAccountNumberAutoFocus] = React.useState(true);
    const [inputOTPAutoFocus, setInputOTPAutoFocus] = React.useState(true);

    const [image, setImage] = React.useState<File | null>(null);
    const [fileName, setFileName] = React.useState('');
    const [otp_code, setOtpCode] = React.useState('');
    const [account_number, setAccountNumber] = React.useState('');
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const profiles = user.profiles.slice(-1);

    React.useEffect(() => {
        if (editPaymentSuccess) {
            history.push('/p2p/payment-method');
        }
    }, [editPaymentSuccess]);

    React.useEffect(() => {
        dispatch(P2PPaymentUserFetchSingle({payment_user_uid}));
        dispatch(p2pProfileFetch());
        setLoading(false);
    }, [dispatch, deleteSuccess]);
    
    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [dispatch, fiat]);

    React.useEffect(()=>{
        setAccountNumber(currentPaymentData[0]?.account_number)
    },[currentPaymentData])

    React.useEffect(() => {
        if (createPaymentSuccess) {
            history.push('/p2p/payment-method');
        }
    }, [createPaymentSuccess]);

    React.useEffect(() => {
        if (deleteSuccess) {
            history.push('/p2p/payment-method');
        }
    }, [deleteSuccess]);

    const handleChangeAccountNumber = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAccountNumber(value);
        setInputAccountNumberAutoFocus(true);
        setInputOTPAutoFocus(false);
    };
    const handleChangeOTP = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setOtpCode(value);
        setInputOTPAutoFocus(true);
        setInputAccountNumberAutoFocus(false);
    };

    const handleDeletePayment = (e) => {
        dispatch(
            p2pPaymentUserDelete({
                payment_id: e,
            })
        );
    };

    const handleEditPayment = () => {
        const formData = new FormData();
        formData.append('payment_id', payment_user_uid);
        formData.append('account_number', account_number);
        formData.append('qr_code', image);
        formData.append('full_name', profiles[0]?.first_name);
        formData.append('payment_method', editPaymentItem.symbol);
        formData.append('otp_code', otp_code);
        formData.append('qrcode', image);
        const payment_id = formData.get('payment_id').toString();
        dispatch(p2pPaymentUserUpdate(formData, payment_id));
    };

    const EwalletForm = () => {
        return (
            <form className="gap-8">
                <label className="mt-3 grey-text-accent">Full name</label>

                <input
                    readOnly
                    disabled
                    defaultValue={profiles[0]?.first_name}
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                />
                <label className="mt-3 grey-text-accent">Phone Number</label>
                <input
                    autoFocus={inputAccountNumberAutoFocus}
                    id="accountNumber"
                    name="accountNumber"
                    value={account_number}
                    onChange={(e) => handleChangeAccountNumber(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                />
                <label className="mt-3">QR Code (Optional)</label>
                <input
                    id="custom-input-file"
                    type="file"
                    // value={inputFile}
                    onChange={(e) => setImage(e.target.files[0])}
                    placeholder="Enter Full Name"
                    className="custom-input-add-payment w-100 white-text d-none"
                />
                <label
                    htmlFor="custom-input-file"
                    className="d-flex justify-content-center align-content-center custom-input-file cursor-pointer dark-bg-accent">
                    <div className="d-flex flex-column align-items-center justify-content-center my-3 radius-lg">
                        <QRIcon />
                        <p className="m-0 p-0 text-xxs grey-text">{fileName ? fileName : 'Upload'}</p>
                    </div>
                </label>
                <label className="mt-3 grey-text-accent">2FA Code</label>
                <input
                    autoFocus={inputOTPAutoFocus}
                    id="otp"
                    name="otp"
                    value={otp_code}
                    onChange={(e) => handleChangeOTP(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="2FA Code"
                />
                <div className="tips-add-payment d-flex align-items-center mt-3 p-16 gap-8 radius-sm mb-24">
                    <InfoWarningIcon />
                    <p className="m-0 p-0 grey-text-accent text-xxs ">
                        Tips : The added payment method will be shown to the buyer during the transaction to accept fiat
                        transfers. Please ensure that the information is correct, real, and matches your KYC Information
                        on Heaven.
                    </p>
                </div>
                <button
                    type="button"
                    // disabled={disabledButton()}
                    onClick={handleEditPayment}
                    className="btn-primary w-100">
                    Confirm
                </button>
            </form>
        );
    };

    const BankForm = () => {
        return (
            <form className="gap-8">
                <label className="mt-3 grey-text-accent">Full name</label>
                <input
                    defaultValue={profiles[0]?.first_name}
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                />
                <label className="mt-3 grey-text-accent">Account Number</label>
                <input
                    autoFocus={inputAccountNumberAutoFocus}
                    id="accountNumber"
                    name="accountNumber"
                    value={account_number}
                    onChange={(e) => handleChangeAccountNumber(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="Account Number"
                />
                <label className="mt-3 grey-text-accent">2FA Code</label>
                <input
                    autoFocus={inputOTPAutoFocus}
                    id="otp"
                    name="otp"
                    value={otp_code}
                    onChange={(e) => handleChangeOTP(e.target.value)}
                    type="number"
                    className="form-control"
                    placeholder="2FA Code"
                />
                <div className="tips-add-payment d-flex align-items-center mt-3 p-16 gap-8 radius-sm mb-24">
                    <InfoWarningIcon />
                    <p className="m-0 p-0 grey-text-accent text-xxs ">
                        Tips : The added payment method will be shown to the buyer during the transaction to accept fiat
                        transfers. Please ensure that the information is correct, real, and matches your KYC Information
                        on Heaven.
                    </p>
                </div>
                <button
                    type="button"
                    // disabled={disabledButton()}
                    onClick={handleEditPayment}
                    className="btn-primary w-100">
                    Confirm
                </button>
            </form>
        );
    };

    function renderPaymentForm() {
        switch (currentPaymentData[0]?.tipe) {
            case 'bank':
                return <BankForm />;
            case 'ewallet':
                return <EwalletForm />;
        }}

        const ModalDeleteConfirmation = ({ show }) => {
            return (
                <div id="off-canvas-filter" className={`position-fixed off-canvas-filter ${show ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-filter overflow-auto d-flex flex-column gap-16 items-align-center">
                        <BlueWarningIcon className="mx-auto" />
                        <span className="gradient-text text-center">Delete Payment Method</span>
                        <span className="grey-text-accent text-center">
                            Are you sure you want to delete this payment method?
                        </span>
                        <button onClick={() => handleDeletePayment(payment_user_uid)} className="btn-primary">
                            Delete
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="btn btn-reset grey-text-accent dark-bg-accent">
                            Cancel
                        </button>
                    </div>
                </div>
            );
        };

        return (
            <section className="pg-mobile-screen-p2p mobile-container position-relative">
                <div className="d-flex justify-content-between px-3 align-items-center mb-32">
                    <div onClick={() => history.goBack()}>
                        <ArrowLeft className={'cursor-pointer'} />
                    </div>
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Edit {editPaymentItem?.bank_name}</p>
                    <div onClick={() => setShowDeleteModal(true)}>
                        <TrashBinMobileIcon className={''} />
                    </div>
                </div>
                {renderPaymentForm()}
                <ModalDeleteConfirmation show={showDeleteModal} />
            </section>
        );
    }
;
