import { BodegaBoxLogo } from "./BodegaBoxLogo";

type TabHeaderProps = {
    title: string;
    children?: React.ReactNode;
}

export function TabHeader({ title, children }: TabHeaderProps) {
    return (
        <div className="tab-header">
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