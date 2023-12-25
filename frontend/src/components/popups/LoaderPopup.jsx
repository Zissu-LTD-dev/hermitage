import {useState, useEffect } from 'react'
import popups from '../../assets/css/popups/popups.module.css'

function LoaderPopup({isShow, message = "טוען"}) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(isShow)
    }, [isShow])

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