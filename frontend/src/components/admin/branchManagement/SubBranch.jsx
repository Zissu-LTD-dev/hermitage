import { useEffect, useState } from "react";
import subBranch from "../../../assets/css/admin/branchManagement/SubBranch.module.css"

function SubBranch({branchData, providerNumber}) {
  const [approved, setApproved] = useState(false);
  let { name, blockedProviders } = branchData

  useEffect(() => {
    if (blockedProviders.length) {
      if(blockedProviders.includes(providerNumber)) {
        setApproved(true);
      }
    }
  }, [blockedProviders]);

  return (
    <>
      <div className={subBranch.main}>
        <div className={subBranch.selectBranch}>
          <input type="checkbox" />
          <div>{name}</div>
        </div>
        {/* button */}
        <div className={!approved  ? subBranch.button + " " + subBranch.approved : subBranch.button + " " + subBranch.notApproved}
         onClick={() => setApproved(!approved)}>
          {!approved ? "לא צריך אישור להזמנה" : "צריך אישור להזמנה"}
        </div>
      </div>
    </>
  )
}

export default SubBranch