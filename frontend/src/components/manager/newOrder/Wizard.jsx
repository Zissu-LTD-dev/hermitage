import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import wizardStyle from "../../../assets/css/manager/newOrder/Wizard.module.css";
import apiRequest from "../../../services/api";

function Wizard() {
  const { state, dispatch } = useMainContext();

  const [step, setStep] = useState(2);

  const sendOrder = async () => {
    let summary = state.summary;
    let branch = state.userInfo.branch;
    let userName = state.userInfo.username;
    let role = state.userInfo.role;
    let order = { summary, branch, userName, role };

    if (summary.length === 0) return dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אין מוצרים לשליחה" } });

    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    const data = await apiRequest("manager/createOrder", "POST", order);
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    if (data) {
      dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנה נשלחה בהצלחה" } });
      dispatch({ type: "CLEAR_ORDER" });
      localStorage.setItem("activeOrder", "{}");
      dispatch({ type: "SET_STATUS_ORDER", payload: 1 });
    } else {
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בשליחת ההזמנה" } });
    }
  };

  const nextStep = () => {
    if (step == 4) return sendOrder() 
    setStep(step + 1);
    let num = state.statusOrder.step + 1;
    dispatch({ type: "SET_STATUS_ORDER", payload: num });
  };

  const prevStep = () => {
    if (step == 1 || step > 4) return;
    setStep(step - 1);
    let num = state.statusOrder.step - 1;
    dispatch({ type: "SET_STATUS_ORDER", payload: num });
  };

  useEffect(() => {
    // clear filters end search results
    dispatch({ type: "SET_SEARCH", payload: "" });
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
    if (step == 4) {
      dispatch({ type: "SET_SUMMARY" });
    }
  }, [step]);

  useEffect(() => {
    setStep(state.statusOrder.step);
  }, [state.statusOrder]);

  return (
    <>
      <div className={wizardStyle.main}>
        <div
          onClick={prevStep}
          className={
            step == 1 || step > 5
              ? wizardStyle.back +
                " " +
                wizardStyle.button +
                " " +
                wizardStyle.off
              : wizardStyle.back + " " + wizardStyle.button
          }
        >
          <i></i>
          <span>חזור אחורה</span>
        </div>
        <div className={wizardStyle.wizard}>
          <div className={wizardStyle.add}>
            {step < 1 ? (
              <i>1</i>
            ) : (
              <i
                className={step == 1 ? wizardStyle.now_here : wizardStyle.done}
              >
                {step == 1 ? 1 : null}
              </i>
            )}
            <span>הוספת מוצרים</span>
          </div>
          <div className={wizardStyle.summary}>
            <div
              className={
                step > 1
                  ? wizardStyle.line + " " + wizardStyle.lineActive
                  : wizardStyle.line
              }
            ></div>
            {step < 2 ? (
              <i>2</i>
            ) : (
              <i
                className={step == 2 ? wizardStyle.now_here : wizardStyle.done}
              >
                {step == 2 ? 2 : null}
              </i>
            )}
            <span>סיכום ביניים</span>
          </div>
          <div className={wizardStyle.returns}>
            <div
              className={
                step > 2
                  ? wizardStyle.line + " " + wizardStyle.lineActive
                  : wizardStyle.line
              }
            ></div>
            {step < 3 ? (
              <i>3</i>
            ) : (
              <i
                className={step == 3 ? wizardStyle.now_here : wizardStyle.done}
              >
                {step == 3 ? 3 : null}
              </i>
            )}
            <span>מוצרים להחזרה</span>
          </div>
          <div className={wizardStyle.end}>
            <div
              className={
                step > 3
                  ? wizardStyle.line + " " + wizardStyle.lineActive
                  : wizardStyle.line
              }
            ></div>
            {step < 4 ? (
              <i>4</i>
            ) : (
              <i
                className={step == 4 ? wizardStyle.now_here : wizardStyle.done}
              >
                {step == 4 ? 4 : null}
              </i>
            )}
            <span>סיכום ואישור</span>
          </div>
        </div>
        <div
          onClick={nextStep}
          className={wizardStyle.next + " " + wizardStyle.button}
        >
          {step < 4 && <span>המשך לשלב הבא</span>}
          {step >= 4 && <span>שלח הזמנה</span>}
          <i></i>
        </div>
      </div>
    </>
  );
}

export default Wizard;
