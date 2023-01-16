import * as React from 'react';
import { InputGroup, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import { RefreshIcon, CheckIcon } from 'src/assets/images/P2PIcon';
import { CustomStylesSelect } from '../../../desktop/components';
import Select from 'react-select';
import '../../../styles/colors.pcss';

export const TableListP2P = () => {
    const [side, setSide] = React.useState('buy');

    const optionQuote = [
        { label: <p className="m-0 text-sm grey-text-accent">USDT</p>, value: 'usdt' },
        { label: <p className="m-0 text-sm grey-text-accent">IDR</p>, value: 'idr' },
        { label: <p className="m-0 text-sm grey-text-accent">BTC</p>, value: 'btc' },
        { label: <p className="m-0 text-sm grey-text-accent">TRX</p>, value: 'trx' },
    ];

    const optionPayment = [
        { label: <p className="m-0 text-sm grey-text-accent">All Payment</p>, value: 'all' },
        { label: <p className="m-0 text-sm grey-text-accent">Dana</p>, value: 'dana' },
        { label: <p className="m-0 text-sm grey-text-accent">Bank BCA</p>, value: 'bca' },
    ];

    return (
        <React.Fragment>
            <div className="com-table-p2p w-100">
                {/* ========= TOOLBAR START ========= */}
                <div className="d-flex align-items-start justify-content-between toolbar-p2p w-100">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center btn-type-side mb-24">
                            <button type="button" onClick={() => setSide('buy')} className="btn-side success">
                                Buy
                            </button>
                            <button type="button" onClick={() => setSide('sell')} className="btn-side danger">
                                Sell
                            </button>
                        </div>

                        <div className="select-filter mr-16">
                            <Select
                                // value={optionQuote.filter(function (option) {
                                //     return option.value === status;
                                // })}
                                styles={CustomStylesSelect}
                                options={optionQuote}
                                // onChange={(e) => {
                                //     setStatus(e.value);
                                //     filterredStatus(e.value);
                                // }}
                            />
                        </div>

                        {/* <div>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="Text input with dropdown button" />

                            <DropdownButton
                                variant="outline-secondary"
                                title="Dropdown"
                                id="input-group-dropdown-2"
                                align="end">
                                <Dropdown.Item href="#">Action</Dropdown.Item>
                                <Dropdown.Item href="#">Another action</Dropdown.Item>
                                <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">Separated link</Dropdown.Item>
                            </DropdownButton>
                        </InputGroup>
                    </div> */}

                        <div className="select-filter mr-16">
                            <Select
                                // value={optionQuote.filter(function (option) {
                                //     return option.value === status;
                                // })}
                                styles={CustomStylesSelect}
                                options={optionPayment}
                                // onChange={(e) => {
                                //     setStatus(e.value);
                                //     filterredStatus(e.value);
                                // }}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <button className="grey-text btn-refresh mr-16">
                            <RefreshIcon fillColor={'var(--text-grey-color)'} /> Refresh
                        </button>

                        <button className="btn-primary">+ Create Offers</button>
                    </div>
                </div>
                {/* ========= TOOLBAR END ========= */}

                {/* ========= TABLE BUY START ========= */}
                {side === 'buy' && (
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
                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-success">Buy USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-success">Buy USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-success">Buy USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-success">Buy USDT</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                {/* ========= TABLE BUY END ========= */}

                {/* ========= TABLE SELL START ========= */}
                {side === 'sell' && (
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
                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-danger">Sell USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-danger">Sell USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-danger">Sell USDT</button>
                                </td>
                            </tr>

                            <tr className="white-text border-table">
                                <td>
                                    <div className="d-flex align-items-center table-row">
                                        <img src="/img/coin.png" alt="coin" className="mr-16" />
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <p className="p-0 m-0 mr-12 text-sm font-bold">USDT - Trader</p>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <p className="p-0 m-0 text-xs mr-8">1.253 Orders</p>
                                                <p className="p-0 m-0 text-xs ">90,1 % Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-xs font-bold">16,749.00 IDR</td>
                                <td>
                                    <div className="d-flex text-xs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Available</p>
                                        <p className="m-0 p-0">1,000 USDT</p>
                                    </div>

                                    <div className="d-flex text-xxs font-bold mb-6">
                                        <p className="m-0 p-0 mr-8">Limit</p>
                                        <p className="m-0 p-0">200.00-4,080.00 AED</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-wrap align-items-center label-bank-container">
                                        <div className="label-bank">
                                            <img src="/img/logo-jago.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-shopee.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-bca.png" alt="logo" />
                                        </div>

                                        <div className="label-bank">
                                            <img src="/img/logo-dana.png" alt="logo" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-danger">Sell USDT</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
                {/* ========= TABLE SELL END ========= */}
            </div>
        </React.Fragment>
    );
};
