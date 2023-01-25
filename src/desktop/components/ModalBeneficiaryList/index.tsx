import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Modal } from '../../components';
import { Decimal } from '../../../components';
import { DEFAULT_WALLET } from '../../../constants';
import { CircleCloseIcon } from '../../../assets/images/CircleCloseIcon';
import {
    selectCurrencies,
    selectBeneficiaries,
    Beneficiary,
    Currency,
    BlockchainCurrencies,
    selectWallets,
    Wallet,
    beneficiariesDelete,
    selectBeneficiariesDeleteSuccess,
} from '../../../modules';
import './ModalBeneficiaryList.pcss';
import { TrashIcon } from '../../../assets/images/TrashIcon';

export interface ModalBeneficiaryListProps {
    showModalBeneficiaryList: boolean;
    showModalAddBeneficiary?: boolean;
    blockchainKey?: string;
    onCloseList: () => void;
    onCloseAdd: () => void;
    handleAddAddress: () => void;
    handlePendingStatus?: (id: number) => void;
    handleDelete?: () => void;
    beneficiaryId?: string;
    handleChangeBeneficiaryId?: (id: number, address: string, blockchainKey: string, currency_id: string) => void;
}

export const ModalBeneficiaryList: React.FunctionComponent<ModalBeneficiaryListProps> = (props) => {
    const [showModalBeneficiaryList, setShowModalBeneficiaryList] = React.useState(props.showModalBeneficiaryList);
    const [showModalAddBeneficiary, setShowModalAddBeneficiary] = React.useState(props.showModalBeneficiaryList);

    const { currency = '' } = useParams<{ currency?: string }>();
    const dispatch = useDispatch();

    const currencies = useSelector(selectCurrencies);
    const wallets = useSelector(selectWallets);
    const [showModalCancel, setShowModalCancel] = React.useState(false);
    const [deleteRowId, setDeleteRowId] = React.useState<Beneficiary>();
    const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);
    const beneficiariesDeleteSuccess = useSelector(selectBeneficiariesDeleteSuccess);
    const currencyItem: Currency = currencies.find((item) => item.id === currency);
    const blockchainItem: BlockchainCurrencies = currencyItem?.networks.find(
        (item) => item.blockchain_key === props.blockchainKey
    );
    const estimatedValueFee = +currencyItem?.price * +blockchainItem?.withdraw_fee;

    const beneficiariesList = beneficiaries.filter((item) => item.currency === currency);

    const wallet: Wallet = wallets.find((item) => item.currency === currency) || DEFAULT_WALLET;

    const balance = wallet && wallet.balance ? wallet.balance.toString() : '0';
    const selectedFixed = (wallet || { fixed: 0 }).fixed;

    const handleDeleteAddress = React.useCallback(
        (item: Beneficiary) => () => {
            dispatch(beneficiariesDelete({ id: item.id }));
            props.handleDelete();
            setShowModalCancel(false);
        },
        []
    );

    const renderHeaderBeneficiaryList = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-between align-items-center w-100 min-w-500">
                    <h6 className="text-md font-normal white-text mb-0">Select Form Address Book</h6>
                    <span onClick={() => props.onCloseList()} className="cursor-pointer">
                        <CircleCloseIcon />
                    </span>
                </div>
            </React.Fragment>
        );
    };

    const renderModalDeleteRow = () => (
        <React.Fragment>
            <h6 className="text-md white-text font-semibold mb-24  text-center">Are you sure to Delete Address?</h6>
            <p className="text-sm grey-text-accent m-0 p-0 mb-24  text-center">
                The beneficiary address will be deleted
            </p>
            <div className="d-flex  justify-content-center">
                <button className="btn btn-danger sm px-5 mr-3" onClick={() => setShowModalCancel(false)}>
                    Close
                </button>
                <button onClick={handleDeleteAddress(deleteRowId)} type="button" className="btn btn-primary sm px-5">
                    Confirm
                </button>
            </div>
        </React.Fragment>
    );

    const renderContentBeneficiaryList = () => {
        return (
            <React.Fragment>
                <div className="body mb-24 w-100">
                    <div className="py-3 px-3 mb-3 dark-bg-main radius-md d-flex justify-content-between">
                        <div className="mr-2">
                            <p className="mb-2 text-sm white-text">Available</p>
                        </div>
                        <div className="ml-2">
                            <p className="mb-2 text-sm grey-text text-right">
                                {' '}
                                <Decimal fixed={selectedFixed} thousSep=",">
                                    {balance}
                                </Decimal>{' '}
                                {currency.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <table className="w-100">
                        <thead>
                            <th className="text-ms white-text mb-1 pr-2">Address</th>
                            <th className="text-ms white-text mb-1 pr-2">Name</th>
                            <th className="text-ms white-text mb-1 pr-2">Status</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {!beneficiariesList[0] ? (
                                <tr>
                                    <td rowSpan={4}>No address yet</td>
                                </tr>
                            ) : (
                                beneficiariesList.map((el, i) => (
                                    <tr key={i}>
                                        <td
                                            onClick={() => {
                                                var currency_id: string;
                                                if (el.state === 'pending') {
                                                    props.handlePendingStatus(el.id);
                                                } else {
                                                    currencyItem.networks.map((item) => {
                                                        if (item.blockchain_key == el.blockchain_key) {
                                                            if (item.parent_id) {
                                                                currency_id = item.parent_id;
                                                            } else {
                                                                currency_id = item.currency_id;
                                                            }
                                                        }
                                                    });
                                                    props.handleChangeBeneficiaryId(
                                                        el.id,
                                                        el.data.address,
                                                        el.blockchain_key,
                                                        currency_id
                                                    );
                                                }
                                            }}
                                            className="text-sm grey-text-accent pr-2 cursor-pointer">
                                            {el && el.data && el.data.address}
                                        </td>
                                        <td className="text-sm grey-text-accent pr-2">{el && el.name}</td>
                                        <td
                                            className={`text-sm grey-text-accent pr-2 ${
                                                el && el.state === 'pending'
                                                    ? 'warning-text'
                                                    : el && el.state === 'active'
                                                    ? 'contrast-text'
                                                    : 'danger-text'
                                            }`}>
                                            {el && el.state === 'pending'
                                                ? 'Pending'
                                                : el && el.state === 'active'
                                                ? 'Active'
                                                : 'Unactive'}
                                        </td>
                                        <button
                                            onClick={() => {
                                                setDeleteRowId(el);
                                                setShowModalCancel(true);
                                            }}
                                            className="btn-transparent w-auto cursor-pointer">
                                            <TrashIcon />
                                        </button>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center">
                        <button
                            onClick={props.handleAddAddress}
                            type="button"
                            className="btn btn-transparent gradient-text font-bold">
                            Add New Address
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {showModalBeneficiaryList && (
                <div className="modal-beneficiary-list">
                    <Modal
                        show={showModalBeneficiaryList}
                        header={renderHeaderBeneficiaryList()}
                        content={renderContentBeneficiaryList()}
                    />
                </div>
            )}
            {<Modal show={showModalCancel} content={renderModalDeleteRow()} />}
        </React.Fragment>
    );
};
