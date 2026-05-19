export async function getRecipeFromChefClaude(
  ingredientsArr: string[]
): Promise<string> {
  const ingredientsString = ingredientsArr.join(", ")

  const response = await fetch("/.netlify/functions/chef-claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ingredients: ingredientsString,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.error || "Failed to fetch recipe from Chef Claude"
    )
  }

  const data = await response.json()

  return data.recipe
}