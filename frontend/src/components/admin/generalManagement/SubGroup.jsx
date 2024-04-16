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

  const addSubGroupHandler = async () => {
    let response = await apiRequestForForm("admin/addSubGroup", "POST", newSubGroup);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "הוספת סניף נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הוספת סניף בוצעה בהצלחה"} });
      state.subGroups.push(newSubGroup);
    }
    setNewSubGroup(initialState);
    setAddSubGroup(false);

  }

  const editSubGroupHandler = () => {
    let response = apiRequestForForm(`admin/editSubGroup/${newSubGroup._id}`, "PUT", newSubGroup);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "עריכת סניף נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "עריכת סניף בוצעה בהצלחה"} });
      let index = state.subGroups.findIndex(subGroup => subGroup._id === newSubGroup._id);
      state.subGroups[index] = newSubGroup;
    }
    setNewSubGroup(initialState);
    setEditSubGroup(false);

  }

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
                    {/* <div className={subGeneralManagement.listButton + " " + subGeneralManagement.deleteButton}>מחיקה</div> */}
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