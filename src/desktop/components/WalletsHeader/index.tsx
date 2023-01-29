import * as React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { FilterInput } from '..';
import { Wallet } from '../../../modules';

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
    status?: string;
    network?: any;
    last: any;
    marketId: string;
}

interface ParentProps {
    wallets: Wallet[];
    nonZeroSelected: boolean;
    setFilterValue: (value: string) => void;
    setFilteredWallets: (value: ExtendedWallet[]) => void;
    handleClickCheckBox: (value: boolean) => void;
}

/**
 * Component for displaying search field and checkbox for Overview, Spot, P2P, Transfers Wallets tabs
 */
export const WalletsHeader: React.FunctionComponent<ParentProps> = (props: ParentProps) => {
    const { wallets, nonZeroSelected } = props;

    const intl = useIntl();

    const searchFilter = (row: Wallet, searchKey: string) => {
        props.setFilterValue(searchKey);
        return row
            ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
                  row.currency?.toLowerCase().includes(searchKey.toLowerCase())
            : false;
    };

    const handleFilter = (result: object[]) => {
        props.setFilteredWallets(result as ExtendedWallet[]);
    };

    const handleToggleCheckbox = React.useCallback(
        (event) => {
            event.preventDefault();
            props.handleClickCheckBox(!nonZeroSelected);
        },
        [nonZeroSelected, props.handleClickCheckBox]
    );

    return (
        <div className="cr-wallets-header d-flex align-items-center mb-24">
            <div className="cr-wallets-header__search ">
                <FilterInput
                    data={wallets}
                    onFilter={handleFilter}
                    filter={searchFilter}
                    placeholder={intl.formatMessage({ id: 'page.body.wallets.overview.seach' })}
                    className="mr-24"
                />
            </div>

            <Form as={Row} className="mb-1 ml-2 " controlid="formHorizontalCheck" onClick={handleToggleCheckbox}>
                <Col sm={{ span: 20, offset: 0 }}>
                    <Form.Check
                        type="checkbox"
                        custom
                        id="nonZeroSelected"
                        checked={nonZeroSelected}
                        readOnly={true}
                        label={intl.formatMessage({ id: 'page.body.wallets.overview.nonZero' })}
                        className="text-sm grey-text-accent m-0 d-flex justify-content-center align-items-center"
                    />
                </Col>
            </Form>
        </div>
    );
};
