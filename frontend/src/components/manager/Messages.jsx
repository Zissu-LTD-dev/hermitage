import { useEffect, useState,  } from "react";
import messageStyle from "../../assets/css/manager/messages/Message.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import apiRequest from "../../services/api";
import MessageM from "./messages/MessageM";

function Messages() {
  const { state, dispatch } = useMainContext();

  const [messageData, setMessageData] = useState([]);
  const [readList, setReadList] = useState([]);

  const getMessages = async () => {
    let branchId =  state.userInfo.branch._id;
    let data = await apiRequest(`manager/getMessages/${branchId}`, "GET");
    if (!data) return ;
    data = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setMessageData(data);
  }

  const getReadList = async () => {
    let branchId = state.userInfo.branch._id;
    const data = await apiRequest(`manager/getReadList/${branchId}`, "GET");
    if (!data) return;
    let readList = data.map((msg) => msg.message_id);
    setReadList(readList);
  }

  const handleReadMessage = async () => {
    let messages = messageData.filter((msg) => !readList.includes(msg._id));
    console.log(messages);
    let branchId = state.userInfo.branch._id;
    const data = await apiRequest("manager/readMessage", "POST", { branch: branchId, messages: messages });
    if (!data) return;
    getMessages();
    getReadList();
  };

  useEffect(() => {
      getMessages();
      getReadList();
  }, []);
      

  return (
    <>
      <div className={messageStyle.main}>
        <div className={messageStyle.header}>
          <div className={messageStyle.title}>הודעות</div>
          <div className={messageStyle.readBTN} onClick={handleReadMessage}>
            קראתי
          </div>
        </div>
        <MessageM data={messageData} readList={readList} />
      </div>
    </>
  );
}

export default Messages;
