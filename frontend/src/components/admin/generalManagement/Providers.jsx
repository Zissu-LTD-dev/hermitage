import { useEffect, useState } from "react";
import subGeneralManagement from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import apiRequestForForm from "../../../services/apiForForm";

function Providers() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialProviders = {
    number: null,
    name: "",
    email: "",
    isBlocked: false,
    branchEmail: [],
  };

  const [providers, setProviders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newProvider, setNewProvider] = useState(initialProviders);
  const [emailBranch, setEmailBranch] = useState("");

  const [addProvider, setAddProvider] = useState(false);
  const [editProvider, setEditProvider] = useState(false);

  // add provider
  const addProviderHandler = async () => {
    let response = await apiRequestForForm(
      "admin/addProvider",
      "post",
      newProvider
    );
    if (response.error) {
      mainDispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "הספק כבר קיים במערכת" },
      });
      return;
    } else {
      mainDispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "הספק נוסף בהצלחה" },
      });
      setAddProvider(false);
      setNewProvider(initialProviders);
    }
  };

  // edit provider
  const editProviderHandler = () => {
    console.log(newProvider);
  };

  useEffect(() => {
    if (branches.length && !newProvider.branchEmail.length) {
      let branchEmail = branches.map((branch) => {
        return {
          branchNumber: branch.number,
          branchName: branch.name,
          emails: [],
        };
      });
      setNewProvider({ ...newProvider, branchEmail: branchEmail });
    }
  }, [branches, newProvider]);

  useEffect(() => {
    if (state.providers.length) {
      setProviders(state.providers);
    }
    if (state.branches.length) {
      setBranches(state.branches);
    }
  }, [state.providers, state.branches]);

  return (
    <>
      <div className={subGeneralManagement.main}>
        <div className={subGeneralManagement.header}>
          <div className={subGeneralManagement.title}>ספקים</div>
          <div className={subGeneralManagement.headerButtons}>
            <div
              className={subGeneralManagement.headerButton}
              onClick={() => setAddProvider(true)}
            >
              הוסף ספק
            </div>
          </div>
        </div>
        <div className={subGeneralManagement.body}>
          {addProvider && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  הוספת ספק
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר ספק:</label>
                    <input
                      type="text"
                      value={newProvider.number}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם ספק:</label>
                    <input
                      type="text"
                      value={newProvider.name}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>אימייל ראשי : </label>
                    <input
                      type="text"
                      value={newProvider.email}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  {newProvider.branchEmail.length &&
                    newProvider.branchEmail.map((branch, index) => {
                      return (
                        <div
                          key={index}
                          className={subGeneralManagement.formFieldsInput}
                        >
                          <label>אימייל עבור סניף: {branch.branchName}</label>
                          <input
                            type="text"
                            // arr to str
                            value={branch.emails.join(",")}
                            onChange={(e) => {
                              let newBranchEmail = newProvider.branchEmail;
                              newBranchEmail[index].emails =
                                e.target.value.split(",");
                              setNewProvider({
                                ...newProvider,
                                branchEmail: newBranchEmail,
                              });
                            }}
                          />
                        </div>
                      );
                    })}

                  <div className={subGeneralManagement.formFieldsButtons}>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.cancelButton
                      }
                      onClick={() => {
                        setAddProvider(false);
                        setNewProvider(initialProviders);
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
                      onClick={() => addProviderHandler()}
                    >
                      הוספה
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {editProvider && <></>}
          {!addProvider && !editProvider && (
            <>
              { providers.length && providers.map((provider, index) => (
                <div key={index} className={subGeneralManagement.list}>
                  <div className={subGeneralManagement.listTitle}>
                    {provider.name}
                  </div>
                  <div className={subGeneralManagement.listDetails}>
                    <div className={subGeneralManagement.listDetail}>
                      מספר ספק: {provider.number}
                    </div>
                    <div className={subGeneralManagement.listDetail}>
                     {provider.email ? provider.email : "אין כתובת דואר אלקטרוני"}
                    </div>
                  </div>
                  <div className={subGeneralManagement.listButtons}>
                    <div
                      className={subGeneralManagement.listButton +
                        " " +
                        subGeneralManagement.editButton}
                      onClick={() => setEditProvider(true)}
                    >
                      עריכה
                    </div>
                    {/* <div className={subGeneralManagement.listButton + " " + subGeneralManagement.deleteButton}>מחיקה</div> */}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Providers;
