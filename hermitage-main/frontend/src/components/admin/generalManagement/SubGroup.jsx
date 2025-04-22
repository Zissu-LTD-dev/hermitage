import { useEffect, useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import subGeneralManagement from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function SubGroup() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialState = {
    name: "",
    number: 0,
  };

  const [newSubGroup, setNewSubGroup] = useState(initialState);
  const [subGroups, setSubGroups] = useState([]);

  const [addSubGroup, setAddSubGroup] = useState(false);
  const [editSubGroup, setEditSubGroup] = useState(false);
  const [currentSubGroup, setCurrentSubGroup] = useState([]);

  const addSubGroupHandler = async () => {
    let response = await apiRequestForForm("admin/addSubGroup", "POST", newSubGroup);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "הוספת קבוצת משנה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הוספת קבוצת משנה בוצעה בהצלחה"} });
      newSubGroup._id = response._id;
      state.subGroups.push(newSubGroup);
      state.subGroups.sort((a, b) => a.number - b.number);
    }
    setNewSubGroup(initialState);
    setAddSubGroup(false);

  }

  const editSubGroupHandler = () => {
    let subGroupExist = subGroups.find(subGroup => subGroup.number == newSubGroup.number && subGroup._id !== newSubGroup._id);
    if(subGroupExist){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מספר קבוצת משנה כבר קיים"} });
      return;
    }

    let response = apiRequestForForm(`admin/editSubGroup/${newSubGroup._id}`, "PUT", newSubGroup);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "עריכת קבוצת משנה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "עריכת קבוצת משנה בוצעה בהצלחה"} });
      let index = state.subGroups.findIndex(subGroup => subGroup._id === newSubGroup._id);
      state.subGroups[index] = newSubGroup;
      state.subGroups.sort((a, b) => a.number - b.number);
    }
    setNewSubGroup(initialState);
    setEditSubGroup(false);

  }

  const deleteSubGroupHandler = async (id) => {
    let response = await apiRequestForForm(`admin/deleteSubGroup/${id}`, "DELETE");
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מחיקת הקבוצת משנה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "מחיקת הקבוצת משנה בוצעה "} });
      let index = state.subGroups.findIndex(subGroup => subGroup._id === id);
      state.subGroups.splice(index, 1);
    }
  }

  useEffect(() => {
    let tempSubGroups = [];
    state.products.forEach(product => {
      if(!tempSubGroups.find(subGroup => subGroup === product.subGroupNumber)){
        product.subGroupNumber && tempSubGroups.push(parseInt(product.subGroupNumber));
      }
    });
    setCurrentSubGroup(tempSubGroups);
  }, [state.products])

  useEffect(() => {
    setSubGroups(state.subGroups);
  }, [state.subGroups])

  return (
    <>
      <div className={subGeneralManagement.main}>
      <div className={subGeneralManagement.header}>
          <div className={subGeneralManagement.title}>קבוצות משנה</div>
          <div className={subGeneralManagement.headerButtons}>
            <div
              className={subGeneralManagement.headerButton}
              onClick={() => setAddSubGroup(true)}
            >
              הוסף קבוצה משנה
            </div>
          </div>
        </div>
        <div className={subGeneralManagement.body}>
          {addSubGroup && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  הוספת קבוצה משנה
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם קבוצת משנה</label>
                    <input
                      type="text"
                      value={newSubGroup.name}
                      onChange={(e) =>
                        setNewSubGroup({ ...newSubGroup, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר קבוצת משנה</label>
                    <input
                      type="number"
                      value={newSubGroup.number}
                      onChange={(e) =>
                        setNewSubGroup({ ...newSubGroup, number: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={subGeneralManagement.formFieldsButtons}>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.cancelButton
                      }
                      onClick={() => {
                        setAddSubGroup(false);
                        setNewSubGroup(initialState);
                      }}
                    >
                      ביטול
                    </div>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.addButton
                      }
                      onClick={() => addSubGroupHandler()}
                    >
                      הוספה
                    </div>
                  </div>
              </div>
            </>
          )}
          {editSubGroup && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  עריכת קבוצה משנה
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם קבוצת משנה</label>
                    <input
                      type="text"
                      value={newSubGroup.name}
                      onChange={(e) =>
                        setNewSubGroup({ ...newSubGroup, name: e.target.value })
                      }
                    />
                  </div>
                    {!currentSubGroup.includes(newSubGroup.number) && (
                      <div className={subGeneralManagement.formFieldsInput}>
                        <label>מספר קבוצת משנה</label>
                        <input
                          type="number"
                          value={newSubGroup.number}
                          onChange={(e) =>
                            setNewSubGroup({ ...newSubGroup, number: e.target.value })
                          }
                        />
                      </div>
                    )}
                </div>
                <div className={subGeneralManagement.formFieldsButtons}>
                  <div
                    className={
                      subGeneralManagement.formFieldsButton +
                      " " +
                      subGeneralManagement.cancelButton
                    }
                    onClick={() => {
                      setEditSubGroup(false);
                      setNewSubGroup(initialState);
                    }}
                  >
                    ביטול
                  </div>
                  <div
                    className={
                      subGeneralManagement.formFieldsButton +
                      " " +
                      subGeneralManagement.addButton
                    }
                    onClick={() => editSubGroupHandler()}
                  >
                    עריכה
                  </div>
                </div>
              </div>
            </>
          )}
          {!addSubGroup && !editSubGroup && (
            <>
              {subGroups.length && (
                subGroups.map((subGroup, index) => (
                <div key={index} className={subGeneralManagement.list}>
                  <div className={subGeneralManagement.listTitle}>
                    {subGroup.name}
                  </div>
                  <div className={subGeneralManagement.listDetails}>
                    <div className={subGeneralManagement.listDetail}>
                      מספר: {subGroup.number}
                    </div>
                  </div>
                  <div className={subGeneralManagement.listButtons}>
                    <div
                      className={
                        subGeneralManagement.listButton +
                        " " +
                        subGeneralManagement.editButton
                      }
                      onClick={() => {
                        setEditSubGroup(true);
                        setNewSubGroup(subGroup);
                      }}
                    >
                      עריכה
                    </div>
                    {!currentSubGroup.includes(subGroup.number) && (
                      <div className={subGeneralManagement.listButton + " " + subGeneralManagement.deleteButton}
                        onClick={() => deleteSubGroupHandler(subGroup._id)}
                      >מחיקה</div>
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

export default SubGroup