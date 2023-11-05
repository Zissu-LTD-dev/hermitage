const xlsx = require("xlsx");
const { Providers, Department, Category, Product } = require("../models");

// collection variables for excel file
let providersCollection = [];
let departmentsCollection = [];
let categoriesCollection = [];
let productsCollection = [];

// upload excel file
const upload = async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);

  let sheetData = [];

  for (let i = 0; i < workbook.SheetNames.length; i++) {
    const sheetName = workbook.SheetNames[i];
    const sheet = workbook.Sheets[sheetName];

    const jsonSheet = xlsx.utils.sheet_to_json(sheet);
    sheetData.push(jsonSheet);
  }


  providersCollection = filterObject(sheetData, ["מס ספק", "ספק"]);
  providersCollection = removeDuplicates(providersCollection, "מס ספק");

  departmentsCollection = filterObject(sheetData, ["מס מחלקה", "שם מחלקה"]);
  departmentsCollection = removeDuplicates(departmentsCollection, "מס מחלקה");

  categoriesCollection = filterObject(sheetData, ["מס קבוצת משנה", "שם קבוצת משנה"]);
  categoriesCollection = removeDuplicates(categoriesCollection, "מס קבוצת משנה");

  productsCollection = filterObject(sheetData, 15);
  productsCollection = removeDuplicates(productsCollection, 'ברקוד');

 
  const result = await addDataToDb(req, res);
  // const result = {
  //   "newProviders": providersCollection,
  //   "newDepartments": departmentsCollection,
  //   "newCategories": categoriesCollection,
  //   "newProducts": productsCollection
  // }

  res.json(result);
};

function filterObject(allData, keys) {
  const filtered = [];

  for (let i = 0; i < allData.length; i++) {
    const data = allData[i];
    for (let i = 0; i < data.length; i++) {
      let obj = {};

      if (Array.isArray(keys)) {
        for (let j = 0; j < keys.length; j++) {
          if (data[i].hasOwnProperty(keys[j])) {
            obj[keys[j]] = data[i][keys[j]];
          }
        }
        filtered.push(obj);
      } else {
        for(let key in data[i]){
          if(data[i].hasOwnProperty(key)){
            obj[key] = data[i][key];
          }
        }
        filtered.push(obj);
      }
    }
  }
  return filtered;
}

function removeDuplicates(arr, key) {
  let unique = [];
  let keys = new Set();

  // remove empty objects
  arr = arr.filter(item => Object.keys(item).length !== 0);
  
  arr.forEach(item => {
    if(!keys.has(item[key])) {
      keys.add(item[key]);
      unique.push(item);
    }
  });

  return unique;
}

// get providers from db and filter from providersCollection array end add to db only new providers
const addProviders = async () => {
  const providers = await Providers.find({});
  const providersNums = providers.map(provider => provider.number);

  // save only new providers
  let newProviders = providersCollection ;
  // change keys names to match db schema , מס ספק -> number, ספק -> name
  newProviders.forEach(provider => {
    // to number type
    provider.number = parseInt(provider["מס ספק"]);
    provider.name = provider["ספק"];
    delete provider["מס ספק"];
    delete provider["ספק"];
  });
  // filter new providers
  newProviders = newProviders.filter(provider => !providersNums.includes(provider.number));
  
  await Providers.insertMany(newProviders);

  return newProviders;
}

// get departments from db and filter from departmentsCollection array end add to db only new departments
const addDepartments = async () => {
  const departments = await Department.find({});
  const departmentsNums = departments.map(department => department.number);

  let newDepartments = departmentsCollection;
  // change keys names to match db schema , מס מחלקה -> number, שם מחלקה -> name
  newDepartments.forEach(department => {
    department.number = parseInt(department["מס מחלקה"]);
    department.name = department["שם מחלקה"];
    delete department["מס מחלקה"];
    delete department["שם מחלקה"];
  });
  // filter new departments
  newDepartments = newDepartments.filter(department => !departmentsNums.includes(department.number));
  await Department.insertMany(newDepartments);

  return newDepartments;

}

// get categories from db and filter from categoriesCollection array end add to db only new categories
const addCategories = async () => {
  const categories = await Category.find({});
  const categoriesNums = categories.map(category => category.number);

  let newCategories = categoriesCollection;
  // change keys names to match db schema , מס קבוצת משנה -> number, שם קבוצת משנה -> name
  newCategories.forEach(category => {
    category.number = parseInt(category["מס קבוצת משנה"]);
    category.name = category["שם קבוצת משנה"];
    delete category["מס קבוצת משנה"];
    delete category["שם קבוצת משנה"];
  });
  // filter new categories
  newCategories = newCategories.filter(category => !categoriesNums.includes(category.number));
  await Category.insertMany(newCategories);

  return newCategories;

}

// get products from db and filter from productsCollection array end add to db only new products
const addProducts = async () => {
  const products = await Product.find({});
  const productsNums = products.map(product => parseInt(product.barcode));

  let newProducts = productsCollection;
  // change keys names to match db schema , ברקוד - barcode, שם מוצר - name, מס ספק - provider, מס מחלקה - department, מס קבוצת משנה - category, מס עמודה - columnNumber, שם עמודה - columnName, תת רשת- branch, מס מדף - number, תת רשת - branchType
  newProducts.forEach(product => {
    product.barcode = product["ברקוד"];
    product.name = product["שם מוצר"];
    product.provider = product["מס ספק"];
    product.department = product["מס מחלקה"];
    product.category = product["מס קבוצת משנה"];
    product.columnNumber = product["מס עמודה "];
    product.columnName = product["שם עמודה"];
    product.row = [{
      branch: parseInt(product["תת רשת"]),
      number: product["מס מדף"]
    }];
    product.branchType = product["תת רשת"];
    delete product["ברקוד"];
    delete product["שם מוצר"];
    delete product["מס ספק"];
    delete product["מס מחלקה"];
    delete product["מס קבוצת משנה"];
    delete product["מס עמודה"];
    delete product["שם עמודה"];
    delete product["תת רשת"];
    delete product["מס מדף"];
    delete product["תת רשת"];
  });
  // filter new products
  newProducts = newProducts.filter(product => !productsNums.includes(parseInt(product.barcode)));
  await Product.insertMany(newProducts);

  return newProducts;
}

// add providers, departments, categories and products to db
const addDataToDb = async () => {
  const newProviders = await addProviders();
  const newDepartments = await addDepartments();
  const newCategories = await addCategories();
  const newProducts = await addProducts();

  let result = {
    "newProviders": newProviders,
    "newDepartments": newDepartments,
    "newCategories": newCategories,
    "newProducts": newProducts
  }

  return result;
}



module.exports = {
  upload,
};
