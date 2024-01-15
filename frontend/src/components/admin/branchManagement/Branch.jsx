import { useEffect, useState } from "react";
import branchStyle from "../../../assets/css/admin/branchManagement/Branch.module.css";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import SubProvider from "./SubProvider";

function Branch({branchData, filtersProviders, showBlocked}) {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [isFiltered, setIsFiltered] = useState(false);
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [providersList, setProvidersList] = useState([]);
  const [providersNum, setProvidersNum] = useState(state.providers.length);

  let { _id, name, blockedProviders: blockedProvidersList } = branchData;

  const added = (providerNumber) => {
    if (!providersList.includes(providerNumber)) setProvidersList((providersList) => [...providersList, providerNumber]);
  }

  const removed = (providerNumber) => {
    if (providersList.includes(providerNumber)) setProvidersList((providersList) => providersList.filter((provider) => provider != providerNumber));
  }

//   blockedProviders
const blockedProviders = async() => {
  let res = await apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
    branchId: _id,
    providersList: providersList,
    blocked: true,
  });
  if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בחסימת הספקים" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הספקים חוסמו" } });
    dispatch({ type: "SET_BLOCKED_PROVIDERS_BY_BRANCH", 
      payload: {
        branchId: _id,
        providersList: providersList
      }
    });
    setIsChecked(false);
  }

// unblockedProviders
const unblockedProviders = async() => {
  let res = await apiRequest("admin/updateBlockedProvidersByBranch", "PUT", {
    branchId: _id,
    providersList: providersList,
    blocked: false,
  });
  if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בהוצאת הספקים מהחסימה" } });

  dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הספקים הוצאו מהחסימה" } });
  dispatch({ type: "SET_UNBLOCKED_PROVIDERS_BY_BRANCH", 
    payload: {
      branchId: _id,
      providersList: providersList
    }
  });
  setIsChecked(false);
}

  useEffect(() => {
    if (filtersProviders.length > 0) {
      setProvidersNum(filtersProviders.length);
      setIsFiltered(true);
    } else {
      setProvidersNum(state.providers.length);
      setIsFiltered(false);
    }
  }, [filtersProviders]);

  useEffect(() => {
    setIsChecked(false);
    setProvidersList([]);
  }, [isFiltered]);

  useEffect(() => {
    if (showBlocked) {
      setProvidersNum(blockedProvidersList.length);
    } else {
      setProvidersNum(state.providers.length);
    }
  }, [showBlocked, blockedProvidersList]);

  return (
    <>
      <div className={branchStyle.main}>
        <div className={branchStyle.header} onClick={() => setOpen(!open)}>
          <span className={branchStyle.titles}>
            <div className={branchStyle.name}>{name}</div>
            <div className={branchStyle.nums}>{providersNum} ספקים</div>
          </span>
          <div
            className={
              !open
                ? branchStyle.close + " " + branchStyle.icon
                : branchStyle.icon
            }
          ></div>
        </div>
        {open && (
          <>
            <div className={branchStyle.body}>
              {(isFiltered && !showBlocked) &&  filtersProviders.map((provider, i) => {
                  return (
                    <SubProvider
                      key={i}
                      branchId={_id}
                      provider={provider}
                      blockedProviders={blockedProvidersList}
                      isChecked={isChecked}
                    added={added}
                    removed={removed}
                    />
                  );
                }) 
              }
              {(!isFiltered && !showBlocked) && 
                state.providers.map((provider, i) => {
                  return (
                    <SubProvider
                      key={i}
                      branchId={_id}
                      provider={provider}
                      blockedProviders={blockedProviders}
                      isChecked={isChecked}
                    added={added}
                    removed={removed}    
                    />
                  );
                })}
                { showBlocked &&  
                  state.providers.map((provider, i) => {
                    if(blockedProvidersList.includes(provider.number)) {
                      return (
                        <SubProvider
                          key={i}
                          branchId={_id}
                          provider={provider}
                          blockedProviders={blockedProviders}
                          isChecked={isChecked}
                        added={added}
                        removed={removed}    
                        />
                      );
                    }})
                }
            </div>
            <div className={branchStyle.footer}>
              {/* בחר הכול  */}
              <div className={branchStyle.selectAll}>
                <input type="checkbox"  checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <div>בחר הכול</div>
              </div>
              <div className={branchStyle.buttons}>
                <div className={branchStyle.noNeed} onClick={unblockedProviders}>
                  הגדר סניפים שנבחרו כלא צריכים אישור להזמנה
                </div>
                <div className={branchStyle.need} onClick={blockedProviders}>
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
