import * as React from 'react';
import { Alert } from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { ErrorAlertIcon, SuccessAlertIcon } from '../../assets/images/AlertIcon';
import { alertDelete, alertDeleteByIndex, AlertState, RootState, selectAlertState } from '../../modules';

interface ReduxProps {
    alerts: AlertState;
}

interface DispatchProps {
    alertDelete: typeof alertDelete;
    alertDeleteByIndex: typeof alertDeleteByIndex;
}

type Props = ReduxProps & DispatchProps & IntlProps;

class AlertMobileComponent extends React.Component<Props> {
    public deleteAlertByIndex = (key: number) => {
        this.props.alertDeleteByIndex(key);
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    public render() {
        return (
            <div className="alert-mobile-component">
                {this.props.alerts.alerts.map((w) =>
                    w.message.map((msg, index) => (
                        <div className="alert-wrapper">
                            <FadeIn key={index}>
                                <div>
                                    <Alert variant={w.type === 'error' ? 'danger' : 'success'}>
                                        <div className="d-flex align-items-center">
                                            {w.type === 'error' ? (
                                                <ErrorAlertIcon className="mr-2" />
                                            ) : (
                                                <SuccessAlertIcon className="mr-2" />
                                            )}
                                            {this.translate(msg)}
                                            <CloseIcon
                                                fill="#fff"
                                                className="ml-2 cursor-pointer"
                                                onClick={() => this.deleteAlertByIndex(index)}
                                            />
                                        </div>
                                    </Alert>
                                </div>
                            </FadeIn>
                        </div>
                    ))
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    alerts: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    alertDelete: () => dispatch(alertDelete()),
    alertDeleteByIndex: (payload) => dispatch(alertDeleteByIndex(payload)),
});

export const AlertsMobile = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AlertMobileComponent)
) as React.FunctionComponent;
