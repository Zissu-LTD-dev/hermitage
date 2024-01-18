import navbar from "../../../assets/css/navbar/Navbar.module.css";

import Filters from "./Filters";
import Search from "./Search";
import DocInfo from "./DocInfo";

function Navbar() {
  return (
    <>
      <div className={navbar.navbar}>
        <span className={navbar.navbar__right} >
          <Filters />
          <Search />
        </span>
        <span className={navbar.navbar__left} >
          <DocInfo />
        </span>
      </div>
    </>
  );
}

export default Navbar;
