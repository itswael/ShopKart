const User = require("../models/user.model");
const authUtil = require('../util/authentication')

function getProducts(req, res) {
  res.render("customer/products/all-products");
}

module.exports = {
  getProducts: getProducts,
};
