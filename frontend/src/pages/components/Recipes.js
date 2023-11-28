function Recipes({ recipes, loading, setDrag }){

    if(loading){
        return <h2>Loading...</h2>
    }

    const handleDragStart = (e, recipe) => {
      setDrag(true);
      e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
    }

    const handleDrag = (e) => {
      if(window.scrollY >= 50){
        window.scrollBy(0, -2);
      }
    }

    const handleDragEnd = (e) => {
      e.preventDefault();
      setDrag(false);
    }

    return (
        <ul className="meal-list">
        {recipes.map((recipe, index) => (
          <li key={index}>
            <div className="meal-item" draggable
              onDragStart={(e) => handleDragStart(e, recipe)}
              onDrag={(e) => handleDrag(e)}
              onDragEnd={(e) => handleDragEnd(e)}>
              <img src={recipe.img_url} alt={recipe.name} draggable="false"/>
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