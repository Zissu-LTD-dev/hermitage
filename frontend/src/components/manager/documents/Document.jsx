import documentStyle from "../../../assets/css/manager/documents/Document.module.css";
import DateDisplay from '../../DateDisplay';

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

function Document({document}) {
  let {name, date, link} = document;


  const handleDownload = async () => {
    let res = await fetch(`${REACT_APP_BACKEND_URL}manager/downloadDocument/${document._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`
      },
    });
    
    let blob = await res.blob();
    let url = await window.URL.createObjectURL(blob);
    window.open(url);
  }

  return (
    <>
      <div className={documentStyle.main}>
        <span>
          <div className={documentStyle.name}>{link.split(".")[link.split("/").length - 1] + "." +  name }</div>
          <div className={documentStyle.date}><DateDisplay timestamp={date} type="full" /></div>
        </span>
        <span>
          <div className={documentStyle.download} onClick={handleDownload}></div>
        </span>
      </div>
    </>
  );
}

export default Document