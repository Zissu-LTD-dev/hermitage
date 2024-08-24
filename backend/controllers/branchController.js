const {
  Branch,
  Category,
  SubGroup,
  Notifications,
  Obligations,
  Document,
  Order,
  Product,
  LocationProductsConfig_row,
  Provider,
  User,
} = require("../models");
const weezmoMail = require("../functions/weezmoMail");

const sendOrderMail = async (branch, provider, productsOrder) => {
  let subject = `הזמנה חדשה מסניף ${branch.name}, עבור : ${provider}`;
  let data = {
    branch,
    provider,
    productsOrder,
  };
  let info = await sendMail(subject, data);
  return info;
};

// getProducts
const getProducts = async (req, res) => {
  const products = await Product.find();
  const locationProductsConfig = await LocationProductsConfig_row.find({});

  res
    .status(200)
    .json({
      success: true,
      products: products,
      locationProductsConfig: locationProductsConfig,
    });
};

// getCategory
const getCategory = async (req, res) => {
  const category = await Category.find({});
  res.status(200).json({ category });
};

// getSubGroups
const getSubGroups = async (req, res) => {
  const subGroups = await SubGroup.find({});
  res.status(200).json({ subGroups });
};

// getFilters
const getFilters = async (req, res) => {
  let subGroups = await SubGroup.find({}, { name: 1, number: 1, _id: 0 });
  let providers = await Provider.find(
    { isBlocked: false },
    { name: 1, number: 1, _id: 0 }
  );

  let filters = [
    { title: "קבוצת משנה", details: subGroups },
    { title: "ספק", details: providers },
  ];

  res.status(200).json({ filters });
};

// createOrder
const createOrder = async (req, res) => {
  let { userName, branch, summary } = req.body;

  // Check if branch is an array or a single object
  const branches = Array.isArray(branch) ? branch : [branch];

  // order number
  let lastOrder = await Order.findOne().sort({ orderNumber: -1 });
  let newOrderNumber = lastOrder ? lastOrder.orderNumber : 100;

  let allOrders = [];

  for (const currentBranch of branches) {
    let newOrders = summary.map((order) => {
      newOrderNumber = newOrderNumber + 1;
      return {
        orderNumber: newOrderNumber,
        userName: userName,
        branchEDI: currentBranch.EDInumber,
        branchNumber: currentBranch.number,
        branchName: currentBranch.name,
        branchAddress: currentBranch.address,
        branchCity: currentBranch.city,
        branchMail: currentBranch.email,
        branchPhone: currentBranch.phone,
        providerNumber: order.providerNumber,
        providerName: order.providerName,
        orderLines: order.orderLines,
        returnLines: order.returnLines,
        totalOrderQty: order.totalOrderQty,
        totalReturnQty: order.totalReturnQty,
        totalOrderAmount: order.totalOrderAmount,
        totalReturnAmount: order.totalReturnAmount,
        orderStatus: order.orderLines.products.length > 0 ? "pending" : "",
        returnStatus: order.returnLines.products.length > 0 ? "pending" : "",
        noteProvider: order.noteProvider,
        noteManager: order.noteManager,
      };
    });

    allOrders = allOrders.concat(newOrders);
  }

  let orders = await Order.insertMany(allOrders);

  let mailPromises = orders.map(async (order) => {
    let branchNumber = order.branchNumber;
    let providerNumber = order.providerNumber;

    // Check if have limited in this order
    let products = order.orderLines.products;
    let productsLimited = products.filter((product) => product.limited);
    if (productsLimited.length > 0) {
      console.log(
        `Provider ${providerNumber} is blocked for branch ${branchNumber}`
      );
      return;
    }
    
    // Check blocked providers only if branch is a single object
    if (!Array.isArray(branch) && branch.blockedProviders && branch.blockedProviders.includes(providerNumber)) {
      console.log(
        `Provider ${providerNumber} is blocked for branch ${branchNumber}`
      );
      return;
    }
    
    let provider = await Provider.findOne({ number: providerNumber });
    let emails = [provider.email];
    let branchEmails = provider.branchEmails.filter(
      (branch) => branch.branchNumber === branchNumber
    );
    emails.push(...branchEmails);
    let mailPromises = emails.map(async (email) => {
      let sendMail = await weezmoMail({
        target: process.env.NODE_ENV == 'dev' ? process.env.EMAIL_FOR_DEV : email,
        message: order,
        subjectLine: `הזמנה חדשה מסניף ${order.branchName}, עבור : ${order.providerName}`,
        senderName: "הרמיטאז' הזמנות סניפים",
      });
      if (sendMail) {
        console.log("Mail was sent successfully");
        await Order.updateOne({ _id: order._id }, { orderStatus: "approved" , returnStatus: "approved" });
      } else {
        console.log("Mail was not sent");
      }
    });
    return Promise.all(mailPromises);
  });

  Promise.all(mailPromises)
    .then(() => {
      console.log("All mails were sent successfully");
      res.status(200).json({ message: "The order was successfully" });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(200)
        .json({ message: "There was an error processing the orders" });
    });
};

// getOrders
const getOrders = async (req, res) => {
  let branchNumber = req.params.branchNumber;

  // get all orders for this branch from Order model
  let orders = await Order.find({
    branchNumber: branchNumber,
  });

  res.status(200).json({ orders: orders });
};

// allDocuments
const allDocuments = async (req, res) => {
  let branchId = req.params.branchId;

  // Bring all documents that forTo is this branch id or all branches
  let documents = await Document.find({ forTo: { $in: [branchId, "all"] } });
  res.status(200).json({ documents: documents });
};

// downloadDocument
const downloadDocument = async (req, res) => {
  let documentId = req.params.documentId;
  let document = await Document.findById(documentId);
  res.download(document.link);
};

// readMessage
const readMessage = async (req, res) => {
  let branchId = req.body.branch;
  let branch = await Branch.findById(branchId);
  // updata all messages to read
  let messages = branch.messages.map((msg) => {
    msg.read = true;
    return msg;
  });
  await branch.updateOne({ messages: messages });
  res.status(200).json({ message: "The message was read successfully" });
};

module.exports = {
  getProducts,
  getCategory,
  getSubGroups,
  getFilters,
  createOrder,
  getOrders,
  allDocuments,
  downloadDocument,
  readMessage,
};
