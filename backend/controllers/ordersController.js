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

// getOrders
const getOrders = async (req, res) => {
  if (req.params.branchId) return res.send(req.params.branchId + " getOrders");
  res.send("getOrders");
};

// updateOrder
const updateOrder = async (req, res) => {
  if (req.params.orderId) return res.send(req.params.orderId + " updateOrder");
  res.send("updateOrder");
};

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


module.exports = {
  getOrders,
  updateOrder,
  createOrder,
};