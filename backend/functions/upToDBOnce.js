const {
  Branch,
  BranchType,
  Category,
  Provider,
  SubGroup,
  LocationProductsConfig_row,
  Product,
} = require("../models");

// upload the branch type
const branchTypeUpload = async (sheet) => {
  try {
    let branchTypes = sheet.map((row) => {
      if (!row["מס תת רשת"] || !row["שם תת רשת"]) {
        return;
      }
      return {
        typeId: row["מס תת רשת"],
        name: row["שם תת רשת"],
      };
    });

    branchTypes = branchTypes.filter((row) => row);

    await BranchType.insertMany(branchTypes);
    return branchTypes;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// upload the branchs
const branchsUpload = async (sheet) => {
  try {
    const branchTypes = await BranchType.find();

    let branchs = sheet.map((row) => {
      let branchType = branchTypes.find(
        (type) => type.typeId === row["מס תת רשת_1"]
      );
      branchType = branchType ? branchType.name : "";

      return {
        number: row["מס סניף"],
        name: row["שם סניף"],
        branchTypeNumber: row["מס תת רשת_1"],
        branchTypeName: branchType,
      };
    });

    branchs = branchs.filter((row) => row);

    await Branch.insertMany(branchs);
    return branchs;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// upload the catergory
const catergoryUpload = async (sheet) => {
  try {
    let categories = sheet.map((row) => {
      return {
        number: row["מס קטגוריה "],
        name: row["שם קטגוריה"],
      };
    });

    categories = categories.filter((row) => row.number);

    await Category.insertMany(categories);
    return categories;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// upload the provider
const providerUpload = async (sheet) => {
  try {
    let branchList = await Branch.find();
    let providers = sheet.map((row, index) => {
      let branchEmails = [];

      let keys = Object.keys(row);
      let vals = Object.values(row);
      keys.forEach((key, index) => {
        if (key === "ספק" || key === "שם ספק" || key === "מייל ראשי") return;

        let keyArr = key.split(" ");
        let branchNumber = parseInt(keyArr[keyArr.length - 1]);
        let branchName = branchList.find(
          (branch) => branch.number === branchNumber
        ).name;
        let emails = vals[index];
        branchEmails.push({ branchNumber, branchName, emails });
      });

      return {
        number: row["ספק"],
        name: row["שם ספק"],
        email: row["מייל ראשי"],
        branchEmails: branchEmails,
      };
    });

    await Provider.insertMany(providers);
    return providers;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// upload the sub group
const subGroupUpload = async (sheet) => {
  try {
    let subGroups = sheet.map((row) => {
      return {
        number: row["מס"],
        name: row["קבוצות משנה"],
      };
    });

    subGroups = subGroups.filter((row) => row.number);

    await SubGroup.insertMany(subGroups);
    return subGroups;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// 👇 יוצא משימוש 👇
// upload the location products config
// const locationProductsConfigUpload = async (sheet) => {
//   let newLocationProductsConfig = [];
//   try {
//     newLocationProductsConfig = await addCategoryToConfig(sheet);
//     newLocationProductsConfig = await addColumnsToConfig(
//       sheet,
//       newLocationProductsConfig
//     );
//     newLocationProductsConfig = await addShelvesToConfig(
//       sheet,
//       newLocationProductsConfig
//     );
//     newLocationProductsConfig = await updateShelvesToConfig(
//       sheet,
//       newLocationProductsConfig
//     );

//     await LocationProductsConfig.deleteMany({});
//     await LocationProductsConfig.insertMany(newLocationProductsConfig);
//     return true;
//   } catch (error) {
//     console.log("error", error);
//     return false;
//   }
// };
// // function for locationProductsConfigUpload
// // 1: add the category to the locationProductsConfig
// const addCategoryToConfig = async (sheet) => {
//   let currentCategory = 0;
//   try {
//     let categories = await Category.find();
//     let newLocationProductsConfig = [];
//     newLocationProductsConfig = sheet.map((row) => {
//       let categoryName = categories.find(
//         (category) => category.number === row["מס קטגוריה "]
//       ).name;
//       let categoryNumber = row["מס קטגוריה "];
//       let category = newLocationProductsConfig.find(
//         (item) => item.categoryNumber === categoryNumber
//       );
//       if (!category && currentCategory !== categoryNumber) {
//         currentCategory = categoryNumber;
//         return {
//           categoryNumber: categoryNumber,
//           categoryName: categoryName,
//           columns: [],
//         };
//       }
//     });
//     newLocationProductsConfig = newLocationProductsConfig.filter((row) => row);
//     if (newLocationProductsConfig.length > 0) return newLocationProductsConfig;
//   } catch (error) {
//     console.log("error", error);
//     return false;
//   }
// };
// // 2: add the columns to the locationProductsConfig
// const addColumnsToConfig = async (sheet, newLocationProductsConfig) => {
//   try {
//     let currentcolumn = 0;
//     sheet.forEach((row) => {
//       let categoryNumber = row["מס קטגוריה "];
//       let category = newLocationProductsConfig.find(
//         (item) => item.categoryNumber === categoryNumber
//       );
//       newLocationProductsConfig = newLocationProductsConfig.map((item) => {
//         if (item.categoryNumber === categoryNumber) {
//           let column = item.columns.find(
//             (column) => column.columnNumber === row["מס עמודה"]
//           );
//           if (!column && currentcolumn !== row["מס עמודה"]) {
//             currentcolumn = row["מס עמודה"];
//             if (row["שם עמודה"] == "עמודה + המספר") {
//               item.columns.push({
//                 columnNumber: row["מס עמודה"],
//                 columnName: `עמודה ${row["מס עמודה"]}`,
//                 shelves: [],
//               });
//             } else {
//               item.columns.push({
//                 columnNumber: row["מס עמודה"],
//                 columnName: row["שם עמודה"],
//                 shelves: [],
//               });
//             }
//           }
//         }
//         return item;
//       });
//     });
//     newLocationProductsConfig = newLocationProductsConfig.filter((row) => row);
//     return newLocationProductsConfig;
//   } catch (error) {
//     console.log("error", error);
//     return false;
//   }
// };
// // 3: add the shelves to the locationProductsConfig
// const addShelvesToConfig = async (sheet, newLocationProductsConfig) => {
//   try {
//     let branchType = await BranchType.find();
//     sheet.forEach((row) => {
//       newLocationProductsConfig.find((item) => {
//         if (item.categoryNumber === row["מס קטגוריה "]) {
//           item.columns.find((column) => {
//             if (column.columnNumber === row["מס עמודה"]) {
//               for (let i = 0; i < branchType.length; i++) {
//                 if (row["מס מדף"] == "פתוח") {
//                   column.shelves.push({
//                     branchTypeNumber: branchType[i].typeId,
//                     Details: [
//                       {
//                         branchTypeOpened: true,
//                         shelfNumber: 0,
//                         shelfName: "פתוח",
//                       },
//                     ],
//                   });
//                 } else if (typeof row["מס מדף"] === "number") {
//                   column.shelves.push({
//                     branchTypeNumber: branchType[i].typeId,
//                     Details: [
//                       {
//                         branchTypeOpened: false,
//                         shelfNumber: row["מס מדף"],
//                         shelfName: row["שם מדף"],
//                       },
//                     ],
//                   });
//                 } else {
//                   let shelves = row["מס מדף"]
//                   shelves = shelves.split(",");
//                   shelves.forEach((shelf) => {
//                     column.shelves.push({
//                       branchTypeNumber: branchType[i].typeId,
//                       Details: [
//                         {
//                           branchTypeOpened: false,
//                           shelfNumber: shelf,
//                           shelfName: `מדף ${shelf}`,
//                         },
//                       ],
//                     });
//                   });
//                 }
//               }
//             }
//           });
//         }
//       });
//     });
//     return newLocationProductsConfig;
//   } catch (error) {
//     console.log("error", error);
//     return false;
//   }
// };
// // 4: update the shelves to the locationProductsConfig par branchType
// const updateShelvesToConfig = async (sheet, newLocationProductsConfig) => {
//   try{
//     let branchType = await BranchType.find();
//     sheet.forEach((row) => {
//       newLocationProductsConfig.find((item) => {
//         if (item.categoryNumber === row["מס קטגוריה "]) {
//           item.columns.find((column) => {
//             if (column.columnNumber === row["מס עמודה"]) {
//               for (let i = 0; i < branchType.length; i++) {
//                 if (!row[branchType[i].typeId]) {
//                   continue;
//                 }
//                 if (row[branchType[i].typeId] == "פתוח") {
//                   column.shelves.find((shelf) => {
//                     if (shelf.branchTypeNumber == branchType[i].typeId) {
//                       shelf.Details = [];
//                       shelf.Details.push({
//                         branchTypeOpened: true,
//                         shelfNumber: 0,
//                         shelfName: "פתוח",
//                       });
//                     }
//                   });
//                 } else if (typeof row[branchType[i].typeId] === "string") {
//                   let isShelves = row[branchType[i].typeId];
//                   isShelves = isShelves.split(" ")[0];
//                   for (let j = 0; j < isShelves; j++) {
//                     column.shelves.find((shelf) => {
//                       if (shelf.branchTypeNumber == branchType[i].typeId) {
//                         shelf.Details = [];
//                         shelf.Details.push({
//                           branchTypeOpened: false,
//                           shelfNumber: j + 1,
//                           shelfName: `מדף ${j + 1}`,
//                         });
//                       }
//                     });
//                   }
//                 }
//               }
//             }
//           });
//         }
//       });
//      });
//     return newLocationProductsConfig;
//   } catch (error) {
//     console.log("error", error);
//     return false;
//   }
// }
// 👆🏻 יוצא משימוש 👆🏻

// upload the location products config row
const locationProductsConfigUploadRow = async (sheet) => {
  try {
    let locationProductsConfig = sheet.map((row) => {
      return {
        categoryNumber: row["מס קטגוריה "],
        categoryName: row["שם קטגוריה"],
        columnsNumber: row["מס עמודה"],
        columnsName:
          row["שם עמודה"] == "עמודה + המספר"
            ? `עמודה ${row["מס עמודה"]}`
            : row["שם עמודה"],
        shelvesNumber: row["מס מדף"],
        shelvesName:
          row["שם מדף"] == "שם מדף" ? `מדף ${row["מס מדף"]}` : row["שם מדף"],
        branchType1: row["1"],
        branchType2: row["2"],
        branchType3: row["3"],
        branchType4: row["4"],
        branchType5: row["5"],
        branchType6: row["6"],
      };
    });

    await LocationProductsConfig_row.insertMany(locationProductsConfig);
    return locationProductsConfig;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// add or update one product in db
const addOrUpdateOneProduct = async (products) => {
  try {
    let newProduct = {};
    products.forEach(async (product) => {
      newProduct = await Product.findOneAndUpdate(
        { barcode: product.barcode },
        product,
        { new: true, upsert: true }
      );
    });
    return newProduct;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// add or update many products in db
const productsUpload = async (sheet) => {
  try {
    let providers = await Provider.find();
    let subGroups = await SubGroup.find();

    let products = sheet.map((row) => {
      let providerName = providers.find(
        (provider) => provider.number === row["מס ספק"]
      ).name;
      let subGroupName = subGroups.find(
        (subGroup) => subGroup.number === row["מס קבוצת משנה"]
      ).name;

      return {
        barcode: row["מס ברקוד (ראשי)"],
        name: row["תאור - שם פריט"],
        providerNumber: row["מס ספק"],
        providerName: providerName,
        subGroupNumber: row["מס קבוצת משנה"],
        subGroupName: subGroupName,
        packQuantity: row["תאור - כמות בארגז"],
        price: row["תאור - עלות קניה"],
        branchTypeConfig: [],
      };
    });

    let result = await addOrUpdateOneProduct(products);

    return result;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// update product 
const productsUpdate = async (sheet1, sheet2) => {
  try {
    let providers = await Provider.find();
    let subGroups = await SubGroup.find();

    let products = sheet1.map((row) => {
      let providerName = providers.find(
        (provider) => provider.number === row["מס ספק"]
      ).name;
      let subGroupName = subGroups.find(
        (subGroup) => subGroup.number === row["מס קבוצת משנה"]
      ).name;

      return {
        barcode: row["מס ברקוד (ראשי)"],
        name: row["תאור - שם פריט"],
        providerNumber: row["מס ספק"],
        providerName: providerName,
        subGroupNumber: row["מס קבוצת משנה"],
        subGroupName: subGroupName,
        packQuantity: row["תאור - כמות בארגז"],
        category: row["מס קטגוריה "],
        price: row["תאור - עלות קניה"],
        branchTypeConfig: [],
        isBlocked: row['חסום להזמנות - 1 חסום , 2 פתוח'] == 1 ? true : false
      };
    });

    sheet2.map((row) => {
      let product = products.find((product) => product.barcode === row["מס ברקוד (ראשי)"]);
      if (product) {
        let branchTypeConfig = [];
        if(row['סוג סניף']){
          branchTypeConfig.push({
            branchType: row[`סוג סניף`],
            location: {
              column: row[`מס עמודה`],
              shelf: row[`מס מדף`],
              index: row[`מס סידור`],
            },
          });
        }
        for (let i = 1; i <= 5; i++) {
          if (row[`סוג סניף_${i}`]) {
            branchTypeConfig.push({
              branchType: row[`סוג סניף_${i}`],
              location: {
                column: row[`מס עמודה_${i}`],
                shelf: row[`מס מדף_${i}`],
                index: row[`מס סידור_${i}`],
              },
            });
          }
        }
        product.branchTypeConfig = branchTypeConfig;
      }
      
    });

    let result = await addOrUpdateOneProduct(products);

    return result;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

module.exports = {
  branchTypeUpload,
  branchsUpload,
  catergoryUpload,
  providerUpload,
  subGroupUpload,
  locationProductsConfigUploadRow,
  productsUpload,
  productsUpdate,
};
