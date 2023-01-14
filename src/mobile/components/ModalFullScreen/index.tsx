import * as React from 'react';
import { CloseButton } from 'react-bootstrap';

export interface ModalFullScreenProps {
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
    /**
     * is Modal alert
     */
    type?: 'success' | 'failed' | 'warning';
}

export const ModalFullScreenMobile: React.FunctionComponent<ModalFullScreenProps> = (props) => {
    const { footer } = props;
    if (!props.show) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={`custom-modal-mobile fade `}>
                <div className="custom-modal-dialog" role="document">
                    <div className="custom-modal-content">
                        <div className="header mb-24">{props.header}</div>
                        <div className="body h-full">{props.content}</div>
                        {footer ? <div className="footer">{props.footer}</div> : ''}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
