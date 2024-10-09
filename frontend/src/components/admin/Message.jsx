import { useState, useEffect } from "react";
import MessageStyle from "../../assets/css/admin/Message.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequestForForm from "../../services/apiForForm";

function Message() {
  const { state, dispatch } = useMainContext();
  const { state: adminState, dispatch: adminDispatch } = useAdminContext();

  const [branches, setBranches] = useState();
  const [selectBranches, setSelectBranches] = useState([]);
  const [message, setMessage] = useState("");
  const [allBranches, setAllBranches] = useState(false);

  const handleCheckbox = (e) => {
    if (e.target.value === "all") {
      if (e.target.checked) {
        setSelectBranches(branches.map((branch) => branch._id));
        setAllBranches(true);
      } else {
        setSelectBranches([]);
        setAllBranches(false);
      }
    } else {
      if (e.target.checked) {
        setAllBranches(false);
        setSelectBranches([...selectBranches, e.target.value]);
      } else {
        setAllBranches(false);
        setSelectBranches(
          selectBranches.filter((branch) => branch !== e.target.value)
        );
      }
    }
  };

  const sendMessage = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    let res = await apiRequestForForm("admin/addMessageToBranchs", "POST", {
      branchesList: selectBranches,
      message,
      sender: state.userInfo.username,
    });
    if (!res) {
      dispatch({ type: "SET_SHOW_LOADER", payload: false });
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "ההודעה לא נשלחה" },
      });
      return;
    }
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "ההודעה נשלחה בהצלחה" },
    });
    setMessage("");
    setSelectBranches([]);
    setAllBranches(false);
  };

  useEffect(() => {
    if (adminState.branches) {
      setBranches(adminState.branches);
    }
  }, [adminState.branches]);

  return (
    <>
      <div className={MessageStyle.main}>
        <div className={MessageStyle.title}>שליחת הודעה לסניפים</div>
        <div className={MessageStyle.selectBranch}>
          <div className={MessageStyle.selectTitle}>בחר סניפים :</div>
          {branches && (
            <div className={MessageStyle.checkbox}>
              <div>
                <input
                  type="checkbox"
                  id="all"
                  name="all"
                  value="all"
                  onChange={handleCheckbox}
                  checked={allBranches}
                />
                <label for="all">כל הסניפים</label>
              </div>
              {branches.map((branch) => (
                <div>
                  <input
                    key={branch._id}
                    type="checkbox"
                    id={branch._id}
                    name={branch._id}
                    value={branch._id}
                    onChange={handleCheckbox}
                    checked={
                      allBranches ? true : selectBranches.includes(branch._id)
                    }
                  />
                  <label for={branch._id}>{branch.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={MessageStyle.message}>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            placeholder="הקלד הודעה"
            value={message}
          ></textarea>
        </div>
        <div className={MessageStyle.btn}>
          <button
            disabled={selectBranches.length === 0 || message === ""}
            onClick={sendMessage}
          >שלח</button>
        </div>
      </div>
    </>
  );
}

export default Message;
