import { useEffect, useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import { useMainContext } from "../../../context/mainContext/MainContext";
import subBranch from "../../../assets/css/admin/branchManagement/SubBranch.module.css";

function SubBranch({ branchData, providerNumber, isChecked, added, removed }) {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const [approved, setApproved] = useState(false);
  const [checked, setChecked] = useState(false);
  let { _id, name } = branchData;

  const blockedProviders = async () => {
    let res = await apiRequest("admin/updateBlockedProvidersByProvider", "PUT", {
      providerNumber: providerNumber,
      branchesList: [_id],
      blocked: true,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בחסימת הסניף" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הסניף נחסם" } });
    dispatch({
      type: "SET_BLOCKED_PROVIDERS_BY_PROVIDER",
      payload: {
        providerNumber: providerNumber,
        branchesList: [_id],
      },
    });
    setChecked(false);
    setApproved(true);
  };

  const unblockedProviders = () => {
    let res = apiRequest("admin/updateBlockedProvidersByProvider", "PUT", {
      providerNumber: providerNumber,
      branchesList: [_id],
      blocked: false,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בביטול חסימת הסניף" } });
    
    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הסניף בוטל מחסימה" } });
    dispatch({
      type: "SET_UNBLOCKED_PROVIDERS_BY_PROVIDER",
      payload: {
        providerNumber: providerNumber,
        branchesList: [_id],
      },
    });
    setChecked(false);
    setApproved(false);
  };

  useEffect(() => {
    state.branches.map((branch) => {
      if (branch._id == _id) {
        if (branch.blockedProviders.includes(providerNumber)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    });
  }, [state.branches]);

  useEffect(() => {
    let branchID = _id;
    if (checked) {
      added(branchID);
    } else {
      removed(branchID);
    }
  }, [checked]);

  useEffect(() => {
    if (isChecked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [isChecked, state.branches]);

  return (
    <>
      <div className={subBranch.main}>
        <div className={subBranch.selectBranch}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <div>{name}</div>
        </div>
        {/* button */}
        {approved ? (
          <div className={subBranch.button + " " + subBranch.notApproved} onClick={unblockedProviders}>
            צריך אישור להזמנה
          </div>
        ) : (
          <div className={subBranch.button + " " + subBranch.approved} onClick={blockedProviders}>
            לא צריך אישור להזמנה
          </div>
        )}
      </div>
    </>
  );
}

export default SubBranch;
