// body parser
const bodyParser = require("body-parser");
const weezmoMail = require("../functions/weezmoMail");
const {
  Branch,
  BranchType,
  SubGroup,
  Category,
  LocationProductsConfig_row,
  Notifications,
  Obligations,
  Document,
  Order,
  Product,
  Provider,
  User,
} = require("../models");

//   InitialData
const initialData = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ number: 1 });
    const products = await Product.find({}).sort({ barcode: 1 });
    const providers = await Provider.find({}).sort({ number: 1 });
    const subGroups = await SubGroup.find({}).sort({ number: 1 });
    const branches = await Branch.find({}).sort({ number: 1 });
    const typeBranches = await BranchType.find({}).sort({ typeId: 1 });

    res.status(200).json({
      categories,
      products,
      providers,
      subGroups,
      branches,
      typeBranches,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateBlockedProvidersByProvider = async (req, res) => {
  let { providerNumber, branchesList, blocked } = req.body;
  try {
    const branches = await Branch.find({}).sort({ number: 1 });

    branches.forEach(async (branch) => {
      if (branchesList.includes(branch._id.toString())) {
        if (blocked) {
          if (!branch.blockedProviders.includes(providerNumber)) {
            branch.blockedProviders.push(providerNumber);
            await branch.save();
          }
        } else {
          if (branch.blockedProviders.includes(providerNumber)) {
            branch.blockedProviders = branch.blockedProviders.filter(
              (provider) => provider !== providerNumber
            );
            await branch.save();
          }
        }
      }
    });
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// updateBlockedProvidersByBranch
const updateBlockedProvidersByBranch = async (req, res) => {
  let { branchId, providersList, blocked } = req.body;
  try {
    const branch = await Branch.findById(branchId);

    if (blocked) {
      providersList.forEach(async (provider) => {
        if (!branch.blockedProviders.includes(provider)) {
          branch.blockedProviders.push(provider);
        }
      });
      await branch.save();
    } else {
      providersList.forEach(async (provider) => {
        if (branch.blockedProviders.includes(provider)) {
          branch.blockedProviders = branch.blockedProviders.filter(
            (prov) => prov !== provider
          );
        }
      });
      await branch.save();
    }
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// updateBlockedProducts
const updateBlockedProducts = async (req, res) => {
  let { productsBarcodeList, blocked } = req.body;
  try {
    if (blocked) {
      productsBarcodeList.forEach(async (barcode) => {
        const prod = await Product.findOne({ barcode: barcode });
        prod.isBlocked = true;
        await prod.save();
      });
    } else {
      productsBarcodeList.forEach(async (barcode) => {
        const prod = await Product.findOne({ barcode: barcode });
        prod.isBlocked = false;
        await prod.save();
      });
    }
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// updateLimitedProducts
const updateLimitedProducts = async (req, res) => {
  let { barcode, limited } = req.body;
  try {
    const prod = await Product.findOne({
      barcode: barcode,
    });
    prod.limited = limited;
    await prod.save();
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// getAllOrders
const getAllOrders = async (req, res) => {
  let orders = await Order.find({}).sort({ orderNumber: -1 });
  res.status(200).json({ orders: orders });
};

// updateOrder
const updateOrder = async (req, res) => {
  let newOrder = req.body;
  let order = await Order.findOne({ _id: newOrder._id });
  order.orderStatus = newOrder.orderStatus;
  order.orderLines = newOrder.orderLines;
  order.totalOrderAmount = newOrder.totalOrderAmount;
  order.totalOrderQty = newOrder.totalOrderQty;

  if (newOrder.orderStatus == "approved") {
    let provider = await Provider.findOne({ number: order.providerNumber });
    let emails = [provider.email];
    let branchEmails = provider.branchEmails.filter(
      (branch) => branch.branchNumber === order.branchNumber
    );

    branchEmails.forEach((branch) => {
      emails = emails.concat(branch.emails);
    });
    
    emails = emails.filter((email) => email !== "");
    
    let mailPromises = emails.map(async (email) => {
      let sendMail = await weezmoMail({
        target:
          process.env.NODE_ENV == "dev" ? process.env.EMAIL_FOR_DEV : email,
        message: order,
        subjectLine: `הזמנה חדשה מסניף ${order.branchName}, עבור : ${order.providerName}`,
        senderName: "הרמיטאז' הזמנות סניפים",
      });
      if (sendMail) {
        console.log("Mail was sent successfully");
      } else {
        console.log("Mail was not sent");
      }
    });
    await Promise.all(mailPromises);

    await order.save();
    res.status(200).json({
      message: "The order was successfully updated and mail was sent",
    });
  } else {
    await order.save();
    res.status(200).json({ message: "The order was successfully updated" });
  }
};

// getAllDocuments
const getAllDocuments = async (req, res) => {
  let documents = await Document.find({}).sort({ date: -1 });
  res.status(200).json({ documents: documents });
};

// download document
const downloadDocument = async (req, res) => {
  let documentId = req.params.id;
  let document = await Document.findById(documentId);
  res.download(document.link);
};

// updateDocument
const updateDocument = async (req, res) => {
  let documentId = req.params.id;
  let document = await Document.findById(documentId);
  document.forTo = req.body.branchId;
  await document.save();
  res.status(200).json({ message: "The document was successfully updated" });
};

// delete document
const deleteDocument = async (req, res) => {
  let documentId = req.params.id;
  let document = await Document.findById(documentId);
  await document.deleteOne();
  res.status(200).json({ message: "The document was successfully deleted" });
};

// add product
const addProduct = async (req, res) => {
  let product = req.body;
  let newProduct = new Product(product);
  await newProduct.save();
  res.status(200).json({ message: "The product was successfully added", _id: newProduct._id });
};

// edit product
const editProduct = async (req, res) => {
  let productID = req.params.id;
  let product = req.body;

  let currentProduct = await Product.findById(productID);
  await currentProduct.updateOne(product);
  await currentProduct.save();

  res.status(200).json({ message: "The product was successfully updated" });
};

// delete product
const deleteProduct = async (req, res) => {
  let productID = req.params.id;
  console.log(productID);
  let currentProduct = await Product.findById(productID);
  await currentProduct.deleteOne();
  res.status(200).json({ message: "The product was successfully deleted" });
};

// GET all branches
const allBranches = async (req, res) => {
  let branches = await Branch.find({}).sort({ number: 1 });
  res.status(200).json({ branches: branches });
};

// add branch
const newBranch = async (req, res) => {
  let branch = req.body;
  let newBranch = new Branch(branch);
  await newBranch.save();

  //update new branch in all providers
  let providers = await Provider.find({});
  providers.forEach(async (provider) => {
    provider.branchEmails.push({
      branchNumber: branch.number,
      branchName: branch.name,
      emails: [],
    });
    // sort branchEmails by branchNumber
    provider.branchEmails.sort((a, b) => a.branchNumber - b.branchNumber);
    await provider.save();
  });

  res.status(200).json({ message: "The branch was successfully added", _id: newBranch._id });
};

// edit branch
const editBranch = async (req, res) => {
  let branchID = req.params.id;
  let branch = req.body;

  let currentBranch = await Branch.findById(branchID);
  await currentBranch.updateOne(branch);
  await currentBranch.save();

  let providers = await Provider.find({});
  providers.map(async (provider) => {
    provider.branchEmails.map((branchEmail) => {
      if (branchEmail.branchNumber == branch.number) {
        branchEmail.branchName = branch.name;
      }
    });
    provider.branchEmails.sort((a, b) => a.branchNumber - b.branchNumber);
    await provider.save();
  });

  res.status(200).json({ message: "The branch was successfully updated" });
};

// delete branch
const deleteBranch = async (req, res) => {
  let branchID = req.params.id;
  let currentBranch = await Branch.findById(branchID);
  await currentBranch.deleteOne();

  let branchs = await Branch.find({});
  let branchsNumbers = branchs.map((branch) => branch.number);

  let providers = await Provider.find({});
  providers.map(async (provider) => {
      provider.branchEmails = provider.branchEmails.filter((branchEmail) => branchsNumbers.includes(branchEmail.branchNumber));
      await provider.save();
  });

  res.status(200).json({ message: "The branch was successfully deleted" });
};

// add type branch
const addTypeBranch = async (req, res) => {
  let typeBranch = req.body;
  let newTypeBranch = new BranchType(typeBranch);
  await newTypeBranch.save();
  res.status(200).json({ message: "The type branch was successfully added", _id: newTypeBranch._id });
};

// edit type branch
const editTypeBranch = async (req, res) => {
  let typeBranchID = req.params.id;
  let typeBranch = req.body;

  let currentTypeBranch = await BranchType.findById(typeBranchID);
  await currentTypeBranch.updateOne(typeBranch);
  await currentTypeBranch.save();

  res.status(200).json({ message: "The type branch was successfully updated" });
};

// delete type branch
const deleteTypeBranch = async (req, res) => {
  let typeBranchID = req.params.id;
  let currentTypeBranch = await BranchType.findById(typeBranchID);
  await currentTypeBranch.deleteOne();
  res.status(200).json({ message: "The type branch was successfully deleted" });
};

// get all users
const allUsers = async (req, res) => {
  let users = await User.find({}).select("-password");
  res.status(200).json({ users: users });
};

// add user
const addUser = async (req, res) => {
  let user = req.body;
  // check if the user already exists
  let userExist = await User.findOne({ email: user.email });
  if (userExist) {
    return res
      .status(400)
      .json({ message: "The user already exists", error: true });
  }
  let newUser = new User(user);
  await newUser.save();
  res
    .status(200)
    .json({ message: "The user was successfully added", error: false , _id: newUser._id});
};

// edit user
const editUser = async (req, res) => {
  let userID = req.params.id;
  let user = req.body;

  let currentUser = await User.findById(userID);
  await currentUser.updateOne(user);
  await currentUser.save();

  res
    .status(200)
    .json({ message: "The user was successfully updated", error: false });
};

// delete user
const deleteUser = async (req, res) => {
  let userID = req.params.id;
  let currentUser = await User.findById(userID);
  await currentUser.deleteOne();
  res.status(200).json({ message: "The user was successfully deleted" });
};

// add provider
const addProvider = async (req, res) => {
  let provider = req.body;
  // check if the provider.number already exists
  let newProvider = await Provider.findOne({ number: provider.number });

  if (!newProvider) {
    newProvider = new Provider(provider);
    await newProvider.save();
    return res
      .status(200)
      .json({ message: "The provider was successfully added", _id: newProvider._id });
  }

  res.status(200).json({ message: "The provider already exists", error: true});
};

// edit provider
const editProvider = async (req, res) => {
  let providerID = req.params.id;
  let provider = req.body;

  let currentProvider = await Provider.findById(providerID);
  await currentProvider.updateOne(provider);
  await currentProvider.save();

  res.status(200).json({ message: "The provider was successfully updated" });
};

// delete provider
const deleteProvider = async (req, res) => {
  let providerID = req.params.id;
  let currentProvider = await Provider.findById(providerID);
  let numProvider = currentProvider.number;
  await currentProvider.deleteOne();

  let branches = await Branch.find({});

  branches.forEach(async (branch) => {
    if (branch.blockedProviders.includes(numProvider)) {
      branch.blockedProviders = branch.blockedProviders.filter(
        (prov) => prov != numProvider
      );
      await branch.save();
    }
  });
  res.status(200).json({ message: "The provider was successfully deleted" });
};

// add sub group
const addSubGroup = async (req, res) => {
  let subGroup = req.body;
  // check if the sub group.number already exists
  let newSub = await SubGroup.findOne({ number: subGroup.number });

  if (!newSub) {
    newSub = new SubGroup(subGroup);
    await newSub.save();
    return res
      .status(200)
      .json({ message: "The sub group was successfully added" , _id: newSub._id});
  }

  res
    .status(200)
    .json({ message: "The sub group already exists", error: true , _id: newSub._id});
};

// edit sub group
const editSubGroup = async (req, res) => {
  let subGroupID = req.params.id;
  let subGroup = req.body;

  let currentSubGroup = await SubGroup.findById(subGroupID);
  await currentSubGroup.updateOne(subGroup);
  await currentSubGroup.save();

  res.status(200).json({ message: "The sub group was successfully updated" });
};

// delete sub group
const deleteSubGroup = async (req, res) => {
  let subGroupID = req.params.id;
  let currentSubGroup = await SubGroup.findById(subGroupID);
  await currentSubGroup.deleteOne();
  res.status(200).json({ message: "The sub group was successfully deleted" });
};

// add category
const addCategory = async (req, res) => {
  let category = req.body;
  // check if the category.number already exists
  let newCategory = await Category.findOne({ number: category.number });

  if (!newCategory) {
    newCategory = new Category(category);
    await newCategory.save();
    return res
      .status(200)
      .json({ message: "The category was successfully added" , _id: newCategory._id});
  }

  res.status(200).json({ message: "The category already exists", error: true });
};

// edit category
const editCategory = async (req, res) => {
  let categoryID = req.params.id;
  let category = req.body;

  let currentCategory = await Category.findById(categoryID);
  await currentCategory.updateOne(category);
  await currentCategory.save();

  res.status(200).json({ message: "The category was successfully updated" });
};

// delete category
const deleteCategory = async (req, res) => {
  let categoryID = req.params.id;
  let currentCategory = await Category.findById(categoryID);
  await currentCategory.deleteOne();
  res.status(200).json({ message: "The category was successfully deleted" });
};

// get locationProductsConfig
const locationProductsConfig = async (req, res) => {
  let locationProductsConfig = await LocationProductsConfig_row.find({});
  res.status(200).json({ locationProductsConfig: locationProductsConfig });
};

// add locationProductsConfig
const addLocationProductsConfig = async (req, res) => {
  let locationProductsConfig = req.body;
  let newLocationProductsConfig = new LocationProductsConfig_row(
    locationProductsConfig
  );
  await newLocationProductsConfig.save();
  res
    .status(200)
    .json({ message: "The locationProductsConfig was successfully added" , _id: newLocationProductsConfig._id});
};

// edit locationProductsConfig
const editLocationProductsConfig = async (req, res) => {
  let locationProductsConfigID = req.params.id;
  let locationProductsConfig = req.body;

  let currentLocationProductsConfig = await LocationProductsConfig_row.findById(
    locationProductsConfigID
  );
  await currentLocationProductsConfig.updateOne(locationProductsConfig);
  await currentLocationProductsConfig.save();

  res
    .status(200)
    .json({ message: "The locationProductsConfig was successfully updated" });
};

// delete locationProductsConfig
const deleteLocationProductsConfig = async (req, res) => {
  let locationProductsConfigID = req.params.id;
  let currentLocationProductsConfig = await LocationProductsConfig_row.findById(
    locationProductsConfigID
  );
  await currentLocationProductsConfig.deleteOne();
  res
    .status(200)
    .json({ message: "The locationProductsConfig was successfully deleted" });
};

// add message to branchs
const addMessageToBranchs = async (req, res) => {
  let { branchesList, message,  sender } = req.body;
  try {
    const branches = await Branch.find({});
    branches.forEach(async (branch) => {
      if (branchesList.includes(branch._id.toString())) {
        let idForMessage = `${branch._id}${branch.messages.length + 1}`;
        branch.messages.push({
          id: idForMessage,
          contact: message,
          sender: sender,
          date: new Date().toLocaleString(),
          read: false,
        });
        await branch.save();
      }
    });
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  initialData,
  updateBlockedProvidersByProvider,
  updateBlockedProvidersByBranch,
  updateBlockedProducts,
  updateLimitedProducts,
  getAllOrders,
  updateOrder,
  getAllDocuments,
  downloadDocument,
  updateDocument,
  deleteDocument,
  addProduct,
  editProduct,
  deleteProduct,
  allBranches,
  newBranch,
  editBranch,
  deleteBranch,
  addTypeBranch,
  editTypeBranch,
  deleteTypeBranch,
  allUsers,
  addUser,
  editUser,
  deleteUser,
  addProvider,
  editProvider,
  deleteProvider,
  addSubGroup,
  deleteSubGroup,
  editSubGroup,
  addCategory,
  editCategory,
  deleteCategory,
  locationProductsConfig,
  addLocationProductsConfig,
  editLocationProductsConfig,
  deleteLocationProductsConfig,
  addMessageToBranchs,
};
