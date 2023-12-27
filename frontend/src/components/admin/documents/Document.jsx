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
          <select className={document.select_branch}>
            <option>כל הסניפים</option>
            <option>סניף א</option>
            <option>סניף ב</option>
            <option>סניף ג</option>
          </select>
          <div className={document.download}></div>
          <div className={document.delete}></div>
        </span>
      </div>
    </>
  );
}

export default Document;
