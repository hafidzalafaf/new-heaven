import * as React from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { EyeClose, EyeOpen } from '../../../assets/images/Eye';

export interface CustomInputProps {
    type: string;
    label: string;
    defaultLabel: string;
    handleChangeInput?: (value: string) => void;
    inputValue: string | number;
    handleFocusInput?: () => void;
    placeholder: string;
    classNameLabel?: string;
    classNameInput?: string;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    id?: string;
    handleClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
    isDisabled?: boolean;
    labelVisible?: boolean;
    autoComplete?: string;
    name?: string;
    classNameGroup?: string;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface State {
    inputType: string;
    showPassword: boolean;
}

type Props = CustomInputProps;

class CustomInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showPassword: true,
            inputType: this.props.type,
        };
    }

    public render() {
        const {
            label,
            labelVisible,
            placeholder,
            defaultLabel,
            inputValue,
            classNameLabel,
            type,
            autoFocus,
            readOnly,
            id,
            handleClick,
            isDisabled,
            onKeyPress,
            autoComplete,
            name,
            classNameInput,
            classNameGroup,
        } = this.props;

        return (
            <React.Fragment>
                <div className={`custom-input form-group ${classNameGroup}`}>
                    <label className={classNameLabel}>{(labelVisible || inputValue) && (label || defaultLabel)}</label>
                    <InputGroup size="lg">
                        <FormControl
                            size="lg"
                            type={this.state.inputType}
                            value={inputValue.toString()}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            onFocus={this.props.handleFocusInput}
                            onBlur={this.props.handleFocusInput}
                            onChange={(e) => this.handleChangeValue(e)}
                            readOnly={readOnly}
                            id={id}
                            onClick={handleClick}
                            disabled={isDisabled}
                            onKeyPress={onKeyPress}
                            autoComplete={'off'}
                            name={name}
                            className={classNameInput}
                        />

                        {type == 'password' ? (
                            <div className="eye-password-icon" onClick={this.handleShowPassword}>
                                {!this.state.showPassword ? (
                                    <EyeOpen className="password-icon" />
                                ) : (
                                    <EyeClose className="password-icon" />
                                )}
                            </div>
                        ) : (
                            ''
                        )}
                    </InputGroup>
                </div>
            </React.Fragment>
        );
    }

    private handleShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        });

        if (this.state.showPassword) {
            this.setState({
                inputType: 'text',
            });
        } else {
            this.setState({
                inputType: 'password',
            });
        }
    };

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export { CustomInput };
