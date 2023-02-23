import React from 'react';
import { useIntl } from 'react-intl';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { CustomInput } from 'src/desktop/components';
import {
    selectCurrencies,
    Currency,
    createInternalTransfersFetch,
    selectInternalTransfersCreateSuccess,
} from '../../../modules';
import { KeyConfirmation } from 'src/mobile/assets/KeyConfirmation';
import { ArrowLeft } from 'src/mobile/assets/Arrow';

const InternalTransferMobileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();
    const [amount, setAmount] = React.useState('');
    const [uid, setUid] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const transferSuccess = useSelector(selectInternalTransfersCreateSuccess);

    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency = currencies.find((item) => item.id === currency);
    const [showModalConfirmation, setShowModalConfirmation] = React.useState(false);

    const handleChangeAmount = (value) => {
        const data = value.replace(/[^0-9\.]/g, '');
        setAmount(data);
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
            setShowModalConfirmation(false);
        }
    }, [transferSuccess]);

    return (
        <section className="internal-transfer-mobile-screen pb-5 dark-bg-main">
            <div className="container-fluid inside-internal-transfer w-100 h-100">
                <div className="pt-5 pb-3">
                    <Link to="/wallets">
                        <ArrowLeft className="white-text" />
                    </Link>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 transfer-head-container">
                    <h1 className="navbar-brand p-0 m-0 white-text">
                        {formatMessage({ id: 'page.mobile.internalTransfer.header' })}
                    </h1>
                </div>

                <form className="form-transfer">
                    <div className="d-flex flex-column justify-content-between align-items-start">
                        <p className="text-sm white-text mb-1">
                            {formatMessage({ id: 'page.mobile.internalTransfer.coins' })}
                        </p>
                        <div className="w-100 d-flex align-items-center coin-selected">
                            <img
                                src={
                                    currencyItem?.icon_url !== '-' &&
                                    currencyItem?.icon_url !== null &&
                                    currencyItem?.icon_url !== 'null'
                                        ? currencyItem?.icon_url
                                        : '/img/dummycoin.png'
                                }
                                alt="icon"
                                className="mr-12 small-coin-icon"
                            />
                            <div>
                                <p className="m-0 text-sm grey-text-accent">
                                    {currencyItem && currencyItem.id.toUpperCase()}
                                </p>
                                <p className="m-0 text-xs grey-text-accent">{currencyItem && currencyItem.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="transfer-information mt-3 mb-3">
                        <div className="transfer-value">
                            <div className="mb-3">
                                <CustomInput
                                    type="text"
                                    label={formatMessage({ id: 'page.mobile.internalTransfer.inputAmount' })}
                                    placeholder={'0.00000000'}
                                    defaultLabel={formatMessage({ id: 'page.mobile.internalTransfer.inputAmount' })}
                                    handleChangeInput={handleChangeAmount}
                                    inputValue={amount}
                                    classNameLabel="text-ms white-text mb-8"
                                    classNameInput={`d-block dark-bg-accent m-0`}
                                    autoFocus={false}
                                    labelVisible
                                />
                            </div>
                        </div>
                    </div>
                    <div className="transfer-information mb-3">
                        <div className="transfer-shipper">
                            <div className="mb-3">
                                <CustomInput
                                    type="text"
                                    label={formatMessage({ id: 'page.mobile.internalTransfer.inputUID' })}
                                    placeholder={formatMessage({ id: 'page.mobile.internalTransfer.inputUID' })}
                                    defaultLabel={''}
                                    handleChangeInput={handleChangeUid}
                                    inputValue={uid}
                                    classNameLabel="text-ms white-text mb-8"
                                    classNameInput={`dark-bg-accent d-block m-0`}
                                    autoFocus={false}
                                    labelVisible
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="m-0 mb-2">
                            {formatMessage({ id: 'page.mobile.internalTransfer.label2FA' })}
                        </label>
                        <CustomInput
                            type="text"
                            label={''}
                            placeholder={formatMessage({ id: 'page.mobile.internalTransfer.placholder2FA' })}
                            defaultLabel={''}
                            handleChangeInput={handleChangeOtp}
                            inputValue={otp}
                            classNameLabel="text-ms white-text d-none"
                            classNameInput={`dark-bg-accent m-0`}
                            autoFocus={false}
                            labelVisible
                        />
                    </div>

                    {/* ===== Trigger modal confirmation for transfer ====== */}
                    <Button
                        onClick={() => {
                            setShowModalConfirmation(!showModalConfirmation);
                        }}
                        disabled={disableButton()}
                        block
                        size="lg"
                        variant="primary">
                        {formatMessage({ id: 'page.mobile.internalTransfer.continue' })}
                    </Button>
                </form>

                {/* ========= Modal confirmation for Internal Transfer ====== */}
                <Modal show={showModalConfirmation} onHide={() => setShowModalConfirmation(!showModalConfirmation)}>
                    <div className="container p-3 text-center">
                        <div className="d-flex mb-2 justify-content-center">
                            <KeyConfirmation />
                        </div>
                        <p className="gradient-text font-weight-bold mb-2">
                            {formatMessage({ id: 'page.mobile.internalTransfer.modal.confirm' })}
                        </p>
                        <div className="">
                            <p className="text-sm text-secondary">
                                {formatMessage({ id: 'page.mobile.internalTransfer.modal.confirmMessage1' })} {amount}{' '}
                                {currency.toUpperCase()}{' '}
                                {formatMessage({ id: 'page.mobile.internalTransfer.modal.confirmMessage2' })}
                            </p>
                        </div>
                        <div className="">
                            <button className="btn btn-primary btn-lg btn-block" onClick={handleCreateTransfer}>
                                {formatMessage({ id: 'page.mobile.internalTransfer.continue' })}
                            </button>
                            <button
                                onClick={() => setShowModalConfirmation(!showModalConfirmation)}
                                className="btn btn-outline-danger btn-block">
                                {formatMessage({ id: 'page.mobile.internalTransfer.cancel' })}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </section>
    );
};

export { InternalTransferMobileScreen };
