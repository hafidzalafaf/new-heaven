import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import './ModalInternalTransfer.pcss';
import { Modal, CustomInput } from '../../components';
import { Decimal } from '../../../components';
import { CircleCloseIcon } from '../../../assets/images/CircleCloseIcon';
import {
    selectCurrencies,
    Currency,
    createInternalTransfersFetch,
    selectInternalTransfersCreateSuccess,
    selectWallets,
    selectUserInfo,
} from '../../../modules';

export interface ModalTransferShowProps {
    showModalTransfer: boolean;
    onClose: () => void;
}

export const ModalInternalTransfer: React.FunctionComponent<ModalTransferShowProps> = (props) => {
    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const { currency = '' } = useParams<{ currency?: string }>();

    const wallets = useSelector(selectWallets);
    const user = useSelector(selectUserInfo);
    const transferSuccess = useSelector(selectInternalTransfersCreateSuccess);

    const [showModalTransfer, setShowModalTransfer] = React.useState(props.showModalTransfer);
    const [showModalTransferConfirmation, setShowModalTransferConfirmation] = React.useState(false);

    const [amount, setAmount] = React.useState('');
    const [uid, setUid] = React.useState('');
    const [otp, setOtp] = React.useState('');

    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency = currencies.find((item) => item.id === currency);
    const wallet = wallets.length && wallets.find((item) => item.currency.toLowerCase() === currency.toLowerCase());
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';
    const selectedFixed = (wallet || { fixed: 0 }).fixed;

    const handleChangeAmount = (e) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmount(value);
    };

    const handleChangeOtp = (value) => {
        setOtp(value);
    };

    const handleChangeUid = (value) => {
        setUid(value);
    };

    const disableButton = () => {
        if (amount === '' || uid === '' || otp === '' || otp.length < 6) {
            return true;
        }
    };

    const handleCreateTransfer = () => {
        const payload = {
            currency: currency.toLowerCase(),
            username_or_uid: uid,
            amount,
            otp,
        };

        dispatch(createInternalTransfersFetch(payload));
    };

    React.useEffect(() => {
        if (transferSuccess) {
            setShowModalTransferConfirmation(false);
            props.onClose;
        }
    }, [transferSuccess]);

    const renderHeaderModalTransfer = () => {
        return (
            <React.Fragment>
                <div
                    className="com-modal-transfer-header
                 d-flex justify-content-between align-items-center">
                    <h6 className="text-xl font-bold white-text mb-0">Transfer Internal</h6>
                    <span onClick={props.onClose} className="cursor-pointer">
                        <CircleCloseIcon />
                    </span>
                </div>
            </React.Fragment>
        );
    };

    const renderContentModalTransfer = () => {
        return (
            <React.Fragment>
                <div className="body mb-24">
                    {user.otp ? (
                        <React.Fragment>
                            <p className="text-ms white-text mb-24">Send Assets to another member</p>
                            <div className="form">
                                <div className="mb-24">
                                    <CustomInput
                                        type="text"
                                        label={'Enter a valid UID of a user you want to transfer money'}
                                        placeholder={'Enter UID'}
                                        defaultLabel={'Enter a valid UID of a user you want to transfer money'}
                                        handleChangeInput={handleChangeUid}
                                        inputValue={uid}
                                        classNameLabel="text-ms white-text mb-8"
                                        classNameInput={`dark-bg-accent`}
                                        autoFocus={false}
                                        labelVisible
                                    />
                                </div>

                                <div className="d-flex flex-column justify-content-between align-items-start mb-24">
                                    <p className="text-ms white-text mb-8">Coins</p>

                                    <div className="w-100 d-flex align-items-center coin-selected">
                                        <img
                                            src={currencyItem && currencyItem.icon_url}
                                            alt="icon"
                                            className="mr-12 small-coin-icon"
                                        />
                                        <div>
                                            <p className="m-0 text-sm grey-text-accent">
                                                {currencyItem && currencyItem.id.toUpperCase()}
                                            </p>
                                            <p className="m-0 text-xs grey-text-accent">
                                                {currencyItem && currencyItem.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <CustomInput
                                        type="text"
                                        label={'Input Amount to send'}
                                        placeholder={'Input Amount'}
                                        defaultLabel={'Input Amount to send'}
                                        handleChangeInput={handleChangeAmount}
                                        inputValue={amount}
                                        classNameLabel="text-ms white-text mb-8"
                                        classNameInput={`dark-bg-accent`}
                                        autoFocus={false}
                                        labelVisible
                                    />
                                </div>

                                <div className="py-3 px-3 mb-3 dark-bg-main radius-md d-flex justify-content-between">
                                    <div className="mr-2">
                                        <p className="mb-2 text-sm white-text">Available</p>
                                    </div>
                                    <div className="ml-2">
                                        <p className="mb-2 text-sm grey-text">
                                            <Decimal fixed={selectedFixed} thousSep=",">
                                                {balance}
                                            </Decimal>{' '}
                                            {currency.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <CustomInput
                                        type="text"
                                        label={'Enter 2FA Code'}
                                        placeholder={'2FA Code'}
                                        defaultLabel={'Enter 2FA Code'}
                                        handleChangeInput={handleChangeOtp}
                                        inputValue={otp}
                                        classNameLabel="text-ms white-text mb-8"
                                        classNameInput={`dark-bg-accent`}
                                        autoFocus={false}
                                        labelVisible
                                    />
                                </div>

                                <button
                                    disabled={disableButton()}
                                    onClick={() => {
                                        setShowModalTransfer(false);
                                        setShowModalTransferConfirmation(true);
                                    }}
                                    type="button"
                                    className="btn btn-primary btn-block">
                                    Continue
                                </button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <p className="mt-4  warning-text font-semibold text-md">
                            Please enable Two-Factor Authentication
                        </p>
                    )}
                </div>
            </React.Fragment>
        );
    };

    const renderHeaderModalTransferConfirmation = () => {
        return (
            <React.Fragment>
                <h6 className="text-md white-text font-semibold mb-0">Transfer Confirmation</h6>
            </React.Fragment>
        );
    };

    const renderContentModalTransferConfirmation = () => {
        return (
            <React.Fragment>
                <p className="text-ms grey-text-accent font-semibold mb-24">
                    Are you sure to transfer {amount} {currency.toUpperCase()} to another User? Please check UID of user
                    you want to transfer
                </p>
                <div className="d-flex">
                    <button
                        className="btn btn-danger sm px-5 mr-3"
                        onClick={() => setShowModalTransferConfirmation(!showModalTransferConfirmation)}>
                        Cancel
                    </button>
                    <button className="btn btn-success sm px-5" onClick={handleCreateTransfer}>
                        Continue
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Modal
                show={showModalTransfer}
                header={renderHeaderModalTransfer()}
                content={renderContentModalTransfer()}
            />

            {showModalTransferConfirmation && (
                <Modal
                    show={showModalTransferConfirmation}
                    header={renderHeaderModalTransferConfirmation()}
                    content={renderContentModalTransferConfirmation()}
                />
            )}
        </React.Fragment>
    );
};
