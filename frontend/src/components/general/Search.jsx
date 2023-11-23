import { useState } from "react";
import searchStyle  from "../../assets/css/general/Search.module.css";



function Search() {
    
    const [search, setSearch] = useState("");
    const handleChange = (e) => {
        setSearch(e.target.value);
      console.log(search);
    };

    return (
    <>
      <div className={searchStyle.search}>
        <input type="text" placeholder="חיפוש מוצרים" onChange={handleChange} />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
