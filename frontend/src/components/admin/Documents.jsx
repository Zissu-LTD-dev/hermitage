import { useState, useEffect} from "react";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import useFetch from "../../hooks/useFetch";
import documents from "../../assets/css/admin/Documents.module.css";
import apiRequestForForm from "../../services/apiForForm";
import Document from "./documents/Document";

function Documents() {
  const { state, dispatch } = useMainContext();
  const { state: adminState, dispatch: adminDispatch } = useAdminContext();
  const { data, loading, error } = useFetch("admin/allDocuments");

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
    
    adminDispatch({ type: "ADD_DOCUMENT", payload: res.file });

    setUpload(false);
    setFile(null);
    setFileName("");
  };

  useEffect(() => {
    if (data){
      adminDispatch({ type: "SET_DOCUMENTS", payload: data.documents });
    }
  }, [data]);

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
          {data && 
            adminState.documents.map((document, i) => (
              <Document key={i} document={document} />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default Documents;
