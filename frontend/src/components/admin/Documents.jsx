import { useState } from "react";
import documents from "../../assets/css/admin/Documents.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import apiRequestForForm from "../../services/apiForForm";
import Document from "./documents/Document";

function Documents() {
  const { state, dispatch } = useMainContext();

  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    if (e.target.files[0].type !== "application/pdf") {
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "PDF הקובץ אינו" },
      });
      return;
    }
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUpload(true);
  };

  const handleUpload = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    const formData = new FormData();
    formData.append("pdfFile", file);

    let res = await apiRequestForForm("admin/uploadPdf", "POST", formData);
    if (!res) {
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "הקובץ לא הועלה" },
      });
      return;
    }
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "הקובץ הועלה בהצלחה" },
    });

    setUpload(false);
    setFile(null);
    setFileName("");
  };

  return (
    <>
      <div className={documents.main}>
        <div className={documents.header}>
          <div className={documents.title}>מסמכים</div>
          <span>
            {!upload && (
              <>
                <div className={documents.button}>
                  <div className={documents.icon}></div>
                  <div className={documents.text}>העלה קובץ חדש</div>
                </div>
                <input
                  className={documents.inputFile}
                  type="file"
                  onChange={handleFile}
                />
              </>
            )}
            {upload && (
              <div className={documents.button}>
                <div
                  className={documents.text + " " + documents.send_file}
                  onClick={handleUpload}
                >
                  שלח קובץ : {fileName}
                </div>
              </div>
            )}
          </span>
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
  );
}

export default Documents;
