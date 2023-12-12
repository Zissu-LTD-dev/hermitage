import { useState } from "react";
import subBranch from "../../../assets/css/admin/branchManagement/SubBranch.module.css"

function SubBranch({ branch, branches }) {
  const [approved, setApproved] = useState(false);

  return (
    <>
      <div className={subBranch.main}>
        <div className={subBranch.selectBranch}>
          <input type="checkbox" />
          <div>{branch.name}</div>
        </div>
        {/* button */}
        <div className={approved  ? subBranch.button + " " + subBranch.approved : subBranch.button + " " + subBranch.notApproved}
         onClick={() => setApproved(!approved)}>
          {approved ? "לא צריך אישור להזמנה" : "צריך אישור להזמנה"}
        </div>
      </div>
    </>
  )
}

export default SubBranch