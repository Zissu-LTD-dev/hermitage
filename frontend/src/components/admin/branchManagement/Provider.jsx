import { useState } from "react";
import providerStyle from "../../../assets/css/admin/branchManagement/Provider.module.css"
import SubBranch from "./SubBranch";

function Provider() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={providerStyle.main}>
        <div className={providerStyle.header} onClick={() => setOpen(!open)}>
          <span className={providerStyle.titles}>
            <div className={providerStyle.name}>שם ספק</div>
            <div className={providerStyle.nums}>22 סניפים</div>
          </span>
          <div className={!open ? providerStyle.close + " " + providerStyle.icon : providerStyle.icon}></div>
        </div>
        {open && (
          <>
            <div className={providerStyle.body}>
              <SubBranch />
              <SubBranch />
              <SubBranch />
            </div>
            <div className={providerStyle.footer}>
              {/* בחר הכול  */}
              <div className={providerStyle.selectAll}>
                <input type="checkbox" />
                <div>בחר הכול</div>
              </div>
              <div className={providerStyle.buttons}>
                <div className={providerStyle.noNeed}>
                  הגדר סניפים שנבחרו כלא צריכים אישור להזמנה
                </div>
                <div className={providerStyle.need}>
                  הגדר סניפים שנבחרו כצריכים אישור להזמנה
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Provider