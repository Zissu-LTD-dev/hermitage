import { useState, useEffect, useRef } from "react";
import UploadFilesStyle from "../../../assets/css/admin/addingProducts/UploadFiles.module.css";
import * as XLSX from "xlsx";

function UploadFiles() {
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

    const ws = XLSX.utils.aoa_to_sheet(deleteProduct);
    const ws1 = XLSX.utils.aoa_to_sheet(addProduct);
    const ws2 = XLSX.utils.aoa_to_sheet(updateProduct);
    const ws3 = XLSX.utils.aoa_to_sheet(moreUpdateProduct);

    const wb = {
      SheetNames: [
        "מחיקה - פריט",
        "הקמה - פריט",
        "עדכון - פריט",
        "עדכון קטגוריות > עמודות > מדף",
      ],
    };
    wb.Sheets = {
      "מחיקה - פריט": ws,
      "הקמה - פריט": ws1,
      "עדכון - פריט": ws2,
      "עדכון קטגוריות > עמודות > מדף": ws3,
    };
    wb.Workbook = { Views: [{ RTL: true }] };

    ws["!cols"] = [{ wpx: 100 }];
    ws1["!cols"] = [
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
    ];
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

  const handleFile = (e) => {
    let types = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!types.includes(e.target.files[0].type)) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "excel הקובץ אינו" },
      });
      return;
    }
    console.log(e.target.name);
    // כאן צריך להיות סוויטש לפי שם הקובץ
    // ואז לכל אחד יהיה ראווט שונה
    // צריך לשעות גם בבאקאנד 
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUpload(true);
  };

  const handleUpload = async () => {
    dispatchMain({ type: "SET_SHOW_LOADER", payload: true });
    const formData = new FormData();
    formData.append("excelFile", file);

    let res = await apiRequestForForm("admin/uploadExcel", "POST", formData);
    if (!res) {
      dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "הקובץ לא הועלה" },
      });
    } else {
      dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
      dispatchMain({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "הקובץ הועלה בהצלחה" },
      });
    }

    setUpload(false);
    setFile(null);
    setFileName("");
  };

  return (
    <>
      {/* אני צריך פה 4 כפתורים 
        1 - כפתור להעלאת מוצרים חדשים 
        2 - כפתור לעדכון מוצרים קיימים
        3 - כפתור למחיקת מוצרים
        4 - כפתור להורדת קובץ דוגמא */}
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
        העלאה של קובץ אקסל עם המוצרים שתרצו להוסיף לעדכן או למחוק חייב להיות
        בטמפלט הנכון
      </p>
    </>
  );
}

export default UploadFiles;
