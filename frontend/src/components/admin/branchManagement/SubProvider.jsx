import { useEffect, useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import providerStyle from "../../../assets/css/admin/branchManagement/SubProvider.module.css";

function SubProvider({ provider, branchId, isChecked, added, removed }) {
  const { state, dispatch } = useAdminContext();
  const [approved, setApproved] = useState(false);
  const [checked, setChecked] = useState(false);

  //   blockedProviders
  const blockedProviders =  () => {
    let res = apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
      branchId: branchId,
      providersList: [provider.number],
      blocked: true,
    });

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
  const unblockedProviders =  () => {
    let res = apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
      branchId: branchId,
      providersList: [provider.number],
      blocked: false,
    });

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
