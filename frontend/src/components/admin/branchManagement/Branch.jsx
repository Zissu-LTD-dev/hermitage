import { useState } from "react";
import branchStyle from "../../../assets/css/admin/branchManagement/Branch.module.css";
import SubProvider from "./SubProvider";

function Branch() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={branchStyle.main}>
        <div className={branchStyle.header} onClick={() => setOpen(!open)}>
          <span className={branchStyle.titles}>
            <div className={branchStyle.name}>שם סניף</div>
            <div className={branchStyle.nums}>22 ספקים</div>
          </span>
          <div className={ !open ? branchStyle.close + " " + branchStyle.icon : branchStyle.icon}></div>
        </div>
        {open && (
          <>
            <div className={branchStyle.body}>
              <SubProvider />
              <SubProvider />
              <SubProvider />
            </div>
            <div className={branchStyle.footer}>
              {/* בחר הכול  */}
              <div className={branchStyle.selectAll}>
                <input type="checkbox" />
                <div>בחר הכול</div>
              </div>
              <div className={branchStyle.buttons}>
                <div className={branchStyle.noNeed}>
                  הגדר סניפים שנבחרו כלא צריכים אישור להזמנה
                </div>
                <div className={branchStyle.need}>
                  הגדר סניפים שנבחרו כצריכים אישור להזמנה
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Branch;
