import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { MobileFilterIcon } from 'src/assets/images/P2PIcon';
import { ModalUserLevel, P2PPaymentMethodProps } from 'src/desktop/components';
import { capitalizeFirstLetter } from 'src/helpers';
import { ArrowLeft, ArrowRight } from 'src/mobile/assets/Arrow';
import { ModalFullScreenMobile, PaginationMobile } from 'src/mobile/components';
import {
    p2pCurrenciesFetch,
    p2pPaymentUserFetch,
    p2pProfileFetch,
    selectLoadingAbilities,
    selectP2PCurrenciesData,
    selectP2PPaymentUser,
    selectP2PPaymentUserDeleteSuccess,
    selectUserInfo,
} from 'src/modules';

import './P2PPaymentMethodMobileScreen.pcss';

export const P2PPaymentMethodMobileScreen = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const paymentMethods: any = useSelector(selectP2PPaymentUser);
    const deleteSuccess = useSelector(selectP2PPaymentUserDeleteSuccess);
    const currenciesData = useSelector(selectP2PCurrenciesData);
    const user = useSelector(selectUserInfo);

    const [loading, setLoading] = React.useState(true);
    const [showChooseBankType, setShowChooseBankType] = React.useState(false);
    const [fiat, setFiat] = React.useState('IDR');
    const [data, setData] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [limit, setLimit] = React.useState(5);
    const [showModalUserLevel, setShowModalUserLevel] = React.useState(false);

    React.useEffect(() => {
        dispatch(p2pPaymentUserFetch({ pageIndex: currentPage, limit: limit, type: '' }));
        dispatch(p2pProfileFetch());
        setLoading(false);
    }, [dispatch, deleteSuccess, currentPage]);

    React.useEffect(() => {
        dispatch(p2pCurrenciesFetch({ fiat }));
    }, [dispatch, fiat]);

    React.useEffect(() => {
        setData(paymentMethods?.list);
    }, [paymentMethods]);

    const AvailableBankForPaymentMethod = () => {
        return (
            <section>
                <div className="d-flex justify-content-start align-items-center mb-32">
                    <div onClick={() => setShowChooseBankType(false)}>
                        <ArrowLeft className={'cursor-pointer'} />
                    </div>
                    <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Select Payment Methods</p>
                </div>
                <div className="d-flex flex-column gap-16">
                    {currenciesData.payment.map((bank) => (
                        <Link
                            to={`/p2p/payment-method/create/${bank.symbol}`}
                            className="bg-soft p-3 radius-lg d-flex flex-row justify-content-between align-items-center grey-text-accent">
                            <div className="d-flex flex-row gap-16 align-items-center">
                                <img
                                    src={bank.logo}
                                    alt={bank.symbol}
                                    width="auto"
                                    height={bank.symbol === 'BTN' ? `50` : `20`}
                                />
                                <span>{bank.symbol}</span>
                            </div>
                            <ArrowRight className={''} />
                        </Link>
                    ))}
                </div>
            </section>
        );
    };

    const PaymentMethodList = ({ data }) => {
        // const paymentList = data.list
        return (
            <div className="d-flex flex-column gap-16 payment-method-list">
                {data?.map((item, i) => (
                    <div
                        // onClick={() => handleChangePaymentMethod(bank)}
                        key={i}
                        className="modal-bank-info-container cursor-pointer bg-soft p-3 radius-lg">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="d-flex align-items-center gap-4">
                                <div className="label-payment"></div>
                                <p className="m-0 p-0 grey-text-accent text-ms">{capitalizeFirstLetter(item?.tipe)}</p>
                            </div>

                            <Link
                                to={`/p2p/payment-method/edit/${item.payment_user_uid}`}
                                className="d-flex align-items-center gap-16">
                                <img src={item?.logo} alt="logo" width={40} className="h-auto" />
                                <ArrowRight className={''} />
                            </Link>
                        </div>

                        <p className="m-0 p-0 grey-text-accent text-ms">{item?.account_name}</p>
                        <p className="m-0 p-0 grey-text-accent text-ms font-bold">{item?.account_number}</p>
                        <p className="m-0 p-0 grey-text text-ms">{item?.symbol}</p>
                    </div>
                ))}
                <PaginationMobile
                    nextPageExists={paymentMethods.nextPageExists}
                    page={currentPage}
                    onClickPrevPage={() => setCurrentPage(currentPage - 1)}
                    onClickNextPage={() => setCurrentPage(currentPage + 1)}
                    firstElementIndex={currentPage * limit}
                    lastElementIndex={currentPage * limit}
                />
            </div>
        );
    };

    return (
        <section className="pg-mobile-screen-p2p mobile-container position-relative">
            <ModalFullScreenMobile show={showChooseBankType} content={<AvailableBankForPaymentMethod />} />
            <div className="d-flex justify-content-start align-items-center mb-32">
                <div onClick={() => history.goBack()}>
                    <ArrowLeft className={'cursor-pointer'} />
                </div>
                <p className="m-0 p-0 grey-text-accent text-md font-extrabold mx-auto">Payment Methods</p>
            </div>
            <PaymentMethodList data={data} />
            {!loading && (
                <button
                    onClick={user?.level < 3 ? () => setShowModalUserLevel(true) : () => setShowChooseBankType(true)}
                    className="bottom-fixed-button btn-primary position-sticky">
                    Add New Payment Method
                </button>
            )}
            {showModalUserLevel && (
                <ModalUserLevel
                    show={showModalUserLevel}
                    title={'Add Payment Method'}
                    onClose={() => setShowModalUserLevel(false)}
                />
            )}
        </section>
    );
};
