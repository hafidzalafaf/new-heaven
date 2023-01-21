import * as React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useWalletsFetch } from '../../../hooks';
import { WalletDepositBody, ModalInternalTransfer } from '../../components';
import { HowToDeposit } from '../../containers';
import { ArrowLeftIcon } from 'src/assets/images/ArrowLeftIcon';
import './WalletDeposit.pcss';

const WalletDeposit: React.FC = () => {
    useWalletsFetch();

    const { currency = '' } = useParams<{ currency?: string }>();

    const [showModalTransfer, setShowModalTransfer] = React.useState(false);

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
        </React.Fragment>
    );
};

export { WalletDeposit };
