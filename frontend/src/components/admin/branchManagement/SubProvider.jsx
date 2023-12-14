import { useEffect, useState } from "react";
import providerStyle from "../../../assets/css/admin/branchManagement/SubProvider.module.css";

function SubProvider({ provider, blockedProviders }) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (blockedProviders.length > 0) {
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
        <div className={!approved  ? providerStyle.button + " " + providerStyle.approved : providerStyle.button + " " + providerStyle.notApproved}
         onClick={() => setApproved(!approved)}>
          {!approved ? "לא צריך אישור להזמנה" : "צריך אישור להזמנה"}
        </div>
      </div>
    </>
  );
}

export default SubProvider;