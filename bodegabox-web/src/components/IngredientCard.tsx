import { CheckMark, EditPencil } from "../assets";
import { Ingredient } from "../services/IngredientService";

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
            <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
                <EditPencil color="#ffffffff" onClick={() => alert('edited')} />
                <CheckMark color="#ffffffff" onClick={() => alert('purchased')} />
            </div>
        </div>
    );
}