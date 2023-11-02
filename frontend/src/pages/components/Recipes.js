function Recipes({ recipes, loading }){

    if(loading){
        return <h2>Loading...</h2>
    }

    return (
        <ul className="meal-list">
        {recipes.map((recipe, index) => (
          <li key={index}>
            <div className="meal-item">
              <img src={recipe.img_url} alt={recipe.name} />
              <h2>{recipe.name}</h2>
              <p>{recipe.category}</p>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                View Recipe
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
}

export default Recipes;