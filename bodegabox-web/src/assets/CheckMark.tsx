type CheckMarkProps = {
    color: string;
    onClick?: () => void;
}

export function CheckMark({ color, onClick }: CheckMarkProps) {
    return (
        <svg onClick={onClick} width="25px" height="25px" viewBox="0 -1 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g> 
                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
            </g>
        </svg>
    );
}