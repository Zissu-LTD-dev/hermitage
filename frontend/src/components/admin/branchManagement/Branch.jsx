import { useEffect, useState } from "react";
import branchStyle from "../../../assets/css/admin/branchManagement/Branch.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import SubProvider from "./SubProvider";

function Branch({branchData, filtersProviders}) {
  const { state, dispatch } = useAdminContext();

  const [isFiltered, setIsFiltered] = useState(false);
  const [open, setOpen] = useState(false);
  let { _id, name, blockedProviders } = branchData;
  let providersNum = state.providers.length;

  useEffect(() => {
    if (filtersProviders.length > 0) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [filtersProviders]);

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
              {isFiltered &&  filtersProviders.map((provider, i) => {
                  return (
                    <SubProvider
                      key={i}
                      branchId={_id}
                      provider={provider}
                      blockedProviders={blockedProviders}
                    />
                  );
                }) 
              }
              {!isFiltered &&
                state.providers.map((provider, i) => {
                  return (
                    <SubProvider
                      key={i}
                      branchId={_id}
                      provider={provider}
                      blockedProviders={blockedProviders}
                    />
                  );
                })}
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
