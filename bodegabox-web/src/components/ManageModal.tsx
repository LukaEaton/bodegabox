import { FaTimes } from "react-icons/fa";

type ManageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    mode: 'add' | 'edit';
}

export function ManageModal({ isOpen, onClose, title, children }: ManageModalProps) {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <FaTimes className="close-button" onClick={onClose} />
                </div>
                <hr/>
                <div className="modal-body">
                    {children}
                </div>
                <hr/>
                <div className="modal-footer">

                </div>
            </div>
        </div>
    );
}