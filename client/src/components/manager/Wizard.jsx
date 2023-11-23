import { useState, useEffect } from "react";
import {useOrderContext} from "../../context/orderContext/OrderContext"
import wizard from "../../assets/css/manager/Wizard.module.css";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import cookie from "js-cookie";


function Wizard() {
  const { state, dispatch } = useOrderContext();
  
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
       return 
      };
    setStep(step + 1);
    let num = state.status.step + 1;
    dispatch({ type: "SET_STATUS", payload: num });
  };
  
  const prevStep = () => {
    if (step == 2 || step == 5 ) return;
    setStep(step - 1);
    let num = state.status.step - 1;
    dispatch({ type: "SET_STATUS", payload: num });
  };

  useEffect(() => {
    if(step == 5) {
      dispatch({ type: "SET_SUMMARY" });
    }
  }, [step]);

  return (
    <>
      <div className={wizard.main}>
        <div
          onClick={prevStep}
          className={
            step == 2 || step == 5 
              ? wizard.back + " " + wizard.button + " " + wizard.off
              : wizard.back + " " + wizard.button 
          }
        >
          <i></i>
          <span>חזור אחורה</span>
        </div>
        <div className={wizard.wizard}>
          <div className={wizard.add}>
            {step < 2 ? <i>1</i> : <i className={wizard.done}>1</i>}
            <span>הוספת מוצרים</span>
          </div>
          <div className={wizard.summary}>
            <div className={wizard.line + " " + step > 1 ? wizard.lineActive : null }></div>
            {step < 3 ? <i>2</i> : <i className={wizard.done}>2</i>}
            <span>סיכום ביניים</span>
          </div>
          <div className={wizard.returns}>
            <div className={wizard.line + " " + step > 2 ? wizard.lineActive : null }></div>
            {step < 4 ? <i>3</i> : <i className={wizard.done}>3</i>}
            <span>מוצרים להחזרה</span>
          </div>
          <div className={wizard.end}>
            <div className={wizard.line + " " + step > 3 ? wizard.lineActive : null }></div>
            {step < 5 ? <i>4</i> : <i className={wizard.done}>4</i>}
            <span>סיכום ואישור</span>
          </div>
        </div>
        <div onClick={nextStep} className={wizard.next + " " + wizard.button}>
          { step < 5  &&  <span>המשך לשלב הבא</span> }
          { step == 5  &&  <span>שלח הזמנה</span> }
          <i></i>
        </div>
      </div>
    </>
  );
}

export default Wizard;
