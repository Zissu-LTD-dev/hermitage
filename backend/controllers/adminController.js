const {
  Branch,
  Category,
  Notifications,
  Obligations,
  Orders,
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



module.exports = {
  initialData,
  updateBlockedProvidersByProvider,
};
