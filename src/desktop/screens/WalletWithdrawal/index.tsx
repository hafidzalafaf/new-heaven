import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useDocumentTitle, useHistoryFetch, useWithdrawSum } from '../../../hooks';
import { selectHistory, alertPush, selectWithdrawSum } from '../../../modules';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'src/assets/images/ArrowLeftIcon';
import './WalletWithdrawal.pcss';
import { WalletWithdrawalForm, WalletWithdrawalInfo } from '../../containers';
import { ModalInternalTransfer } from '../../components';
import { Table } from '../../../components';
import { NoData } from '../../components';
import { copy } from '../../../components';
import { CopyableTextField } from '../../../components';
import { CopyButton } from '../../../assets/images/CopyButton';
import moment from 'moment';

export const WalletWitdrawal: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();

    useWithdrawSum();

    const { currency = '' } = useParams<{ currency?: string }>();
    const historys = useSelector(selectHistory);
    const sum = useSelector(selectWithdrawSum);
    const [showModalTransfer, setShowModalTransfer] = React.useState(false);

    useDocumentTitle('Wallet || Withdrawal');
    useHistoryFetch({ type: 'withdraws', currency: currency, limit: 3, page: 0 });

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    const getTableHeaders = () => {
        return ['Date', 'Transaction ID', 'Amount', 'Type Transaction', 'Address', 'Status', 'Confirmation'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            moment(item.created_at).format('D MMM YYYY - HH:mm'),
            <>
                {item.blockchain_txid ? (
                    <fieldset onClick={() => doCopy('item' + String(item.id))}>
                        <CopyableTextField
                            value={item.blockchain_txid}
                            fieldId={'item' + String(item.id)}
                            className="white-text"
                        />
                    </fieldset>
                ) : (
                    '-'
                )}
            </>,
            item.amount,
            item.type,
            <>{item.rid ? `${item.rid.slice(0, 15)}...` : '-'}</>,
            item.state,
            item.confirmations,
        ]);
    };

    return (
        <React.Fragment>
            <div className="pg-wallet-withdraw-screen dark-bg-main">
                <div className="header-withdraw dark-bg-main d-flex justify-content-between py-4 px-24 mb-24">
                    <div className="d-flex mr-2">
                        <Link to="/wallets" className="white-text text-lg">
                            <ArrowLeftIcon className={''} />
                        </Link>
                        <p className=" white-text text-lg mb-0 ml-4">Withdrawal Crypto</p>
                    </div>

                    <div className="ml-2">
                        <Link to={`/wallets/${currency}/deposit`}>
                            <button className="btn btn-secondary radius-sm m-1 text-sm font-bold">Deposit</button>
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
                <div className="dark-bg-accent body-withdraw">
                    <div className="d-flex justify-content-between align-items-start mb-24 w-100 body-withdraw__content">
                        <div className="w-60">
                            <WalletWithdrawalForm />
                        </div>
                        <div className="w-30">
                            <WalletWithdrawalInfo />
                        </div>
                    </div>
                    <div className="table-container">
                        <h1 className="mb-24 text-lg white-text">Recent Withdraw</h1>
                        <Table header={getTableHeaders()} data={getTableData(historys)} />
                        {historys.length < 1 && <NoData text="No Data Yet" />}
                        {historys.length > 0 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Link to="/history-transaction" className="font-bold text-center gradient-text text-sm">
                                    View All
                                </Link>
                            </div>
                        )}
                    </div>
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
