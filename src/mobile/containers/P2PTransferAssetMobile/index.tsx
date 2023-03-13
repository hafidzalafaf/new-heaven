import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import { SwitchMobileIcon } from 'src/mobile/assets/P2PMobileIcon';
import { createP2PTransfersFetch, selectP2PTransfersCreateSuccess, selectP2PTransfersCreateLoading } from 'src/modules';
import Select from 'react-select';
import { CustomStyleSelectP2PTransfer } from './CustomStyleSelectP2PTransfer';
import { PercentageTransferP2P } from 'src/desktop/components';

export interface P2PTransferAssetMobileProps {
    handleShowTransfer: () => void;
    wallet: any;
}

export const P2PTransferAssetMobile: React.FunctionComponent<P2PTransferAssetMobileProps> = (props) => {
    const { handleShowTransfer, wallet } = props;

    const dispatch = useDispatch();
    const transferSuccess = useSelector(selectP2PTransfersCreateSuccess);
    const transferLoading = useSelector(selectP2PTransfersCreateLoading);

    const [amount, setAmount] = React.useState('');
    const [currency, setCurrency] = React.useState('');
    const [base_wallet, setBaseWallet] = React.useState('p2p');
    const [target_wallet, setTargetWallet] = React.useState('spot');
    const [percentageValue, setPercentage] = React.useState(0);
    const [isSwitch, setIsSwitch] = React.useState(false);
    const [otp, setOtp] = React.useState('');

    React.useEffect(() => {
        if (transferSuccess) {
            setAmount('');
            setCurrency('');
            setBaseWallet('p2p');
            setTargetWallet('spot');
            setOtp('');
        }
    }, [transferSuccess]);

    const switchAddress = () => {
        setBaseWallet(target_wallet);
        setTargetWallet(base_wallet);
        setIsSwitch((prevState) => !prevState);
    };

    const handleChangeAmount = (e: string) => {
        const value = e.replace(/[^0-9\.]/g, '');
        setAmount(value);
        setPercentage(0);
    };

    const handleTransferAsset = () => {
        const payload = {
            base_wallet,
            target_wallet,
            currency: wallet?.currency,
            amount: +amount,
            otp_code: otp,
        };

        dispatch(createP2PTransfersFetch(payload));
    };

    React.useEffect(() => {
        if (percentageValue != 0) {
            const p2pAmount = (+wallet?.p2p_balance * percentageValue) / 100;
            const spotAmount = (+wallet?.spotBalance * percentageValue) / 100;
            setAmount(base_wallet === 'p2p' ? p2pAmount.toString() : spotAmount.toString());
        }
    }, [percentageValue, switchAddress]);

    const disabledButton = () => {
        if (transferLoading || otp?.length < 6) {
            return true;
        }

        if (base_wallet == 'p2p') {
            if (+amount < 0 || +amount > +wallet?.p2p_balance) {
                return true;
            }
        }

        if (base_wallet == 'spot') {
            if (+amount < 0 || +amount > +wallet?.balance) {
                return true;
            }
        }

        if (base_wallet === target_wallet) {
            return true;
        }
    };

    const optionsAssets = [
        {
            value: 'p2p',
            label: <p className="m-0 p-0 grey-text text-sm">P2P</p>,
        },
        {
            value: 'spot',
            label: <p className="m-0 p-0 grey-text text-sm">Spot</p>,
        },
    ];

    return (
        <div className="w-100 p2p-com-transfer-mobile position-relative">
            <div className="position-fixed nav-transfer-info-top dark-bg-main">
                <div className="d-flex justify-content-center align-items-center position-relative mb-40 w-100">
                    <div className="d-flex align-items-center gap-8">
                        <p className="m-0 p-0 text-md font-extrabold grey-text-accent">Transfer</p>

                        <span onClick={handleShowTransfer} className="transfer-close position-absolute cursor-pointer">
                            <ArrowLeft className={''} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="tranfer-content-form-container">
                <div className="transfer-form-container w-100 mb-16">
                    <div className="w-100">
                        <Select
                            isSearchable={false}
                            styles={CustomStyleSelectP2PTransfer}
                            value={optionsAssets.filter(function (option) {
                                return option.value === base_wallet;
                            })}
                            onChange={(e) => setBaseWallet(e.value)}
                            options={optionsAssets}
                        />
                    </div>

                    <div
                        onClick={switchAddress}
                        className="d-flex justify-content-center align-items-center cursor-pointer">
                        <SwitchMobileIcon />
                    </div>

                    <div className="w-100">
                        <Select
                            isSearchable={false}
                            styles={CustomStyleSelectP2PTransfer}
                            value={optionsAssets.filter(function (option) {
                                return option.value === target_wallet;
                            })}
                            onChange={(e) => setTargetWallet(e.value)}
                            options={optionsAssets}
                        />
                    </div>
                </div>

                <div className="transfer-form-container w-100 mb-16">
                    <div>
                        <label className="m-0 p-0 grey-text-accent text-sm font-bold mb-16">Coin</label>
                        <div className="coin-container d-flex align-items-center gap-8">
                            <img src={wallet?.logo_url} alt={wallet?.id} height={24} width={24} />

                            <p className="m-0 p-0 grey-text text-sm">{wallet?.currency?.toUpperCase()}</p>
                        </div>
                    </div>

                    {base_wallet == 'p2p' && wallet?.p2p_balance < 0 && (
                        <p className="m-0 p-0 grey-text text-xxs">
                            No amount available to transfer, please select another coin.
                        </p>
                    )}

                    {base_wallet == 'spot' && wallet?.balance < 0 && (
                        <p className="m-0 p-0 grey-text text-xxs">
                            No amount available to transfer, please select another coin.
                        </p>
                    )}

                    <div>
                        <label className="m-0 p-0 grey-text-accent text-sm font-bold mb-16">Amount</label>
                        <input
                            value={amount}
                            onChange={(e) => handleChangeAmount(e.target.value)}
                            type="number"
                            placeholder="Enter Amount"
                            id="exampleFormControlInput1"
                            className="input-transfer w-100 white-text text-sm"
                        />
                    </div>

                    <div>
                        <PercentageTransferP2P
                            orderPercentage={percentageValue}
                            handleSelectPercentage={(e) => {
                                setPercentage(e);
                                if (e == 0) {
                                    setAmount('0');
                                }
                            }}
                            label0="0"
                            label25="25"
                            label50="50"
                            label75="75"
                            label100="100"
                        />
                    </div>

                    <div>
                        <label className="m-0 p-0 grey-text-accent text-sm font-bold mb-16">2FA Code</label>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="number"
                            placeholder="Enter 2FA Code"
                            className="input-transfer w-100 white-text text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bottom-nav-create-transfer">
                <button
                    type="button"
                    disabled={disabledButton()}
                    onClick={handleTransferAsset}
                    className="btn-primary w-100 white-text text-ms font-normal">
                    Confirm Transfer
                </button>
            </div>
        </div>
    );
};
