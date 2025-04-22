import { useState, useEffect } from "react";
import makingOrderBranch from "../../assets/css/admin/MakingOrderBranch.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import NewOrderForBranch from "./makingOrderBranch/NewOrderForBranch";

function MakingOrderBranch() {
  const { state: stateMain, dispatch: dispatchMain } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [selectBranch, setSelectBranch] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleBranchSelection = (e) => {
    const branchId = e.target.value;
    setSelectedBranches((prevSelectedBranches) => {
      const newSelectedBranches = prevSelectedBranches.includes(branchId)
        ? prevSelectedBranches.filter((id) => id !== branchId)
        : [...prevSelectedBranches, branchId];
      setSelectAll(newSelectedBranches.length === branches.length);
      return newSelectedBranches;
    });
  };

  const handleSelectAllBranches = (e) => {
    if (e.target.checked) {
      setSelectedBranches(branches.map((branch) => branch._id));
      setSelectAll(true);
    } else {
      setSelectedBranches([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (selectedBranches.length > 0) {
      const selectedBranchesDetails = branches.filter((branch) =>
        selectedBranches.includes(branch._id)
      );
      dispatchMain({
        type: "SET_CURRENT_BRANCH",
        payload: selectedBranchesDetails,
      });
    }
  }, [selectedBranches]);

  useEffect(() => {
    if (state.branches) {
      setBranches(state.branches);
    }
  }, [state.branches]);

  useEffect(() => {
    return () => {
      dispatchMain({ type: "SET_CURRENT_BRANCH", payload: [] });
    };
  }, []);

  return (
    <>
      {selectBranch && <NewOrderForBranch />}
      {!selectBranch && (
        <div className={makingOrderBranch.mainSelectBranch}>
          <div className={makingOrderBranch.title}>ביצוע הזמנה עבור סניפים</div>
          <div className={makingOrderBranch.chooseBranch}>
            <div
              className={
                makingOrderBranch.selectAllCheckbox +
                " " +
                makingOrderBranch.branchCheckbox
              }
            >
              <input
                type="checkbox"
                id="selectAll"
                onChange={handleSelectAllBranches}
                checked={selectAll}
                className={makingOrderBranch.selectAllCheckbox}
              />
              <label htmlFor="selectAll">בחר הכל</label>
            </div>
            {branches &&
              branches.map((branch) => (
                <div
                  key={branch._id}
                  className={makingOrderBranch.branchCheckbox}
                >
                  <input
                    type="checkbox"
                    id={`branch-${branch._id}`}
                    value={branch._id}
                    onChange={handleBranchSelection}
                    checked={selectedBranches.includes(branch._id)}
                    className={makingOrderBranch.branchCheckbox}
                  />
                  <label htmlFor={`branch-${branch._id}`}>{branch.number} - {branch.name}</label>
                </div>
              ))}
          </div>

          <div
            className={makingOrderBranch.btn}
            onClick={() => {
              selectedBranches.length && setSelectBranch(true);
            }}
          >
            בחר
          </div>
        </div>
      )}
    </>
  );
}

export default MakingOrderBranch;
