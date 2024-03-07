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
} = require("../functions/upToDBOnce.js");


const mainUpload = async (req, res) => {
  let { action, tabName } = req.body;
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

  switch (action) {
    case "סוגי סניף":
      tabName = tabName ? tabName : "תת רשת + סניפים + קטגוריות";
      let result = await branchTypeUpload(sheet[tabName]);
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
      tabName = tabName ? tabName : "תת רשת + סניפים + קטגוריות";
      let result2 = await branchsUpload(sheet[tabName]);
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
      tabName = tabName ? tabName : "תת רשת + סניפים + קטגוריות ";
      let result3 = await catergoryUpload(sheet[tabName]);
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
      tabName = tabName ? tabName : "ספקים + מיילים";
      let result4 = await providerUpload(sheet[tabName]);
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
      tabName = tabName ? tabName : "קבוצת משנה";
      let result5 = await subGroupUpload(sheet[tabName]);
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
      tabName = tabName ? tabName : "קטגוריה > עמודה > מדף - מפורט";
      // let result6 = await locationProductsConfigUpload(sheet[tabName]);
      let result6 = await locationProductsConfigUploadRow(sheet[tabName]);
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

    case "מוצרים הקמה":
      tabName = tabName ? tabName : "הקמה - פריט ";
      let result7 = await productsUpload(sheet[tabName]);
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

    case "מוצרים עדכון":
      let result8 = await productsUpdate(
        sheet["עדכון - פריט"],
        sheet["עדכון קטגוריות > עמודות > מדף"]
      );
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
