import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    alertPush,
    Currency,
    selectCurrencies,
    walletsAddressFetch,
    selectWallets,
    selectHistory,
    Wallet,
} from '../../../modules';
import { DEFAULT_WALLET } from '../../../constants';
import './WalletDepositBody.pcss';
import { useWalletsFetch, useHistoryFetch } from '../../../hooks';
import { QRCode, Decimal, Table } from '../../../components';
import { CustomStylesSelect } from '../../components';
import { copy } from '../../../helpers';
import { Modal } from 'react-bootstrap';
import { useParams, useHistory, Link } from 'react-router-dom';
import { NoData } from '../../components';
import moment from 'moment';
import { CopyableTextField } from '../../../components';

const WalletDepositBody = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const historys = useSelector(selectHistory);
    const wallets = useSelector(selectWallets) || [];
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallet: Wallet = wallets.find((item) => item.currency === currency) || DEFAULT_WALLET;
    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency | any = (currencies && currencies.find((item) => item.id === wallet.currency)) || {
        min_confirmations: 6,
        deposit_enabled: false,
    };
    const enableDesposit = currencyItem?.networks?.filter((item) => item.deposit_enabled == true);

    useWalletsFetch();
    useHistoryFetch({ type: 'deposits', currency: currency, limit: 3, page: 0 });

    const [active, setActive] = useState(enableDesposit ? enableDesposit[0]?.protocol : '');
    const [tab, setTab] = useState(enableDesposit ? enableDesposit[0]?.blockchain_key : '');
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [address, setAddress] = React.useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const label = React.useMemo(
        () => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }),
        [intl]
    );

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    const blockchain = (active && currencyItem?.networks.find((n) => n.protocol === active)) || {
        blockchain_key: null,
    };

    const blockchainKey = blockchain?.blockchain_key;
    const minDepositAmount = blockchain?.min_deposit_amount || '0';

    const depositAddress =
        (wallet &&
            blockchainKey &&
            wallet.deposit_addresses.find((w) => w.blockchain_key.toLowerCase() === blockchainKey.toLowerCase())) ||
        null;

    useEffect(() => {
        setActive(enableDesposit ? enableDesposit[0]?.blockchain_key?.toUpperCase() : '');
        setCurrentTabIndex(0);
    }, [wallet.currency]);

    React.useEffect(() => {
        if (depositAddress?.address !== null) {
            setAddress(depositAddress?.address);
        }
    }, [depositAddress]);

    const handleGenerateAddress = (e) => {
        e.preventDefault();
        if (
            depositAddress === null &&
            wallets.length &&
            wallet !== null &&
            wallet.type !== 'fiat' &&
            currencyItem?.networks &&
            blockchain?.status !== ' disabled' &&
            tab === blockchain?.blockchain_key
        ) {
            dispatch(walletsAddressFetch({ currency: currency, blockchain_key: tab }));
        }
    };

    useEffect(() => {
        if (currencyItem?.networks && currencyItem.networks[0] && currencyItem?.type !== 'fiat') {
            setActive(enableDesposit && enableDesposit[0]?.protocol);
            setTab(enableDesposit && enableDesposit[0]?.blockchain_key);
        }
    }, [currencyItem]);

    const handleViewAll = () => {
        history.push('/history-transaction', { types: 'deposits' });
    };

    const getTableHeaders = () => {
        return ['Date', 'TXID', 'Amount', 'Type Transaction', 'Status', 'Confirmation'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            moment(item.created_at).format('DD-MM-YYYY HH:mm:ss'),
            <>
                {item.tid ? (
                    <fieldset onClick={() => doCopy('txid')}>
                        <CopyableTextField value={item.tid} fieldId="txid" className="white-text" />
                    </fieldset>
                ) : (
                    '-'
                )}
            </>,
            item.amount,
            item.transfer_type,
            item.state,
            item.confirmations,
        ]);
    };

    const renderDeposit = useMemo(() => {
        return (
            <React.Fragment>
                {/* <CurrencyInfo wallet={wallet} /> */}
                <div className="wallet-deposit-body">
                    <div className="d-flex justify-content-between mb-24 content-container">
                        <div className="w-50">
                            <h1 className="white-text text-ms font-extrabold mb-16">Deposit Payment</h1>
                            <p className="font-sm grey-text-accent mb-24">
                                Please don't deposit any other digital assets except {currency?.toUpperCase()} to the
                                address below. Otherwise, you may lose your assets permanently.
                            </p>
                            <div className="d-flex align-items-start select-container mb-24">
                                <p className="text-ms font-extrabold white-text">Coin Base</p>
                                <div className="w-75">
                                    <div className="w-100 d-flex align-items-center coin-selected mb-8">
                                        <img
                                            src={currencyItem?.icon_url}
                                            alt="icon"
                                            className="mr-12 small-coin-icon"
                                        />
                                        <div>
                                            <p className="m-0 text-sm grey-text-accent">
                                                {currencyItem?.id?.toUpperCase()}
                                            </p>
                                            <p className="m-0 text-xs grey-text-accent">{currencyItem?.name}</p>
                                        </div>
                                    </div>
                                    <p className="m-0 text-sm grey-text">Min Deposit : {minDepositAmount}</p>
                                </div>
                            </div>

                            <div className="d-flex mt-3 mb-24">
                                <div className="mr-64">
                                    <p className="mb-2 text-xs white-text">Expected Arrival</p>
                                    <p className="mb-2 text-sm white-text font-bold">Expected Arrival</p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs white-text">Minimum Deposit</p>
                                    <p className="mb-2 text-sm white-text font-bold">
                                        <Decimal fixed={wallet?.fixed} thousSep=",">
                                            {minDepositAmount?.toString()}
                                        </Decimal>
                                        &nbsp;{wallet?.currency?.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <ul className="pl-2">
                                <li className="white-text text-sm mb-8">
                                    Send only {currency.toUpperCase()} to this deposit address.
                                </li>
                                <li className="white-text text-sm mb-8">
                                    Ensure the network is {currency.toUpperCase()} Smart Chain ({active}).
                                </li>
                                <li className="white-text text-sm mb-8">Do not send NFTs to this address.</li>
                            </ul>
                        </div>

                        <div className="network-container w-50">
                            <h1 className="white-text text-ms font-extrabold mb-16">
                                {enableDesposit?.length > 1 && 'Select Network :'}
                            </h1>

                            <div className="navbar position-relative navbar-expand-lg mb-24">
                                <div className="collapse navbar-collapse">
                                    <ul className="navbar-nav">
                                        {enableDesposit?.map((network) => (
                                            <li
                                                className={`nav-item ${active === network?.protocol ? 'active' : ''}`}
                                                key={network?.blockchain_key}
                                                onClick={() => {
                                                    setActive(network?.protocol);
                                                    setTab(network?.blockchain_key);
                                                }}>
                                                <div className="nav-link">{network?.protocol}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {depositAddress === null ? (
                                <button
                                    onClick={(e) => handleGenerateAddress(e)}
                                    className="w-100 btn-primary cursor-pointer"
                                    disabled={depositAddress?.state === 'pending' ? true : false}
                                    type="button">
                                    {'Generate Address'}
                                </button>
                            ) : (
                                depositAddress?.address === null && (
                                    <button
                                        className="w-100 btn-primary cursor-pointer"
                                        disabled={depositAddress?.state === 'pending' ? true : false}
                                        type="button">
                                        {'Creating ...'}
                                    </button>
                                )
                            )}

                            {depositAddress !== null && depositAddress?.address !== null && (
                                <React.Fragment>
                                    <h3 className="white-text text-sm font-bold">Address</h3>
                                    <input
                                        id="address"
                                        className="text-ms blue-text font-extrabold mb-24 address"
                                        defaultValue={address}
                                    />
                                    <div className="d-flex">
                                        <button
                                            className="btn-primary mr-12"
                                            type="button"
                                            disabled={depositAddress?.address === null}
                                            onClick={() => doCopy('address')}>
                                            Copy Address
                                        </button>
                                        <button
                                            type="button"
                                            disabled={depositAddress?.address === null}
                                            className="btn-primary"
                                            onClick={handleShow}>
                                            Show QRCode
                                        </button>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>

                    <div className="table-container">
                        <h1 className="mb-24 text-lg white-text">Recent Deposit</h1>
                        <Table header={getTableHeaders()} data={getTableData(historys)} />
                        {historys.length < 1 && <NoData text="No Data Yet" />}
                        {historys.length > 0 && (
                            <div className="d-flex justify-content-center mt-3">
                                <p
                                    onClick={handleViewAll}
                                    className="font-bold text-center gradient-text text-sm cursor-pointer">
                                    View All
                                </p>
                            </div>
                        )}
                    </div>

                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Body>
                            <div className="text-center">
                                <QRCode dimensions={255} data={depositAddress?.address} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="border-none d-flex flex-column justify-content-center align-items-center">
                            <input
                                id="address-modal"
                                className="text-ms blue-text text-center font-extrabold mb-24 address"
                                defaultValue={depositAddress?.address}
                            />
                            <button className="btn-primary mr-12" type="button" onClick={() => doCopy('address-modal')}>
                                Copy Address
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }, [
        currency,
        currencies,
        CustomStylesSelect,
        minDepositAmount,
        depositAddress,
        handleGenerateAddress,
        handleViewAll,
        currencyItem,
        active,
        blockchain,
        blockchainKey,
        setActive,
        doCopy,
        handleClose,
        handleShow,
        getTableData,
        getTableHeaders,
        walletsAddressFetch,
        wallet,
    ]);

    return renderDeposit;
};

// const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export { WalletDepositBody };
