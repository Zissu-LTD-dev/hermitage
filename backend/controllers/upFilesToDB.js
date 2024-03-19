const excel = require("xlsx");
const {
  branchTypeUpload,
  branchsUpload,
  catergoryUpload,
  providerUpload,
  subGroupUpload,
  locationProductsConfigUploadRow,
  productsUpload,
  productsUpdate,
  productsUpdateDetailed
} = require("../functions/upToDBOnce.js");


const mainUpload = async (req, res) => {
  let { action, tabName, tabName2 } = req.body;
  let file = req.file;

  // read the file
  const workbook = excel.readFile(file.path);
  let sheet = {};
  await workbook.SheetNames.forEach(function (sheetName) {
    sheet[sheetName] = excel.utils.sheet_to_json(workbook.Sheets[sheetName], {
      blankrows: false,
      defval: "",
      raw: true,
    });
  });

  sheet = Object.values(sheet);

  switch (action) {
    case "סוגי סניף":
      let result = await branchTypeUpload(sheet[7]);
      result
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "הוספת סניפים":
      let result2 = await branchsUpload(sheet[7]);
      result2
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "קטגוריות":
      let result3 = await catergoryUpload(sheet[7]);
      result3
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "הוספת ספקים":
      let result4 = await providerUpload(sheet[6]);
      result4
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "הוספת קבוצת משנה":
      let result5 = await subGroupUpload(sheet[4]);
      result5
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "הגדרת עמודים ומדפים":
      let result6 = await locationProductsConfigUploadRow(sheet[5]);
      result6
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
            data: result6,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "הקמת מוצרים":
      let result7 = await productsUpload(sheet[0]);
      result7
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
            data: result7,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "עדכון מוצרים":
      let result8 = await productsUpdate( sheet[2]);
      result8
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
            data: result8,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
      break;

    case "עדכון מוצרים מפורט":
      let result9 = await productsUpdateDetailed( sheet[3]);
      result9
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
            data: result9,
          })
        : res.json({
            status: "error",
            massage: `הקובץ ${file.originalname} לא נטען בהצלחה`,
          });
    break;

    case "מחיקת פריטים":
      // TODO: add the function to delete the items
          res.json({ sheet: sheet[1] });
      break;

    default:
      res.json({
        status: "error",
        massage: "לא נבחרה פעולה",
      });
      break;
  }
};

module.exports = {
  mainUpload,
};
