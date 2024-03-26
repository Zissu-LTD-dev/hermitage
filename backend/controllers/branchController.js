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
const { sendMail, verify } = require("../functions/sendMail");

const sendOrderMail = async (branch, provider, productsOrder) => {
    let subject = `הזמנה חדשה מסניף ${branch.name}, עבור : ${provider}`;
    let data = {
        branch,
        provider,
        productsOrder
    }
    let info = await sendMail(subject, data);
    return info;
}

// getProducts
const getProducts = async (req, res) => {
    const products = await Product.find({ isBlocked: false });
    const locationProductsConfig = await LocationProductsConfig_row.find({});
    
    res.status(200).json({ 'success': true, 'products': products, 'locationProductsConfig': locationProductsConfig });
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
    let subGroups = await SubGroup.find({}, {name: 1, number: 1, _id: 0});
    let providers = await Provider.find({isBlocked: false}, {name: 1, number: 1, _id: 0});

    let filters = [
        {title: "קבוצת משנה", details: subGroups},
        {title: "ספק", details: providers}
    ]


    res.status(200).json({ filters });
}

  // createOrder
const createOrder = async (req, res) => {
    let {branch, summary} = req.body;
    
    // order number
    let lastOrder = await Order.findOne().sort({orderNumber: -1});
    let newOrderNumber = lastOrder ? lastOrder.orderNumber : 100 ;
    
    let newOrders = summary.map(order => {
      newOrderNumber = newOrderNumber + 1;  
      return {
          "orderNumber": newOrderNumber,
          "branchNumber": branch.number,
          "branchName": branch.name,
          "providerNumber": order.providerNumber,
          "providerName": order.providerName,
          "orderLines": order.orderLines,
          "returnLines": order.returnLines,
          "totalOrderQty": order.totalOrderQty,
          "totalReturnQty": order.totalReturnQty,
          "totalOrderAmount": order.totalOrderAmount,
          "totalReturnAmount": order.totalReturnAmount,
          "orderStatus": "pending",
          "returnStatus": "pending",
          "notes": "",
        }
    });

    let orders = await Order.insertMany(newOrders);
    console.log(newOrders);
    
    res.status(200).json({message: 'The order was successfully sent'});
  };

  // getOrders
const getOrders = async (req, res) => {
    let branchName = req.params.branchName;
    let orders = await Order.find({branchName: branchName, status: "pending"});
    res.status(200).json({orders: orders});
  };

  // allDocuments
const allDocuments = async (req, res) => {
    let branchId = req.params.branchId;

    // Bring all documents that forTo is this branch id or all branches
    let documents = await Document.find({forTo: {$in: [branchId, "all"]}});
    res.status(200).json({documents: documents});
  };

  // downloadDocument
const downloadDocument = async (req, res) => {
    let documentId = req.params.documentId;
    let document = await Document.findById(documentId);
    res.download(document.link);
  };


  module.exports = {
    getProducts,
    getCategory,
    getSubGroups,
    getFilters,
    createOrder,
    getOrders,
    allDocuments,
    downloadDocument
  };