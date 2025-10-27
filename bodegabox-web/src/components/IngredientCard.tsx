import { Ingredient } from "../types";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

export function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                backgroundColor: "#00e2f215",
                margin: "5px 10px 5px 0px",
                borderRadius: "5px",
            }}
        >
            <h4 style={{ margin: "0px 3px" }}>{ingredient.name}</h4>
            <p style={{ margin: "0px 0px 0px 10px", color: "#9f9f9fff", fontStyle: "italic" }}>{ingredient.description}</p>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
                <BsPencilSquare style={{ cursor: "pointer" }} onClick={() => alert('edited')} />
                <FaCheck style={{ cursor: "pointer" }} onClick={() => alert('bought')} />
            </div>
        </div>
    );
}