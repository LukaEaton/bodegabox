import { FaTimes } from "react-icons/fa";
import { ActionButton } from "../components";
import { ActionButtonConfig } from "../components/ActionButton";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerButtons?: ActionButtonConfig[];
    containerClass?: string;
}

export function Modal({ isOpen, onClose, title, children, footerButtons, containerClass }: ModalProps) {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-container ${containerClass}`}>
                <div className="modal-header">
                    <h3 style={{margin:"0"}}>{title}</h3>
                    <FaTimes className="close-button" onClick={onClose} />
                </div>
                <hr/>
                <div className="modal-body">
                    {children}
                </div>
                <hr/>
                <div className="modal-footer">
                    {footerButtons && footerButtons.map((button, index) => (
                        <ActionButton 
                            key={index}
                            label={button.label}
                            icon={button.icon}
                            onClick={button.onClick}
                            className={button.className}
                            disabled={button.disabled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}