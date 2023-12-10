import document from "../../../assets/css/manager/documents/Document.module.css";

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
        </span>
      </div>
    </>
  );
}

export default Document