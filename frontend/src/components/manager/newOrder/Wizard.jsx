import { useState, useEffect } from "react";
import {useMainContext} from "../../../context/mainContext/MainContext"
import wizardStyle from "../../../assets/css/manager/newOrder/Wizard.module.css";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import cookie from "js-cookie";


function Wizard() {
  const { state, dispatch } = useMainContext();
  
  const [step, setStep] = useState(2);

  const sendOrder = async () => {
    try {
      let summary = state.summary;
      let branch = state.userInfo.branch;
      let order = { summary, branch };
      const res = await fetch(`${REACT_APP_BACKEND_URL}manager/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookie.get("token")}`,
        },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };


  const nextStep = () => {
    if (step == 5){
      
        sendOrder();
        dispatch({ type: "CLEAR_ORDER" })  
        setStep(step + 1);
       return 
      };
    setStep(step + 1);
    let num = state.statusOrder.step + 1;
    dispatch({ type: "SET_STATUS_ORDER", payload: num });
  };
  
  const prevStep = () => {
    if (step == 2 || step > 5 ) return;
    setStep(step - 1);
    let num = state.statusOrder.step - 1;
    dispatch({ type: "SET_STATUS_ORDER", payload: num });
  };

  useEffect(() => {
    // clear filters end search results
    dispatch({ type: "SET_SEARCH", payload: '' });
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
    if(step == 5) {
      dispatch({ type: "SET_SUMMARY" });
    }
  }, [step]);

  return (
    <>
      <div className={wizardStyle.main}>
        <div
          onClick={prevStep}
          className={
            step == 2 || step > 5 
              ? wizardStyle.back + " " + wizardStyle.button + " " + wizardStyle.off
              : wizardStyle.back + " " + wizardStyle.button 
          }
        >
          <i></i>
          <span>חזור אחורה</span>
        </div>
        <div className={wizardStyle.wizard}>
          <div className={wizardStyle.add}>
            {step < 2 ? <i>1</i> : <i className={step == 2 ? wizardStyle.now_here : wizardStyle.done }>{step == 2 ? 1 : null}</i>}
            <span>הוספת מוצרים</span>
          </div>
          <div className={wizardStyle.summary}>
            <div className={step > 2 ? wizardStyle.line + " " + wizardStyle.lineActive : wizardStyle.line }></div>
            {step < 3 ? <i>2</i> : <i className={step == 3 ? wizardStyle.now_here : wizardStyle.done }>{step == 3 ? 2 : null}</i>}
            <span>סיכום ביניים</span>
          </div>
          <div className={wizardStyle.returns}>
            <div className={step > 3 ? wizardStyle.line + " " + wizardStyle.lineActive : wizardStyle.line }></div>
            {step < 4 ? <i>3</i> : <i className={step == 4 ? wizardStyle.now_here : wizardStyle.done }>{step == 4 ? 3 : null}</i>}
            <span>מוצרים להחזרה</span>
          </div>
          <div className={wizardStyle.end}>
            <div className={step > 4 ? wizardStyle.line + " " + wizardStyle.lineActive : wizardStyle.line }></div>
            {step < 5 ? <i>4</i> : <i className={step == 5 ? wizardStyle.now_here : wizardStyle.done }>{step == 5 ? 4 : null}</i>}
            <span>סיכום ואישור</span>
          </div>
        </div>
        <div onClick={nextStep} className={wizardStyle.next + " " + wizardStyle.button}>
          { step < 5  &&  <span>המשך לשלב הבא</span> }
          { step >= 5  &&  <span>שלח הזמנה</span> }
          <i></i>
        </div>
      </div>
    </>
  );
}

export default Wizard;
