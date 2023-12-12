import docInfo from "../../../assets/css/navbar/DocInfo.module.css";

function DocInfo() {
  const docNum = 4;

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
