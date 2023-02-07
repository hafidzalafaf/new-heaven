import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { CheckIcon, CloseIcon, NoDataIcon } from 'src/assets/images/P2PIcon';
import '../../../styles/colors.pcss';
import { CustomStylePaymentOrder } from 'src/desktop/containers/TableListP2P/CustomStylePaymentOrder';
import Select from 'react-select';

export interface TableOfferP2PProps {
    side: string;
    list: any;
    optionPaymentOrder?: any;
    expand: string;
    currency: string;
    fiat: string;
    price: string;
    amount: string;
    payment_order?: string;
    handleChangePrice: (e: string) => void;
    handleChangePaymentOrder?: (e: string) => void;
    handleCreacteOrder: () => void;
    handleSelectOffer: (expand: string, offer_number: string, price: string) => void;
    handleCloseExpand: () => void;
    resetForm: () => void;
}

export const TableOfferP2P: React.FunctionComponent<TableOfferP2PProps> = (props) => {
    const {
        side,
        list,
        optionPaymentOrder,
        expand,
        currency,
        fiat,
        price,
        amount,
        payment_order,
        handleChangePrice,
        handleChangePaymentOrder,
        handleCreacteOrder,
        handleSelectOffer,
        handleCloseExpand,
        resetForm,
    } = props;
    const history = useHistory();
    const intl = useIntl();

    return (
        <React.Fragment>
            <table className="w-100">
                <thead className="w-100">
                    <tr className="w-100 text-xs font-bold grey-text-accent border-table">
                        <th className="table-head">Advertiser</th>
                        <th className="table-head">Price</th>
                        <th className="table-head">Available / Limit</th>
                        <th className="table-head">Payment Methods</th>
                        <th className="table-head">Trades 0 Fee(s)</th>
                    </tr>
                </thead>
                <tbody>
                    {list?.length > 1 ? (
                        list?.map((item, i) => (
                            <tr
                                key={i}
                                onClick={() => {
                                    handleSelectOffer(item?.offer_number, item?.offer_number, item?.price);
                                }}
                                className="white-text border-table cursor-pointer">
                                {expand === item.offer_number ? (
                                    <td colSpan={5} className="row-description dark-bg-main radius-lg">
                                        <div className="d-flex align-items-center justify-content-between mb-24">
                                            <div className="d-flex align-items-center">
                                                <img src="/img/bigcoin.png" alt="coin" className="mr-24" />
                                                <div>
                                                    <h2 className="m-0 p-0 white-text mb-12 text-ms fontbold">
                                                        {item?.trader?.email}
                                                    </h2>
                                                    <div className="d-flex">
                                                        <p className="p-0 m-0 text-xs mr-8">{item?.sum_order} Orders</p>
                                                        <p className="p-0 m-0 text-xs ">
                                                            {item?.persentage} % Complete
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="btn-close" onClick={() => handleCloseExpand()}>
                                                <CloseIcon />
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mb-24 py-12">
                                            <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                <p className="m-0 p-0 mr-16">Price</p>
                                                <p className="m-0 p-0 mr-4">
                                                    {item?.price} {fiat?.toUpperCase()}
                                                </p>
                                            </div>

                                            <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                <p className="m-0 p-0 mr-16">Available</p>
                                                <p className="m-0 p-0 mr-4">
                                                    {item?.available_amount} {currency?.toUpperCase()}
                                                </p>
                                            </div>

                                            <div className="padding-4 d-flex align-items-center white-text text-xs font-bold divide">
                                                <p className="m-0 p-0 mr-16">Payment Time Limit</p>
                                                <p className="m-0 p-0 mr-16">{item?.payment_time} Minutes</p>
                                            </div>

                                            <div className="padding-4 d-flex align-items-center white-text text-xs font-bold">
                                                <p className="m-0 p-0 mr-16">Seller's Payment Methods</p>
                                                <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                    {item?.payment[0]
                                                        ? item?.payment?.map((bank, i) => (
                                                              <div key={i} className="label-bank">
                                                                  <img src={bank?.logo} alt={bank?.bank_name} />
                                                              </div>
                                                          ))
                                                        : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <form className="dark-bg-accent w-50 form-buy">
                                                <h1 className="white-text text-lg mb-44">
                                                    Buy {currency?.toUpperCase()} Crypto
                                                </h1>

                                                <div className="position-relative mb-24">
                                                    <label className="white-text text-xs font-semibold mb-8">
                                                        I Want To Pay
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={'00.00'}
                                                        value={price}
                                                        onChange={(e) => handleChangePrice(e.target.value)}
                                                        required
                                                        className="form-control input-p2p-form white-text"
                                                    />
                                                    <label className="input-label-right text-sm grey-text position-absolute">
                                                        All {fiat?.toUpperCase()}
                                                    </label>
                                                </div>

                                                <div className="position-relative mb-44">
                                                    <label className="white-text text-xs font-semibold mb-8">
                                                        I Will Recieve
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={'00.00'}
                                                        value={amount}
                                                        required
                                                        className="form-control input-p2p-form white-text"
                                                    />
                                                    <label className="input-label-right text-sm grey-text position-absolute">
                                                        {currency?.toUpperCase()}
                                                    </label>
                                                </div>

                                                {side === 'sell' && (
                                                    <div className="position-relative mb-44">
                                                        <label className="white-text text-xs font-semibold mb-8">
                                                            Payment Method
                                                        </label>
                                                        <Select
                                                            value={optionPaymentOrder?.filter(function (option) {
                                                                return option.value === payment_order;
                                                            })}
                                                            styles={CustomStylePaymentOrder}
                                                            options={optionPaymentOrder}
                                                            onChange={(e) => {
                                                                handleChangePaymentOrder(e.value);
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="d-flex align-items-center justify-content-between w-100 btn-container">
                                                    <button
                                                        type="button"
                                                        onClick={resetForm}
                                                        className="w-50 btn-secondary grey-text">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCreacteOrder}
                                                        className="w-50 btn-primary">
                                                        Buy {currency?.toUpperCase()}
                                                    </button>
                                                </div>
                                            </form>

                                            <div className="w-40">
                                                <h1 className="white-text text-md mb-16">Term and Conditions :</h1>
                                                <p className="text-xs font-extrabold grey-text mb-16">
                                                    {item?.term_of_condition}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                ) : (
                                    <>
                                        <td>
                                            <div className="d-flex align-items-center table-row">
                                                <img src="/img/coin.png" alt="coin" className="mr-16" />
                                                <div>
                                                    <div className="d-flex align-items-center">
                                                        <p className="p-0 m-0 mr-12 text-sm font-bold">
                                                            {item?.trader?.email}
                                                        </p>
                                                        <span className="check">
                                                            <CheckIcon />
                                                        </span>
                                                    </div>
                                                    <div className="d-flex">
                                                        <p className="p-0 m-0 text-xs mr-8">{item?.sum_order} Orders</p>
                                                        <p className="p-0 m-0 text-xs ">
                                                            {item?.persentage} % Complete
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs font-bold">
                                            {item?.price} {fiat?.toUpperCase()}
                                        </td>
                                        <td>
                                            <div className="d-flex text-xs font-bold mb-6">
                                                <p className="m-0 p-0 mr-8">Available</p>
                                                <p className="m-0 p-0">
                                                    {item?.available_amount} {currency?.toUpperCase()}
                                                </p>
                                            </div>

                                            <div className="d-flex text-xxs font-bold mb-6">
                                                <p className="m-0 p-0 mr-8">Limit</p>
                                                <p className="m-0 p-0">
                                                    {item?.min_order}-{item?.max_order} AED
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap align-items-center label-bank-container">
                                                {item?.payment[0]
                                                    ? item?.payment?.map((bank, i) => (
                                                          <div key={i} className="label-bank">
                                                              <img src={bank?.logo} alt={bank?.bank_name} />
                                                          </div>
                                                      ))
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <button className="btn-success">Buy {currency?.toUpperCase()}</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>
                                <div className="d-flex justify-content-center align-items-center w-100 min-h-300">
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <NoDataIcon />
                                        <p className="grey-text">No Data</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </React.Fragment>
    );
};
