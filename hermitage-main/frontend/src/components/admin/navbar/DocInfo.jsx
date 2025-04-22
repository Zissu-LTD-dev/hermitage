import { useEffect, useState } from "react";
import message from "../../../assets/css/navbar/message.module.css";
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
      <div className={message.main}>
        <div className={message.sub__icon} >
          <span >{docNum}</span>
        </div>
        <div className={message.doc__info}>
          <span className={message.doc__icon} />
        </div>
      </div>
    </>
  );
}

export default DocInfo;
