import documents from "../../assets/css/admin/Documents.module.css"
import Document from "./documents/Document"

function Documents() {
  return (
    <>
        <div className={documents.main}>
            <div className={documents.header}>
                <div className={documents.title}>מסמכים</div>
                <div className={documents.button}>
                    <div className={documents.icon}></div>
                    <div className={documents.text}>העלה קובץ חדש</div>
                </div>
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