import { useEffect, useState } from "react";
import docInfo from "../../../assets/css/navbar/DocInfo.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import apiRequest from "../../../services/api";

function DocInfo() {
  const { state, dispatch } = useMainContext();
  const [docNum, setDocNum] = useState(0);

    const getDocuments = async (branchId) => {
      let res = await apiRequest(`manager/allDocuments/${branchId}`);
      if (!res) {
        return;
      }
      setDocNum(res.documents.length);
    };

  useEffect(() => {
    if (!state.userInfo.branch) return;
    let branchId = state.userInfo.branch.idNumber;
    getDocuments(branchId);
  }, [state.userInfo]);

  return (
    <>
      <div className={docInfo.main}>
        <div className={docInfo.sub__icon} >
          <span >{docNum}</span>
        </div>
        <div className={docInfo.doc__info}>
          <span className={docInfo.doc__icon} />
        </div>
      </div>
    </>
  );
}

export default DocInfo;
