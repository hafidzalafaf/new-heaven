import cr from 'classnames';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router';
import { IntlProps } from '../../../';
import { CodeVerification, Pagination } from '../../components';
import { CopyableTextField, Table } from '../../../components';
import { localeDate } from '../../../helpers/localeDate';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import Modal from 'react-bootstrap/Modal';
import { NoData } from '../../components';

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
    RootState,
    selectMobileDeviceState,
    selectUserInfo,
    User,
} from '../../../modules';

import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
    selectApiKeysPageIndex,
} from '../../../modules/user/apiKeys/selectors';

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

class ProfileApiKeysComponent extends React.Component<Props, ProfileApiKeysState> {
    public state = {
        otpCode: '',
        codeFocused: false,
        showModalDelete: false,
        itemDelete: {},
    };

    public t = (key: string) => {
        return this.props.intl.formatMessage({ id: key });
    };

    public copy = (id: string) => {
        const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

        if (copyText) {
            copyText.select();

            document.execCommand('copy');
            (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
        }
    };

    public componentDidMount() {
        this.props.apiKeysFetch({ pageIndex: 0, limit: 4 });
    }

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
                <div className="api-screen dark-bg-accent pb-5">
                    <div className="header dark-bg-main py-4 px-24 mb-24">
                        <h2 className="mb-0 text-xl white-text font-bold ">API Management</h2>
                    </div>
                    <div className="px-24">
                        <div className="d-flex justify-content-between mb-24">
                            <h6 className="text-md white-text font-semibold mb-0">My API Keys</h6>
                            <div className="button">
                                {user.otp && dataLoaded && (
                                    <div>
                                        <div
                                            className="btn btn-transparent w-auto gradient-text font-bold text-ms mr-3"
                                            onClick={this.handleCreateKeyClick}>
                                            {this.t('page.body.profile.apiKeys.header.create')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mb-24">
                            <p className="text-sm mb-2 grey-text-accent">
                                1. Each account can create up to 30 API Keys.
                            </p>
                            <p className="text-sm mb-2 grey-text-accent">
                                2. Do not disclose your API Key to anyone to avoid asset losses. It is recommended to
                                bind IP for API Key to increase your account security.
                            </p>
                            <p className="text-sm mb-2 grey-text-accent">
                                3. Be aware that your API Key may be disclosed by authorizing it to a third-party
                                platform.
                            </p>
                            <p className="text-sm mb-2 grey-text-accent">
                                4. You will not be able to create an API if KYC is not completed.
                            </p>
                        </div>
                    </div>

                    {!user.otp && (
                        <div className="px-24">
                            <p className="mt-4  warning-text font-semibold text-md">
                                {this.t('page.body.profile.apiKeys.noOtp')}
                            </p>
                        </div>
                    )}

                    {user.otp && dataLoaded && !apiKeys.length && <NoData text="You have no API key" />}

                    {user.otp && dataLoaded && apiKeys.length > 0 && (
                        <React.Fragment>
                            <div className="px-24">
                                <Table header={this.getTableHeaders()} data={this.getTableData(apiKeys)} />
                                <Pagination
                                    firstElemIndex={firstElemIndex}
                                    lastElemIndex={lastElemIndex}
                                    page={pageIndex}
                                    nextPageExists={nextPageExists}
                                    onClickPrevPage={this.onClickPrevPage}
                                    onClickNextPage={this.onClickNextPage}
                                />
                            </div>
                        </React.Fragment>
                    )}
                </div>

                <Modal
                    show={this.props.modal.active}
                    onHide={() => this.props.toggleApiKeys2FAModal({ active: false })}>
                    <div className="p-4">
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
            this.t('page.body.profile.apiKeys.table.header.kid'),
            this.t('page.body.profile.apiKeys.table.header.algorithm'),
            this.t('page.body.profile.apiKeys.table.header.state'),
            this.t('page.body.profile.apiKeys.table.header.created'),
            this.t('page.body.profile.apiKeys.table.header.updated'),
            'Action',
            '',
        ];
    };

    private getTableData(apiKeysData: ApiKeyDataInterface[]) {
        return apiKeysData.map((item) => [
            item.kid,
            item.algorithm,
            <div>
                <span className={item.state === 'active' ? 'active' : 'disabled'}>{item.state}</span>
            </div>,
            localeDate(item.created_at, 'fullDate'),
            localeDate(item.updated_at, 'fullDate'),
            <div>
                <Form>
                    <Form.Check
                        className="cursor-pointer"
                        type="switch"
                        id={`apiKeyCheck-${item.kid}`}
                        label=""
                        onChange={this.handleToggleStateKeyClick(item)}
                        checked={item.state === 'active'}
                    />
                </Form>
            </div>,
            <p
                className="danger-text text-sm cursor-pointer"
                onClick={() => {
                    this.setState({ itemDelete: item, showModalDelete: true });
                }}>
                Delete
            </p>,
        ]);
    }

    private renderModalHeader = () => {
        const headerText =
            this.props.modal.action === 'createSuccess'
                ? this.t('page.body.profile.apiKeys.modal.created_header')
                : this.t('page.body.profile.apiKeys.modal.header');

        return (
            <div className="d-flex justify-content-between">
                <h3 className="mb-24 white-text text-xl font-bold">{headerText}</h3>
                <span className="" onClick={this.handleHide2FAModal}>
                    <ModalCloseIcon />
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
                        {this.t('page.body.profile.apiKeys.modal.btn.create')}
                    </Button>
                );
                break;
            case 'createSuccess':
                button = (
                    <Button block={true} onClick={this.handleCreateSuccess} size="lg" variant="primary">
                        {this.t('page.body.profile.apiKeys.modal.btn.create')}
                    </Button>
                );
                body = (
                    <div>
                        <div>
                            <fieldset onClick={() => this.handleCopy('access-key-id', 'access')}>
                                <CopyableTextField
                                    className=""
                                    fieldId={'access-key-id'}
                                    value={(modal.apiKey && modal.apiKey.kid) || ''}
                                    copyButtonText={this.t('page.body.profile.content.copyLink')}
                                    label={this.t('page.body.profile.apiKeys.modal.access_key')}
                                />
                            </fieldset>
                        </div>
                        <div className="secret-section">
                            <p className="secret-warning grey-text-accent text-xs">
                                <span className="secret-sign warning-text text-ms mr-2">&#9888;</span>
                                <span className="white-text text-sm">
                                    {this.t('page.body.profile.apiKeys.modal.secret_key')}
                                </span>
                                <br />
                                {this.t('page.body.profile.apiKeys.modal.secret_key_info')}
                                <span className="grey-text-accent text-sm">
                                    {this.t('page.body.profile.apiKeys.modal.secret_key_store')}
                                </span>
                            </p>
                        </div>
                        <div>
                            <fieldset onClick={() => this.handleCopy('secret-key-id', 'secret')}>
                                <CopyableTextField
                                    className=""
                                    fieldId={'secret_key-id'}
                                    value={secret || ''}
                                    copyButtonText={this.t('page.body.profile.content.copyLink')}
                                    label={this.t('page.body.profile.apiKeys.modal.secret_key')}
                                />
                            </fieldset>
                        </div>
                        <p className="note-section grey-text-accent text-xs">
                            <span className="secret-sign warning-text text-ms mr-2">&#9888;</span>
                            <span className="white-text text-sm">
                                {this.t('page.body.profile.apiKeys.modal.note')}{' '}
                            </span>
                            <br />
                            {this.t('page.body.profile.apiKeys.modal.note_content')}
                        </p>
                        <div className="button-confirmation">{button}</div>
                    </div>
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
                            ? this.t('page.body.profile.apiKeys.modal.btn.disabled')
                            : this.t('page.body.profile.apiKeys.modal.btn.activate')}
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
                        {this.t('page.body.profile.apiKeys.modal.btn.delete')}
                    </Button>
                );
                break;
            default:
                break;
        }
        body = !body ? (
            <div>
                <div className="text-sm white-text mb-12">{this.t('page.body.profile.apiKeys.modal.title')}</div>
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

const connected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileApiKeysComponent)) as any;
const ProfileApiKeys = withRouter(connected);

export { ProfileApiKeys };
