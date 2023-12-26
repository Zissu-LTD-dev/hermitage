import {useState, useEffect } from 'react'
import { useMainContext } from "../../context/mainContext/MainContext";
import popups from '../../assets/css/popups/popups.module.css'

function WarningPopup({isShow, message = "אזהרה" }) {
    const { state, dispatch } = useMainContext();
    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            dispatch({ type: "SET_SHOW_WARNING", payload: { show: false, message: "" } });
        }, 4000)
    }, [])

    useEffect(() => {
        setShow(isShow)
    }, [isShow])

    return (
    <>
    {show &&
        <div className={popups.main + " " + popups.warning}>
            {/* <div className={popups.title}>Warning</div> */}
            <div className={popups.message}>{message}</div>
            <div className={popups.icon}></div>
        </div>
    }
    </>
  )
}

export default WarningPopup