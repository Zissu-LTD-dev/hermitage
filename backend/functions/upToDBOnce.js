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
  let categories = await Category.find();
  try {
    let locationProductsConfig = sheet.map((row) => {
      row = Object.values(row);

      let columnsName ;
      if(row[3].includes("עמודה +")){
        columnsName = "עמודה " + row[2];
      }else if(row[3].includes("מקרר +")) {
        columnsName = "מקרר " + row[2];
      }else{
        columnsName = row[3];
      }

      return {
        categoryNumber: row[0],
        categoryName: categories.find((category) => category.number === row[0]).name,
        columnsNumber: row[2],
        columnsName: columnsName,
        shelvesNumber: row[4],
        shelvesName: row[5],
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

      
      let providerName ;
      let subGroupName ;
       
      if (providers.find((provider) => provider.number === row[0])){
        providerName = providers.find((provider) => provider.number === row[0]).name;
      } else {
        return false;
      }

      if(subGroups.find((subGroup) => subGroup.number === row[2])) {
        subGroupName = subGroups.find((subGroup) => subGroup.number === row[2]).name;
      } else {
        return false;
      }


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

    products = products.filter((row) => row);

    let result = await addOrUpdateOneProduct(products);

    return result;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// update product 
const productsUpdate = async (sheet) => {
  try {
    let providers = await Provider.find();
    let subGroups = await SubGroup.find();

    let products = sheet.map((row) => {
      row = Object.values(row);

      let newProduct = {};

      let providerName = null ;
      let subGroupName  = null;
       
      if (providers.find((provider) => provider.number === row[1])){
        providerName = providers.find((provider) => provider.number === row[1]).name;
      } 
      

      if(subGroups.find((subGroup) => subGroup.number === row[3])) {
        subGroupName = subGroups.find((subGroup) => subGroup.number === row[3]).name;
      }
      
      newProduct.barcode = row[4]; // "מס ברקוד (ראשי)"
      newProduct.name = row[5] ?  row[5] : null ; // "תאור - שם פריט"
      newProduct.providerNumber = row[1] ? row[1] : null; // "מס ספק"
      newProduct.providerName = providerName ? providerName : null; // "שם ספק"
      newProduct.subGroupNumber = row[3] ? row[3] : null; // "מס קבוצת משנה"
      newProduct.subGroupName = subGroupName ? subGroupName : null; // "שם קבוצת משנה"
      newProduct.packQuantity = row[6] ? row[6] : null; // "תאור - כמות בארגז"
      newProduct.category = row[2] ? row[2] : null; // "מס קטגוריה "
      newProduct.price = row[7] ? row[7] : null; // "תאור - עלות קניה"
      newProduct.isBlocked = row[0] == 1 ? true : false; // "חסום להזמנות - 1 חסום , 2 פתוח"
      newProduct.limited = row[8] == 1 ? true : false; // הגבלת פריט - 1 מוגבל , 2 לא מוגבל"

      // clear the empty fields
      Object.keys(newProduct).forEach((key) => {
        if (newProduct[key] === null || newProduct[key] === undefined) {
          delete newProduct[key];
        }
      });

      return {
        newProduct 
      };
    });
    
    products.map(async (product) => {
      return await Product.findOneAndUpdate(
        { barcode: product.newProduct.barcode },
        product.newProduct
      );
    });

    return products;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}

// productsUpdateDetailed
const productsUpdateDetailed = async (sheet) => {

  let branchTypes = await BranchType.find();
  
  let products = sheet.map((row) => {
    row = Object.values(row);

    let newProduct = {};
    
    newProduct.barcode = row[0]; // "מס ברקוד (ראשי)"
    newProduct.branchTypeConfig = [];

    for (let i = 0; i < branchTypes.length; i++) {
      let branchTypeIndex = 1 + i * 5; // כל סוג סניף תופס 5 עמודות
      if (row[branchTypeIndex]) {
        newProduct.branchTypeConfig.push({
          branchType: row[branchTypeIndex], // "סוג סניף"
          QuantityLimit: row[branchTypeIndex + 4] ? row[branchTypeIndex + 4] : 0, // מוצר מוגבל דיפולט 0  
          location: {
            column: row[branchTypeIndex + 1], // "מס עמודה"
            shelf: row[branchTypeIndex + 2], // "מס מדף"
            index: row[branchTypeIndex + 3], // "מס סידור"
          },
        });
      }
    }

    return newProduct;
  });

  products.map(async (product) => {
    let existingProduct = await Product.findOne({ barcode: product.barcode });
    if (existingProduct) {
      product.branchTypeConfig.forEach((newConfig) => {
        let existingConfig = existingProduct.branchTypeConfig.find(
          (config) => config.branchType === newConfig.branchType
        );
        if (existingConfig) {
          existingConfig.QuantityLimit = newConfig.QuantityLimit 
            || newConfig.QuantityLimit === 0 
          ? newConfig.QuantityLimit : existingConfig.QuantityLimit;
          existingConfig.location = newConfig.location.column || newConfig.location.column === 0 ? newConfig.location : existingConfig.location;
        } else {
          existingProduct.branchTypeConfig.push(newConfig);
        }
      });
      await existingProduct.save();
    } else {
      await Product.create(product);
    }
  });
  
  return products;
}

// delete product
const productsDelete = async (sheet) => {
  try {
    let products = sheet.map((row) => {
      row = Object.values(row);
      return row[0];
    });
    console.log("products delete", products);
    products.map(async (barcode) => {
      return await Product.findOneAndDelete({ barcode: barcode });
    });
    return products;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

module.exports = {
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
};
