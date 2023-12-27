const {
  Branch,
  Category,
  Notifications,
  Obligations,
  Order,
  Products,
  Providers,
  User,
} = require("../models");

//   InitialData
const initialData = async (req, res) => {
  try {
    const products = await Products.find({});
    const providers = await Providers.find({});
    const categories = await Category.find({});
    const branches = await Branch.find({});

    res.status(200).json({
      products,
      providers,
      categories,
      branches,
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
        const prod = await Products.findOne({ barcode: barcode });
        prod.blocked = true;
        await prod.save();
      });
    }else{
      productsBarcodeList.forEach(async (barcode) => {
        const prod = await Products.findOne({ barcode: barcode });
        prod.blocked = false;
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
  initialData,
  updateBlockedProvidersByProvider,
  updateBlockedProvidersByBranch,
  updateBlockedProducts,
  getAllOrders,
  updateOrder,
};
