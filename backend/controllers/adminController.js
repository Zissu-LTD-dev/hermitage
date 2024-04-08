// body parser
const bodyParser = require("body-parser");
const {
  Branch,
  BranchType,
  SubGroup,
  Category,
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
    const categories = await Category.find({});
    const products = await Product.find({});
    const providers = await Provider.find({});
    const subGroups = await SubGroup.find({});
    const branches = await Branch.find({});
    const typeBranches = await BranchType.find({});

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
    const branches = await Branch.find({});

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
  let {branchId, providersList, blocked } = req.body;
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
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

// updateBlockedProducts
const updateBlockedProducts = async (req, res) => {
  let {productsBarcodeList, blocked } = req.body;
  try {
    if(blocked){
      productsBarcodeList.forEach(async (barcode) => {
        const prod = await Product.findOne({ barcode: barcode });
        prod.isBlocked = true;
        await prod.save();
      });
    }else{
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
}

// getAllOrders
const getAllOrders = async (req, res) => {
  let orders = await Order.find({}).sort({orderNumber: -1});
  res.status(200).json({orders: orders});
};

// updateOrder
const updateOrder = async (req, res) => {
  let newOrder = req.body;
  let order = await Order.findOne({_id: newOrder._id});
  order.orderStatus = newOrder.orderStatus;
  order.orderLines = newOrder.orderLines;
  order.totalOrderAmount = newOrder.totalOrderAmount;
  order.totalOrderQty = newOrder.totalOrderQty;
  await order.save();
  // TODO:  if orderStatus is 'approved' send mail to the provider
  res.status(200).json({message: 'The order was successfully updated'});
};

// getAllDocuments
const getAllDocuments = async (req, res) => {
  let documents = await Document.find({});
  res.status(200).json({documents: documents});
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
  document.forTo = req.body.branchId ;
  await document.save();
  res.status(200).json({message: 'The document was successfully updated'});
};

// delete document
const deleteDocument = async (req, res) => {
  let documentId = req.params.id;
  let document = await Document.findById(documentId);
  await document.deleteOne();
  res.status(200).json({message: 'The document was successfully deleted'});
};

// delete product
const deleteProduct = async (req, res) => {
  let productID = req.params.id;
  console.log(productID);
  let currentProduct = await Product.findById(productID);
  await currentProduct.deleteOne();
  res.status(200).json({message: 'The product was successfully deleted'});
}

// edit product
const editProduct = async (req, res) => {
  let productID = req.params.id;
  let product = req.body;

  let currentProduct = await Product.findById(productID);
  await currentProduct.updateOne(product);
  await currentProduct.save();
  
  res.status(200).json({message: 'The product was successfully updated'});
}



module.exports = {
  initialData,
  updateBlockedProvidersByProvider,
  updateBlockedProvidersByBranch,
  updateBlockedProducts,
  getAllOrders,
  updateOrder,
  getAllDocuments,
  downloadDocument,
  updateDocument,
  deleteDocument,
  deleteProduct,
  editProduct,
};
