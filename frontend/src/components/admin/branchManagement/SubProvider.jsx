import { useEffect, useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import { useMainContext } from "../../../context/mainContext/MainContext";
import providerStyle from "../../../assets/css/admin/branchManagement/SubProvider.module.css";

function SubProvider({ provider, branchId, isChecked, added, removed }) {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const [approved, setApproved] = useState(false);
  const [checked, setChecked] = useState(false);

  //   blockedProviders
  const blockedProviders = async () => {
    let res = await apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
      branchId: branchId,
      providersList: [provider.number],
      blocked: true,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בחסימת הספק" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הספק נחסם" } });
    dispatch({
      type: "SET_BLOCKED_PROVIDERS_BY_BRANCH",
      payload: {
        branchId: branchId,
        providersList: [provider.number],
      },
    });
    setApproved(true);
    setChecked(false);
  };

  // unblockedProviders
  const unblockedProviders = async () => {
    let res = await apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
      branchId: branchId,
      providersList: [provider.number],
      blocked: false,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בביטול חסימת הספק" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הספק הוסר מהחסימה" } });
    dispatch({
      type: "SET_UNBLOCKED_PROVIDERS_BY_BRANCH",
      payload: {
        branchId: branchId,
        providersList: [provider.number],
      },
    });
    setChecked(false);
    setApproved(false);
  };

  useEffect(() => {
    state.branches.map((branch) => {
      if (branch._id == branchId) {
        if (branch.blockedProviders.includes(provider.number)) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    });
  }, [state.branches]);

  useEffect(() => {
    let providerNumber = provider.number;
    if (checked) {
      added(providerNumber);
    } else {
      removed(providerNumber);
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
      <div className={providerStyle.main}>
        <div className={providerStyle.selectProvider}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <div>{provider.name}</div>
        </div>
        {/* button */}
        {approved ? (
          <div
            className={providerStyle.button + " " + providerStyle.notApproved}
            onClick={unblockedProviders}
            >
            צריך אישור להזמנה
          </div>
        ) : (
          <div
          className={providerStyle.button + " " + providerStyle.approved}
          onClick={blockedProviders}
          >
            לא צריך אישור להזמנה
          </div>
        )}
      </div>
    </>
  );
}

export default SubProvider;
