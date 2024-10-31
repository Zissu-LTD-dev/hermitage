import { useEffect, useState } from "react";
import messageStyle from "../../../assets/css/manager/messages/Message.module.css";

function MessageM( {data , readList}) {
  
  const [messageData, setMessageData] = useState([]);

  useEffect(() => {
    setMessageData(data);
  }, [data]);

  return (
    <>
      <div className={messageStyle.main}>
        <div className={messageStyle.message__popup}>
          {messageData.map((msg, index) => (
            <div key={index} className={messageStyle.message__popup__item}>
              { !readList.includes(msg._id) && <div className={messageStyle.newMessage}>
                  הודעה חדשה
                </div>}
              <div
                className={
                  messageStyle.message__popup__item__content  + " " + (!readList.includes(msg._id) ? messageStyle.read : messageStyle.unread)
                }
              >
                {msg.content}
              </div>
              <p className={messageStyle.message__popup__item__date}>
                נשלחה ב: {msg.timestamp.split("T")[0].replace(/-/g, "/")} <br />
                בשעה: {msg.timestamp.split("T")[1].split(".")[0]} <br />
                שולח : {msg.sender}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
// (msg.read ? messageStyle.read : messageStyle.unread)

export default MessageM;
