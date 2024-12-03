const {
  Branch,
  Category,
  SubGroup,
  Message,
  MessageReads,
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

  res.status(200).json({
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

  let branches = Array.isArray(branch) ? branch : [branch];
  let branchNumbers = branches.map((branch) => branch.number);
  branches = await Branch.find({ number: { $in: branchNumbers } });
  let lastOrder = await Order.findOne().sort({ orderNumber: -1 });
  let newOrderNumber = lastOrder ? lastOrder.orderNumber : 100;
  let sendMail = false;

  let allOrders = [];

  for (const currentBranch of branches) {
    let newOrders = summary.map((order) => {
      newOrderNumber = newOrderNumber + 1;

      // Check for limited products
      const hasLimitedProducts = order.orderLines.products.some(
        (product) =>
          product.QuantityLimit > 0 && product.quantity > product.QuantityLimit
      );

      // Mark limited products
      const productsWithLimitFlag = order.orderLines.products.map(
        (product) => ({
          ...product,
          isLimited:
            product.QuantityLimit > 0 &&
            product.quantity > product.QuantityLimit,
        })
      );

      // Check if provider is blocked
      const isBlocked =
        currentBranch.blockedProviders &&
        currentBranch.blockedProviders.includes(order.providerNumber);

      return {
        orderNumber: newOrderNumber,
        userName: userName,
        branchEDI: currentBranch.EDInumber,
        branchNumber: currentBranch.number,
        HP: currentBranch.HP,
        companyName: currentBranch.companyName,
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
        blockReason: isBlocked
          ? "ספק חסום"
          : hasLimitedProducts
          ? "מוצר מוגבל"
          : "",
        createdDate: new Date(),
      };
    });

    allOrders = allOrders.concat(newOrders);
  }

  try {
    let orders = await Order.insertMany(allOrders);
  
    let sendMail = true;
  
    for (const order of orders) {
      let branchNumber = order.branchNumber;
      let providerNumber = order.providerNumber;
      let blockReason = order.blockReason;

      if (blockReason && blockReason !== "") {
        continue; // המשך להזמנה הבאה
      }
  
  
      // מציאת הספק
      let provider = await Provider.findOne({ number: providerNumber });
      if (!provider) {
        console.log(`Provider ${providerNumber} not found`);
        continue; // המשך להזמנה הבאה
      }
  
      // יצירת רשימת אימיילים
      let emails = new Set([provider.email]);
      provider.branchEmails
        .filter((branch) => branch.branchNumber === branchNumber)
        .forEach((branch) => branch.emails.forEach((email) => emails.add(email)));
  
      emails = Array.from(emails).filter((email) => email); // ניקוי אימיילים ריקים
  
      // שליחת מיילים
      for (const email of emails) {
        let sendMailResult = await weezmoMail.weezmoMail({
          target:
            process.env.NODE_ENV === "dev" ? process.env.EMAIL_FOR_DEV : email,
          message: order,
          subjectLine: `הזמנה חדשה מסניף ${order.branchName}, עבור : ${order.providerName}`,
          senderName: "הרמיטאז' הזמנות סניפים",
        });
  
        if (sendMailResult) {
          console.log(`Mail sent successfully to ${email}`);
          await Order.updateOne(
            { _id: order._id },
            { orderStatus: "approved", returnStatus: "approved" }
          );
        } else {
          console.log(`Failed to send mail to ${email}`);
          sendMail = false; // לפחות מייל אחד לא נשלח
        }
      }
    }
  
    // סיום פעולה ושליחת תגובה
    res.status(200).json({
      message: sendMail
        ? "All mails were sent successfully"
        : "Some mails failed to send, orders saved waiting for approval",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "There was an error processing the orders" });
  }
  
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

// getMessages
const getMessages = async (req, res) => {
  // params
  let branchId = req.params.branchId;
  // תביא לי רק את ההודעות של הסניף הזה אם הוא נמצא במערך branch_ids
  let messages = await Message.find({ branch_ids: branchId });
  res.status(200).json(messages);
};

// getReadList
const getReadList = async (req, res) => {
  let branchId = req.params.branchId;
  let readList = await MessageReads.find({ branch_id: branchId });
  res.status(200).json(readList);
};

// readMessage
const readMessage = async (req, res) => {
  let { branch, messages } = req.body;
  let readList = messages.map((msg) => {
    return {
      message_id: msg._id,
      branch_id: branch,
      read_timestamp: new Date(),
    };
  });

  let readMessages = await MessageReads.insertMany(readList);
  res.status(200).json({ readMessages });
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
  getMessages,
  getReadList,
  readMessage,
};
