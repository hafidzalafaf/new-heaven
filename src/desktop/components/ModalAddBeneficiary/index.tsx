import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import './ModalAddBeneficiary.pcss';
import { CircleCloseIcon } from 'src/assets/images/CircleCloseIcon';
import { validateBeneficiaryAddress } from '../../../helpers/validateBeneficiaryAddress';
import { DEFAULT_WALLET } from '../../../constants';
import { Modal, CustomInput } from '..';
import { CustomStylesSelect } from '../../components';
import { Decimal } from '../../../components';
import '../../../styles/colors.pcss';
import { useWalletsFetch } from '../../../hooks';
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
import Select from 'react-select';

export interface ModalAddBeneficiaryProps {
    showModalAddBeneficiary: boolean;
    showModalBeneficiaryList?: boolean;
    onCloseAdd: () => void;
    onCloseList: () => void;
    handleAddAddress: () => void;
    currency_id: string;
}

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
};

export const ModalAddBeneficiary: React.FunctionComponent<ModalAddBeneficiaryProps> = (props) => {
    useWalletsFetch();
    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();

    const currencies = useSelector(selectCurrencies);
    const wallets = useSelector(selectWallets);
    const errorCreate = useSelector(selectBeneficiariesCreateError);
    const createLoading = useSelector(selectBeneficiariesCreateLoading);
    const currencyItem = currencies.find((item) => item.id === currency);
    const isRipple = React.useMemo(() => currency === 'xrp', [currency]);

    const [showModalAddBeneficiary, setShowModalAddBeneficiary] = React.useState(props.showModalAddBeneficiary);
    const [showModalBeneficiaryList, setShowModalBeneficiaryList] = React.useState(props.showModalBeneficiaryList);
    const [coinAddress, setCoinAddress] = React.useState('');
    const [coinAddressValid, setCoinAddressValid] = React.useState(false);
    const [coinBlockchainName, setCoinBlockchainName] = React.useState(defaultSelected);
    const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState('');
    const [coinDescription, setCoinDescription] = React.useState('');
    const [coinDestinationTag, setCoinDestinationTag] = React.useState('');
    const [currencyID, setCurrencyID] = React.useState('');
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
            await dispatch(beneficiariesCreate(payload));
            handleClearModalsInputs();
            props.handleAddAddress();
        } else {
            dispatch(alertPush({ message: [`You can't add your own beneficiary address`], type: 'error' }));
            setCoinAddress('');
            setCoinBlockchainName(defaultSelected);
            setCoinBeneficiaryName('');
            setCoinDescription('');
        }
    }, [coinAddress, coinBeneficiaryName, coinDescription, currency, coinBlockchainName, errorCreate, createLoading]);

    const isDisabled = !coinAddress || !coinBeneficiaryName || !coinAddressValid || !coinBlockchainName.blockchainKey;

    const optionNetworks =
        currencyItem &&
        currencyItem.networks.map((item) => {
            const customLabel = (
                <div className="d-flex align-items-center">
                    <p className="m-0 grey-text-accent text-sm">{item.blockchain_key}</p>
                </div>
            );
            return {
                label: customLabel,
                value: item.blockchain_key,
            };
        });

    const renderHeaderModalAddBeneficiary = () => {
        return (
            <React.Fragment>
                <div
                    className="com-modal-add-beneficiary-header
                 d-flex justify-content-between align-items-center w-100">
                    <h6 className="text-xl font-bold white-text mb-0">Withdraw Crypto</h6>
                    <span onClick={() => props.onCloseAdd()} className="cursor-pointer">
                        <CircleCloseIcon />
                    </span>
                </div>
            </React.Fragment>
        );
    };
    // ketika gagal add hanya tampilkan error saja, modal tidak tampil
    const renderContentModalAddBeneficiary = () => {
        return (
            <React.Fragment>
                <div className="com-modal-add-beneficiary-content mb-24">
                    <div className="body mb-24">
                        <div className="py-3 px-3 mb-3 dark-bg-main radius-md d-flex justify-content-between">
                            <div className="mr-2">
                                <p className="mb-2 text-sm white-text">Available</p>
                            </div>
                            <div className="ml-2">
                                <p className="mb-2 text-sm grey-text text-right">
                                    <Decimal fixed={selectedFixed} thousSep=",">
                                        {balance}
                                    </Decimal>{' '}
                                    {currency.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form>
                        <div>
                            <p className="text-ms white-text mb-8">Select Networks</p>
                            <Select
                                styles={CustomStylesSelect}
                                options={optionNetworks}
                                value={optionNetworks.filter(function (option) {
                                    return option.value === coinBlockchainName.blockchainKey;
                                })}
                                onChange={(e) =>
                                    setCoinBlockchainName({ ...coinBlockchainName, blockchainKey: e.value })
                                }
                            />
                        </div>
                        <div>
                            <CustomInput
                                type="text"
                                label={'Blockchain Address'}
                                placeholder={'Input Address'}
                                defaultLabel={'Blockchain Address'}
                                handleChangeInput={handleChangeCoinAddress}
                                inputValue={coinAddress}
                                classNameLabel="text-ms white-text mb-8"
                                classNameInput={``}
                                autoFocus={false}
                                classNameGroup={'mb-1'}
                                labelVisible
                            />
                            <div className="mb-3">
                                {coinAddress != '' && !coinAddressValid && (
                                    <span className="text-xs danger-text">Invalid Address</span>
                                )}
                            </div>
                            <p className="mb-16 text-xs grey-text ">
                                Do not send Tether USD unless you are certain the destination supports TRC-20
                                transactions. If it does not, you could permanently lose access to your coins.
                            </p>
                        </div>

                        <div>
                            <CustomInput
                                type="text"
                                label={'Beneficiary Name'}
                                placeholder={'Input Name'}
                                defaultLabel={'Beneficiary Name'}
                                handleChangeInput={handleChangeBeneficiaryName}
                                inputValue={coinBeneficiaryName}
                                classNameLabel="text-ms white-text mb-8"
                                classNameInput={``}
                                autoFocus={false}
                                labelVisible
                            />
                        </div>
                        <div>
                            <CustomInput
                                type="textarea"
                                label={'Description (Optional)'}
                                placeholder={'Input Description'}
                                defaultLabel={'Description (Optional)'}
                                handleChangeInput={handleChangeCoinDescription}
                                inputValue={coinDescription}
                                classNameLabel="text-ms white-text mb-8"
                                classNameInput={``}
                                autoFocus={false}
                                labelVisible
                            />
                        </div>

                        <button
                            disabled={isDisabled}
                            onClick={handleSubmitAddAddressCoinModal}
                            type="button"
                            className="btn btn-primary btn-block">
                            Save Address
                        </button>
                    </form>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {showModalAddBeneficiary && (
                <Modal
                    show={showModalAddBeneficiary}
                    header={renderHeaderModalAddBeneficiary()}
                    content={renderContentModalAddBeneficiary()}
                />
            )}
        </React.Fragment>
    );
};
