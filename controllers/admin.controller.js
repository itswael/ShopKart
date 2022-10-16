const User = require("../models/user.model");
const authUtil = require('../util/authentication')

function getProducts(req, res) {
  res.render("admin/products/all-products");
}

function getNewProduct(req, res) {
    res.render("admin/products/new-product");
  }

  function createNewProduct(req, res) {
    res.redirect('/products');
  }

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct
};
