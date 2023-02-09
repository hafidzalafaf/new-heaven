import cr from 'classnames';
import moment from 'moment';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { languages } from '../../../api/config';
import { CustomInput, SearchDropdown } from '../../components';
import { formatDate, isDateInFuture } from '../../../helpers';
import {
    editIdentity,
    Label,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectEditIdentitySuccess,
    selectLabelData,
    selectSendIdentitySuccess,
    selectUserInfo,
    sendIdentity,
    User,
} from '../../../modules';
import { IdentityData } from '../../../modules/user/kyc/identity/types';

import * as countries from 'i18n-iso-countries';

interface ReduxProps {
    editSuccess?: string;
    sendSuccess?: string;
    lang: string;
    labels: Label[];
    user: User;
}

interface DispatchProps {
    editIdentity: typeof editIdentity;
    sendIdentity: typeof sendIdentity;
    labelFetch: typeof labelFetch;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface IdentityState {
    city: string;
    district: string;
    province: string;
    country: string;
    placeOfBirth: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    postcode: string;
    residentialAddress: string;
    cityFocused: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class IdentityComponent extends React.Component<Props, IdentityState> {
    public state = {
        city: '',
        district: '',
        province: '',
        country: '',
        placeOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
        postcode: '',
        residentialAddress: '',
        cityFocused: false,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public componentDidUpdate(prev: Props) {
        const { history, editSuccess, sendSuccess } = this.props;

        if ((!prev.editSuccess && editSuccess) || (!prev.sendSuccess && sendSuccess)) {
            this.props.labelFetch();
            history.push('/profile');
        }
    }

    public render() {
        const { editSuccess, sendSuccess, lang } = this.props;
        const { city, dateOfBirth, firstName, postcode, residentialAddress, country } = this.state;
        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));

        /* tslint:enable */

        const dataCountries = Object.values(countries.getNames(lang)).map((item) => {
            return { label: item, value: item };
        });

        return (
            <React.Fragment>
                <div className="header dark-bg-main py-4 px-24 mb-24">
                    <h2 className="mb-0 text-xl white-text font-bold pt-2">Profile ID Verification</h2>
                </div>
                <div className="phone-form px-24">
                    <h3 className=" text-md white-text font-bold mb-24">Get Verifed your Profile ID</h3>
                    <div className="row">
                        <div className="col-md-10 col-lg-8">
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
                                        inputValue={firstName}
                                        handleChangeInput={this.handleChangeFirstName}
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
                                        inputValue={residentialAddress}
                                        handleChangeInput={(e) => this.handleChange(e, 'residentialAddress')}
                                    />
                                </div>
                                {/* <div className="col-md-6">
                                    <CustomInput
                                        defaultLabel="District"
                                        label="District"
                                        placeholder="District"
                                        type="text"
                                        labelVisible
                                        classNameLabel="white-text text-sm"
                                        classNameGroup="mb-24"
                                        inputValue={district}
                                        handleChangeInput={(e) => this.handleChange(e, 'district')}
                                    />
                                </div> */}
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
                                        handleChangeInput={(e) => this.handleChange(e, 'city')}
                                    />
                                </div>
                                {/* <div className="col-md-6">
                                    <CustomInput
                                        defaultLabel="Province"
                                        label="Province"
                                        placeholder="Province"
                                        type="text"
                                        labelVisible
                                        classNameLabel="white-text text-sm"
                                        classNameGroup="mb-24"
                                        inputValue={province}
                                        handleChangeInput={(e) => this.handleChange(e, 'province')}
                                    />
                                </div> */}
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
                                    <div className="input-date-document">
                                        <label className="text-sm mb-8 white-text">Date of Birth</label>
                                        <MaskInput
                                            maskString="00/00/0000"
                                            mask="00/00/0000"
                                            onChange={this.handleChangeDate}
                                            value={dateOfBirth}
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-6">
                                    <CustomInput
                                        defaultLabel="Place of Birth"
                                        label="Place of Birth"
                                        placeholder="Place of Birth"
                                        type="text"
                                        labelVisible
                                        classNameLabel="white-text text-sm"
                                        classNameGroup="mb-24"
                                        inputValue={placeOfBirth}
                                        handleChangeInput={(e) => this.handleChange(e, 'placeOfBirth')}
                                    />
                                </div> */}
                                <div className="col-md-6">
                                    <CustomInput
                                        defaultLabel="Postal Code"
                                        label="Postal Code"
                                        placeholder="Postal Code"
                                        type="text"
                                        labelVisible
                                        classNameLabel="white-text text-sm"
                                        classNameGroup="mb-24"
                                        inputValue={postcode}
                                        handleChangeInput={(e) => this.handleChange(e, 'postcode')}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <div className="mb-12">
                                    {sendSuccess && !editSuccess && (
                                        <p className="pg-confirm__success">{this.translate(sendSuccess)}</p>
                                    )}
                                    {editSuccess && !sendSuccess && (
                                        <p className="pg-confirm__success">{this.translate(editSuccess)}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary px-5 rounded-xl"
                                    onClick={this.sendData}
                                    disabled={this.handleCheckButtonDisabled()}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private selectCountry = (option) => {
        this.setState({
            country: countries.getAlpha2Code(option.value, this.props.lang),
        });
    };

    private scrollToElement = (displayedElem: number) => {
        const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-identity__forms__row')[
            displayedElem
        ] as HTMLElement;
        element && element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

    private handleChange = (value: string, key: string) => {
        // @ts-ignore
        this.setState({
            [key]: value,
        });
    };

    private handleChangeFirstName = (e: string) => {
        this.setState({
            firstName: e,
        });
    };

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: e.target.value,
        });
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'fullName':
                const fullNameRegex = new RegExp(`^[a-zA-Z—-\\s]{1,255}$`);

                return Boolean(value.match(fullNameRegex));
            case 'lastName':
                const lastNameRegex = new RegExp(`^[a-zA-Z—-\\s]{1,255}$`);

                return Boolean(value.match(lastNameRegex));
            case 'residentialAddress':
                const residentialAddressRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\\\\\s]{1,255}$`);

                return Boolean(value.match(residentialAddressRegex));
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\\\\\s]{1,255}$`);

                return Boolean(value.match(cityRegex));
            case 'district':
                const districtRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\\\\\s]{1,255}$`);

                return Boolean(value.match(districtRegex));
            case 'province':
                const provinceRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\\\\\s]{1,255}$`);

                return Boolean(value.match(provinceRegex));
            case 'placeOfBirth':
                const placeOfBirthRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\\\\\s]{1,255}$`);

                return Boolean(value.match(placeOfBirthRegex));
            case 'postcode':
                const postcodeRegex = new RegExp(`^[a-zA-Z0-9]{1,12}$`);

                return Boolean(value.match(postcodeRegex));
            case 'dateOfBirth':
                if (value.length === 10) {
                    return moment(value, 'DD/MM/YYYY').unix() < Date.now() / 1000;
                }

                return false;
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const { dateOfBirth, firstName, postcode, residentialAddress, city, country } = this.state;

        const fullNameValid = this.handleValidateInput('fullName', firstName);
        const residentialAddressValid = this.handleValidateInput('residentialAddress', residentialAddress);
        const postcodeValid = this.handleValidateInput('postcode', postcode);
        const dateOfBirthValid = this.handleValidateInput('dateOfBirth', dateOfBirth);
        const cityValid = this.handleValidateInput('city', city);

        return !fullNameValid || !residentialAddressValid || !cityValid || !postcodeValid || !dateOfBirthValid;
    };

    private sendData = (event) => {
        event.preventDefault();
        const { labels, user } = this.props;
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo: IdentityData = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            address: this.state.residentialAddress,
            postcode: this.state.postcode,
            city: this.state.city,
            country: this.state.country,
            confirm: true,
        };
        const isIdentity =
            labels.length && labels.find((w) => w.key === 'profile' && w.value === 'verified' && w.scope === 'private');
        const verifiedProfiles = user.profiles.length ? user.profiles.filter((i) => i.state === 'verified') : [];
        const lastVerifiedProfile = verifiedProfiles.length && verifiedProfiles[verifiedProfiles.length - 1];

        if (!isIdentity && lastVerifiedProfile && lastVerifiedProfile.address) {
            this.props.editIdentity(profileInfo);
        } else {
            this.props.sendIdentity(profileInfo);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    editSuccess: selectEditIdentitySuccess(state),
    sendSuccess: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    labels: selectLabelData(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    editIdentity: (payload) => dispatch(editIdentity(payload)),
    sendIdentity: (payload) => dispatch(sendIdentity(payload)),
    labelFetch: () => dispatch(labelFetch()),
});

export const KycProfile = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(IdentityComponent) as any; // tslint:disable-line
