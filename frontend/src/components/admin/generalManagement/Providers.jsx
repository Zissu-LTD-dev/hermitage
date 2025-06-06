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
    bookkeepingEmail: "",
    isBlocked: false,
    branchEmails: [],
  };

  const [providers, setProviders] = useState([]);
  const [emptyProviders , setEmptyProviders] = useState([]);
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
      newProvider._id = response._id;
      state.providers.push(newProvider);
      newProvider.number = parseInt(newProvider.number);
      state.providers.sort((a, b) => a.number - b.number);
      setAddProvider(false);
      setNewProvider(initialProviders);
    }
  };

  // edit provider
  const editProviderHandler = () => {
    let response = apiRequestForForm(`admin/editProvider/${newProvider._id}`, "put", newProvider);
    if (response.error) {
      mainDispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "שגיאה בעדכון הספק" },
      });
      return;
    } else {
      mainDispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "הספק עודכן בהצלחה" },
      });
      state.providers = [...state.providers.filter((provider) => provider._id !== newProvider._id), newProvider];
      state.providers.sort((a, b) => a.number - b.number);
      setProviders(state.providers);
      setEditProvider(false);
      setNewProvider(initialProviders);
    }
  };

  // delete provider
  const deleteProviderHandler = async (id, number) => {
    let response = await apiRequestForForm(`admin/deleteProvider/${id}`, "delete");
    if (response.error) {
      mainDispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "שגיאה במחיקת הספק" },
      });
      return;
    } else {
      mainDispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "הספק נמחק בהצלחה" },
      });
      state.providers = state.providers.filter((provider) => provider._id !== id);
      state.branches.forEach(async (branch) => {
        if (branch.blockedProviders.includes(number)) {
          branch.blockedProviders = branch.blockedProviders.filter((blockedProvider) => blockedProvider !== number);
        }
      });
      setProviders(state.providers);
    }
  };

  useEffect(() => {
    if (branches.length && !newProvider.branchEmails.length) {
      let branchEmails = branches.map((branch) => {
        return {
          branchNumber: branch.number,
          branchName: branch.name,
          emails: [],
        };
      });
      setNewProvider({ ...newProvider, branchEmails: branchEmails });
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

  useEffect(() => {
    let tempProviders = [];
    state.products.forEach((product) => {
      if (!tempProviders.find((provider) => provider === product.providerNumber)) {
        product.providerNumber && tempProviders.push(product.providerNumber);
      }
    });
    let emptyProviders = [];
    state.providers.forEach((provider) => {
      if (!tempProviders.find((tempProvider) => tempProvider === provider.number)) {
        emptyProviders.push(provider);
      }
    });
    setEmptyProviders(emptyProviders);
  }, [state.products, addProvider]);

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
                      type="number"
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
                    <label>מייל איש סחר : </label>
                    <input
                      type="text"
                      value={newProvider.bookkeepingEmail}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          bookkeepingEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מייל ראשי : </label>
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
                 
                  {newProvider.branchEmails.length &&
                    newProvider.branchEmails.map((branch, index) => {
                      return (
                        <div
                          key={index}
                          className={subGeneralManagement.formFieldsInput}
                        >
                          <label>מייל עבור סניף: {branch.branchName} - {branch.branchNumber}</label>
                          <input
                            type="text"
                            // arr to str
                            value={branch.emails.join(",")}
                            onChange={(e) => {
                              let newbranchEmails = newProvider.branchEmails;
                              newbranchEmails[index].emails =
                                e.target.value.split(",");
                              setNewProvider({
                                ...newProvider,
                                branchEmails: newbranchEmails,
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
          {editProvider && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  עריכת ספק
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מספר ספק:</label>
                    <input
                      type="number"
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
                    <label>מייל איש סחר : </label>
                    <input
                      type="text"
                      value={newProvider.bookkeepingEmail}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          bookkeepingEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>מייל ראשי : </label>
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
                  {newProvider.branchEmails.map((branch, index) => {
                      return (
                        <div
                          key={index}
                          className={subGeneralManagement.formFieldsInput}
                        >
                          <label>מייל עבור סניף: {branch.branchName} - {branch.branchNumber}</label>
                          <input
                            type="text"
                            // arr to str
                            value={branch.emails.join(",")}
                            onChange={(e) => {
                              let newbranchEmails = newProvider.branchEmails;
                              newbranchEmails[index].emails =
                                e.target.value.split(",");
                              setNewProvider({
                                ...newProvider,
                                branchEmails: newbranchEmails,
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
                        setEditProvider(false);
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
                      onClick={() => editProviderHandler()}
                    >
                      עריכה
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
                    <div className={subGeneralManagement.listDetail} dir="ltr">
                     {provider.email ? provider.email : "אין כתובת דואר אלקטרוני"}
                    </div>
                  </div>
                  <div className={subGeneralManagement.listButtons}>
                    <div
                      className={subGeneralManagement.listButton +
                        " " +
                        subGeneralManagement.editButton}
                      onClick={() => {
                        setNewProvider(provider);
                        setEditProvider(true);
                      }}
                    >
                      עריכה
                    </div>
                    { emptyProviders.find((emptyProvider) => emptyProvider.number === provider.number) &&
                      <div
                        onClick={() => deleteProviderHandler(provider._id , provider.number)}
                        className={subGeneralManagement.listButton + " " + subGeneralManagement.deleteButton}
                        >מחיקה</div>
                      }
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
