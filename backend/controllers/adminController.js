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

    try{
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
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


module.exports = {
    initialData
}