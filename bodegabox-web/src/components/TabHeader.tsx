import { BodegaBoxLogo } from "./BodegaBoxLogo";

type TabHeaderProps = {
    title: string;
    children?: React.ReactNode;
}

export function TabHeader({ title, children }: TabHeaderProps) {
    return (
        <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#272727ff", padding: "15px 15px", borderBottom: "4px solid rgba(0, 226, 242, 0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                margin: "0px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <BodegaBoxLogo />
                    <h2 style={{ margin: "0px" }}>{title}</h2>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}