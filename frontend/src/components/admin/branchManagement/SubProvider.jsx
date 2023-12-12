import { useEffect, useState } from "react";
import providerStyle from "../../../assets/css/admin/branchManagement/SubProvider.module.css";

function SubProvider({ provider, blockedProviders }) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (blockedProviders) {
      if (blockedProviders.includes(provider.number)) {
        setApproved(true);
      }
    }
  }, []);

  return (
    <>
      <div className={providerStyle.main}>
        <div className={providerStyle.selectProvider}>
          <input type="checkbox" />
          <div>{provider.name}</div>
        </div>
        {/* button */}
        <div className={approved  ? providerStyle.button + " " + providerStyle.approved : providerStyle.button + " " + providerStyle.notApproved}
         onClick={() => setApproved(!approved)}>
          {approved ? "לא צריך אישור להזמנה" : "צריך אישור להזמנה"}
        </div>
      </div>
    </>
  );
}

export default SubProvider;

        // {!approved ? (
        //   <div
        //     className={providerStyle.approved}
        //     onClick={() => setApproved(!approved)}
        //   >
        //     לא צריך אישור להזמנה
        //   </div>
        // ) : (
        //   <div
        //     className={providerStyle.notApproved}
        //     onClick={() => setApproved(!approved)}
        //   >
        //     צריך אישור להזמנה
        //   </div>
        // )}