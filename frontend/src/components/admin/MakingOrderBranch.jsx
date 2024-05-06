import { useState, useEffect } from "react"
import makingOrderBranch from "../../assets/css/admin/MakingOrderBranch.module.css"
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";

function MakingOrderBranch() {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [selectBranch, setSelectBranch] = useState(false)
  const [currentBranch, setCurrentBranch] = useState();
  const [branches, setBranches] = useState();

  const handleBranch = (e) => {
    let branch = branches.find(branch => branch._id === e.target.value)
    setCurrentBranch(branch.name)
  }

  useEffect(() => {
    if (state.branches) {
      setBranches(state.branches)
    }
    // return () => {
        
    // }
  }, [state.branches]);

  return (
    <>
        {!selectBranch &&(
            <div className={makingOrderBranch.mainSelectBranch}>
                <h2>ביצוע הזמנה עבור סניף  {currentBranch}</h2>
                <select onChange={handleBranch}>
                    <option>בחר סניף</option>
                    {branches && branches.map((branch) => (
                        <option value={branch._id}>{branch.name}</option>
                    ))}
                </select>
                <button onClick={() => setSelectBranch(true)}>בחר</button>
            </div>
        )}
        {selectBranch && (
            <div className={makingOrderBranch.main}>
                <h2>ביצוע הזמנה עבור סניף - {currentBranch}</h2>
            </div>
        )}
    </>
  )
}

export default MakingOrderBranch