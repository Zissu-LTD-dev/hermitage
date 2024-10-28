import { useState, useEffect, useRef } from "react";
import UploadFilesStyle from "../../../assets/css/admin/addingProducts/UploadFiles.module.css";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import { useMainContext } from "../../../context/mainContext/MainContext";
import * as XLSX from "xlsx";

function UploadFiles() {
  const { state, dispatch } = useAdminContext();
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const deleteProductFile = useRef(null);
  const addProductFile = useRef(null);
  const updateProductFile = useRef(null);

  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [btnName, setBtnName] = useState("");

  const downloadExcel = () => {
    const deleteProduct = [["מס ברקוד (ראשי)"]];
    const addProduct = [
      [
        "מס ספק",
        "מס קטגוריה",
        "מס קבוצת משנה",
        "מס ברקוד (ראשי)",
        "תאור - שם פריט",
        "תאור - כמות בארגז",
        "תאור - עלות קניה",
      ],
    ];
    const updateProduct = [
      [
        "חסום להזמנות - 1 חסום , 2 פתוח",
        "מס ספק",
        "מס קטגוריה",
        "מס קבוצת משנה",
        "מס ברקוד (ראשי)",
        "תאור - שם פריט",
        "תאור - כמות בארגז",
        "תאור - עלות קניה",
        "הגבלת פריט - 1 מוגבל , 2 לא מוגבל",
      ],
    ];
    const moreUpdateProduct = [
      [
        "מס ברקוד (ראשי)",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
        "סוג סניף",
        "מס עמודה",
        "מס מדף",
        "מס סידור",
        "לא מוצג 1  מוצג 2 ",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(addProduct);
    const ws1 = XLSX.utils.aoa_to_sheet(deleteProduct);
    const ws2 = XLSX.utils.aoa_to_sheet(updateProduct);
    const ws3 = XLSX.utils.aoa_to_sheet(moreUpdateProduct);

    const wb = {
      SheetNames: [
        "הקמה - פריט",
        "מחיקה - פריט",
        "עדכון - פריט",
        "עדכון קטגוריות > עמודות > מדף",
      ],
    };
    wb.Sheets = {
      "הקמה - פריט": ws,
      "מחיקה - פריט": ws1,
      "עדכון - פריט": ws2,
      "עדכון קטגוריות > עמודות > מדף": ws3,
    };
    wb.Workbook = { Views: [{ RTL: true }] };

    ws["!cols"] = [
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
    ];
    ws1["!cols"] = [{ wpx: 100 }];
    ws2["!cols"] = [
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 170 },
    ];
    ws3["!cols"] = [{ wpx: 100 }];

    XLSX.writeFile(wb, "קובץ טמפלט.xlsx");
  };

  const resetState = () => {
    setFile(null);
    setFileData(null);
    setFileName("");
    setUpload(false);
    setBtnName("");
  };

  const deleteProduct = () => {
    resetState();
    // reset file input
    addProductFile.current.value = "";
    updateProductFile.current.value = "";
    if (deleteProductFile.current.value) {
      deleteProductFile.current.value = "";
    }
    deleteProductFile.current.click();
  };

  const addProduct = () => {
    resetState();
    deleteProductFile.current.value = "";
    updateProductFile.current.value = "";
    if (addProductFile.current.value) {
      addProductFile.current.value = "";
    }
    addProductFile.current.click();
  };

  const updateProduct = () => {
    resetState();
    deleteProductFile.current.value = "";
    addProductFile.current.value = "";
    if (updateProductFile.current.value) {
      updateProductFile.current.value = "";
    }
    updateProductFile.current.click();
  };

  const changeDataToJSON = (dataXLSX, keys) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      let sheetName = workbook.SheetNames.findIndex((sheet) => sheet === keys);
      const sheet = workbook.Sheets[workbook.SheetNames[sheetName]];
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
        defval: "",
      });
      setFileData(sheetData);
    };
    reader.readAsArrayBuffer(dataXLSX);
  };

  const handleFile = async (e) => {
    let types = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!types.includes(e.target.files[0].type)) {
      mainDispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "excel הקובץ אינו" },
      });
      return;
    }
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    switch (e.target.name) {
      case "addProduct":
        setBtnName("addProduct");
        changeDataToJSON(e.target.files[0], "הקמה - פריט");
        break;
      case "updateProduct":
        setBtnName("updateProduct");
        changeDataToJSON(e.target.files[0], "עדכון - פריט");
        break;
      case "deleteProduct":
        setBtnName("deleteProduct");
        changeDataToJSON(e.target.files[0], "מחיקה - פריט");
        break;
    }
  };

  const handleUpload = async (action) => {
    switch (action) {
      case "addProduct":
        let addProductRes = await uploadToServer(file, "Adding products");
        if (!addProductRes) {
          mainDispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        break;
      case "updateProduct":
        let updateProductRes = await uploadToServer(file, "Update Products");
        if (!updateProductRes) {
          mainDispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        let updateDetailedProductRes = await uploadToServer(
          file,
          "Update Detailed Products"
        );
        if (!updateDetailedProductRes) {
          mainDispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        break;
      case "deleteProduct":
        let res = await uploadToServer(file, "Deleting items");
        if (!res) {
          mainDispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        break;
      default:
        break;
    }
    mainDispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "הקובץ נטען העמוד יטען מחדש" },
    });
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };
  const uploadToServer = async (file, action) => {
    const token = cookie.get("token");

    let formData = new FormData();
    formData.append("file", file);
    formData.append("action", action);

    try {
      let res = await fetch(
        `${REACT_APP_BACKEND_URL}admin/file-upload/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      res = await res.json();
      if (res.status == "ok") {
        return res;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <>
      <div className={UploadFilesStyle.main}>
        {/* העלאת מוצרים חדשים  */}
        <div
          className={UploadFilesStyle.btnFile + " " + UploadFilesStyle.upload}
          onClick={() => addProduct()}
        >
          הקמה - פריט
          {/* file input */}
          <input
            className={UploadFilesStyle.inputFile}
            ref={addProductFile}
            type="file"
            accept=".xlsx, .xls"
            name="addProduct"
            onChange={(e) => handleFile(e)}
          />
        </div>
        {/* עדכון מוצרים קיימים */}
        <div
          className={UploadFilesStyle.btnFile + " " + UploadFilesStyle.update}
          onClick={() => updateProduct()}
        >
          עדכון - פריט | עדכון קטגוריות &gt; עמודות &gt; מדף
          {/* file input */}
          <input
            className={UploadFilesStyle.inputFile}
            ref={updateProductFile}
            type="file"
            accept=".xlsx, .xls"
            name="updateProduct"
            onChange={(e) => handleFile(e)}
          />
        </div>
        {/* מחיקת מוצרים */}
        <div
          className={UploadFilesStyle.btnFile + " " + UploadFilesStyle.delete}
          onClick={() => deleteProduct()}
        >
          מחיקה - פריט
          {/* file input */}
          <input
            className={UploadFilesStyle.inputFile}
            ref={deleteProductFile}
            type="file"
            accept=".xlsx, .xls"
            name="deleteProduct"
            onChange={(e) => handleFile(e)}
          />
        </div>
        {/* הורדת קובץ דוגמא */}
        <div
          className={UploadFilesStyle.btnFile + " " + UploadFilesStyle.download}
          onClick={() => downloadExcel()}
        >
          הורדת קובץ טמפלט
        </div>
      </div>
      <p className={UploadFilesStyle.warning}>
        *העלאה של קובץ אקסל עם המוצרים להוספה עדכון או מחיקה חייב להיות בטמפלט
        הנכון* <br />
        *העדכון הוא על 2 טאבים באקסל*
      </p>
      {fileData && fileData.length > 0 && (
        <>
          <div className={UploadFilesStyle.fileData}>
            <h3>קובץ שנבחר: {fileName}</h3>
            <table>
              <thead>
                <tr>
                  {Object.keys(fileData[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={UploadFilesStyle.uploadBtns}>
            <button
              className={UploadFilesStyle.cancel}
              onClick={() => {
                setFile(null);
                setFileData(null);
                setFileName("");
                setUpload(false);
                setBtnName("");
              }}
            >
              ביטול
            </button>
            <button
              className={UploadFilesStyle.upload}
              onClick={() => handleUpload(btnName)}
            >
              העלאה
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default UploadFiles;
