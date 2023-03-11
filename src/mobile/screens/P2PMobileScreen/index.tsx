import * as React from 'react';
import { useDocumentTitle } from '../../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
    p2pFiatFetch,
    p2pPaymentUserFetch,
    p2pCurrenciesFetch,
    selectUserLoggedIn,
    selectP2POffers,
    selectP2PAccountOffer,
    selectP2PFiatsData,
    selectP2PCurrenciesData,
    selectUserInfo,
    selectP2PPaymentUser,
    offersFetch,
    p2pOfferFetch,
    P2PFiat,
} from 'src/modules';
import { ModalMobile, CardOfferListMobile, ModalFullScreenMobile } from 'src/mobile/components';
import { ActiveCheck, GreyCheck } from 'src/assets/images/P2PIcon';
import { ArrowLeft } from 'src/mobile/assets/Arrow';
import {
    NotifMobileIcon,
    HamburgerMobileIcon,
    FilterMobileIcon,
    DropdownFilterMobileIcon,
    SettingMobileIcon,
    CircleAddMobileIcon,
    DashboardMobileIcon,
    DocumentMobileIcon,
    CircleHelpMobileIcon,
    UserMobileIcon,
    ReplayMobileIcon,
} from 'src/mobile/assets/P2PMobileIcon';
import { InfoIcon } from 'src/assets/images/InfoIcon';
import { NoData, FilterInput } from 'src/desktop/components';
import { Link } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { P2PNotificationMobile } from 'src/mobile/containers';

export const P2PMobileScreen: React.FC = () => {
    useDocumentTitle('P2P');
    const dispatch = useDispatch();
    const location = useLocation<{ side?: string; currency?: string; fiat?: string }>();
    const history = useHistory();

    const isLoggedIn = useSelector(selectUserLoggedIn);
    const publicOffer = useSelector(selectP2POffers);
    const privateOffer = useSelector(selectP2PAccountOffer);
    const fiats: P2PFiat[] = useSelector(selectP2PFiatsData);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const user = useSelector(selectUserInfo);
    const paymentMethods = useSelector(selectP2PPaymentUser);

    const [showModalAnnouncement, setShowModalAnnouncement] = React.useState(false);
    const [selectAnnouncement, setSelectAnnouncement] = React.useState(false);
    const [showModalSelectCurrency, setShowModalSelectCurrency] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [showMenu, setShowMenu] = React.useState(false);

    const [startDate, setStartDate] = React.useState<string | number>();
    const [endDate, setEndDate] = React.useState<string | number>();

    const [currencies, setCurrencies] = React.useState([]);
    const [payments, setPayments] = React.useState([]);
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredCurrency, setFilteredCurrency] = React.useState([]);

    const [side, setSide] = React.useState(
        location?.state?.side ? (location?.state?.side == 'buy' ? 'sell' : 'buy') : 'buy'
    );
    const [fiat, setFiat] = React.useState(location?.state?.fiat ? location?.state?.fiat : 'IDR');
    const [currency, setCurrency] = React.useState(
        location?.state?.currency ? location?.state?.currency : currencies?.length > 0 ? currencies[0]?.currency : 'eth'
    );
    const [symbol, setSymbol] = React.useState('Rp');
    const [amountList, setAmountList] = React.useState('');
    const [amountFilter, setAmountFilter] = React.useState('');
    const [minPriceFilter, setMinPriceFilter] = React.useState('');
    const [maxPriceFilter, setMaxPriceFilter] = React.useState('');
    const [paymentFilterValue, setPaymentFilterValue] = React.useState([]);
    const [paymentFilter, setPaymentFilter] = React.useState([]);
    const [paymentListUser, setPaymentListUser] = React.useState([]);
    const [currencyOffer, setCurrencyOffer] = React.useState(currencies?.length > 0 ? currencies[0]?.currency : 'eth');
    const [priceOffer, setPriceOffer] = React.useState('');
    const [showNotif, setShowNotif] = React.useState(false);

    React.useEffect(() => {
        dispatch(p2pFiatFetch());
        dispatch(p2pPaymentUserFetch());
    }, [dispatch]);

    React.useEffect(() => {
        setFilteredCurrency(fiats);
    }, [fiats]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [fiat, currencyOffer, priceOffer]);

    React.useEffect(() => {
        setCurrencies(currenciesData?.currency);
        setPayments(currenciesData?.payment);
        setPaymentListUser(paymentMethods);
    }, [currenciesData, paymentMethods]);

    React.useEffect(() => {
        const defaultPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
        };

        const amountListPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountList,
        };

        const amountFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            amount: amountFilter,
        };

        const priceFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
        };

        const paymentFilterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            payment: paymentFilter,
        };

        const filterPayload = {
            fiat: fiat,
            currency: currency,
            side: side,
            min_price: minPriceFilter,
            max_price: maxPriceFilter,
            amount: amountFilter,
            paymentFilter: paymentFilter,
        };

        if (currency !== undefined && fiat !== undefined && isLoggedIn) {
            dispatch(
                p2pOfferFetch(
                    amountList
                        ? amountListPayload
                        : amountFilter
                        ? amountFilterPayload
                        : minPriceFilter && maxPriceFilter
                        ? priceFilterPayload
                        : paymentFilter
                        ? paymentFilterPayload
                        : minPriceFilter && maxPriceFilter && amountFilter && paymentFilter
                        ? filterPayload
                        : defaultPayload
                )
            );
        }

        if (currency !== undefined && fiat !== undefined && !isLoggedIn) {
            dispatch(
                offersFetch(
                    amountList
                        ? amountListPayload
                        : amountFilter
                        ? amountFilterPayload
                        : minPriceFilter && maxPriceFilter
                        ? priceFilterPayload
                        : paymentFilter
                        ? paymentFilterPayload
                        : minPriceFilter && maxPriceFilter && amountFilter && paymentFilter
                        ? filterPayload
                        : defaultPayload
                )
            );
        }
    }, [
        dispatch,
        side,
        fiat,
        currency,
        amountList,
        amountFilter,
        minPriceFilter,
        maxPriceFilter,
        paymentFilter,
        isLoggedIn,
    ]);

    React.useEffect(() => {
        setTimeout(() => {
            setShowModalAnnouncement(true);
        }, 3000);
    }, []);

    const searchFilter = (row, searchKey: string) => {
        setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.code?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        setFilteredCurrency(result);
    };

    const handleSelectPaymentFilter = (e: any) => {
        if (paymentFilter?.includes(e)) {
            setPaymentFilter(paymentFilter.filter((item) => item !== e));
        } else {
            setPaymentFilter([...paymentFilter, e]);
        }
    };

    const handleSelectPaymentFilterDropdown = (e: any) => {
        if (paymentFilter?.includes(e)) {
            setPaymentFilter(paymentFilter.filter((item) => item !== e));
        } else {
            setPaymentFilter([e]);
        }
    };

    const menu = [
        {
            icon: <SettingMobileIcon />,
            name: 'Payment Methods',
            url: '/p2p/profile',
        },
        {
            icon: <CircleAddMobileIcon />,
            name: 'Create an Offers',
            url: '/p2p/create-offer',
        },
        {
            icon: <DashboardMobileIcon />,
            name: 'My Offers',
            url: '/p2p/offer',
        },
        {
            icon: <DocumentMobileIcon />,
            name: 'Order History',
            url: '/p2p/order',
        },
        {
            icon: <CircleHelpMobileIcon />,
            name: 'P2P Help Center',
            url: '/p2p/faq',
        },
        {
            icon: <UserMobileIcon />,
            name: 'P2P User Center',
            url: '/p2p/profile',
        },
        {
            icon: <ReplayMobileIcon />,
            name: 'Replay Guide',
            url: '/p2p/faq',
        },
    ];

    const renderModalAnnouncement = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-content-center w-100">
                    <img src="/img/announcement-mobile.png" alt="warning" width={68} height={68} className="mb-24" />
                </div>
                <h1 className="text-lg grey-text-accent font-extrabold mb-24 text-center">Announcement</h1>
                <p className="text-sm grey-text-accent mb-24 text-justify">
                    To Avoid Becoming A Victim Of Scammers, Never Transfer Cryptocurrency Before Actually Receiving
                    Payment! Don't Trust Anyone Who Claims To Be Customer Support And Convinces You To Complete A
                    Transaction Before You Receive Your Payment- They Are Scammers. After The Seller Confirms The Order
                    And Transfers The Asset To The Buyer, The Transaction Is Considered Complete And Cannot Be
                    Contested. Heaven Is Not Responsible For Transactions Made Outside The Platform.
                </p>

                <div className="d-flex align-items-center gap-8 mb-24">
                    {selectAnnouncement ? (
                        <span className="cursor-pointer" onClick={() => setSelectAnnouncement(!selectAnnouncement)}>
                            <ActiveCheck />
                        </span>
                    ) : (
                        <span className="cursor-pointer" onClick={() => setSelectAnnouncement(!selectAnnouncement)}>
                            <GreyCheck />
                        </span>
                    )}

                    <p className="m-0 p-0 grey-text-accent text-xxs">I have read and agree to the above content</p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowModalAnnouncement(false)}
                    className="btn-primary font-normal text-ms w-100">
                    Confirm
                </button>
            </React.Fragment>
        );
    };

    const renderModalSelectCurrency = () => {
        return (
            <React.Fragment>
                <div className="d-flex justify-content-center align-items-center position-relative mb-24">
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">Select Currency</p>
                    <span
                        onClick={() => setShowModalSelectCurrency(!showModalSelectCurrency)}
                        className="back position-absolute">
                        <ArrowLeft className={'cursor-pointer'} />
                    </span>
                </div>

                <div className="d-flex align-items-center justify-content-between form-search w-100 mb-16">
                    <div className="w-80">
                        <FilterInput
                            data={fiats}
                            onFilter={handleFilter}
                            filter={searchFilter}
                            placeholder={'Enter the currency you are looking for.'}
                            className="search-currency placeholder-search"
                        />
                    </div>

                    <div className="w-20">
                        <button
                            type="button"
                            className="m-0 p-0 grey-text text-xxs text-right btn-cancel btn-transparent">
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-4 w-100 py-8 available-currencies">
                    <p className="m-0 p-0 white-text text-ms">Available Currencies</p>
                    <InfoIcon />
                </div>

                <div className="fiats-container">
                    {filteredCurrency?.map((fiat, i) => (
                        <span
                            key={i}
                            onClick={() => {
                                setFiat(fiat?.name);
                                setShowModalSelectCurrency(!showModalSelectCurrency);
                                setSymbol(fiat?.symbol);
                            }}
                            className="fiats-option cursor-pointer">
                            <p className="m-0 p-0 grey-text-accent text-ms font-extrabold">{fiat?.symbol}</p>
                            <p className="m-0 p-0 grey-text text-ms font-extrabold">{fiat?.name}</p>
                        </span>
                    ))}
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <div className="pg-mobile-screen-p2p mobile-container">
                <div className="d-flex justify-content-between align-items-center mb-32 position-relative">
                    <span onClick={() => history.goBack()}>
                        <ArrowLeft className={'cursor-pointer'} />
                    </span>
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold">P2P</p>
                    <div className="d-flex gap-8 justify-content-start align-items-center">
                        <span onClick={() => setShowNotif(!showNotif)} className={'cursor-pointer'}>
                            <NotifMobileIcon />
                        </span>
                        {/* <span onClick={() => setShowMenu(!showMenu)} className={'cursor-pointer'}>
                            <HamburgerMobileIcon />
                        </span> */}

                        <Dropdown>
                            <Dropdown.Toggle
                                variant=""
                                id="dropdown-basic"
                                className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm">
                                <HamburgerMobileIcon />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-profile">
                                <Dropdown.Item className="dark-bg-accent dropdown-profile cursor-pointer">
                                    {menu?.map((item, i) => (
                                        <Link
                                            key={i}
                                            to={item?.url}
                                            className="dark-bg-accent p-3 dropdown-profile cursor-pointer d-flex gap-8 align-items-center">
                                            {item?.icon}
                                            <p className="m-0 p-0 grey-text-accent text-xxs">{item?.name}</p>
                                        </Link>
                                    ))}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <div className="p2p-market-header dark-bg-accent d-flex flex-column gap-16 radius-xl mb-8">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-16">
                            <button
                                onClick={() => setSide('buy')}
                                type="button"
                                className={`btn-transparent text-ms ${side == 'buy' ? 'white-text' : 'grey-text'}`}>
                                Buy
                            </button>
                            <button
                                onClick={() => setSide('sell')}
                                type="button"
                                className={`btn-transparent text-ms ${side == 'sell' ? 'white-text' : 'grey-text'}`}>
                                Sell
                            </button>
                        </div>

                        <div className="d-flex align-items-center gap-8">
                            <button
                                type="button"
                                onClick={() => setShowModalSelectCurrency(!showModalSelectCurrency)}
                                className="btn-transparent grey-text-accent text-ms">
                                {fiat?.toUpperCase()}
                            </button>
                            <span className="cursor-pointer">
                                <FilterMobileIcon />
                            </span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-start align-items-center gap-16 w-100">
                        {currencies?.map((cur, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrency(cur?.currency)}
                                type="button"
                                className={`btn-transparent py-10 w-auto ${currency == cur?.currency && 'active'}`}>
                                <span className={` ${currency == cur?.currency ? 'gradient-text' : 'grey-text'}`}>
                                    {cur?.currency?.toUpperCase()}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <Link to={`/p2p/create-offer`} className="btn-primary text-xxs">
                            Create Offer +
                        </Link>

                        <div
                            onClick={() => setShowFilter(!showFilter)}
                            className="d-flex align-items-center cursor-pointer">
                            <p className="m-0 p-0 grey-text text-xxs font-bold">Filter</p>
                            <DropdownFilterMobileIcon />
                        </div>
                    </div>
                </div>

                {isLoggedIn && (!privateOffer || !privateOffer[0]) ? (
                    <NoData text="No Offer Yet" />
                ) : (
                    isLoggedIn &&
                    privateOffer?.map((offer, i) => (
                        <div key={i} className="mb-8">
                            <CardOfferListMobile
                                side={side}
                                fiat={fiat}
                                currency={currency}
                                offer={offer}
                                symbol={symbol}
                            />
                        </div>
                    ))
                )}

                {!isLoggedIn && (!publicOffer || !publicOffer[0]) ? (
                    <NoData text="No Offer Yet" />
                ) : (
                    !isLoggedIn &&
                    publicOffer?.map((offer, i) => (
                        <div key={i} className="mb-8">
                            <CardOfferListMobile
                                side={side}
                                fiat={fiat}
                                currency={currency}
                                offer={offer}
                                symbol={symbol}
                            />
                        </div>
                    ))
                )}

                {isLoggedIn && <ModalMobile show={showModalAnnouncement} content={renderModalAnnouncement()} />}

                <ModalFullScreenMobile show={showModalSelectCurrency} content={renderModalSelectCurrency()} />

                <ModalFullScreenMobile
                    show={showNotif}
                    content={<P2PNotificationMobile handleShowNotif={() => setShowNotif(!showNotif)} />}
                />

                <div id="off-canvas-filter" className={`position-fixed off-canvas-filter ${showFilter ? 'show' : ''}`}>
                    <div className="fixed-bottom off-canvas-content-container-filter overflow-auto">
                        {/* <div>
                            <label className="m-0 white-text text-sm mb-8">Start Date</label>
                            <input
                                type="date"
                                className="form-control mb-24"
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}
                                value={startDate}
                                defaultValue={new Date().toISOString().slice(0, 10)}
                            />
                        </div>

                        <div>
                            <label className="m-0 white-text text-sm mb-8">End Date</label>
                            <input
                                type="date"
                                className="form-control mb-24"
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                }}
                                value={endDate}
                                defaultValue={new Date().toISOString().slice(0, 10)}
                            />
                        </div> */}

                        <div className="mb-24">
                            <label className="m-0 grey-text text-ms font-extrabold mb-16">Price</label>
                            <div className="position-relative mb-16">
                                <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">
                                    min
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={minPriceFilter}
                                    onChange={(e) => {
                                        setMinPriceFilter(e.target.value);
                                    }}
                                    placeholder="00000"
                                    className="custom-input-filter w-100 white-text"
                                />
                                <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                    {fiat?.toUpperCase()}
                                </label>
                            </div>

                            <div className="position-relative mb-16">
                                <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">
                                    max
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={maxPriceFilter}
                                    onChange={(e) => {
                                        setMaxPriceFilter(e.target.value);
                                    }}
                                    placeholder="00000"
                                    className="custom-input-filter w-100 white-text"
                                />
                                <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                    {fiat?.toUpperCase()}
                                </label>
                            </div>
                        </div>

                        <div className="mb-24">
                            <label className="m-0 grey-text text-ms font-extrabold mb-16">Amount</label>
                            <div className="position-relative mb-16">
                                <label className="input-label-left text-sm grey-text position-absolute m-0 p-0">
                                    e.g
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={amountFilter}
                                    onChange={(e) => {
                                        setAmountFilter(e.target.value);
                                    }}
                                    placeholder="00000"
                                    className="custom-input-filter w-100 white-text"
                                />
                                <label className="input-label-right text-sm grey-text position-absolute m-0 p-0">
                                    {fiat?.toUpperCase()}
                                </label>
                            </div>
                        </div>

                        <div className="mb-24">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="m-0 grey-text text-ms font-extrabold mb-16">Payment Methods</label>

                                <div className="d-flex align-items-center cursor-pointer">
                                    <p className="m-0 p-0 grey-text text-xxs font-bold">All</p>
                                    <DropdownFilterMobileIcon />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap align-items-center gap-8">
                                {payments && payments[0] ? (
                                    payments?.map((payment, i) => (
                                        <div
                                            onClick={() => handleSelectPaymentFilter(payment?.payment_id)}
                                            key={i}
                                            className={`badge-payment text-center text-sm cursor-pointer ${
                                                paymentFilter?.find((item) => item == payment?.payment_id) && 'active'
                                            }`}>
                                            <span
                                                className={` ${
                                                    paymentFilter?.find((item) => item == payment?.payment_id)
                                                        ? 'gradient-text'
                                                        : 'grey-text'
                                                }`}>
                                                {payment?.bank_name}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="m-0 p-0 text-center text-sm grey-text">No Payment Method Yet</p>
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center align-items-center">
                            <button
                                onClick={() => {
                                    setShowFilter(!showFilter);
                                    setAmountFilter('');
                                    setMaxPriceFilter('');
                                    setMinPriceFilter('');
                                    setPaymentFilter([]);
                                }}
                                type="button"
                                className="btn btn-reset grey-text-accent dark-bg-accent text-sm w-40 mr-8">
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                type="button"
                                className="btn-primary grey-text-accent text-sm font-normal w-40">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
