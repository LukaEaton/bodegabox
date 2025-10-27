import { Ingredient } from "../types";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";

type IngredientCardProps = {
    ingredient: Ingredient;
    onEdit: (ingredient: Ingredient) => void;
    onPurchase: (ingredientId: number) => void;
    onRevertPurchase: (ingredientId: number) => void;
};

export function IngredientCard({ ingredient, onEdit, onPurchase, onRevertPurchase }: IngredientCardProps) {
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
                { ingredient.valid ? 
                    <>
                        <BsPencilSquare style={{ cursor: "pointer" }} onClick={() => onEdit(ingredient)} />
                        <FaCheck style={{ cursor: "pointer" }} onClick={() => onPurchase(ingredient.id)} />
                    </>
                    :
                    <GrRevert style={{ cursor: "pointer" }} onClick={() => onRevertPurchase(ingredient.id)} />
                }
            </div>
        </div>
    );
}