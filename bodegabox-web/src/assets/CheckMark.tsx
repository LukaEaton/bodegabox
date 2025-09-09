type CheckMarkProps = {
    color: string;
    onClick?: () => void;
}

export function CheckMark({ color, onClick }: CheckMarkProps) {
    return (
        <svg onClick={onClick} width="25px" height="25px" viewBox="0 -1 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> 
                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> 
            </g>
        </svg>
    );
}