import { useEffect, useState } from "react";
import subGeneralManagement from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import apiRequestForForm from "../../../services/apiForForm";

function Users() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialData = {
    username: "",
    email: "",
    password: "",
    role: "",
    branch: null,
  };

  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newUser, setNewUser] = useState(initialData);

  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);

  // add user
  const handleAddUser = async () => {
    let user = apiRequestForForm("admin/addUser", "POST", newUser);
    user.then((data) => {
      if (!data) {
        mainDispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "המשתמש כבר קיים" },
        });
        setAddUser(false);
        setNewUser(initialData);
      } else {
        mainDispatch({
          type: "SET_SHOW_SUCCESS",
          payload: { show: true, message: "המשתמש נוסף בהצלחה" },
        });
        newUser._id = data._id;
        setUsers([...users, newUser]);
        setAddUser(false);
        setNewUser(initialData);
      }
    });
  };

  // edit user
  const handleEditUser = async () => {
    // remove empty key
    let newUserC = Object.fromEntries(
      Object.entries(newUser).filter(([key, value]) => value)
    );
    setNewUser(newUserC);

    let user = apiRequestForForm(
      `admin/editUser/${newUser._id}`,
      "PUT",
      newUser
    );
    user.then((data) => {
      if (data.error) {
        mainDispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "שגיאה בעדכון המשתמש" },
        });
        return;
      }
      mainDispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "המשתמש עודכן בהצלחה" },
      });
      let updatedUsers = users.map((user) => {
        if (user._id === newUser._id) {
          return newUser;
        }
        return user;
      });
      setUsers(updatedUsers);
      setEditUser(false);
      setNewUser(initialData);
    });
  };

  // delete user
  const handleDeleteUser = async (id) => {
    let user = apiRequestForForm(`admin/deleteUser/${id}`, "DELETE");
    user.then((data) => {
      if (data.error) {
        mainDispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "שגיאה במחיקת המשתמש" },
        });
        return;
      }
      mainDispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "המשתמש נמחק בהצלחה" },
      });
      let updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
    });
  };

  useEffect(() => {
    if (state.branches) {
      setBranches(state.branches);
    }
  }, [state.branches]);

  useEffect(() => {
    let users = apiRequestForForm("admin/allUsers");
    users.then((data) => {
      setUsers(data.users);
    });
    setCurrentUsers(mainState.userInfo);
  }, []);

  return (
    <>
      <div className={subGeneralManagement.main}>
        <div className={subGeneralManagement.header}>
          <div className={subGeneralManagement.title}>ניהול משתמשים</div>
          <div className={subGeneralManagement.headerButtons}>
            <div
              className={subGeneralManagement.headerButton}
              onClick={() => setAddUser(true)}
            >
              הוספת משתמש
            </div>
          </div>
        </div>
        <div className={subGeneralManagement.body}>
          {addUser && (
            <div className={subGeneralManagement.formFields}>
              <div className={subGeneralManagement.formFieldsTitle}>
                הוספת משתמש
              </div>
              <div className={subGeneralManagement.formFieldsForm}>
                <div className={subGeneralManagement.formFieldsInput}>
                  <label>שם משתמש</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                  />
                </div>
                <div className={subGeneralManagement.formFieldsInput}>
                  <label>אימייל</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div className={subGeneralManagement.formFieldsInput}>
                  <label>סיסמה</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                </div>
                <div className={subGeneralManagement.formFieldsInput}>
                  <label>תפקיד</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="" disabled >בחר תפקיד</option>
                    <option value="manager">מנהל סניף</option>
                    <option value="subAdmin">מנהל תפעול</option>
                    <option value="admin">מנהל אדמין</option>
                    <option value="master">מאסטר</option>
                  </select>
                </div>
                {newUser.role === "manager" && (
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>סניף</label>
                    <select
                      value={newUser.branch}
                      onChange={(e) =>
                        setNewUser({ ...newUser, branch: e.target.value })
                      }
                    >
                      <option value="">בחר סניף</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch.number}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={subGeneralManagement.formFieldsButtons}>
                  <div
                    className={
                      subGeneralManagement.formFieldsButton +
                      " " +
                      subGeneralManagement.cancelButton
                    }
                    onClick={() => {
                      setAddUser(false);
                      setNewUser(initialData);
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
                    onClick={() => handleAddUser()}
                  >
                    הוספה
                  </div>
                </div>
              </div>
            </div>
          )}
          {editUser && (
            <>
              <div className={subGeneralManagement.formFields}>
                <div className={subGeneralManagement.formFieldsTitle}>
                  עריכת משתמש
                </div>
                <div className={subGeneralManagement.formFieldsForm}>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>שם משתמש</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>אימייל</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>סיסמה חדשה</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </div>
                  <div className={subGeneralManagement.formFieldsInput}>
                    <label>תפקיד</label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value=""
                        disabled
                      >בחר תפקיד</option>
                      <option value="manager">מנהל סניף</option>
                      <option value="subAdmin">מנהל תפעול</option>
                      <option value="admin">מנהל אדמין</option>
                      <option value="master">מאסטר</option>
                    </select>
                  </div>
                  {newUser.role === "manager" && (
                    <div className={subGeneralManagement.formFieldsInput}>
                      <label>סניף</label>
                      <select
                        value={newUser.branch}
                        onChange={(e) =>
                          setNewUser({ ...newUser, branch: e.target.value })
                        }
                      >
                        <option value="">בחר סניף</option>
                        {branches.map((branch) => (
                          <option key={branch._id} value={branch.number}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className={subGeneralManagement.formFieldsButtons}>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.cancelButton
                      }
                      onClick={() => {
                        setEditUser(false);
                        setNewUser(initialData);
                      }}
                    >
                      ביטול
                    </div>
                    <div
                      className={
                        subGeneralManagement.formFieldsButton +
                        " " +
                        subGeneralManagement.editButton
                      }
                      onClick={handleEditUser}
                    >
                      עריכה
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {!addUser && !editUser && users != [] && (
            <>
              {users.length &&
                users.map((user, index) => (
                  <div key={index} className={subGeneralManagement.list}>
                    <div className={subGeneralManagement.listTitle}>
                      {user.username}
                    </div>
                    <div className={subGeneralManagement.listDetails}>
                      <div className={subGeneralManagement.listDetail}>
                        {user.email}
                      </div>
                      <div className={subGeneralManagement.listDetail}>
                        {user.role 
                          ? user.role === "manager"
                            ? "מנהל סניף"
                            : user.role === "subAdmin"
                            ? "מנהל תפעול"
                            : user.role === "admin"
                            ? "מנהל אדמין"
                            : "מאסטר"
                          : ""}
                      </div>
                      <div className={subGeneralManagement.listDetail}>
                        {user.branch && branches.length > 0
                          ? branches.find(
                              (branch) => branch.number === user.branch
                            )?.name || "כללי"
                          : "כללי"}
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
                          setEditUser(true);
                          setNewUser(user);
                        }}
                      >
                        עריכה
                      </div>
                      {currentUsers._id !== user._id && (
                        <div
                          onClick={() => handleDeleteUser(user._id)}
                          className={
                            subGeneralManagement.listButton +
                            " " +
                            subGeneralManagement.deleteButton
                          }
                        >
                          מחיקה
                        </div>
                      )}
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

export default Users;
