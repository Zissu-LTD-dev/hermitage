import {useState, useEffect, useRef} from "react";
import documentStyle from "../../../assets/css/admin/documents/Document.module.css";
import apiRequest from "../../../services/api";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import DateDisplay from '../../DateDisplay';

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;



function Document({dataDocument}) {
  const { state, dispatch } = useMainContext();
  const { state: adminState, dispatch: adminDispatch } = useAdminContext();
  const [branches, setBranches] = useState([]); 
  const [forTo, setForTo] = useState(["all"]);
  const [openChooseBranch, setOpenChooseBranch] = useState(false);
  const [shoeBranchesList, setShowBranchesList] = useState(false);
  const [branchChecked, setBranchChecked] = useState([]);

 
  let {name, date, link} = dataDocument;
  
  const handleBranchChange = (e) => {
    let branchId = e.target.value;
    let checked = e.target.checked;
    if(branchId == "all"){
      if(checked){
        setBranchChecked(["all"]);
      }else{
        setBranchChecked([]);
      }
    }else{
      console.log('branchId', branchId);
      if(branchChecked.includes("all")){
        let newBranchChecked = branches.map((branch) => branch._id);
        if(newBranchChecked.includes(branchId)){
          newBranchChecked = newBranchChecked.filter((branch) => branch !== branchId);
        }else{
          newBranchChecked.push(branchId);
        }
        setBranchChecked(newBranchChecked);
      }else{
        if(checked){
          setBranchChecked([...branchChecked, branchId]);
        }else{
          let newBranchChecked = branchChecked.filter((branch) => branch !== branchId);
          setBranchChecked(newBranchChecked);
        }
      }
    }
  }

  const handleSend = async () => {
    if(branchChecked.length === 0){
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "יש לבחור לפחות סניף אחד" },
      });
      setOpenChooseBranch(false);
      return;
    }
    let branchId = branchChecked;
    let res = await apiRequest(`admin/updateDocument/${dataDocument._id}`, "PUT", {branchId});
    if (!res) {
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "העדכון נכשל" },
      });
      setOpenChooseBranch(false);
      return;
    }
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "העדכון בוצע בהצלחה" },
    });
    adminDispatch({ type: "UPDATE_DOCUMENT", payload: {documentId: dataDocument._id, branchId: branchChecked} });
    setOpenChooseBranch(false);
    setForTo(branchChecked.includes("all") ? ["כל הסניפים"] : branchChecked.map((branch) => {
      let activeBranch = [];
      branches.map((b) => {
        if(b._id == branch){
          activeBranch.push(b.name);
        }
      });
      return activeBranch;
    }));
  }



  const handleDownload = async () => {
    
    try {
      let res = await fetch(`${REACT_APP_BACKEND_URL}admin/downloadDocument/${dataDocument._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`
        },
      });
  
      let blob = await res.blob();
      let url = window.URL.createObjectURL(blob);
      
      let a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async () => {
    // delete dataDocument from db
    let res = await apiRequest(`admin/deleteDocument/${dataDocument._id}`, "DELETE");

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
    adminDispatch({ type: "DELETE_DOCUMENT", payload: dataDocument._id });

  }

  useEffect(() => {
    if (adminState.branches.length > 0) {
      setBranches(adminState.branches);
    }
  }, [adminState.branches]);

  useEffect(() => {
    if (branches.length === 0) return;
    if(dataDocument.forTo != "all") {
      let activeBranch = [];
      let checkedBranches = [];
      branches.map((branch) => {
        if(dataDocument.forTo.includes(branch._id)){
          activeBranch.push(branch.name);
          checkedBranches.push(branch._id);
        }
      });
      setForTo(activeBranch);
      setBranchChecked(checkedBranches);
    }else{
      setForTo(["כל הסניפים"]);
    }
  }, [branches]);

  return (
    <>
      <div className={documentStyle.main}>
        <span>
          <div className={documentStyle.name}>{link.split(".")[1] + "." +  name }</div>
          <div className={documentStyle.date}><DateDisplay timestamp={date} type="full" /></div>
          {forTo.includes("כל הסניפים") && <div className={documentStyle.forTo} >כל הסניפים</div> }
          {!forTo.includes("כל הסניפים") && 
            <div className={documentStyle.show_main_branch}>
              <div className={documentStyle.show_branch} onClick={() => setShowBranchesList(!shoeBranchesList)}>
                לסניפים
                <div className={!shoeBranchesList ? documentStyle.arrow_down + " " + documentStyle.arrow : documentStyle.arrow}></div>
              </div>
              {shoeBranchesList &&
                <div className={documentStyle.list_branches}>
                  {forTo.map((branch, index) => {
                    return <div key={index}>{branch}</div>
                  })}
                </div>
              }
            </div>
          }
        </span>
        <span>
        <div className={documentStyle.select_branch} >
          <div className={documentStyle.choose_branch} onClick={() => setOpenChooseBranch(!openChooseBranch)}>
            בחר סניפים
            <div className={!openChooseBranch ? documentStyle.arrow_down + " " + documentStyle.arrow : documentStyle.arrow}></div>
          </div>
          {openChooseBranch && 
            <>
            <div className={documentStyle.branches}>
              <div >
                <input onChange={handleBranchChange} type="checkbox" id="all" name="all" value="all"
                checked={branchChecked.includes("all") ? true : false}
                />
                <label htmlFor="all">כל הסניפים</label>
              </div>
              {branches.map((branch, index) => {
                return (
                  <div key={index} >
                    <input onChange={handleBranchChange} type="checkbox" id={branch._id} name={branch._id} value={branch._id}
                    checked={branchChecked.includes("all") || branchChecked.includes(branch._id) ? true : false}
                    />
                    <label htmlFor={branch._id}>{branch.name} - {branch.number}</label>
                  </div>
                );
              })}
              <div className={documentStyle.send} onClick={handleSend}>
                <button>שלח</button>
              </div>
            </div>
            </>
          }
        </div>
          <div className={documentStyle.download} onClick={handleDownload}></div>
          <div className={documentStyle.delete} onClick={handleDelete}></div>
        </span>
      </div>
    </>
  );
}

export default Document;
