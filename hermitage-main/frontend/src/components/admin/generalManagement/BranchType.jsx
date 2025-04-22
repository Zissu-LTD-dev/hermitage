import { useEffect, useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import generalManagementStyles from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function BranchType() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialState = {
    name: "",
    typeId: 0,
  };

  const [newBranchType, setNewBranchType] = useState(initialState);
  const [branchTypes, setBranchTypes] = useState([]);

  const [addBranchType, setAddBranchType] = useState(false);
  const [editBranchType, setEditBranchType] = useState(false);
  const [currentBranchType, setCurrentBranchType] = useState([]);

  const addBranchTypeHandler = async () => {
    let branchTypeNumberExists = branchTypes.find(branchType => branchType.typeId === newBranchType.typeId);
    if(branchTypeNumberExists){
        mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מספר סוג סניף כבר קיים"} });
        return;
    }
    let response = await apiRequestForForm("admin/addBranchType", "POST", newBranchType);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "הוספת סוג סניף נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הוספת סוג סניף בוצעה בהצלחה"} });
      newBranchType._id = response._id;
      state.typeBranches.push(newBranchType);
      state.typeBranches.sort((a, b) => a.typeId - b.typeId);
    }
    setNewBranchType(initialState);
    setAddBranchType(false);
  }

  const editBranchTypeHandler = () => {
    let response = apiRequestForForm(`admin/editBranchType/${newBranchType._id}`, "PUT", newBranchType);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "עריכת סוג סניף נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "עריכת סוג סניף בוצעה בהצלחה"} });
      let index = state.typeBranches.findIndex(branchType => branchType._id === newBranchType._id);
      state.typeBranches[index] = newBranchType;
      state.typeBranches.sort((a, b) => a.typeId - b.typeId);
    }
    setNewBranchType(initialState);
    setEditBranchType(false);
  }

  // delete branch type
  const deleteBranchTypeHandler = async (id) => {
    let response = await apiRequestForForm(`admin/deleteBranchType/${id}`, "DELETE");
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מחיקת סוג הסניף נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "מחיקת סוג הסניף בוצעה "} });
      let index = state.typeBranches.findIndex(branchType => branchType._id === id);
      state.typeBranches.splice(index, 1);
    }
  }

  useEffect(() => {
    let tempBranchTypes = [];
    state.branches.forEach(branch => {
      if(!tempBranchTypes.find(branchType => branchType === branch.branchTypeNumber)){
        tempBranchTypes.push(branch.branchTypeNumber);
      }
    });
    setCurrentBranchType(tempBranchTypes);
  }, [state.branches])

  useEffect(() => {
    // sort branch types by number
    state.typeBranches.sort((a, b) => a.number - b.number);
    setBranchTypes(state.typeBranches);
  }, [state.typeBranches])

  return (
    <>
      <div className={generalManagementStyles.main}>
        <div className={generalManagementStyles.header}>
          <div className={generalManagementStyles.title}>סוגי סניפים</div>
          <div className={generalManagementStyles.headerButtons}>
            <div
              className={generalManagementStyles.headerButton}
              onClick={() => setAddBranchType(true)}
            >
              הוסף סוג סניף
            </div>
          </div>
        </div>
        <div className={generalManagementStyles.body}>
          {addBranchType && (
            <>
              <div className={generalManagementStyles.formFields}>
                <div className={generalManagementStyles.formFieldsTitle}>
                  הוספת סוג סניף
                </div>
                <div className={generalManagementStyles.formFieldsForm}>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>שם סוג סניף</label>
                    <input
                      type="text"
                      value={newBranchType.name}
                      onChange={(e) =>
                        setNewBranchType({ ...newBranchType, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>מספר סוג סניף</label>
                    <input
                      type="number"
                      value={newBranchType.typeId}
                      onChange={(e) =>
                        setNewBranchType({ ...newBranchType, typeId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={generalManagementStyles.formFieldsButtons}>
                    <div
                      className={
                        generalManagementStyles.formFieldsButton +
                        " " +
                        generalManagementStyles.cancelButton
                      }
                      onClick={() => {
                        setAddBranchType(false);
                        setNewBranchType(initialState);
                      }}
                    >
                      ביטול
                    </div>
                    <div
                      className={
                        generalManagementStyles.formFieldsButton +
                        " " +
                        generalManagementStyles.addButton
                      }
                      onClick={() => addBranchTypeHandler()}
                    >
                      הוספה
                    </div>
                  </div>
              </div>
            </>
          )}
          {editBranchType && (
            <>
              <div className={generalManagementStyles.formFields}>
                <div className={generalManagementStyles.formFieldsTitle}>
                  עריכת סוג סניף
                </div>
                <div className={generalManagementStyles.formFieldsForm}>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>שם סוג סניף</label>
                    <input
                      type="text"
                      value={newBranchType.name}
                      onChange={(e) =>
                        setNewBranchType({ ...newBranchType, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>מספר סוג סניף</label>
                    <input
                      type="number"
                      value={newBranchType.typeId}
                      onChange={(e) =>
                        setNewBranchType({ ...newBranchType, typeId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={generalManagementStyles.formFieldsButtons}>
                  <div
                    className={
                      generalManagementStyles.formFieldsButton +
                      " " +
                      generalManagementStyles.cancelButton
                    }
                    onClick={() => {
                      setEditBranchType(false);
                      setNewBranchType(initialState);
                    }}
                  >
                    ביטול
                  </div>
                  <div
                    className={
                      generalManagementStyles.formFieldsButton +
                      " " +
                      generalManagementStyles.addButton
                    }
                    onClick={() => editBranchTypeHandler()}
                  >
                    עריכה
                  </div>
                </div>
              </div>
            </>
          )}
          {!addBranchType && !editBranchType && (
            <>
              {branchTypes.length && (
                branchTypes.map((branchType, index) => (
                <div key={index} className={generalManagementStyles.list}>
                  <div className={generalManagementStyles.listTitle}>
                    {branchType.name}
                  </div>
                  <div className={generalManagementStyles.listDetails}>
                    <div className={generalManagementStyles.listDetail}>
                      מספר: {branchType.typeId}
                    </div>
                  </div>
                  <div className={generalManagementStyles.listButtons}>
                    <div
                      className={
                        generalManagementStyles.listButton +
                        " " +
                        generalManagementStyles.editButton
                      }
                      onClick={() => {
                        setEditBranchType(true);
                        setNewBranchType(branchType);
                      }}
                    >
                      עריכה
                    </div>
                    {!currentBranchType.includes(branchType.typeId) && (
                      <div
                        className={
                          generalManagementStyles.listButton +
                          " " +
                          generalManagementStyles.deleteButton
                        }
                        onClick={() => deleteBranchTypeHandler(branchType._id)}
                      >
                        מחיקה
                      </div>
                      )}
                  </div>
                </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BranchType;