import { TabHeader, PullToRefresh } from "../components";

export function RecipesPage() {
    return (
        <div className="tab">
            <TabHeader title="Recipes" />
            <PullToRefresh onRefresh={() => {}}>
                <p>recipes</p>
            </PullToRefresh>
        </div>
    );
}