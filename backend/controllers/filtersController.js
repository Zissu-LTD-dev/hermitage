const {
    Branches,
    Category,
    Notifications,
    Obligations,
    Orders,
    Products,
    Providers,
    User,
  } = require("../models");


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


  module.exports = { getFilters };