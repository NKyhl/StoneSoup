import { useState } from "react";
import "./search.css"
import SearchIcon from '@mui/icons-material/Search';
import Recipes from "./Recipes";
import { Pagination } from "@mui/material";

function Search({setDrag}){

    const [searchValue, setSearchValue] = useState("");
	const [ingValue, setIngValue] = useState("");
    const [minCal, setMinCal] = useState("");
    const [maxCal, setMaxCal] = useState("");
    const [minCarb, setMinCarb] = useState("");
    const [maxCarb, setMaxCarb] = useState("");
    const [minFat, setMinFat] = useState("");
    const [maxFat, setMaxFat] = useState("");
    const [minProtein, setMinProtein] = useState("");
    const [maxProtein, setMaxProtein] = useState("");

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const recipesPerPage = 6;
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const handleChange = (event, value) => {
        setCurrentPage(value);
      };


    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            "search" : searchValue,
			"ingredient" : ingValue,
            "minCal" : minCal,
            "maxCal" : maxCal,
            "minCarb" : minCarb,
            "maxCarb" : maxCarb,
            "minFat" : minFat,
            "maxFat" : maxFat,
            "minProtein" : minProtein,
            "maxProtein" : maxProtein
        };

        const res = await fetch('/api/search/name', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(!res.ok){
            return;
        }

        const res_json = await res.json();
        console.log(res_json.recipes);
        setRecipes(res_json.recipes);
        setLoading(false);
    }


    return (
        <>
        <div className="search-parent">
        <div className="search-container"> 
                <form onSubmit={handleSearch} style={{ width: "100%"}}>
                    <div className="search">
                        <input type="text" className="searchTerm" placeholder="Recipe Name" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                        <input type="text" className="searchTerm" placeholder="Ingredients" value={ingValue} onChange={(e) => setIngValue(e.target.value)}/>
                        <button type="submit" className="searchButton">
                            <SearchIcon/>
                        </button>
                    </div>
                </form>
        <div className="filter-container">
        <div className="filter">
                    <p>Between</p>
                    <input
                    type="text"
                    id="calories"
                    placeholder="Min Cals"

                    value={minCal}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinCal(value);}}
                    />
                    <p>and</p>
                    <input
                    type="text"
                    name="calories"
                    placeholder="Max Cals"
                    value={maxCal}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxCal(value);}}
                    />
                    <p>calories</p>
                </div>
                <div className="filter">
                    <p>Between</p>
                    <input
                    type="text"
                    id="carbs"
                    placeholder="Min Carbs"
                    value={minCarb}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinCarb(value);}}
                    />
                    <p>and</p>
                    <input
                    type="text"
                    name="carbs"
                    placeholder="Max Carbs"
                    value={maxCarb}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxCarb(value);}}
                    />
                    <p>g carbs</p>
                </div>
                <div className="filter">
                    <p>Between</p>
                    <input
                    type="text"
                    id="fats"
                    placeholder="Min Fats"
                    value={minFat}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinFat(value);}}
                    />
                    <p>and</p>
                    <input
                    type="text"
                    name="fats"
                    placeholder="Max Fats"
                    value={maxFat}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxFat(value);}}
                    />
                    <p>g fat</p>
                </div>
                <div className="filter">
                    <p>Between</p>
                    <input
                    type="text"
                    id="protein"
                    placeholder="Min Protein"
                    value={minProtein}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinProtein(value);}}
                    />
                    <p>and</p>
                    <input
                    type="text"
                    name="protein"
                    placeholder="Max Protein"
                    value={maxProtein}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxProtein(value);}}
                    />
                    <p>g protein</p>
                </div>
            </div>
            </div>
            <div className="recipe-container">
                <Recipes recipes={currentRecipes} loading={loading} setDrag={setDrag}></Recipes>
                <Pagination count={Math.ceil(recipes.length / recipesPerPage)} onChange={handleChange} ></Pagination>
            </div>
            </div>
        </>
    );
}

export default Search;
