const User = require("../models/user.model");
const authUtil = require('../util/authentication')

function getProducts(req, res) {
  res.redirect('/products');
}

module.exports = {
  getProducts: getProducts,
};
