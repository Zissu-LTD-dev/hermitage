import navbar from "../../../assets/css/navbar/Navbar.module.css";

import Filters from "./Filters";
import Search from "./Search";
import DocInfo from "./DocInfo";

function Navbar() {
  return (
    <>
      <div className={navbar.navbar}>
        <span>
          <Filters />
          <Search />
        </span>
        <span>
          <DocInfo />
        </span>
      </div>
    </>
  );
}

export default Navbar;
