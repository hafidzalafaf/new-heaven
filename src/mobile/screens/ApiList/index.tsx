import * as React from 'react';
import { useIntl } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {
    alertPush,
    ApiKeyCreateFetch,
    apiKeyCreateFetch,
    ApiKeyDataInterface,
    ApiKeyDeleteFetch,
    apiKeyDeleteFetch,
    ApiKeys2FAModal,
    apiKeys2FAModal,
    apiKeysFetch,
    ApiKeyStateModal,
    ApiKeyUpdateFetch,
    apiKeyUpdateFetch,
    selectUserInfo,
    selectMobileDeviceState,
    User,
    RootState,
} from '../../../modules';
import { IntlProps } from '../../../';
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
    selectApiKeysPageIndex,
} from '../../../modules/user/apiKeys/selectors';
import { ArrowLeft } from '../../assets/Arrow';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { TrashIcon } from '../../../assets/images/TrashIcon';
import { Table, CopyableTextField } from '../../../components';
import { CodeVerification } from 'src/desktop/components';

interface ReduxProps {
    apiKeys: ApiKeyDataInterface[];
    dataLoaded: boolean;
    modal: ApiKeyStateModal;
    user: User;
    pageIndex: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    isMobile: boolean;
}

interface DispatchProps {
    toggleApiKeys2FAModal: typeof apiKeys2FAModal;
    apiKeysFetch: typeof apiKeysFetch;
    createApiKey: typeof apiKeyCreateFetch;
    updateApiKey: typeof apiKeyUpdateFetch;
    deleteApiKey: typeof apiKeyDeleteFetch;
    fetchSuccess: typeof alertPush;
}

interface ProfileApiKeysState {
    otpCode: string;
    codeFocused: boolean;
    showModalDelete: boolean;
    itemDelete: any;
}

type Props = ReduxProps & DispatchProps & IntlProps;

class ApiListMobileScreenComponent extends React.Component<Props, ProfileApiKeysState> {
    public state = {
        otpCode: '',
        codeFocused: false,
        showModalDelete: false,
        itemDelete: {},
    };

    public t = (key: string) => {
        return this.props.intl.formatMessage({ id: key });
    };

    public componentDidMount() {
        this.props.apiKeysFetch({ pageIndex: 0, limit: 4 });
    }

    public copy = (id: string) => {
        const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

        if (copyText) {
            copyText.select();

            document.execCommand('copy');
            (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
        }
    };

    public render() {
        const { apiKeys, dataLoaded, firstElemIndex, lastElemIndex, nextPageExists, pageIndex, user } = this.props;

        const renderModalContentCancel = () => (
            <React.Fragment>
                <h6 className="text-md white-text font-semibold mb-24  text-center">Are you sure to Delete Api Key?</h6>
                <p className="text-sm grey-text-accent m-0 p-0 mb-24  text-center">
                    The API Key you made will be deleted
                </p>
                <div className="d-flex  justify-content-center">
                    <button
                        className="btn btn-danger sm px-5 mr-3"
                        onClick={() => this.setState({ showModalDelete: false })}>
                        Close
                    </button>
                    <button
                        onClick={() => {
                            this.handleDeleteKeyClick(this.state.itemDelete);
                            this.setState({ showModalDelete: false });
                        }}
                        type="button"
                        className="btn btn-primary sm px-5">
                        Confirm
                    </button>
                </div>
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <div className="mobile-container api-mobile-screen no-header home-screen dark-bg-main">
                    <div className="head-container position-relative">
                        <Link to={'/profile'} className="cursor-pointer position-absolute">
                            <ArrowLeft className={'back'} />
                        </Link>
                        <h1 className="text-center text-md grey-text-accent font-bold">API Management</h1>
                    </div>
                    <div className="mt-5">
                        <h6 className="subtitle">My API Keys</h6>
                        <ul className="pl-0">
                            <li className="grey-text text-sm">1. Each account can create up to 30 API Keys.</li>
                            <li className="grey-text text-sm">
                                2. Do not disclose your API Key to anyone to avoid asset losses. It is recommended to
                                bind IP for API Key to increase your account security.
                            </li>
                            <li className="grey-text text-sm">
                                3. Be aware that your API Key may be disclosed by authorizing it to a third-party
                                platform.
                            </li>
                            <li className="grey-text text-sm">
                                4. You will not be able to create an API if KYC is not completed.
                            </li>
                        </ul>
                    </div>

                    {!user.otp && (
                        <div className="px-24">
                            <p className="mt-4  warning-text font-semibold text-md">
                                {this.t('page.mobile.profile.apiKeys.noOtp')}
                            </p>{' '}
                        </div>
                    )}

                    {user.otp && !apiKeys.length && (
                        <div className="text-center mt-4 grey-text-accent text-ms">
                            {this.t('page.mobile.profile.apiKeys.noKeys')}
                        </div>
                    )}

                    {user.otp && apiKeys.length > 0 && (
                        <div className="table-mobile-wrapper">
                            <Table header={this.getTableHeaders()} data={this.getTableData(apiKeys)} />
                        </div>
                    )}

                    {user.otp && (!apiKeys.length || apiKeys.length > 0) && (
                        <div className="mt-3 mb-4">
                            <button
                                onClick={this.handleCreateKeyClick}
                                type="button"
                                className="btn btn-primary btn-mobile btn-block">
                                Create New Api
                            </button>
                        </div>
                    )}
                </div>
                <Modal
                    show={this.props.modal.active}
                    onHide={() => this.props.toggleApiKeys2FAModal({ active: false })}>
                    <div className="p-4 modal-mobile-screen">
                        {this.renderModalHeader()}
                        {this.renderModalBody()}
                    </div>
                </Modal>

                {this.state.showModalDelete && (
                    <Modal show={this.state.showModalDelete}>
                        <div className="p-4">{renderModalContentCancel()}</div>
                    </Modal>
                )}
            </React.Fragment>
        );
    }

    private getTableHeaders = () => {
        return [
            this.t('page.mobile.profile.apiKeys.item.kid'),
            this.t('page.mobile.profile.apiKeys.item.algorithm'),
            this.t('page.mobile.profile.apiKeys.item.state'),
            this.t('page.mobile.profile.apiKeys.item.status'),
            this.t('page.mobile.profile.apiKeys.item.action'),
        ];
    };

    private getTableData(apiKeysData: ApiKeyDataInterface[]) {
        return apiKeysData.map((item) => [
            item.kid,
            item.algorithm,
            <div>
                <span className={item.state === 'active' ? 'active' : 'disabled'}>{item.state}</span>
            </div>,
            <div>
                <Form>
                    <Form.Check
                        type="switch"
                        className="w-50"
                        id={`apiKeyCheck-${item.kid}`}
                        label=""
                        onChange={this.handleToggleStateKeyClick(item)}
                        checked={item.state === 'active'}
                    />
                </Form>
            </div>,
            <p
                onClick={() => {
                    this.setState({ itemDelete: item, showModalDelete: true });
                }}
                className="delete-button">
                <TrashIcon />
            </p>,
        ]);
    }

    private renderModalHeader = () => {
        const headerText =
            this.props.modal.action === 'createSuccess'
                ? this.t('page.mobile.profile.apiKeys.modal.created_header')
                : this.t('page.mobile.profile.apiKeys.modal.header');

        return (
            <div className="d-flex justify-content-between">
                <h3 className="mb-24 white-text text-xl font-bold">{headerText}</h3>

                <span className="cursor-pointer" onClick={this.handleHide2FAModal}>
                    <CloseIcon className="close-icon" />
                </span>
            </div>
        );
    };

    private renderModalBody = () => {
        const { otpCode, codeFocused } = this.state;
        const { modal, isMobile } = this.props;
        const secret = modal && modal.apiKey ? modal.apiKey.secret : '';
        let body;
        let button;
        const isDisabled = !otpCode.match(/.{6}/g);
        switch (this.props.modal.action) {
            case 'createKey':
                button = (
                    <Button
                        block={true}
                        onClick={this.handleCreateKey}
                        disabled={isDisabled}
                        size="lg"
                        variant="primary">
                        {/* {this.t('page.body.profile.apiKeys.modal.btn.create')} */}
                        Submit
                    </Button>
                );
                break;
            case 'createSuccess':
                button = (
                    <Button block={true} onClick={this.handleCreateSuccess} size="lg" variant="primary">
                        {/* {this.t('page.body.profile.apiKeys.modal.btn.create')} */}
                        Submit
                    </Button>
                );

                // This is modal body for success creating API
                body = (
                    <form>
                        <div className="mb-3">
                            <h6 className="text-ms grey-text-accent font-bold">Secret Key</h6>
                            <p className="text-sm grey-text">
                                This information will be shown only once and cannot be retrieved once lost. Please store
                                it properly.
                            </p>
                            <div className="mb-3">
                                <label className="mb-3 grey-text-accent text-sm font-semibold">Key ID</label>
                                <fieldset onClick={() => this.handleCopy('access-key-id', 'access')}>
                                    <CopyableTextField
                                        className="ml-3 w-100"
                                        fieldId={'access-key-id'}
                                        value={(modal.apiKey && modal.apiKey.kid) || ''}
                                        copyButtonText={this.t('page.mobile.profile.content.copyLink')}
                                        label={this.t('page.mobile.profile.apiKeys.modal.access_key')}
                                    />
                                </fieldset>
                            </div>
                            <div className="mb-3">
                                <label className="mb-3 grey-text-accent text-sm font-semibold">Secret Key</label>
                                <fieldset onClick={() => this.handleCopy('secret-key-id', 'secret')}>
                                    <CopyableTextField
                                        className=""
                                        fieldId={'secret_key-id'}
                                        value={secret || ''}
                                        copyButtonText={this.t('page.mobile.profile.content.copyLink')}
                                        label={this.t('page.mobile.profile.apiKeys.modal.access_key')}
                                    />
                                </fieldset>
                            </div>

                            <ul className="pl-2">
                                <span className="text-xxs grey-text">Note:</span>
                                <li className="text-xxs grey-text">
                                    To avoid asset loss, please do not tell your Secret Key and Private Key to others
                                </li>
                                <li className="text-xxs grey-text">
                                    If you forget your Secret Key, please delete it and apply for the new Secret Key
                                    pair{' '}
                                </li>
                            </ul>
                            <div className="button-confirmation">{button}</div>
                        </div>
                    </form>
                );
                break;
            case 'updateKey':
                button = (
                    <Button
                        block={true}
                        onClick={this.handleUpdateKey}
                        disabled={isDisabled}
                        size="lg"
                        variant="primary">
                        {modal.apiKey && modal.apiKey.state === 'active'
                            ? this.t('page.mobile.profile.apiKeys.modal.btn.disabled')
                            : this.t('page.mobile.profile.apiKeys.modal.btn.activate')}
                    </Button>
                );
                break;
            case 'deleteKey':
                button = (
                    <Button
                        block={true}
                        onClick={this.handleDeleteKey}
                        disabled={isDisabled}
                        size="lg"
                        variant="primary">
                        {this.t('page.mobile.profile.apiKeys.modal.btn.delete')}
                    </Button>
                );
                break;
            default:
                break;
        }
        body = !body ? (
            <div>
                <div className="text-sm white-text mb-12">{this.t('page.mobile.profile.apiKeys.modal.title')}</div>
                <div>
                    <CodeVerification
                        code={otpCode}
                        onChange={this.handleOtpCodeChange}
                        onSubmit={this.handleEnterPress}
                        codeLength={6}
                        type="text"
                        placeholder="______"
                        inputMode="decimal"
                        showPaste2FA={false}
                        isMobile={isMobile}
                    />
                </div>
                <div>{button}</div>
            </div>
        ) : (
            body
        );

        return <React.Fragment>{body}</React.Fragment>;
    };

    private handleHide2FAModal = () => {
        const payload: ApiKeys2FAModal['payload'] = { active: false };
        this.props.toggleApiKeys2FAModal(payload);
        this.setState({ otpCode: '' });
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private renderOnClick = () => {
        switch (this.props.modal.action) {
            case 'createKey':
                this.handleCreateKey();
                break;
            case 'createSuccess':
                this.handleCreateSuccess();
                break;
            case 'updateKey':
                this.handleUpdateKey();
                break;
            case 'deleteKey':
                this.handleDeleteKey();
                break;
            default:
                break;
        }
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.renderOnClick();
        }
    };

    private handleCreateKeyClick = () => {
        const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'createKey' };
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleCreateKey = () => {
        const payload: ApiKeyCreateFetch['payload'] = { totp_code: this.state.otpCode };
        this.props.createApiKey(payload);
        this.setState({ otpCode: '' });
    };

    private handleCreateSuccess = () => {
        const payload: ApiKeys2FAModal['payload'] = { active: false };
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleToggleStateKeyClick = (apiKey) => () => {
        const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'updateKey', apiKey };
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleUpdateKey = () => {
        const apiKey: ApiKeyDataInterface = { ...this.props.modal.apiKey } as any;
        apiKey.state = apiKey.state === 'active' ? 'disabled' : 'active';
        const payload: ApiKeyUpdateFetch['payload'] = { totp_code: this.state.otpCode, apiKey: apiKey };
        this.props.updateApiKey(payload);
        this.setState({ otpCode: '' });
    };

    private handleCopy = (id: string, type: string) => {
        this.copy(id);
        this.props.fetchSuccess({ message: [`success.api_keys.copied.${type}`], type: 'success' });
    };

    private handleDeleteKeyClick = (apiKey) => {
        const payload: ApiKeys2FAModal['payload'] = { active: true, action: 'deleteKey', apiKey };
        this.props.toggleApiKeys2FAModal(payload);
    };

    private handleDeleteKey = () => {
        const { modal } = this.props;
        const payload: ApiKeyDeleteFetch['payload'] = {
            kid: (modal.apiKey && modal.apiKey.kid) || '',
            totp_code: this.state.otpCode,
        };
        this.props.deleteApiKey(payload);
        this.setState({ otpCode: '' });
    };

    private onClickPrevPage = () => {
        const { pageIndex } = this.props;
        this.props.apiKeysFetch({ pageIndex: Number(pageIndex) - 1, limit: 4 });
    };

    private onClickNextPage = () => {
        const { pageIndex } = this.props;
        this.props.apiKeysFetch({ pageIndex: Number(pageIndex) + 1, limit: 4 });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    apiKeys: selectApiKeys(state),
    dataLoaded: selectApiKeysDataLoaded(state),
    modal: selectApiKeysModal(state),
    user: selectUserInfo(state),
    pageIndex: selectApiKeysPageIndex(state),
    firstElemIndex: selectApiKeysFirstElemIndex(state, 4),
    lastElemIndex: selectApiKeysLastElemIndex(state, 4),
    nextPageExists: selectApiKeysNextPageExists(state),
    isMobile: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    toggleApiKeys2FAModal: (payload: ApiKeys2FAModal['payload']) => dispatch(apiKeys2FAModal(payload)),
    apiKeysFetch: (payload) => dispatch(apiKeysFetch(payload)),
    createApiKey: (payload) => dispatch(apiKeyCreateFetch(payload)),
    updateApiKey: (payload) => dispatch(apiKeyUpdateFetch(payload)),
    deleteApiKey: (payload) => dispatch(apiKeyDeleteFetch(payload)),
    fetchSuccess: (payload) => dispatch(alertPush(payload)),
});

const connected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ApiListMobileScreenComponent)) as any;
const ApiListMobileScreen = withRouter(connected);

export { ApiListMobileScreen };
