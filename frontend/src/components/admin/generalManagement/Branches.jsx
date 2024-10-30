import { useEffect, useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import subGeneralManagement from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function Branches() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialBranch = {
    EDInumber: "",
    number: "",
    name: "",
    companyName: "",
    HP: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    branchTypeNumber: null,
    branchTypeName: "",
    blockedProviders: [],
  };

  const [typeBranch, setTypeBranch] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState(initialBranch);

  const [addBranch, setAddBranch] = useState(false);
  const [editBranch, setEditBranch] = useState(false);
  const [deleteBranch, setDeleteBranch] = useState(0);

  // add branch to branches
  const addBranchHandler = async () => {
    const response = await apiRequestForForm(
      "admin/newBranch",
      "POST",
      newBranch
    );
    if (!response) {
      mainDispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "הוספת סניף נכשלה" },
      });
      return;
    }
    mainDispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "הסניף נוסף בהצלחה" },
    });
    newBranch._id = response._id;

    let newBranches = [...branches, newBranch];
    newBranches.sort((a, b) => a.number - b.number);
    setBranches(newBranches);
    setNewBranch(initialBranch);
    setAddBranch(false);
    window.location.reload();
  };

  // edit branch
  const editBranchHandler = async () => {
    const response = await apiRequestForForm(
      `admin/editBranch/${newBranch._id}`,
      "PUT",
      newBranch
    );
    if (!response) {
      mainDispatch({ type: "SHOW_ERROR", payload: "עריכת סניף נכשלה" });
      return;
    }
    mainDispatch({ type: "SHOW_SUCCESS", payload: "הסניף נערך בהצלחה" });

    const newBranches = branches.map((branch) => {
      if (branch._id === newBranch._id) {
        return newBranch;
      }
      return branch;
    });
    newBranches.sort((a, b) => a.number - b.number);
    state.branches = newBranches;
    mainState.branches = newBranches;
    let updatedProviders = state.providers.map((provider) => {
      let updatedBranchEmails = provider.branchEmails.map((branchEmail) => {
        if (branchEmail.branchNumber === newBranch.number) {
          branchEmail.branchName = newBranch.name;
        }
        return branchEmail;
      });
      updatedBranchEmails.sort((a, b) => a.branchNumber - b.branchNumber);
      provider.branchEmails = updatedBranchEmails;
      return provider;
    });

    state.providers = updatedProviders;

    setBranches(newBranches);
    setNewBranch(initialBranch);
    setEditBranch(false);
  };

  useEffect(() => {
    setEditBranch(false);
    setNewBranch(initialBranch);
  }, [addBranch]);

  useEffect(() => {
    if (state.branches.length > 0 && state.typeBranches.length > 0) {
      let sortedBranches = state.branches.sort((a, b) => a.number - b.number);
      setBranches(sortedBranches);
      setTypeBranch(state.typeBranches);
    }
  }, [state.branches, state.typeBranches]);

  useEffect(() => {
    state.branches = branches;
   }, [branches]);

  return (
    <>
      <div className={subGeneralManagement.main}>
        <div className={subGeneralManagement.header}>
          <div className={subGeneralManagement.title}>סניפים</div>
          <div className={subGeneralManagement.headerButtons}>
            <div
              className={subGeneralManagement.headerButton}
              onClick={() => setAddBranch(true)}
            >
              הוספת סניף
            </div>
          </div>
        </div>
        {!addBranch && !editBranch && (
          <div className={subGeneralManagement.list}>
          <div className={subGeneralManagement.listDetails}>
            <div className={subGeneralManagement.listDetail}>מספר סניף</div>
            <div className={subGeneralManagement.listDetail}>EDI-num</div>
            <div className={subGeneralManagement.listDetail}>ח.פ</div>
            <div className={subGeneralManagement.listDetail}>שם חברה</div>
            <div className={subGeneralManagement.listDetail}>טלפון</div>
            <div className={subGeneralManagement.listDetail}>מייל</div>
            <div className={subGeneralManagement.listDetail}>כתובת</div>
            <div className={subGeneralManagement.listDetail}>עיר</div>
            <div className={subGeneralManagement.listDetail}>סוג סניף</div>
          </div>
        </div>
        )}
        <div className={subGeneralManagement.body}>
          {addBranch && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  הוספת סניף
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר סניף:</label>
                    <input
                      type="text"
                      value={newBranch.number}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, number: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר EDI:</label>
                    <input
                      type="text"
                      value={newBranch.EDInumber}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          EDInumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם סניף:</label>
                    <input
                      type="text"
                      value={newBranch.name}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>ח.פ:</label>
                    <input
                      type="text"
                      value={newBranch.HP}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, HP: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם חברה:</label>
                    <input
                      type="text"
                      value={newBranch.companyName}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>טלפון:</label>
                    <input
                      type="text"
                      value={newBranch.phone}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>אימייל:</label>
                    <input
                      type="text"
                      value={newBranch.email}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, email: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>כתובת:</label>
                    <input
                      type="text"
                      value={newBranch.address}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, address: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>עיר:</label>
                    <input
                      type="text"
                      value={newBranch.city}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, city: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>סוג סניף:</label>
                    <select
                      value={newBranch.branchTypeNumber}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          branchTypeNumber: e.target.value,
                          branchTypeName:
                            e.target.options[e.target.selectedIndex].text,
                        })
                      }
                    >
                      <option value="">בחר סוג סניף</option>
                      {typeBranch.map((type, index) => (
                        <option key={index} value={type.typeId}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={subGeneralManagement.formFieldsButtons}>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.cancelButton
                      }
                      onClick={() => {
                        setAddBranch(false);
                        setNewBranch(initialBranch);
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
                      onClick={() => addBranchHandler()}
                    >
                      הוספה
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {editBranch && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  עריכת סניף
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר סניף:</label>
                    <input
                      type="text"
                      value={newBranch.number}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, number: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר EDI:</label>
                    <input
                      type="text"
                      value={newBranch.EDInumber}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          EDInumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם סניף:</label>
                    <input
                      type="text"
                      value={newBranch.name}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>ח.פ:</label>
                    <input
                      type="text"
                      value={newBranch.HP}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, HP: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם חברה:</label>
                    <input
                      type="text"
                      value={newBranch.companyName}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>טלפון:</label>
                    <input
                      type="text"
                      value={newBranch.phone}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>אימייל:</label>
                    <input
                      type="text"
                      value={newBranch.email}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, email: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>כתובת:</label>
                    <input
                      type="text"
                      value={newBranch.address}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, address: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>עיר:</label>
                    <input
                      type="text"
                      value={newBranch.city}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, city: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>סוג סניף:</label>
                    <select
                      value={newBranch.branchTypeNumber}
                      onChange={(e) =>
                        setNewBranch({
                          ...newBranch,
                          branchTypeNumber: e.target.value,
                          branchTypeName:
                            e.target.options[e.target.selectedIndex].text,
                        })
                      }
                    >
                      <option value="">בחר סוג סניף</option>
                      {typeBranch.map((type, index) => (
                        <option key={index} value={type.typeId}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={subGeneralManagement.formFieldsButtons}>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.cancelButton
                      }
                      onClick={() => {
                        setEditBranch(false);
                        setNewBranch(initialBranch);
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
                      onClick={() => editBranchHandler()}
                    >
                      עריכה
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {!addBranch && !editBranch && (
            <>
              {branches.map((branch, index) => (
                <div key={index} className={subGeneralManagement.list}>
                  <div className={subGeneralManagement.listTitle}>
                    {branch.name}
                  </div>
                  <div className={subGeneralManagement.listDetails}>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.number}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.EDInumber ? branch.EDInumber : "אין edi "}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.HP ? branch.HP : "אין ח.פ"}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.companyName ? branch.companyName : "אין שם חברה"}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.phone ? branch.phone : "אין טלפון"}
                    </div>
                    <div className={subGeneralManagement.listDetail} dir="ltr" style={{textAlign: "right"}}>

                      {branch.email ? branch.email : "אין אימייל"}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.address ? branch.address : "אין כתובת"}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.city ? branch.city : "אין עיר"}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                      {branch.branchTypeName}
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
                        setEditBranch(true);
                        setNewBranch(branch);
                        setDeleteBranch(0);
                      }}
                    >
                      עריכה
                    </div>
                    <div className={subGeneralManagement.listButton + " " + subGeneralManagement.deleteButton}
                      onClick={() => {
                        setDeleteBranch(branch.number);
                      }}
                    >מחיקה</div>
                  </div>
                  {deleteBranch === branch.number && (
                    <div className={subGeneralManagement.deleteBranch}>
                      <div className={subGeneralManagement.deleteBranchTitle}>
                        האם למחוק את הסניף?
                      </div>
                      <div className={subGeneralManagement.deleteBranchButtons}>
                        <div
                          className={
                            subGeneralManagement.deleteBranchButton +
                            " " +
                            subGeneralManagement.cancelButtonDelete
                          }
                          onClick={() => setDeleteBranch(0)}
                        >
                          ביטול
                        </div>
                        <div
                          className={
                            subGeneralManagement.deleteBranchButton +
                            " " +
                            subGeneralManagement.deleteButtonDelete
                          }
                          onClick={() => {
                            setDeleteBranch(0);
                            setBranches(branches.filter((b) => b.number !== branch.number));
                            apiRequestForForm(`admin/deleteBranch/${branch._id}`, "DELETE");
                          }}
                        >
                          מחיקה
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Branches;
