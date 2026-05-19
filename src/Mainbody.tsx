import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromChefClaude } from "./ai"

export default function Mainbody() {
    const [ingredients, setIngredients] = React.useState<string[]>([])

    const [recipe, setRecipe] = React.useState<string>("")

    async function getRecipe(): Promise<void> {
        console.log("Get recipe clicked!")
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
        setRecipe(recipeMarkdown)
    }

    function addIngredient(formData: FormData): void {
        const newIngredient = formData.get("ingredient")

        if (typeof newIngredient !== "string" || newIngredient.trim() === "") {
            return
        }

        setIngredients(prevIngredients => [
            ...prevIngredients,
            newIngredient.trim()
        ])
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            )}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}
