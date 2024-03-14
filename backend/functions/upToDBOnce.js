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
      row = Object.values(row);
      if (!row[0] || !row[1]) {
        return false; 
      }
      return {
        typeId: row[0],
        name: row[1],
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
      row = Object.values(row);
      let branchType = branchTypes.find(
        (type) => type.typeId === row[5]
        );
      branchType = branchType ? branchType.name : "";
      
      return {
        number: row[3],
        name: row[4],
        branchTypeNumber: row[5],
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
      row = Object.values(row);
      return {
        number: row[7],
        name: row[8],
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
// זה עולה רק פעם אחת אז אני לא משנה את זה למיקומים לפי מספרים באקסל 
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
      row = Object.values(row);
      return {
        number: row[0],
        name: row[1],
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


// upload the location products config row
const locationProductsConfigUploadRow = async (sheet) => {
  try {
    let locationProductsConfig = sheet.map((row) => {
      row = Object.values(row);
      return {
        categoryNumber: row[6],
        categoryName: row[7],
        columnsNumber: row[8],
        columnsName:
          row[9] == "עמודה + המספר"
            ? `עמודה ${row[8]}`
            : row[9],
        shelvesNumber: row[10],
        shelvesName: row[11],
        branchType1: row[0],
        branchType2: row[1],
        branchType3: row[2],
        branchType4: row[3],
        branchType5: row[4],
        branchType6: row[5],
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
      row = Object.values(row);
      let providerName = providers.find(
        (provider) => provider.number === row[0]
      ).name;
      let subGroupName = subGroups.find(
        (subGroup) => subGroup.number === row[2]
      ).name;

      return {
        barcode: row[3], // "מס ברקוד (ראשי)"
        name: row[4], // "תאור - שם פריט"
        providerNumber: row[0], // "מס ספק"
        providerName: providerName, // "שם ספק"
        subGroupNumber: row[2], // "מס קבוצת משנה"
        subGroupName: subGroupName, // "שם קבוצת משנה"
        packQuantity: row[5], // "תאור - כמות בארגז"
        category: row[1], // "מס קטגוריה "
        price: row[6], // "תאור - עלות קניה"
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
      row = Object.values(row);
      let providerName = providers.find(
        (provider) => provider.number == row[1]
      ).name;
      let subGroupName = subGroups.find(
        (subGroup) => subGroup.number == row[3]
      ).name;

      return {
        barcode: row[4], // "מס ברקוד (ראשי)"
        name: row[5], // "תאור - שם פריט"
        providerNumber: row[1], // "מס ספק"
        providerName: providerName, // "שם ספק"
        subGroupNumber: row[3], // "מס קבוצת משנה"
        subGroupName: subGroupName, // "שם קבוצת משנה"
        packQuantity: row[6], // "תאור - כמות בארגז"
        category: row[2], // "מס קטגוריה "
        price: row[7], // "תאור - עלות קניה"
        branchTypeConfig: [], 
        isBlocked: row[0] == 1 ? true : false // "חסום להזמנות - 1 חסום , 2 פתוח"
      };
    });

    sheet2.map((row) => {
      row = Object.values(row);
      let product = products.find((product) => product.barcode === row[0]);
      if (product) {
        let branchTypeConfig = [];  
        if(row[1]){ // "סוג סניף 1"
          branchTypeConfig.push({
            branchType: row[1], // "סוג סניף 1"
            available: row[5] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[2], // "מס עמודה"
              shelf: row[3], // "מס מדף"
              index: row[4], // "מס סידור"
            },
          });
        }
        if(row[6]){ // "סוג סניף 2"
          branchTypeConfig.push({
            branchType: row[6], // "סוג סניף 2"
            available: row[10] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[7], // "מס עמודה"
              shelf: row[8], // "מס מדף"
              index: row[9], // "מס סידור"
            },
          });
        }
        if(row[11]){ // "סוג סניף 3"
          branchTypeConfig.push({
            branchType: row[11], // "סוג סניף 3"
            available: row[15] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[12], // "מס עמודה"
              shelf: row[13], // "מס מדף"
              index: row[14], // "מס סידור"
            },
          });
        }
        if(row[16]){ // "סוג סניף 4"
          branchTypeConfig.push({
            branchType: row[16], // "סוג סניף 4"
            available: row[20] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[17], // "מס עמודה"
              shelf: row[18], // "מס מדף"
              index: row[19], // "מס סידור"
            },
          });
        }
        if(row[21]){ // "סוג סניף 5"
          branchTypeConfig.push({
            branchType: row[21], // "סוג סניף 5"
            available: row[25] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[22], // "מס עמודה"
              shelf: row[23], // "מס מדף"
              index: row[24], // "מס סידור"
            },
          });
        }
        if(row[26]){ // "סוג סניף 6"
          branchTypeConfig.push({
            branchType: row[26], // "סוג סניף 6"
            available: row[30] == 1 ? false : true, // 'לא מוצג 1  מוצג 2 ' 
            location: {
              column: row[27], // "מס עמודה"
              shelf: row[28], // "מס מדף"
              index: row[29], // "מס סידור"
            },
          });
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
