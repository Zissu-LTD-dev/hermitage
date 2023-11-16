import manager from "../assets/css/manager/manager.module.css";

import DynamicContent from "../components/manager/DynamicContent";
import Sidebar from "../components/manager/Sidebar";
import Navbar from "../components/general/Navbar";

function Manager() {
  return (
    <>
      <div className={manager.main}>
        <Sidebar branchName="סניף נהריה" />
        <Navbar />
        <div className={manager.content}>
          <DynamicContent />
        </div>
      </div>
    </>
  );
}

export default Manager;
