import * as React from 'react';

export interface ModalProps {
    /**
     * Property for
     */
    show: boolean;
    /**
     * Modal header
     */
    header?: React.ReactNode;
    /**
     * Content that will be displayed in modal body
     */
    content: React.ReactNode;
    /**
     * Modal footer
     */
    footer?: React.ReactNode;
    /**
     * Additional classname
     */
    className?: string;
    /**
     * full view modal
     */
    wideView?: boolean;
    /**
     * is Modal alert
     */
    type?: 'success' | 'failed' | 'warning';
}

export const Modal: React.FunctionComponent<ModalProps> = (props) => {
    const { footer, wideView, className } = props;
    if (!props.show) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={`custom-modal fade ${className} ${wideView ? 'wide-modal' : ''}`}>
                <div className="custom-modal-dialog" role="document">
                    <div className="custom-modal-content">
                        <div className="header d-flex justify-content-between mb-24">{props.header}</div>
                        <div className="body mb-24">{props.content}</div>
                        {footer ? <div className="footer">{props.footer}</div> : ''}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
