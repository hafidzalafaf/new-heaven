import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { CustomInput } from 'src/desktop/components';
import { ModalFullScreenMobile } from '../../components';
import Select from 'react-select';

import { DEFAULT_WALLET } from '../../../constants';
import { CustomStylesSelect } from '../../components';
import { validateBeneficiaryAddress } from '../../../helpers/validateBeneficiaryAddress';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import WAValidator from 'multicoin-address-validator';
import {
    beneficiariesCreate,
    selectCurrencies,
    selectWallets,
    Wallet,
    selectBeneficiariesCreateError,
    selectBeneficiariesCreate,
    selectBeneficiariesCreateLoading,
    alertPush,
} from '../../../modules';

export interface ModalBeneficiaryMobileProps {
    showModalAddBeneficiary: boolean;
    showModalBeneficiaryList?: boolean;
    onCloseAdd: () => void;
    onCloseList: () => void;
    handleAddAddress: () => void;
}

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
};

export const ModalAddBeneficiaryMobile: React.FC<ModalBeneficiaryMobileProps> = (props) => {
    const { currency = '' } = useParams<{ currency?: string }>();
    const dispatch = useDispatch();

    const currencies = useSelector(selectCurrencies);
    const wallets = useSelector(selectWallets);
    const errorCreate = useSelector(selectBeneficiariesCreateError);
    const createLoading = useSelector(selectBeneficiariesCreateLoading);
    const currencyItem = currencies.find((item) => item.id === currency);
    const isRipple = React.useMemo(() => currency === 'xrp' || currency === 'xlm', [currency]);

    const [showModalAddBeneficiary, setShowModalAddBeneficiary] = React.useState(props.showModalAddBeneficiary);

    const [coinAddress, setCoinAddress] = React.useState('');
    const [coinAddressValid, setCoinAddressValid] = React.useState(false);
    const [coinBlockchainName, setCoinBlockchainName] = React.useState(defaultSelected);
    const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState('');
    const [coinDescription, setCoinDescription] = React.useState('');
    const [coinDestinationTag, setCoinDestinationTag] = React.useState('');
    const [currencyID, setCurrencyID] = React.useState('');
    const [protocol, setProtocol] = React.useState('');

    const wallet: Wallet = wallets.find((item) => item.currency === currency) || DEFAULT_WALLET;
    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';
    const selectedFixed = (wallet || { fixed: 0 }).fixed;

    const handleClearModalsInputs = React.useCallback(() => {
        setCoinAddress('');
        setCoinBeneficiaryName('');
        setCoinBlockchainName(defaultSelected);
        setCoinDescription('');
        setCoinDestinationTag('');
    }, []);

    React.useEffect(() => {
        currencyItem.networks.map((item) => {
            if (item.blockchain_key == coinBlockchainName.blockchainKey) {
                if (item.parent_id) {
                    setCurrencyID(item.parent_id);
                } else {
                    setCurrencyID(item.currency_id);
                }
            }
        });
    }, [coinBlockchainName]);

    const validateCoinAddressFormat = React.useCallback(
        (value: string) => {
            const valid = WAValidator.validate(value, currencyID);
            setCoinAddressValid(valid);
        },
        [currencyID]
    );

    const handleChangeCoinAddress = (value: string) => {
        setCoinAddress(value);
        validateCoinAddressFormat(value);
    };

    const handleChangeBeneficiaryName = (value: string) => {
        setCoinBeneficiaryName(value);
    };

    const handleChangeCoinDescription = (value: string) => {
        setCoinDescription(value);
    };

    const handleChangeCoinDestinationTag = (value: string) => {
        setCoinDestinationTag(value);
    };

    const handleSubmitAddAddressCoinModal = React.useCallback(async () => {
        const filterCurrency = wallets.find((curr) => curr.currency == currency);
        const addressExist =
            filterCurrency && filterCurrency.deposit_addresses.find((item) => item.address == coinAddress);
        const payload = {
            currency: currency || '',
            name: coinBeneficiaryName,
            blockchain_key: coinBlockchainName.blockchainKey,
            data: JSON.stringify({
                address: isRipple && coinDestinationTag ? `${coinAddress}?dt=${coinDestinationTag}` : coinAddress,
            }),
            ...(coinDescription && { description: coinDescription }),
        };

        if (!addressExist) {
            if (isRipple && !coinDestinationTag) {
                dispatch(
                    alertPush({
                        message: [`Please insert destination tag. If its your own wallet, you can use random number`],
                        type: 'error',
                    })
                );
            } else {
                await dispatch(beneficiariesCreate(payload));
                handleClearModalsInputs();
                props.handleAddAddress();
            }
        } else {
            dispatch(alertPush({ message: [`You can't add your own beneficiary address`], type: 'error' }));
            setCoinAddress('');
            setCoinBlockchainName(defaultSelected);
            setCoinBeneficiaryName('');
            setCoinDescription('');
        }
    }, [coinAddress, coinBeneficiaryName, coinDescription, currency, coinBlockchainName, coinDestinationTag]);

    const isDisabled = !coinAddress || !coinBeneficiaryName || !coinAddressValid || !coinBlockchainName.blockchainKey;

    const enableWithdraw = currencyItem?.networks?.filter((item) => item.withdrawal_enabled == true);

    const optionNetworks = enableWithdraw?.map((item) => {
        const customLabel = (
            <div className="d-flex align-items-center cursor-pointer" onClick={() => setProtocol(item?.protocol)}>
                <p className="m-0 grey-text-accent text-sm">{item.protocol}</p>
            </div>
        );

        return {
            label: customLabel,
            value: item.blockchain_key,
        };
    });

    const renderHeaderModalBeneficiary = () => {
        return (
            <>
                <div className="pt-3">
                    <span onClick={() => props.onCloseAdd()} className="cursor-pointer white-text">
                        <ArrowLeft className="white-text" />
                    </span>
                </div>
                <div className="d-flex mt-2 justify-content-between align-items-center transfer-head-container">
                    <h1 className="navbar-brand white-text">Withdraw Crypto</h1>
                </div>
            </>
        );
    };

    const renderContentModalBeneficiary = () => {
        return (
            <>
                <form>
                    <div className="align-items-start">
                        <p className="text-sm white-text mb-8">
                            Select Networks <span className="danger-text">*</span>
                        </p>
                        <Select
                            styles={CustomStylesSelect}
                            options={optionNetworks}
                            value={optionNetworks.filter(function (option) {
                                return option.value === coinBlockchainName.blockchainKey;
                            })}
                            onChange={(e) => setCoinBlockchainName({ ...coinBlockchainName, blockchainKey: e.value })}
                        />
                    </div>

                    <div className="align-items-start">
                        <label className="text-sm white-text">
                            Blockchain Address <span className="danger-text">*</span>
                        </label>
                        <div className="input-amount">
                            <div>
                                <CustomInput
                                    type="text"
                                    label=""
                                    placeholder={'Input Blockchain Address'}
                                    defaultLabel=""
                                    handleChangeInput={handleChangeCoinAddress}
                                    inputValue={coinAddress}
                                    classNameLabel="d-none"
                                    classNameInput={`dark-bg-accent`}
                                    autoFocus={false}
                                    labelVisible={false}
                                />
                                <div className="mb-3">
                                    {coinAddress != '' && !coinAddressValid && (
                                        <span className="text-xs danger-text">Invalid Address</span>
                                    )}
                                </div>
                                {protocol && (
                                    <p className="text-xs grey-text ">
                                        Do not send <strong className="gradient-text">{currency?.toUpperCase()}</strong>{' '}
                                        unless you are certain the destination supports{' '}
                                        <strong className="gradient-text">{protocol?.toUpperCase()}</strong>{' '}
                                        transactions. If it does not, you could permanently lose access to your coins.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {isRipple && (
                        <div className="align-items-start">
                            <label className="text-sm white-text">
                                {currency == 'xrp' ? 'Destination Tag' : 'Memo'}
                            </label>
                            <div className="input-amount">
                                <div>
                                    <CustomInput
                                        type="text"
                                        label=""
                                        placeholder={`Input ${currency == 'xrp' ? 'Destination Tag' : 'Memo'} `}
                                        defaultLabel=""
                                        handleChangeInput={handleChangeCoinDestinationTag}
                                        inputValue={coinDestinationTag}
                                        classNameLabel="d-none"
                                        classNameInput={`dark-bg-accent`}
                                        autoFocus={false}
                                        labelVisible={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="align-items-start">
                        <label className="text-sm white-text">
                            Beneficiary Name <span className="danger-text">*</span>
                        </label>
                        <div className="input-amount">
                            <div>
                                <CustomInput
                                    type="text"
                                    label=""
                                    placeholder={'Input Beneficiary Name'}
                                    defaultLabel=""
                                    handleChangeInput={handleChangeBeneficiaryName}
                                    inputValue={coinBeneficiaryName}
                                    classNameLabel="d-none"
                                    classNameInput={`dark-bg-accent`}
                                    autoFocus={false}
                                    labelVisible={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="align-items-start">
                        <label className="text-sm white-text">Description (Optional)</label>
                        <div className="input-amount">
                            <div>
                                <CustomInput
                                    type="textarea"
                                    label=""
                                    placeholder={'Input Description'}
                                    defaultLabel=""
                                    handleChangeInput={handleChangeCoinDescription}
                                    inputValue={coinDescription}
                                    classNameLabel="d-none"
                                    classNameInput={`dark-bg-accent`}
                                    autoFocus={false}
                                    labelVisible={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="py-3">
                        <button
                            disabled={isDisabled}
                            onClick={handleSubmitAddAddressCoinModal}
                            type="button"
                            className="btn btn-primary btn-block btn-lg">
                            Save Address
                        </button>
                    </div>
                </form>
            </>
        );
    };

    return (
        <>
            {showModalAddBeneficiary && (
                <ModalFullScreenMobile
                    show={showModalAddBeneficiary}
                    header={renderHeaderModalBeneficiary()}
                    content={renderContentModalBeneficiary()}
                />
            )}
        </>
    );
};
