import navbar from "../../../assets/css/navbar/Navbar.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

import Filters from "./Filters";
import Search from "./Search";
import MessageM from "../messages/MessageM";

function Navbar() {
  const { state } = useMainContext();

  return (
    <>
      <div className={navbar.navbar}>
        <span className={ !state.activeNavbar ? navbar.navbar__right__hidden + " " + navbar.navbar__right : navbar.navbar__right} >
          <Filters />
          <Search />
        </span>
        {/* <span className={navbar.navbar__left} >
          {state.userInfo.role === "manager" && <MessageM />}
        </span> */}
      </div>
    </>
  );
}

export default Navbar;
