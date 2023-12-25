import {useState, useEffect } from 'react'
import popups from '../../assets/css/popups/popups.module.css'

function WarningPopup({isShow, message = "אזהרה" }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShow(false)
        }, 7000)
    }, [])

    useEffect(() => {
        setShow(isShow)
    }, [isShow])

    return (
    <>
    {show &&
        <div className={popups.main + " " + popups.warning}>
            <div className={popups.title}>Warning</div>
            <div className={popups.message}>{message}</div>
            <div className={popups.icon}></div>
        </div>
    }
    </>
  )
}

export default WarningPopup