const {
    Branch,
    Category,
    SubGroup,
    Notifications,
    Obligations,
    Document,
    Order,
    Return,
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
    // Bring all products that a large or equal brunchtype 
    const products = await Product.find({});
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
  // get blockedProviders from branch 
  let blockedProviders = await Branch.findById(branch.idNumber, {blockedProviders: 1, _id: 0});

  let orderNum = await Order.findOne().sort("-orderNum")
  let returnNum = await Return.findOne().sort("-returnNum")
  orderNum = orderNum ? orderNum.orderNum + 1 : 1
  returnNum = returnNum ? returnNum.returnNum + 1 : 1 
  
    for (let order of summary) {
      
      if(order.productsOrder.length){
  
        let orderEntity = new Order({
          orderNum: orderNum,
          branchID: branch.idNumber,
          branchName: branch.name,
          provider: order.provider,
          providerName: order.providerName,
          products: order.productsOrder,
          totalOrders: order.sumOrder,
          totalReturns: order.sumReturn,
          totalPrice: order.sumTotal,
        });
        await orderEntity.save();
        await sendOrderMail(branch, order.providerName, order.productsOrder);
      }
  
      if(order.productsReturn.length){
        let returnEntity = new Return({
          returnNum: returnNum,
          branchID: branch.idNumber,
          branchName: branch.name,
          provider: order.provider,
          providerName: order.providerName,
          products: order.productsReturn,
          totalOrders: order.sumOrder,
          totalReturns: order.sumReturn,
          totalPrice: order.sumTotal,
        });
        await returnEntity.save();
      }
    }
  
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