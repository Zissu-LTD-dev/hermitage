const {
  Branches,
  Categories,
  Notifications,
  Obligations,
  Order,
  Return,
  Products,
  Providers,
  User,
} = require("../models");



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

const getAllOrders = async (req, res) => {
  let orders = await Order.find({});
  res.status(200).json({orders: orders});
};


// updateOrder
const updateOrder = async (req, res) => {
  let newOrder = req.body;
  let order = await Order.findOne({_id: newOrder._id});
  order.status = newOrder.status;
  order.products = newOrder.products;
  await order.save();
  res.status(200).json({message: 'The order was successfully updated'});
};


module.exports = {
  getOrders,
  getAllOrders,
  updateOrder,
  createOrder,
};