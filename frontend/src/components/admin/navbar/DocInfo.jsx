import { useEffect, useState } from "react";
import docInfo from "../../../assets/css/navbar/DocInfo.module.css";
import useFetch from "../../../hooks/useFetch";

function DocInfo() {
  const { data, loading, error } = useFetch("admin/allDocuments");
  const [docNum, setDocNum] = useState(0);

  useEffect(() => {

    if (!data) return;
    setDocNum(data.documents.length);
  }, [data]);

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
