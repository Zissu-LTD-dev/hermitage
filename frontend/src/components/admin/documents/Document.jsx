import {useState, useEffect} from "react";
import documentStyle from "../../../assets/css/admin/documents/Document.module.css";
import apiRequest from "../../../services/api";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;



function Document({document}) {
  const { state, dispatch } = useMainContext();
  const { state: adminState, dispatch: adminDispatch } = useAdminContext();
  const [branches, setBranches] = useState([]); 
  const [forTo, setForTo] = useState("all");
 
  let {name, date, link} = document;

  date = date.split("T")[0].split("-").reverse().join(".");

  const handleBranchChange = async (e) => {
    let branchId = e.target.value;
    let res = await apiRequest(`admin/updateDocument/${document._id}`, "PUT", {branchId});
    if (!res) {
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "העדכון נכשל" },
      });
      return;
    }
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "העדכון בוצע בהצלחה" },
    });
    adminDispatch({ type: "UPDATE_DOCUMENT", payload: {documentId: document._id, branchId} });
    
    branches.map((branch) => {
      if(branchId == "all"){
        setForTo("כל הסניפים");
      }else if (branch._id == branchId) {
        setForTo(branch.name);
      }
    });
    
  }

  const handleDownload = async () => {
    let res = await fetch(`${REACT_APP_BACKEND_URL}admin/downloadDocument/${document._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`
      },
    });
    let blob = await res.blob();
    let url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  const handleDelete = async () => {
    // delete document from db
    let res = await apiRequest(`admin/deleteDocument/${document._id}`, "DELETE");

    if (!res) {
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "המחיקה נכשלה" },
      });
      return;
    }
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "המחיקה בוצעה בהצלחה" },
    });
    adminDispatch({ type: "DELETE_DOCUMENT", payload: document._id });

  }

  useEffect(() => {
    if (adminState.branches.length > 0) {
      setBranches(adminState.branches);
    }
  }, []);

  useEffect(() => {
    if (branches.length === 0) return;
    if(document.forTo != "all") {
      let branchName = branches.find(branch => branch._id === document.forTo[0]);
      setForTo(branchName.name);
    }else{
      setForTo("כל הסניפים");
    }
  }, [branches]);

  return (
    <>
      <div className={documentStyle.main}>
        <span>
          <div className={documentStyle.name}>{name}</div>
          <div className={documentStyle.date}>{date}</div>
        </span>
        <span>
          <select className={documentStyle.select_branch} value={forTo} onChange={handleBranchChange} >
            {forTo != "all" && <option disabled value={forTo}>{forTo}</option> }
            <option value="all">כל הסניפים</option>
            {branches.map((branch) => {
              return <option key={branch._id} value={branch._id}>{branch.name}</option>;
            })}
          </select>
          <div className={documentStyle.download} onClick={handleDownload}></div>
          <div className={documentStyle.delete} onClick={handleDelete}></div>
        </span>
      </div>
    </>
  );
}

export default Document;
