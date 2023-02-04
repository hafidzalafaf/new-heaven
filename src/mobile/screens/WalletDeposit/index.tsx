import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { alertPush, Currency, selectCurrencies, walletsAddressFetch, selectWallets, Wallet } from '../../../modules';
import { useWalletsFetch, useDocumentTitle } from '../../../hooks';
//import { QRCode } from '../../../components';
import { copy } from '../../../helpers';
import { DEFAULT_WALLET } from '../../../constants';
import { ArrowLeft, ArrowRight } from 'src/mobile/assets/Arrow';
import { InfoModalNetworkIcon, InfoWarningIcon } from '../../../assets/images/InfoIcon';
import { CopyButton } from '../../../assets/images/CopyButton';
import { HelpIcon } from 'src/mobile/assets/Help';
import { ModalMobile } from 'src/mobile/components';
import { Modal } from 'react-bootstrap';
import QRCode from 'react-qr-code';

import { ModalFullScreenMobile } from 'src/mobile/components';
import { CircleCloseModalNetworkIcon } from 'src/assets/images/CircleCloseIcon';

type LocationProps = {
    state: {
        blockchain_key: string;
        protocol: string;
    };
};

const WalletDepositMobileScreen: React.FC = () => {
    const { currency = '' } = useParams<{ currency?: string }>();
    useWalletsFetch();
    useDocumentTitle(`Deposit ${currency.toUpperCase()}`);
    const { formatMessage } = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = (useLocation() as unknown) as LocationProps;

    const wallets = useSelector(selectWallets) || [];
    const blockchain_key = location.state?.blockchain_key;
    const protocol = location.state?.protocol;
    const [address, setAddress] = React.useState('');
    const [showFAQ, setShowFAQ] = React.useState(false);
    const [showFAQDetail, setShowFAQDetail] = React.useState(false);
    const [showNetworkModal, setShowNetworkModal] = React.useState(false);

    const wallet: Wallet = wallets.find((item) => item.currency === currency) || DEFAULT_WALLET;
    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency | any = (currencies && currencies.find((item) => item.id === wallet.currency)) || {
        min_confirmations: 6,
        deposit_enabled: false,
    };

    const handleSelectNetwork = (blockchain_key, protocol) => {
        history.push(`/wallets/${currencyItem.id}/deposit`, { blockchain_key: blockchain_key, protocol: protocol });
    };
    
    const blockchain = (protocol &&
        currencyItem &&
        currencyItem.networks &&
        currencyItem.networks.find((n) => n.protocol === protocol)) || {
        blockchain_key: null,
    };

    const blockchainKey = blockchain && blockchain.blockchain_key;

    const depositAddress =
        (wallet &&
            blockchainKey &&
            wallet.deposit_addresses.find((w) => w.blockchain_key.toLowerCase() === blockchainKey.toLowerCase())) ||
        null;

    const handleGenerateAddress = (e) => {
        e.preventDefault();
        if (
            depositAddress === null &&
            wallets.length &&
            wallet !== null &&
            wallet.type !== 'fiat' &&
            currencyItem?.networks &&
            blockchain?.status !== ' disabled'
        ) {
            dispatch(walletsAddressFetch({ currency, blockchain_key }));
        }
    };

    const doCopy = (text: string) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    React.useEffect(() => {
        if (depositAddress && depositAddress.address !== null) {
            setAddress(depositAddress && depositAddress.address);
        }
    }, [depositAddress]);

    const renderHeaderFAQMobile = () => {
        return (
            <React.Fragment>
                <div>
                    <div className="mt-3">
                        <span onClick={() => setShowFAQ(!showFAQ)} className="cursor-pointer text-secondary">
                            <ArrowLeft className={''} />
                        </span>
                    </div>
                    <h5 className="font-semibold grey-text-accent mt-3">FAQ</h5>
                </div>
            </React.Fragment>
        );
    };

    const closeFAQDetail = () => {
        setShowFAQDetail(false);
        setShowFAQ(true);
    };

    const openFAQDetail = () => {
        setShowFAQDetail(true);
        setShowFAQ(false);
    };

    const handleSelectChangeNetwork = (item) => {
        handleSelectNetwork(item && item.blockchain_key, item && item.protocol);
        setShowNetworkModal(false)
    };

    const renderContentFAQMobile = () => {
        return (
            <>
                <div className="list-faq grey-text-accent">
                    <div onClick={openFAQDetail} className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>How To Deposit</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>How do i deposit crypto into Heaven Exchange account</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>
                            What should i do if i didn't receive my deposits or i deposit to an incorrect address
                        </span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>What should i do if i deposit the wrong crypto?</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>See intructions</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>What are the common deposit networks?</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                    <div className="d-flex justify-content-between cursor-pointer mb-3 align-items-start pb-1 text-sm">
                        <span>What should i do if i forgot to specify the Memo, Tag, or Message for my deposit</span>
                        <span>
                            <ArrowRight className={''} />
                        </span>
                    </div>
                </div>
            </>
        );
    };

    const renderFAQDetailHeader = () => {
        return (
            <div className="mt-3 px-12">
                <div onClick={closeFAQDetail} className="cursor-pointer">
                    <ArrowLeft className={''} />
                </div>
                <h1 className="font-semibold navbar-brand grey-text-accent mt-3">How to Deposit</h1>
            </div>
        );
    };

    const renderFAQDetailContent = () => {
        return (
            <div className="w-100">
                <div className="mb-3 d-flex flex-row align-top justify-content-around">
                    <img className="align-top" height={34} width={34} src="/img-mobile/faq/no1.svg" />
                    <div className="w-80">
                        <h5 className="font-semibold white-text">Copy Address</h5>
                        <p className="text-sm grey-text-accent">
                            Choose the crypto and its network on this page, and copy the deposit address
                        </p>
                    </div>
                </div>
                <div className="mb-3 d-flex flex-row align-top justify-content-around">
                    <img className="align-top" height={34} width={34} src="/img-mobile/faq/no2.svg" />
                    <div className="w-80">
                        <h5 className="font-semibold white-text">Initiate a Withdrawal</h5>
                        <p className="text-sm grey-text-accent">Initiate a withdrawal on the withdrawal platform.</p>
                    </div>
                </div>
                <div className="mb-3 d-flex flex-row align-top justify-content-around">
                    <img className="align-top" height={34} width={34} src="/img-mobile/faq/no3.svg" />
                    <div className="w-80">
                        <h5 className="font-semibold white-text">Network Confirmation</h5>
                        <p className="text-sm grey-text-accent">
                            Wait for the blockchain network to confirm your transfer.
                        </p>
                    </div>
                </div>
                <div className="mb-3 d-flex flex-row align-top justify-content-around">
                    <img className="align-top" height={34} width={34} src="/img-mobile/faq/no4.svg" />
                    <div className="w-80">
                        <h5 className="font-semibold white-text">Deposit Success</h5>
                        <p className="text-sm grey-text-accent">
                            After the network confirmation,we will credit the crypto for you.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <section className="wallet-deposit-mobile-screen pb-5 dark-bg-main">
                <div className="container-fluid w-100 h-100">
                    <div className="pt-5 pb-3">
                        <Link to="/wallets">
                            <ArrowLeft className="grey-text-accent" />
                        </Link>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100 mb-24">
                        <h1 className="navbar-brand p-0 m-0 grey-text-accent">
                            Deposit {currencyItem && currencyItem.name}
                        </h1>
                        <div onClick={() => setShowFAQ(!showFAQ)} className="cursor-pointer">
                            <HelpIcon className={'mr-1'} />
                            <span className="grey-text-accent text-sm">FAQ</span>
                        </div>
                    </div>

                    {/* ========= Render if address has been generated =========== */}
                    {depositAddress && depositAddress.address !== null && (
                        <React.Fragment>
                            <div className="d-flex relative justify-content-center align-items-center radius-lg dark-bg-accent w-100 qr-container mb-16">
                                <div className="card p-1">
                                    <QRCode size={200} value={depositAddress && depositAddress.address} />
                                </div>
                                <div className="logo-coin d-flex justify-content-center align-items-center">
                                    <img src={currencyItem.icon_url} alt="" />
                                </div>
                            </div>
                            <h2 className="p-0 m-0 text-sm grey-text-accent font-bold mb-8">Network</h2>
                            <div className="d-flex justify-content-between align-items-center mb-16">
                                <div className="d-flex">
                                    <h2 className="p-0 m-0 text-sm grey-text-accent font-bold mr-8">
                                        {currencyItem && currencyItem.id && currencyItem.id.toUpperCase()}
                                    </h2>
                                    <h3 className="p-0 m-0 text-xxs grey-text">
                                        {currencyItem && currencyItem.name}{' '}
                                        {currencyItem && currencyItem.id && currencyItem.id.toUpperCase()}
                                    </h3>
                                </div>
                                <div className='cursor-pointer' onClick={()=> setShowNetworkModal(!showNetworkModal)}>
                                <ArrowRight className={''} />
                                </div>
                            </div>
                            <h2 className="p-0 m-0 text-sm grey-text-accent font-bold mb-8">Address</h2>
                            <div className="d-flex justify-content-between align-items-center mb-24">
                                <input
                                    id="address"
                                    className="p-0 m-0 text-sm grey-text-accent font-bold address w-90"
                                    defaultValue={address}
                                />
                                <button
                                    className="btn-transparent w-10"
                                    type="button"
                                    disabled={
                                        depositAddress && depositAddress.address && depositAddress.address === null
                                    }
                                    onClick={() => doCopy('address')}>
                                    <CopyButton />
                                </button>
                            </div>
                            {depositAddress === null ? (
                                <button
                                    onClick={(e) => handleGenerateAddress(e)}
                                    className="w-100 btn-primary cursor-pointer"
                                    disabled={depositAddress && depositAddress.state === 'pending' ? true : false}
                                    type="button">
                                    {'Generate Address'}
                                </button>
                            ) : (
                                depositAddress &&
                                depositAddress.address === null && (
                                    <button
                                        className="w-100 btn-primary cursor-pointer"
                                        disabled={depositAddress && depositAddress.state === 'pending' ? true : false}
                                        type="button">
                                        {'Creating ...'}
                                    </button>
                                )
                            )}
                            <button
                                disabled={depositAddress && depositAddress.address && depositAddress.address === null}
                                onClick={() => doCopy('address')}
                                className="btn-primary w-100">
                                Copy Address
                            </button>
                        </React.Fragment>
                    )}

                    {/* ======= Render if address has not been generated ======= */}

                    {depositAddress === null || (depositAddress && depositAddress.address === null) ? (
                        <React.Fragment>
                            <div className="d-flex justify-content-between align-items-center dark-bg-accent radius-sm p-16 mb-16">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={currencyItem && currencyItem.icon_url}
                                        alt="logo"
                                        className="small-coin-icon mr-8"
                                    />
                                    <div className="d-flex flex-column justify-content-start align-items-start">
                                        <p className="p-0 m-0 grey-text-accent text-ms font-bold">
                                            {currencyItem && currencyItem.name}
                                        </p>
                                        <p className="p-0 m-0 grey-text text-ms font-bold">
                                            {currencyItem.id && currencyItem.id.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <span>
                                    <ArrowRight className={''} />
                                </span>
                            </div>

                            <div className="dark-bg-accent info-container radius-lg mb-16">
                                <div className="d-flex radius-sm p-16 align-items-center info mb-24">
                                    <span className="mr-8">
                                        <InfoWarningIcon />
                                    </span>
                                    <p className="m-0 p-0 grey-text-accent text-xxs">
                                        Please don't deposit any other digital asset except BTC to the address below.
                                        Otherwise, you may lose your assets permanently
                                    </p>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <p className="text-ms font-extrabold grey-text m-0 p-0">Payment Address</p>
                                    <CopyButton />
                                </div>

                                {depositAddress === null ? (
                                    <button
                                        onClick={(e) => handleGenerateAddress(e)}
                                        className="w-100 btn-primary cursor-pointer"
                                        disabled={depositAddress && depositAddress.state === 'pending' ? true : false}
                                        type="button">
                                        {'Generate Address'}
                                    </button>
                                ) : (
                                    depositAddress &&
                                    depositAddress.address === null && (
                                        <button
                                            className="w-100 btn-primary cursor-pointer"
                                            disabled={
                                                depositAddress && depositAddress.state === 'pending' ? true : false
                                            }
                                            type="button">
                                            {'Creating ...'}
                                        </button>
                                    )
                                )}
                            </div>
                        </React.Fragment>
                    ) : (
                        ''
                    )}

                    {depositAddress === null || (depositAddress && depositAddress.address === null) ? (
                        <ul className="grey-text text-sm">
                            <li>
                                {currency && currency.toUpperCase()} deposit will be into the account after the 3
                                confirmation, and it can be allowed to withdraw after the 5 confirmation.
                            </li>
                            <li>
                                Minimum deposit are 0.0001 {currency && currency.toUpperCase()}, and deposit will be not
                                into the account if they are less the minimum.
                            </li>
                        </ul>
                    ) : (
                        ''
                    )}
                </div>
            </section>

            {showFAQ && (
                <div className="modal-benericary-list-mobile"
                style={{
                    zIndex: 10
                }}
                >
                    <ModalFullScreenMobile
                        show={showFAQ}
                        header={renderHeaderFAQMobile()}
                        content={renderContentFAQMobile()}
                    />
                </div>
            )}

            {showFAQDetail && (
                <div className="modal-benericary-list-mobile"
                style={{
                    zIndex: 9999
                }}
                >
                    <ModalMobile show={showFAQDetail} header={renderFAQDetailHeader()} content={renderFAQDetailContent()} />
                </div>
            )}

            {
                showNetworkModal && (
                    <Modal
                    dialogClassName="modal-transfer-fullscreen"
                        show={showNetworkModal}
                    >
                    <div className={`position-relative dark-bg-main`}>
                    <div className={`modal-deposit-wallet ${showNetworkModal ? ' show ' : ''}`}>
                        <div className="modal-deposit-wallet__content fixed-bottom off-canvas-content-container overflow-auto">
                            <div className="d-flex justify-content-between align-items-center mb-12">
                                <h3 className="p-0 m-0 text-ms grey-text-accent">Select Network</h3>
                                <span onClick={() => setShowNetworkModal(false)} className="cursor-pointer">
                                    <CircleCloseModalNetworkIcon />
                                </span>
                            </div>
    
                            <div className="d-flex justify-content-start align-items-start mb-24">
                                <span className="mr-8 curspr-pointer">
                                    <InfoModalNetworkIcon />
                                </span>
                                <p className="m-0 p-0 grey-text text-xxs">
                                    Ensure that the selected network is consistent with your method of withdrawal, Otherwise
                                    you are at risk losing your assets,
                                </p>
                            </div>
    
                            {currencyItem &&
                                currencyItem.networks.map((item, i) => (
                                    <div
                                        onClick={()=>handleSelectChangeNetwork(item)}
                                        key={i}
                                        className={`${protocol === item.protocol ? `border border-info` : `border border-dark`} rounded-lg cursor-pointer mb-8 p-2`}>
                                        <h3 className="p-0 m-0 text-ms grey-text-accent">{item && item.protocol}</h3>
                                        <p className="m-0 p-0 grey-text text-xxs">{item && item.blockchain_key}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                </Modal>
                )
            }
        </React.Fragment>
    );
};

export { WalletDepositMobileScreen };
