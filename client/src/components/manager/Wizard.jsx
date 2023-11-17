import { useState, useEffect } from "react";
import wizard from "../../assets/css/manager/Wizard.module.css";

function Wizard() {
  const [step, setStep] = useState(2);

  const nextStep = () => {
    if (step == 5) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step == 2) return;
    setStep(step - 1);
  };

  return (
    <>
      <div className={wizard.main}>
        <div
          onClick={prevStep}
          className={
            step == 2
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
          <span>המשך לשלב הבא</span>
          <i></i>
        </div>
      </div>
    </>
  );
}

export default Wizard;
