import { useState } from "react";
import providerStyle from "../../../assets/css/admin/branchManagement/Provider.module.css"
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import SubBranch from "./SubBranch";

function Provider(providerData) {
  const { state, dispatch } = useAdminContext();
  const [open, setOpen] = useState(false);
  let { name, branches } = providerData.providerData;
  let branchesNum = state.branches.length;


  return (
    <>
      <div className={providerStyle.main}>
        <div className={providerStyle.header} onClick={() => setOpen(!open)}>
          <span className={providerStyle.titles}>
            <div className={providerStyle.name}>{name}</div>
            <div className={providerStyle.nums}>{branchesNum} סניפים</div>
          </span>
          <div className={!open ? providerStyle.close + " " + providerStyle.icon : providerStyle.icon}></div>
        </div>
        {open && (
          <>
            <div className={providerStyle.body}>
              {state.branches.map((branch, i) => {
                return (
                  <SubBranch
                    key={i}
                    branch={branch}
                    branches={branches}
                  />
                )
              })}
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