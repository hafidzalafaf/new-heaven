import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { memberLevelsFetch, selectMemberLevels, selectUserInfo } from 'src/modules';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useWalletsFetch } from '../../../hooks';
import { WalletDepositBody, ModalInternalTransfer } from '../../components';
import { Modal } from '../../components';
import { HowToDeposit } from '../../containers';
import { ArrowLeftIcon } from 'src/assets/images/ArrowLeftIcon';
import './WalletDeposit.pcss';
import { CircleCloseDangerLargeIcon } from 'src/assets/images/CircleCloseIcon';

const WalletDeposit: React.FC = () => {
    const { currency = '' } = useParams<{ currency?: string }>();
    const dispatch = useDispatch();
    useWalletsFetch();

    const [showModalTransfer, setShowModalTransfer] = React.useState(false);
    const [showModalLocked, setShowModalLocked] = React.useState(false);
    const memberLevel = useSelector(selectMemberLevels);
    const user = useSelector(selectUserInfo);

    React.useEffect(() => {
        dispatch(memberLevelsFetch());
        if (user?.level < memberLevel?.deposit?.minimum_level) {
            setShowModalLocked(true);
        }
    }, [dispatch, user, memberLevel]);

    const renderHeaderModalLocked = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <CircleCloseDangerLargeIcon />
                </div>
            </React.Fragment>
        );
    };

    const renderContentModalLocked = () => {
        return (
            <React.Fragment>
                <h1 className="white-text text-lg mb-24 text-center ">Deposit Locked</h1>
                <p className="grey-text text-ms font-extrabold mb-24 text-center">
                    {user?.level == 1
                        ? 'For deposit you must verified your phone number and document first'
                        : 'For deposit you must verified your document first'}
                </p>
                <div className="d-flex justify-content-center align-items-center w-100 mb-0">
                    <Link to={`${user?.level == 1 ? '/profile' : '/profile/kyc'}`}>
                        <button type="button" className="btn btn-primary sm px-5 mr-3">
                            {user?.level == 1 ? 'Verify Phone Number' : 'Verify Document'}
                        </button>
                    </Link>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-wallet-deposit-screen dark-bg-main">
                <div className="header-deposit dark-bg-main d-flex justify-content-between py-4 px-24 mb-24">
                    <div className="d-flex mr-2">
                        <Link to="/wallets" className="white-text text-lg">
                            <ArrowLeftIcon className={''} />
                        </Link>
                        <p className=" white-text text-lg mb-0 ml-4">Deposit Crypto</p>
                    </div>

                    <div className="ml-2">
                        <Link to={`/wallets/${currency}/withdraw`}>
                            <button className="btn btn-secondary radius-sm m-1 text-sm font-bold">Withdraw</button>
                        </Link>

                        <button
                            onClick={() => setShowModalTransfer(!showModalTransfer)}
                            className="btn btn-secondary radius-sm m-1 text-sm font-bold"
                            data-toggle="modal"
                            data-target="#transfer">
                            Transfer Internal
                        </button>
                    </div>
                </div>
                <div className="dark-bg-accent body-deposit">
                    <HowToDeposit />
                    <WalletDepositBody />
                </div>
            </div>

            {showModalTransfer && (
                <ModalInternalTransfer
                    showModalTransfer={showModalTransfer}
                    onClose={() => setShowModalTransfer(false)}
                />
            )}

            <Modal show={showModalLocked} header={renderHeaderModalLocked()} content={renderContentModalLocked()} />
        </React.Fragment>
    );
};

export { WalletDeposit };
