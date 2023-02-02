import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { IntlProps } from '../../';

interface ErrorWrapperState {
    eventId: any; // tslint:disable-line
    hasError: boolean;
}

interface ErrorWrapperProps {
    children: React.ReactNode;
}

type ErrorProps = ErrorWrapperProps & IntlProps;

class HandleErrorWrapper extends React.Component<ErrorProps, ErrorWrapperState> {
    constructor(props) {
        super(props);

        this.state = {
            eventId: null,
            hasError: false,
        };
    }

    public static getDerivedStateFromError() {
        return { hasError: true };
    }

    public componentDidCatch(error, info) {
        Sentry.withScope((scope) => {
            scope.setExtras(info);
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="dark-bg-main w-100 pg-error-screen">
                    <div className="container d-flex justify-content-between align-items-center gap-24">
                        <div>
                            <h1 className="m-0 p-0 mb-12 text-error gradient-text">Oops!</h1>
                            <h2 className="m-0 p-0 mb-12 white-text text-xl">Something Went Wrong</h2>
                            <h3 className="m-0 p-0 mb-24 white-text text-sm">
                                We keep track of these errors, but feel free to report feedback if refreshing doesn't
                                fix things.
                            </h3>

                            <div className="d-flex justify-content-start align-items-center gap-24">
                                <button onClick={() => location.reload()} className="btn-primary">
                                    Try Again
                                </button>
                                <button
                                    onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}
                                    className="btn-primary btn-outline">
                                    {this.props.intl.formatMessage({ id: 'sentry.report_feedback' })}
                                </button>
                            </div>
                        </div>
                        <img src="/img/error.png" alt="error" />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ErrorWrapper = injectIntl(HandleErrorWrapper);
