import {useState, useEffect } from 'react'
import { useMainContext } from "../../context/mainContext/MainContext";
import popups from '../../assets/css/popups/popups.module.css'

function LoaderPopup({isShow, message = "טוען"}) {
    const { state, dispatch } = useMainContext();
    const [show, setShow] = useState(false)

    useEffect(() => {
      setShow(isShow)
    }, [isShow])
    
    useEffect(() => {
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: false, message: "" } });
      dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: false, message: "" } });
      dispatch({ type: "SET_SHOW_WARNING", payload: { show: false, message: "" } });
    }, [])

  return (
    <>
    {show &&
        <div className={popups.loader}>
            <div className={popups.title}></div>
            <div className={popups.message}>{message}</div>
            <div className={popups.icon}></div>
        </div>
    }
    </>
  )
}

export default LoaderPopup