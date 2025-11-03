export type ActionButtonConfig = {
    label?: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export function ActionButton({ label, icon, onClick, className, disabled }: ActionButtonConfig) {
    return (
        <button className={`action-button ${className} ${disabled && "disabled-button "}`} onClick={onClick} disabled={disabled}>
            {icon}
            {label}
        </button>
    );
}