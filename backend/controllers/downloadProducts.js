const excel = require("xlsx");
const { Product, BranchType } = require("../models");

const downloadProducts = async (req, res) => {
  let branchType = await BranchType.find({});
  let products = await Product.find({});
  let data = [];
  products.map((product) => {
    let isBlocked = product.isBlocked ? 1 : 2;
    data.push({
      "חסום להזמנות - 1 חסום , 2 פתוח": isBlocked,
      "ספק": product.providerName,
      "מס ספק": product.providerNumber,
      "מס קטגוריה ": product.category,
      "קבוצת משנה": product.subGroupName,
      "מס קבוצת משנה": product.subGroupNumber,
      "מס ברקוד (ראשי)": product.barcode, 
      "תאור - שם פריט": product.name,
      "תאור - כמות בארגז": product.packQuantity,
      "תאור - עלות קניה": product.price,
    });
    branchType.map((type) => {
      let found = product.branchTypeConfig.find((config) => config.branchType == type.typeId);
      if (found && found.location.column > 0) {
        data[data.length - 1][type.name] = 1;
      } else {
        data[data.length - 1][type.name] = "";
      }
    });
  });
  var wb = { Workbook: { Views: [{ RTL: true }] }, Sheets: {}, SheetNames: [] };
  var ws = excel.utils.json_to_sheet(data, { cellStyles: true });

  // Set the column widths
  ws["!cols"] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 40 }, 
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];

  excel.utils.book_append_sheet(wb, ws, "products");
  excel.writeFile(wb, "products.xlsx");
  res.download("products.xlsx");
};

module.exports = {
  downloadProducts,
};
