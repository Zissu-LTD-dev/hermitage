import document from "../../../assets/css/admin/documents/Document.module.css";

function Document() {
  return (
    <>
      <div className={document.main}>
        <span>
          <div className={document.name}>קובץ חדש</div>
          <div className={document.date}>12.12.12</div>
        </span>
        <span>
          <div className={document.download}></div>
          <div className={document.delete}></div>
        </span>
      </div>
    </>
  );
}

export default Document;
