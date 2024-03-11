import { useState, useEffect } from "react";
import { useMainContext } from "../../context/mainContext/MainContext";
import apiRequest from "../../services/api";
import documentsStyle from "../../assets/css/manager/Documents.module.css";
import Document from "./documents/Document";

function Documents() {
  const { state, dispatch } = useMainContext();
  const [documents, setDocuments] = useState([]);


  useEffect(() => {
    let branchId = state.userInfo.branch.number;
    const getDocuments = async () => {
      let res = await apiRequest(`manager/allDocuments/${branchId}`);
      if (!res) {
        dispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "הקבצים לא נטענו" },
        });
        return;
      }
      dispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "הקבצים נטענו בהצלחה" },
      });
      dispatch({ type: "SET_DOCUMENTS", payload: res.documents });
      setDocuments(res.documents);
    };
    getDocuments();
  }, [state.userInfo]);

  return (
    <>
      <div className={documentsStyle.main}>
        <div className={documentsStyle.header}>
          <div className={documentsStyle.title} >מסמכים</div>
        </div>
        <div className={documentsStyle.body}>
          {documents.map((document, index) => (
            <Document key={index} document={document} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Documents