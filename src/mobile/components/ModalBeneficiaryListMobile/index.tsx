import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, Redirect } from 'react-router';
import { useBeneficiariesFetch } from 'src/hooks';
import { selectBeneficiaries, Beneficiary, beneficiariesDelete, beneficiariesFetch } from '../../../modules';
import './ModalBeneficiaryListMobile.pcss';
import { ModalFullScreenMobile } from '../ModalFullScreen';
import { WalletIcon } from 'src/mobile/assets/Wallets';
import { ArrowLeft } from 'src/mobile/assets/Arrow';

export interface ModalBeneficiaryListMobileProps {
    showModalBeneficiaryList: boolean;
    showModalAddBeneficiary?: boolean;
    blockchainKey?: string;
    onCloseList: () => void;
    onCloseAdd: () => void;
    handleAddAddress: () => void;
    handlePendingStatus?: (id: number) => void;
    beneficiaryId?: string;
    handleDelete?: () => void;
    handleChangeBeneficiaryId?: (id: number, address: string, blockchainKey: string) => void;
}

export const ModalBeneficiaryListMobile: React.FC<ModalBeneficiaryListMobileProps> = (props) => {
    const [showModalBeneficiaryList, setShowModalBeneficiaryList] = React.useState(props.showModalBeneficiaryList);
    const dispatch = useDispatch();
    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();

    const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);
    const beneficiariesList = beneficiaries.filter((item) => item.currency === currency);

    const handleDeleteAddress = React.useCallback(
        (item: Beneficiary) => () => {
            dispatch(beneficiariesDelete({ id: item.id }));
            props.handleDelete();
        },
        []
    );

    const renderHeaderBeneficiaryListMobile = () => {
        return (
            <React.Fragment>
                <div>
                    <div className="mt-3">
                        <span onClick={() => props.onCloseList()} className="cursor-pointer text-secondary">
                            <ArrowLeft className={''} />
                        </span>
                    </div>
                    <h5 className="font-semibold white-text mt-5">Select Form Address Book</h5>
                </div>
            </React.Fragment>
        );
    };

    const renderContentBeneficiaryListMobile = () => {
        return (
            <>
                <div className="mb-2">
                    {!beneficiariesList[0] ? (
                        <span className="white-text text-center">No Address yet</span>
                    ) : (
                        beneficiariesList.map((item, i) => (
                            <div className="my-2 content-list-mobile pb-2 cursor-pointer" key={i}>
                                <div className="d-flex align-items-center mb-1 justify-content-between">
                                    <h6 className="text-secondary mb-0 text-truncate">{item && item.name}</h6>
                                    <div
                                        onClick={handleDeleteAddress(item)}
                                        className="delete-button-address cursor-pointer">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            width={25}
                                            height={25}
                                            className="text-secondary">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div
                                    onClick={() => {
                                        if (item.state === 'pending') {
                                            props.handlePendingStatus(item.id);
                                        } else {
                                            props.handleChangeBeneficiaryId(
                                                item.id,
                                                item.data.address,
                                                item.blockchain_key
                                            );
                                        }
                                    }}
                                    className="d-flex ml-2">
                                    <span className="text-secondary text-sm font-light">
                                        Address<span className="ml-2">:</span>
                                    </span>
                                    <span className="white-text text-sm ml-2">
                                        {item && item.data && item.data.address.slice(0, 35)}...
                                    </span>
                                </div>
                                <div className="d-flex ml-2">
                                    <span className="text-secondary text-sm font-light">
                                        Status <span className="ml-3">:</span>
                                    </span>
                                    <span
                                        className={`ml-2 ${
                                            item && item.state === 'pending'
                                                ? 'warning-text'
                                                : item && item.state === 'active'
                                                ? 'contrast-text'
                                                : 'danger-text'
                                        }`}>
                                        {item && item.state === 'pending'
                                            ? 'Pending'
                                            : item && item.state === 'active'
                                            ? 'Active'
                                            : 'Unactive'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-5">
                    <button
                        onClick={props.handleAddAddress}
                        type="button"
                        className="btn btn-block btn-lg btn-dash-wallet text-sm">
                        <WalletIcon className="text-danger" />
                        Add New Address
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            {showModalBeneficiaryList && (
                <div className="modal-benericary-list-mobile">
                    <ModalFullScreenMobile
                        show={showModalBeneficiaryList}
                        header={renderHeaderBeneficiaryListMobile()}
                        content={renderContentBeneficiaryListMobile()}
                    />
                </div>
            )}
        </>
    );
};
