function Recipes({ recipes, loading }){

    if(loading){
        return <h2>Loading...</h2>
    }

    return (
        <ul>
            {recipes.map(recipe => (
                <li key={recipe.name}>{recipe.name}</li>
            ))}
        </ul>
    );
}

export default Recipes;