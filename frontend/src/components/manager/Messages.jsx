import messageStyle from "../../assets/css/manager/messages/Message.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import apiRequest from "../../services/api";
import MessageM from "./messages/MessageM";

function Messages() {
  const { state, dispatch } = useMainContext();

  const handleReadMessage = async () => {
    const data = await apiRequest("manager/readMessage", "POST", {
      branch: state.userInfo.branch._id,
    });
    if (!data) return;
    dispatch({ type: "READ_MESSAGE" });
  };

  return (
    <>
      <div className={messageStyle.main}>
        <div className={messageStyle.header}>
          <div className={messageStyle.title}>הודעות</div>
          <div className={messageStyle.readBTN} onClick={handleReadMessage}>
            קראתי
          </div>
        </div>
        <MessageM />
      </div>
    </>
  );
}

export default Messages;
