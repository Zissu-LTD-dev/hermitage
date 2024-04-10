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
  productsUpdateDetailed,
  productsDelete
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
    case "Types branch":
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

    case "Adding branches":
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

    case "Categories":
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

    case "Adding providers":
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

    case "Adding sub group":
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

    case "Setting pages and shelves":
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

    case "Adding products":
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

    case "Update Products":
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

    case "Update Detailed Products":
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

    case "Deleting items":
     let result10 = await productsDelete( sheet[1]);
      result10
        ? res.json({
            status: "ok",
            massage: `הקובץ ${file.originalname} נטען בהצלחה`,
            data: result10,
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
