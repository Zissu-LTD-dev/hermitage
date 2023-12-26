import { useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import providerStyle from "../../../assets/css/admin/branchManagement/Provider.module.css"
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import SubBranch from "./SubBranch";

function Provider({providerData}) {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [branchesList, setBranchesList] = useState([]);

  let { name, number } = providerData;
  let branchesNum = state.branches.length;

  const added = (branchID) => {
    if (!branchesList.includes(branchID)) setBranchesList((branchesList) => [...branchesList, branchID]);
  }

  const removed = (branchID) => {
    if (branchesList.includes(branchID)) setBranchesList((branchesList) => branchesList.filter((branch) => branch != branchID));
  }

  const blockedProviders = async() => {
    let res = await apiRequest("admin/updateBlockedProvidersByProvider", "PUT", {
      providerNumber: number,
      branchesList: branchesList,
      blocked: true
    });
    if(!res) dispatchMain({ type: "SET_SHOW_ERROR", payload: {show: true, message: "הגדרת הסניפים לא נשמרה"}});
    if(branchesList.length) {
      dispatchMain({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הגדרת הסניפים בוצע"}})
      dispatch({
        type: "SET_BLOCKED_PROVIDERS_BY_PROVIDER",
        payload: {
          providerNumber: number,
          branchesList: branchesList
        }
      });
      setIsChecked(false);
    }
  }

  const unblockedProviders = async() => {
    let res = await apiRequest("admin/updateBlockedProvidersByProvider", "PUT", {
      providerNumber: number,
      branchesList: branchesList,
      blocked: false
    });
    if(!res) dispatchMain({ type: "SET_SHOW_ERROR", payload: {show: true, massage: "הגדרת הסניפים לא נשמרה"}});

    if(branchesList.length) {
      dispatchMain({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הגדרת הסניפים בוצע"}})
      dispatch({
        type: "SET_UNBLOCKED_PROVIDERS_BY_PROVIDER",
        payload: {
          providerNumber: number,
          branchesList: branchesList
        }
      });
      setIsChecked(false);
    }
  }





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
                    branchData={branch}
                    providerNumber={number}
                    isChecked={isChecked}
                    added={added}
                    removed={removed}
                  />
                )
              })}
            </div>
            <div className={providerStyle.footer}>
              {/* בחר הכול  */}
              <div className={providerStyle.selectAll}>
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <div>בחר הכול</div>
              </div>
              <div className={providerStyle.buttons}>
                <div className={providerStyle.noNeed} onClick={() => unblockedProviders()} >
                  הגדר סניפים שנבחרו כלא צריכים אישור להזמנה
                </div>
                <div className={providerStyle.need} onClick={() => blockedProviders()}>
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