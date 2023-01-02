import classnames from 'classnames';
import * as React from 'react';
import { CellData, Table } from '../../../components';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Sell, Buy } from '../../../assets/images/TradeIcon';
import { Form, Spinner } from 'react-bootstrap';
import { isLogin } from '@ionic/cli';

export interface OpenOrdersProps {
    /**
     * List of open orders, takes order side ('buy' | 'sell') as last element of a row
     */
    data: CellData[][];
    /**
     * Callback that is called when cancel button of order row is clicked
     */
    onCancel: (index: number) => void;
    /**
     * List of headers for open orders table
     */
    headers?: React.ReactNode[];
    /**
     * List of headers keys for open orders table
     */
    headersKeys?: React.ReactNode[];
    /**
     * toggleByOrderType function
     */
    function?: () => void;

    handleToggle?: (event) => void;

    handleCancelAll?: () => void;

    hideOthrerPairs?: boolean;
}

export class OpenOrders extends React.Component<OpenOrdersProps> {
    private defaultHeaders = ['Date', 'Action', 'Price', 'Amount', ''];
    private defaultHeadersKeys = ['Date', 'Action', 'Price', 'Amount', ''];

    public render() {
        const { headers = this.defaultHeaders } = this.props;
        const { headersKeys = this.defaultHeadersKeys } = this.props;
        const tableData = this.props.data.map(this.renderRow);
        const orderIndex = headersKeys.findIndex((header) => header === 'Order Type');

        if (headersKeys[orderIndex] === 'Order Type') {
            headers[orderIndex] = <span onClick={this.props.function}>Order Type</span>;
        }

        return (
            <div className="max-400">
                <div className="d-flex justify-content-between dark-bg-accent sort-filter">
                    <p className="white-text font-bold text-sm">Open orders</p>
                    <div className="filter">
                        <div className="d-flex align-items-center">
                            <p className="text-sm grey-text font-bold mb-0 mr-2">Sort by: </p>
                            <button className="btn btn-transparent w-auto danger-text text-sm font-bold">
                                Sell
                                <Sell />
                            </button>
                            <button className="btn btn-transparent w-auto contrast-text text-sm font-bold">
                                Buy
                                <Buy />
                            </button>
                            <div className="form-group form-check mb-0">
                                <Form className="cr-title-component__checkbox" onClick={this.props.handleToggle}>
                                    <Form.Check
                                        type="checkbox"
                                        custom
                                        id="hideOtherPairs"
                                        checked={this.props.hideOthrerPairs}
                                        readOnly={true}
                                        label={'Hide All Pairs'}
                                        className={'form-check-input'}
                                    />
                                </Form>
                            </div>
                            <p
                                className="text-sm danger-text font-bold mb-0 ml-2 cursor-pointer"
                                onClick={this.props.handleCancelAll}>
                                Cancel All
                            </p>
                        </div>
                    </div>
                </div>
                {isLogin ? <Table header={headers} data={tableData as CellData[][]} /> : ''}
            </div>
        );
    }

    public renderCell = (rowIndex: number) => (cell: CellData, index: number, row: CellData[]) => {
        const { headersKeys = this.defaultHeadersKeys } = this.props;
        const actionIndex = headersKeys.findIndex((header) => header === 'Action');
        const orderIndex = headersKeys.findIndex((header) => header === 'Order Type');
        const buySellIndex = headersKeys.findIndex((header) => header === '');
        switch (index) {
            case actionIndex:
                return this.renderAction(row[actionIndex] as string, row[buySellIndex] as string);
            case orderIndex:
                return this.renderOrder(row[buySellIndex] as string);
            case buySellIndex:
                return this.renderCancelButton(rowIndex);
            default:
                return cell;
        }
    };

    public renderRow = (row: CellData[], index: number) => {
        return row.map(this.renderCell(index)); // format cells and remove first column of order side
    };

    public renderAction(actionName: string, actionType: string) {
        const action = actionType ? actionType.toLowerCase() : actionType;
        const classNames = classnames('cr-open-orders__price', {
            'cr-open-orders__price--buy': action === 'buy',
            'cr-open-orders__price--sell': action === 'sell',
        });

        return <span className={classNames}>{actionName}</span>;
    }

    public renderOrder(orderType: string) {
        // tslint:disable-next-line:no-magic-numbers
        const type = orderType ? orderType.toLowerCase().slice(0, 3) : orderType;
        const classNames = classnames('cr-open-orders__order', {
            'cr-open-orders__order--buy': type === 'buy',
            'cr-open-orders__order--sell': type === 'sel',
        });

        return <span className={classNames}>{orderType}</span>;
    }

    public renderCancelButton = (index: number) => {
        return <CloseIcon onClick={this.handleCancel(index)} />;
    };

    private handleCancel = (index: number) => () => {
        this.props.onCancel(index);
    };
}
