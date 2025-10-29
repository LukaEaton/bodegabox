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
                backgroundColor: "rgba(0, 226, 242, 0.1)",
                margin: "5px 10px 5px 0px",
                borderRadius: "5px",
                gap: "10px"
            }}
        >
            <h4 style={{ margin: "0px" }}>{ingredient.name}</h4>
            <p style={{ margin: "0px", color: "#9f9f9fff", fontStyle: "italic", fontSize: "15px" }}>{ingredient.description}</p>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center", marginRight: "5px" }}>
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