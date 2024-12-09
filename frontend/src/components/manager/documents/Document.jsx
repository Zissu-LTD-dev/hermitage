import {useRef} from "react";
import documentStyle from "../../../assets/css/manager/documents/Document.module.css";
import DateDisplay from '../../DateDisplay';

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

function Document({document}) {
  let {name, date, link} = document;
  const linkRef = useRef(null);

  const handleDownload = async () => {
    
    if (typeof window === 'undefined') {
      console.error('Download is only available in a browser');
      return;
    }

    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}manager/downloadDocument/${document._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const downloadLink = linkRef.current || document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = name;
      
      if (!linkRef.current) {
        document.body.appendChild(downloadLink);
      }
      
      downloadLink.click();
      
      if (!linkRef.current) {
        document.body.removeChild(downloadLink);
      }
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
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
        <a ref={linkRef} style={{display: 'none'}} />
      </div>
    </>
  );
}

export default Document;