import documents from "../../assets/css/manager/Documents.module.css";
import Document from "./documents/Document";

function Documents() {
  return (
    <>
      <div className={documents.main}>
        <div className={documents.header}>
          <div className={documents.title} >מסמכים</div>
        </div>
        <div className={documents.body}>
          <Document />
          <Document />
          <Document />
          <Document />
          <Document />
        </div>
      </div>
    </>
  )
}

export default Documents