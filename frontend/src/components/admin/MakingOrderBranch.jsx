import { useState, useEffect } from "react"
import makingOrderBranch from "../../assets/css/admin/MakingOrderBranch.module.css"
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import NewOrderForBranch from "./makingOrderBranch/NewOrderForBranch";

function MakingOrderBranch() {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [selectBranch, setSelectBranch] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branches, setBranches] = useState();

  const handleBranch = (e) => {
    let branch = branches.find(branch => branch._id === e.target.value)
    setCurrentBranch(branch)
  }

  useEffect(() => {
    if (currentBranch) {
        dispatchMain({ type: "SET_CURRENT_BRANCH", payload: currentBranch })
    }
  }, [currentBranch])

  useEffect(() => {
    if (state.branches) {
      setBranches(state.branches)
    }
  }, [state.branches]);

  useEffect(() => {
    return () => {
      dispatchMain({ type: "SET_CURRENT_BRANCH", payload: null })
    // setCurrentBranch(null)
    }
  }, [])

  return (
    <>
        {selectBranch && (
            <NewOrderForBranch />
        )}
        {!selectBranch &&(
            <div className={makingOrderBranch.mainSelectBranch}>
                <div className={makingOrderBranch.title} >ביצוע הזמנה עבור סניף  {currentBranch && currentBranch.name}</div>
                <select onChange={handleBranch}>
                    <option value="" disabled selected >בחר סניף</option>
                    {branches && branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                    ))}
                </select>
                <div className={makingOrderBranch.btn} onClick={() => {currentBranch && setSelectBranch(true) }}>בחר</div>
            </div>
        )}
    </>
  )
}

export default MakingOrderBranch