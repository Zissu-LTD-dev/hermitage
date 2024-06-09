import { useEffect, useState, useRef } from "react";
import messageStyle from "../../../assets/css/manager/messages/Message.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

function MessageM() {
  const { state, dispatch } = useMainContext();

  const wrapperRef = useRef(null);

  const [msgNum, setMsgNum] = useState(0);
  const [messageData, setMessageData] = useState([]);
  const [openShowMessage, setOpenShowMessage] = useState(false);

  

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenShowMessage(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (state.userInfo.branch) {
      let sortData = state.userInfo.branch.messages.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setMessageData(sortData);
      let num = state.userInfo.branch.messages.filter(
        (msg) => msg.read === false
      ).length;
      setMsgNum(num);
    }
  }, [state.userInfo]);



  return (
    <>
      <div className={messageStyle.main}>
        <div className={messageStyle.message__popup}>
          {messageData.map((msg, index) => (
            <div key={index} className={messageStyle.message__popup__item}>
              {!msg.read && <div className={messageStyle.newMessage}>
                  הודעה חדשה
                </div>}
              <div
                className={
                  messageStyle.message__popup__item__content +
                  " " +
                  (msg.read ? messageStyle.read : messageStyle.unread)
                }
              >
                {msg.contact}
              </div>
              <p className={messageStyle.message__popup__item__date}>
                נשלחה ב: {msg.date.split(",")[0]} <br />
                בשעה: {msg.date.split(",")[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MessageM;
