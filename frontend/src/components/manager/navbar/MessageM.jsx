import { useEffect, useState, useRef } from "react";
import messageStyle from "../../../assets/css/navbar/message.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import apiRequest from "../../../services/api";

function MessageM() {
  const { state, dispatch } = useMainContext();
  
  const [msgNum, setMsgNum] = useState(0);
  const [messageData, setMessageData] = useState([]);
  const [openShowMessage, setOpenShowMessage] = useState(false);

  const hendleReadMessage = async () => {
    const data = await apiRequest("manager/readMessage", "POST", {
      branch: state.userInfo.branch._id,
    });
    if (!data) return;
    dispatch({ type: "READ_MESSAGE" });
  };

  useEffect(() => {
    if(openShowMessage) hendleReadMessage();
  }, [openShowMessage]);

  useEffect(() => {
    if (state.userInfo.branch) {
      setMessageData(state.userInfo.branch.messages);
      let num = state.userInfo.branch.messages.filter(
        (msg) => msg.read === false
      ).length;
      setMsgNum(num);
    }
  }, [state.userInfo]);

  return (
    <>
      <div
        className={messageStyle.main}
        onClick={() => setOpenShowMessage(!openShowMessage)}
      >
        <div className={messageStyle.sub__icon}>
          <span>{msgNum}</span>
        </div>
        <div className={messageStyle.doc__info}>
          <span className={messageStyle.doc__icon} />
        </div>
      </div>
      <div
        className={
          messageStyle.message__popup +
          " " +
          (openShowMessage ? messageStyle.active : messageStyle.close)
        }
      >
        {messageData.map((msg, index) => (
          <div key={index} className={messageStyle.message__popup__item}>
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
              נשלחה ב: {new Date(msg.date).toLocaleDateString()} <br />
              בשעה: {new Date(msg.date).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default MessageM;
