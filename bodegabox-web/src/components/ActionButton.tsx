export type ActionButtonConfig = {
    label?: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export function ActionButton({ label, icon, onClick, className }: ActionButtonConfig) {
    return (
        <button className={`action-button ${className}`} onClick={onClick}>
            {icon}
            {label}
        </button>
    );
}