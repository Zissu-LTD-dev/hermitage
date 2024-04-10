import { useState, useEffect, useRef } from "react";
import UploadFilesStyle from "../../../assets/css/admin/addingProducts/UploadFiles.module.css";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import * as XLSX from "xlsx";

function UploadFiles() {
  const { state, dispatch } = useAdminContext();
  const deleteProductFile = useRef(null);
  const addProductFile = useRef(null);
  const updateProductFile = useRef(null);

  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

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
    ];
    ws3["!cols"] = [{ wpx: 100 }];

    XLSX.writeFile(wb, "קובץ טמפלט.xlsx");
  };

  const deleteProduct = () => {
    deleteProductFile.current.click();
  };
  const addProduct = () => {
    addProductFile.current.click();
  };
  const updateProduct = () => {
    updateProductFile.current.click();
  };

  const handleFile = async (e) => {

    let types = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!types.includes(e.target.files[0].type)) {
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "excel הקובץ אינו" },
      });
      return;
    }

    switch (e.target.name) {
      case "addProduct":
        let addProductRes = await handleUpload(e.target.files[0], "Adding products");
        if (!addProductRes) {
          dispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        // reloud the page
        window.location.reload();
        break;
      case "updateProduct":
        let updateProductRes = await handleUpload(e.target.files[0], "Update Products");
        if (!updateProductRes) {
          dispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        let updateDetailedProductRes = await handleUpload(e.target.files[0], "Update Detailed Products");
        if (!updateDetailedProductRes) {
          dispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }
        // reloud the page
        window.location.reload();
        break;
      case "deleteProduct":
        let res = await handleUpload(e.target.files[0], "Deleting items");
        if (!res) {
          dispatch({
            type: "SET_SHOW_ERROR",
            payload: { show: true, message: "הקובץ לא נטען בהצלחה" },
          });
          return;
        }

        // reloud the page
        window.location.reload();
        break;
      default:
        break;
    }

    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUpload(true);
  };

  const handleUpload = async (file, action) => {
    const token = cookie.get("token");

    let formData = new FormData();
    formData.append("file", file);
    formData.append("action", action);
     
    try {
      let res = await fetch(`${REACT_APP_BACKEND_URL}admin/file-upload/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData 
      });
      res = await res.json();
      if(res.status == 'ok'){return res;}else{ return false;}
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
          העלאת מוצרים חדשים
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
          עדכון מוצרים קיימים
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
          מחיקת מוצרים
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
        *העלאה של קובץ אקסל עם המוצרים להוספה עדכון או מחיקה חייב להיות
        בטמפלט הנכון*
      </p>
    </>
  );
}

export default UploadFiles;
