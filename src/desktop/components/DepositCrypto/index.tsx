import React from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { formatCCYAddress } from '../../../helpers';
import { Wallet } from '../../../modules';
import { QRCode, Tooltip, Decimal, CopyableTextField } from '../../../components';
import { TipIcon } from '../../../assets/images/TipIcon';

export interface DepositCryptoProps {
    /**
     * Wallet
     */
    wallet: Wallet;
    /**
     * Blockchain
     */
    network: string;
    /**
     * Data which is used to display error if data is undefined
     */
    error: string;
    /**
     * Defines the size of QR code component.
     * @default 118
     */
    dimensions?: number;
    /**
     *  Renders text of a component
     */
    text?: string;
    /**
     * @default 'Deposit by Wallet Address'
     * Renders text of the label of CopyableTextField component
     */
    copiableTextFieldText?: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * Renders text alert about success copy address
     */
    handleOnCopy: () => void;
    /**
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
    /**
     * Generate address button label
     */
    buttonLabel?: string;
    disabled?: boolean;
    minDepositAmount?: string;
}

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const { formatMessage } = useIntl();

    const QR_SIZE = 118;
    const {
        buttonLabel,
        copiableTextFieldText,
        copyButtonText,
        dimensions,
        error,
        handleGenerateAddress,
        handleOnCopy,
        text,
        wallet,
        network,
        minDepositAmount,
    } = props;

    const depositAddress = wallet.deposit_addresses?.find(
        (address) => address.blockchain_key?.toLowerCase() === network?.toLowerCase()
    );
    const size = dimensions || QR_SIZE;
    const disabled = !depositAddress?.address;
    const onCopy = !disabled ? handleOnCopy : undefined;
    const getDepositAddress = (addressData, currency) => {
        const address = addressData?.address?.split('?')[0];
        return address ? formatCCYAddress(currency, address) : '';
    };
    const walletAddress = getDepositAddress(depositAddress, wallet.currency);
    const getDepositTag = (addressData) => addressData?.address?.split('?')[1]?.split('=')[1];
    const walletTag = getDepositTag(depositAddress);

    const renderMemo = React.useMemo(() => {
        return (
            <React.Fragment>
                <fieldset onClick={onCopy}>
                    <CopyableTextField
                        className=""
                        value={walletTag || ''}
                        fieldId={walletTag ? 'copy_memo_1' : 'copy_memo_2'}
                        copyButtonText={copyButtonText}
                        disabled={disabled}
                        label={formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.memo' })}
                    />
                </fieldset>
                <p>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.memo.warning' })}</p>
            </React.Fragment>
        );
    }, [walletTag]);

    if (!depositAddress) {
        return (
            <div>
                <Button block={true} type="button" onClick={handleGenerateAddress} size="lg" variant="primary">
                    {buttonLabel ? buttonLabel : 'Generate deposit address'}
                </Button>
            </div>
        );
    }

    if (props.disabled) {
        return (
            <div>
                {formatMessage(
                    { id: 'page.body.wallets.tabs.deposit.ccy.disabled' },
                    { currency: wallet?.currency.toUpperCase() }
                )}
            </div>
        );
    }

    return (
        <React.Fragment>
            <div>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 300 }}
                    overlay={<Tooltip title="page.body.wallets.tabs.deposit.min.amount.tip" />}>
                    <div>
                        <TipIcon />
                    </div>
                </OverlayTrigger>
                <span>
                    {formatMessage({ id: 'page.body.wallets.tabs.deposit.min.deposit' })}&nbsp;
                    <span>
                        <Decimal fixed={wallet.fixed}>{minDepositAmount?.toString()}</Decimal>
                        &nbsp;{wallet.currency?.toUpperCase()}
                    </span>
                </span>
            </div>
            <h5>{`${wallet?.name} (${wallet?.currency.toUpperCase()})`}</h5>

            <p>{text}</p>
            {walletAddress ? (
                <div>
                    <QRCode dimensions={size} data={walletAddress} />
                </div>
            ) : null}
            <fieldset onClick={onCopy}>
                <CopyableTextField
                    className=""
                    value={walletAddress || error}
                    fieldId={walletAddress ? 'copy_deposit_1' : 'copy_deposit_2'}
                    copyButtonText={copyButtonText}
                    disabled={disabled}
                    label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                />
            </fieldset>
            {walletTag && renderMemo}
            <h5>
                {formatMessage(
                    { id: 'page.body.wallets.tabs.deposit.ccy.hint.title' },
                    { currency: wallet?.currency.toUpperCase() }
                )}
            </h5>
            <p>
                {formatMessage(
                    { id: 'page.body.wallets.tabs.deposit.ccy.hint' },
                    { currency: wallet?.currency.toUpperCase() }
                )}
            </p>
        </React.Fragment>
    );
};

export { DepositCrypto };
