import { useState } from "react";
import "./search.css"
import SearchIcon from '@mui/icons-material/Search';

function Search(){

    const [minCal, setMinCal] = useState(null);
    const [maxCal, setMaxCal] = useState(null);
    const [minCarb, setMinCarb] = useState(null);
    const [maxCarb, setMaxCarb] = useState(null);
    const [minFat, setMinFat] = useState(null);
    const [maxFat, setMaxFat] = useState(null);
    const [minProtein, setMinProtein] = useState(null);
    const [maxProtein, setMaxProtein] = useState(null);


    return (
        <>
        <div className="search-container"> 
            <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" placeholder="What are you looking for?"/>
                    <button type="submit" className="searchButton">
                        <SearchIcon />
                    </button>
                </div>
            </div>
        <div style={{ margin: "10px 150px 0 0"}}>
        <div className="filter">
                    <label htmlFor="calories">Calories: </label>
                    <input
                    type="text"
                    id="calories"
                    placeholder="Min Cals"

                    value={minCal}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinCal(value);}}
                    />
                    <input
                    type="text"
                    name="calories"
                    placeholder="Max Cals"
                    value={maxCal}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxCal(value);}}
                    />
                </div>
                <div className="filter">
                    <label htmlFor="carbs">Carbs: </label>
                    <input
                    type="text"
                    id="carbs"
                    placeholder="Min Carbs"
                    value={minCarb}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinCarb(value);}}
                    />
                    <input
                    type="text"
                    name="carbs"
                    placeholder="Max Carbs"
                    value={maxCarb}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxCarb(value);}}
                    />
                </div>
                <div className="filter">
                    <label htmlFor="fats">Fats: </label>
                    <input
                    type="text"
                    id="fats"
                    placeholder="Min Fats"
                    value={minFat}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinFat(value);}}
                    />
                    <input
                    type="text"
                    name="fats"
                    placeholder="Max Fats"
                    value={maxFat}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxFat(value);}}
                    />
                </div>
                <div className="filter">
                    <label htmlFor="protein">Protein: </label>
                    <input
                    type="text"
                    id="protein"
                    placeholder="Min Protein"
                    value={minProtein}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMinProtein(value);}}
                    />
                    <input
                    type="text"
                    name="protein"
                    placeholder="Max Protein"
                    value={maxProtein}
                    onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setMaxProtein(value);}}
                    />
                </div>
            </div>
            </div>
        </>
    );
}

export default Search;