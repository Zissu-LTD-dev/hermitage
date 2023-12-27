const {
    Branch,
    Category,
    Notifications,
    Obligations,
    Order,
    Return,
    Products,
    Providers,
    User,
  } = require("../models");

// getProducts
const getProducts = async (req, res) => {
    const branchId = req.params.branchId;
    // Bring all products that a large or equal brunchtype 
    const products = await Products.find({
        $and: [
            {
                branchType: {
                    $gte: branchId
                }
            },
            {
                blocked: {
                    $ne: true
                }
            }
        ]
    });
    
    res.status(200).json({ 'success': true, 'products': products });
  };


  // getFilters
const getFilters = async (req, res) => {
    let categories = await Category.find({}, {name: 1, number: 1, _id: 0});
    let providers = await Providers.find({status: "active"}, {name: 1, number: 1, _id: 0});

    let filters = [
        {title: "קבוצת משנה", details: categories},
        {title: "ספק", details: providers}
    ]


    res.status(200).json({ filters });
}

  // createOrder
const createOrder = async (req, res) => {
    let {branch, summary} = req.body;
  
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
          provider: order.providerName,
          products: order.productsOrder,
          totalOrders: order.sumOrder,
          totalReturns: order.sumReturn,
          totalPrice: order.sumTotal,
        });
        await orderEntity.save();
      }
  
      if(order.productsReturn.length){
        let returnEntity = new Return({
          returnNum: returnNum,
          branchID: branch.idNumber,
          branchName: branch.name,
          provider: order.providerName,
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


  module.exports = {
    getProducts,
    getFilters,
    createOrder,
    getOrders,
  };