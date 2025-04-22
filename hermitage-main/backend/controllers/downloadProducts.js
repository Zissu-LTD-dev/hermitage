const excel = require("xlsx");
const { Product, BranchType, Category } = require("../models");

const downloadProducts = async (req, res) => {
  let branchType = await BranchType.find({});
  let products = await Product.find({});
  let categories = await Category.find({});
  let data = [];

  for (const product of products) {
    let isBlocked = product.isBlocked ? 1 : 2;
    let categoryName = categories.find((category) => category.number == product.category);

    let productRow = {
      "חסום להזמנות - 1 חסום , 2 פתוח": isBlocked,
      "ספק": product.providerName,
      "מס ספק": product.providerNumber,
      "קטגוריה": categoryName ? categoryName.name : "",
      "מס קטגוריה ": product.category,
      "קבוצת משנה": product.subGroupName,
      "מס קבוצת משנה": product.subGroupNumber,
      "מס ברקוד (ראשי)": product.barcode,
      "תאור - שם פריט": product.name,
      "תאור - כמות בארגז": product.packQuantity,
      "תאור - עלות קניה": product.price,
      "תמונה": product.image == true ? "יש" : "חסר",
    };
  
    let numBT = branchType.length;
    for (let i = 0; i < numBT; i++) {
      const branch = product.branchTypeConfig[i];
      if (!branch) {
        productRow[`סוג סניף ${i + 1}`] = "";
        productRow[`הגבלת מוצר ${i + 1}`] = "";
        productRow[`עמודה ${i + 1}`] = "";
        productRow[`מדף ${i + 1}`] = "";
        productRow[`מקום ${i + 1}`] = "";
        continue;
      }
      let branchName = branchType.find((type) => type.typeId == branch.branchType);
      productRow[`סוג סניף ${i + 1}`] = branchName ? branchName.name : "";
      productRow[`הגבלת מוצר ${i + 1}`] = branch.QuantityLimit;
      productRow[`עמודה ${i + 1}`] = branch.location.column;
      productRow[`מדף ${i + 1}`] = branch.location.shelf;
      productRow[`מקום ${i + 1}`] = branch.location.index;
    }
  
    data.push(productRow);
  }

  var wb = { Workbook: { Views: [{ RTL: true }] }, Sheets: {}, SheetNames: [] };
  var ws = excel.utils.json_to_sheet(data, { cellStyles: true });

  // Base columns
  let colWidths = Array(12).fill({ wch: 15 });
  colWidths[8] = { wch: 40 }; // wider column for product name

  // Add widths only for actual branch columns
  const maxConfigs = Math.max(...products.map(p => p.branchTypeConfig ? p.branchTypeConfig.length : 0));
  for (let i = 0; i < maxConfigs * 5; i++) {
    colWidths.push({ wch: 15 });
  }
  
  ws["!cols"] = colWidths;

  excel.utils.book_append_sheet(wb, ws, "products");
  excel.writeFile(wb, "products.xlsx");
  res.download("products.xlsx");
};

module.exports = {
  downloadProducts,
};
