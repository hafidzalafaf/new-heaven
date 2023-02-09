import cr from 'classnames';
import * as countries from 'i18n-iso-countries';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { accountUploadSizeMaxRange, accountUploadSizeMinRange, languages } from '../../../api/config';
import { CustomInput, UploadFile, SearchDropdown } from '../../components';
import { formatDate, isDateInFuture, randomSecureHex } from '../../../helpers';
import {
    alertPush,
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    selectSendDocumentsSuccess,
    selectSendDocumentsLoading,
    selectUserInfo,
    User,
    sendDocuments,
    UserOffersData,
    userFetch,
} from '../../../modules';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import DocumentFrontExample from 'src/assets/images/kyc/DocumentFrontExample.svg';
import DocumentSelfieExample from 'src/assets/images/kyc/DocumentSelfieExample.svg';
import moment from 'moment';

interface ReduxProps {
    lang: string;
    success?: string;
    isMobileDevice: boolean;
    user: User;
    isLoading?: boolean;
}

interface DispatchProps {
    sendDocuments: typeof sendDocuments;
    fetchAlert: typeof alertPush;
    userFetch: typeof userFetch;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DocumentsState {
    documentsType: string;
    issuedDate: string;
    expireDate: string;
    idNumber: string;
    fileFront: File[];
    fileBack: File[];
    fileSelfie: File[];
    frontFileSizeErrorMessage: string;
    backFileSizeErrorMessage: string;
    selfieFileSizeErrorMessage: string;
    birthDate: string;
    placeBirth: string;
    name: string;
    address: string;
    district: string;
    city: string;
    province: string;
    step: string;
    country: string;
    showNotification: boolean;
    kycStatus: string;
    documentSuccess: boolean;
    // isLoading: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class KycDocumentComponent extends React.Component<Props, DocumentsState> {
    public translate = (key: string, value?: string, min?: string) =>
        this.props.intl.formatMessage({ id: key }, { value, min });

    public data = [
        this.translate('page.body.kyc.documents.select.passport'),
        this.translate('page.body.kyc.documents.select.identityCard'),
        this.translate('page.body.kyc.documents.select.driverLicense'),
    ];

    public state = {
        documentsType: '',
        issuedDate: '',
        expireDate: '',
        idNumber: '',
        fileFront: [],
        fileBack: [],
        fileSelfie: [],
        frontFileSizeErrorMessage: '',
        backFileSizeErrorMessage: '',
        selfieFileSizeErrorMessage: '',
        name: '',
        address: '',
        district: '',
        city: '',
        province: '',
        birthDate: '',
        placeBirth: '',
        step: 'profile',
        country: '',
        showNotification: true,
        kycStatus: '',
        documentSuccess: false,
        isLoading: false,
    };

    public UNSAFE_componentWillReceiveProps(next: Props) {
        this.checkStatusKyc(next);
    }

    public componentDidMount() {
        const kycData = this.props.user;
        const kycLabel = kycData.labels[0];

        if (kycLabel.key == 'document') {
            const kycStatus = kycLabel.value;
            this.setState({ kycStatus: kycStatus });
        }
    }

    public render() {
        const { isMobileDevice, lang } = this.props;
        const {
            fileFront,
            fileSelfie,
            idNumber,
            frontFileSizeErrorMessage,
            selfieFileSizeErrorMessage,
            address,
            district,
            city,
            province,
            birthDate,
            placeBirth,
            showNotification,
            kycStatus,
            documentSuccess,
        }: // isLoading,
        DocumentsState = this.state;

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));
        /* tslint:enable */

        const onSelect = (value) => this.handleChangeDocumentsType(this.data[value]);
        const dataCountries = Object.values(countries.getNames(lang)).map((item) => {
            return { label: item, value: item };
        });

        return (
            <React.Fragment>
                <div className="header dark-bg-main py-4 px-24 mb-24">
                    <h2 className="mb-0 text-xl white-text font-bold pt-2">Document Verification</h2>
                </div>
                <div className="px-24 kyc-document-screen">
                    <h6 className="text-lg white-text font-bold mb-24">Get Verifed your Government Issued ID</h6>
                    <div className="row">
                        <div className="col-lg-10 col-12">
                            {showNotification && kycStatus != 'pending' && (
                                <div className="notification-warning notification alert show text-ms white-text font-normal position-relative mb-24">
                                    Complete your identity verify to start trading with heaven exchange
                                    <div className="close-icon">
                                        <CloseIcon
                                            fill="#fff"
                                            onClick={() => this.setState({ showNotification: false })}
                                        />
                                    </div>
                                </div>
                            )}
                            {kycStatus != 'pending' && (
                                <form action="">
                                    {this.state.step == 'profile' && (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="Full name"
                                                    label="Full name"
                                                    placeholder="Full name"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={this.state.name}
                                                    handleChangeInput={this.handleChangeName}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="Your Home Address"
                                                    label="Your Home Address"
                                                    placeholder="Your Home Address"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={address}
                                                    handleChangeInput={this.handleChangeAddress}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="District"
                                                    label="District"
                                                    placeholder="District"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={district}
                                                    handleChangeInput={this.handleChangedistrict}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="City"
                                                    label="City"
                                                    placeholder="City"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={city}
                                                    handleChangeInput={this.handleChangecity}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="Province"
                                                    label="Province"
                                                    placeholder="Province"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={province}
                                                    handleChangeInput={this.handleChangeprovince}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="text-sm mb-8 white-text">Country</label>
                                                <SearchDropdown
                                                    className="pg-confirm__content-identity__forms__row__content-number-dropdown"
                                                    options={dataCountries}
                                                    onSelect={this.selectCountry}
                                                    placeholder={this.translate('page.body.kyc.identity.CoR')}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="text-sm mb-8 white-text">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    className="form-control mb-24"
                                                    onChange={(e) => {
                                                        this.handleChangeBirthDate(e);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <CustomInput
                                                    defaultLabel="Place of Birth"
                                                    label="Place of Birth"
                                                    placeholder="Place of Birth"
                                                    type="text"
                                                    labelVisible
                                                    classNameLabel="white-text text-sm"
                                                    classNameGroup="mb-24"
                                                    inputValue={placeBirth}
                                                    handleChangeInput={this.handleChangePlaceBirth}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <div className="mt-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary px-5"
                                                        onClick={() => this.setState({ step: 'document' })}>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {this.state.step == 'document' && (
                                        <React.Fragment>
                                            <div className="information mt-5">
                                                <p className="font-bold white-text text-ms mb-3">
                                                    To avoid delays when verifying account, Please make sure bellow:
                                                </p>
                                                <ul className="pl-3">
                                                    <li className="grey-text-accent mb-1 font-normal text-sm">
                                                        You can use Pasport / Driving License / National Id
                                                    </li>
                                                    <li className="grey-text-accent mb-1 font-normal text-sm">
                                                        Chosen credential must not be expired.
                                                    </li>
                                                    <li className="grey-text-accent mb-1 font-normal text-sm">
                                                        Document should be good condition and clearly visible.
                                                    </li>
                                                    <li className="grey-text-accent mb-1 font-normal text-sm">
                                                        Make sure that there is no light glare on the card.
                                                    </li>
                                                </ul>
                                                <div className="row">
                                                    <div className="col-lg-5 col-6">
                                                        <CustomInput
                                                            defaultLabel="ID Number"
                                                            label="ID Number"
                                                            placeholder="ID Number"
                                                            type="text"
                                                            labelVisible
                                                            classNameLabel="white-text text-sm"
                                                            inputValue={idNumber}
                                                            handleChangeInput={this.handleChangeIdNumber}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <UploadFile
                                                        isMobileDevice={isMobileDevice}
                                                        id="fileFront"
                                                        title={this.translate(
                                                            'page.body.kyc.documents.uploadFile.front.title'
                                                        )}
                                                        label={this.translate(
                                                            'page.body.kyc.documents.uploadFile.front.label'
                                                        )}
                                                        buttonText={this.translate(
                                                            'page.body.kyc.documents.uploadFile.front.button'
                                                        )}
                                                        sizesText={this.uploadFileSizeGuide()}
                                                        formatsText={this.translate(
                                                            'page.body.kyc.documents.uploadFile.front.formats'
                                                        )}
                                                        handleUploadScan={(uploadEvent) =>
                                                            this.handleUploadScan(uploadEvent, 'front')
                                                        }
                                                        exampleImagePath={DocumentFrontExample}
                                                        uploadedFile={fileFront[0] && (fileFront[0] as File).name}
                                                        fileSizeErrorMessage={frontFileSizeErrorMessage}
                                                    />
                                                </div>
                                                <div className="col-lg-6">
                                                    <UploadFile
                                                        isMobileDevice={isMobileDevice}
                                                        id="fileSelfie"
                                                        title={this.translate(
                                                            'page.body.kyc.documents.uploadFile.selfie.title'
                                                        )}
                                                        label={this.translate(
                                                            'page.body.kyc.documents.uploadFile.selfie.label'
                                                        )}
                                                        buttonText={this.translate(
                                                            'page.body.kyc.documents.uploadFile.selfie.button'
                                                        )}
                                                        sizesText={this.uploadFileSizeGuide()}
                                                        formatsText={this.translate(
                                                            'page.body.kyc.documents.uploadFile.selfie.formats'
                                                        )}
                                                        handleUploadScan={(uploadEvent) =>
                                                            this.handleUploadScan(uploadEvent, 'selfie')
                                                        }
                                                        exampleImagePath={DocumentSelfieExample}
                                                        uploadedFile={fileSelfie[0] && (fileSelfie[0] as File).name}
                                                        fileSizeErrorMessage={selfieFileSizeErrorMessage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mt-4">
                                                <button
                                                    className="btn btn-secondary mr-3 px-5"
                                                    onClick={() => this.setState({ step: 'profile' })}>
                                                    Back
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary px-lg"
                                                    onClick={this.sendDocuments}
                                                    disabled={this.handleCheckButtonDisabled()}>
                                                    {this.props.isLoading ? (
                                                        <Spinner animation="border" variant="primary" />
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </button>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </form>
                            )}

                            {kycStatus == 'pending' && (
                                <div className="py-5">
                                    <div className="d-flex align-items-center flex-column">
                                        <img src="/img/pending.png" alt="Pending Icon" />
                                        <h6 className="text-center white-text font-bold text-lg m-3">
                                            Waiting For Review
                                        </h6>
                                        <p className="text-sm text-center grey-text-accent">
                                            We will complete the verification within 1 to 3 business days and notify the
                                            result to you through SMS and email. <br /> To ensure your account security,
                                            the withdrawal services on KuCoin and Futures will be temporarily closed for
                                            24 hours after the setting is approved.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private checkStatusKyc = (next: Props) => {
        if (next.success && !this.props.success) {
            this.props.userFetch();
            this.props.history.push('/profile');
        } else {
            // this.setState({ isLoading: false });
        }
    };

    private selectCountry = (option) => {
        this.setState({
            country: countries.getAlpha2Code(option.value, this.props.lang),
        });
    };

    private uploadFileSizeGuide = () => {
        if (accountUploadSizeMinRange) {
            return this.translate(
                'page.body.kyc.address.uploadFile.sizeMinMax',
                accountUploadSizeMaxRange.toString(),
                accountUploadSizeMinRange.toString()
            );
        }

        return this.translate('page.body.kyc.address.uploadFile.sizeMax', accountUploadSizeMaxRange.toString());
    };

    private handleChangeDocumentsType = (value: string) => {
        this.setState({
            documentsType: value,
        });
    };

    private handleChangeIdNumber = (value: string) => {
        this.setState({
            idNumber: value,
        });
    };

    private handleChangeIssuedDate = (e: OnChangeEvent) => {
        this.setState({
            issuedDate: moment(e.target.value).format('DD/MM/YYYY'),
        });
    };

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
            expireDate: moment(e.target.value).format('DD/MM/YYYY'),
        });
    };

    private handleChangeAddress = (value: string) => {
        this.setState({
            address: value,
        });
    };
    private handleChangeName = (value: string) => {
        this.setState({
            name: value,
        });
    };
    private handleChangedistrict = (value: string) => {
        this.setState({
            district: value,
        });
    };
    private handleChangecity = (value: string) => {
        this.setState({
            city: value,
        });
    };
    private handleChangeprovince = (value: string) => {
        this.setState({
            province: value,
        });
    };
    private handleChangePlaceBirth = (value: string) => {
        this.setState({
            placeBirth: value,
        });
    };

    private handleChangeBirthDate = (e: OnChangeEvent) => {
        this.setState({
            birthDate: moment(e.target.value).format('DD/MM/YYYY'),
        });
    };

    private handleUploadScan = (uploadEvent, id) => {
        const allFiles: File[] = uploadEvent.target.files;
        const maxDocsCount = 1;
        const additionalFileList =
            Array.from(allFiles).length > maxDocsCount
                ? Array.from(allFiles).slice(0, maxDocsCount)
                : Array.from(allFiles);

        if (!additionalFileList.length) {
            return;
        }

        const sizeKB = (additionalFileList[0].size / 1024).toFixed(1);

        switch (id) {
            case 'front':
                if (additionalFileList[0].size > accountUploadSizeMaxRange * 1024 * 1024) {
                    this.setState({
                        frontFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooBig', sizeKB),
                    });
                } else {
                    this.setState({ frontFileSizeErrorMessage: '' });
                }

                this.setState({ fileFront: additionalFileList });
                break;

            case 'selfie':
                if (additionalFileList[0].size > accountUploadSizeMaxRange * 1024 * 1024) {
                    this.setState({
                        selfieFileSizeErrorMessage: this.translate('page.body.kyc.uploadFile.error.tooBig', sizeKB),
                    });
                } else {
                    this.setState({ selfieFileSizeErrorMessage: '' });
                }

                this.setState({ fileSelfie: additionalFileList });
                break;
            default:
                break;
        }
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'issuedDate':
                return !isDateInFuture(value);
            case 'expireDate':
                return isDateInFuture(value);
            case 'idNumber':
                const cityRegex = new RegExp(`^[a-zA-Z0-9]{1,255}$`);

                return Boolean(value.match(cityRegex));
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const {
            documentsType,
            fileFront,
            fileSelfie,
            idNumber,
            frontFileSizeErrorMessage,
            backFileSizeErrorMessage,
            selfieFileSizeErrorMessage,
            address,
            birthDate,
            city,
            country,
            district,
            name,
            province,
            placeBirth,
        } = this.state;

        const profileValid =
            address !== '' &&
            birthDate !== '' &&
            city !== '' &&
            country !== '' &&
            district !== '' &&
            name !== '' &&
            province !== '' &&
            placeBirth !== '';

        const filesValid =
            fileFront.length &&
            fileSelfie.length &&
            frontFileSizeErrorMessage === '' &&
            selfieFileSizeErrorMessage === '';

        return !this.handleValidateInput('idNumber', idNumber) || !filesValid || !profileValid;
    };

    private sendDocuments = async () => {
        const { documentsType, fileBack, fileFront, fileSelfie } = this.state;
        const identificator = randomSecureHex(32);

        if (this.handleCheckButtonDisabled()) {
            return;
        }

        await this.props.sendDocuments(this.createFormData(identificator));
        const userLevel = this.props.user.labels;
    };

    private createFormData = (identificator: string) => {
        const { documentsType, issuedDate, idNumber, fileFront, fileSelfie }: DocumentsState = this.state;
        const typeOfDocuments = this.getDocumentsType(documentsType);

        const request = new FormData();

        request.append('birthDate', this.state.birthDate);
        request.append('idNumber', idNumber);
        request.append('name', this.state.name);
        request.append('address', this.state.address);
        request.append('district', this.state.district);
        request.append('city', this.state.city);
        request.append('province', this.state.province);
        request.append('country', this.state.country);
        request.append('place_of_birth', this.state.placeBirth);
        request.append('selfie_image', fileSelfie[0]);
        request.append('identity_image', fileFront[0]);
        request.append('identificator', identificator);
        return request;
    };

    private getDocumentsType = (value: string) => {
        switch (value) {
            case this.data[0]:
                return 'Passport';
            case this.data[1]:
                return 'Identity card';
            case this.data[2]:
                return 'Driver license';
            default:
                return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    success: selectSendDocumentsSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
    user: selectUserInfo(state),
    isLoading: selectSendDocumentsLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    fetchAlert: (payload) => dispatch(alertPush(payload)),
    sendDocuments: (payload) => dispatch(sendDocuments(payload)),
    userFetch: () => dispatch(userFetch()),
});

export const KycDocument = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(KycDocumentComponent) as any;
