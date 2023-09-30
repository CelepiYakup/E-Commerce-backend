const express = require("express");
const {
  allProducts,
  detailProducts,
  createProducts,
  createReview,
  deleteProducts,
  updateProducts,
  adminProducts,
} = require("../controllers/productsController");

const {authenticationMid,roleChecked} = require("../middleware/auth")

const router = express.Router();

router.get("/products", allProducts);

router.get("/admin/products", authenticationMid, roleChecked("admin"), adminProducts);

router.get("/products/:id", detailProducts);

router.post("/products/new", authenticationMid, roleChecked("admin"), createProducts);

router.post("/products/newReview", authenticationMid, createReview);

router.delete("/products/:id",authenticationMid,roleChecked("admin"), deleteProducts);

router.patch("/products/:id",authenticationMid,roleChecked("admin"), updateProducts);

module.exports = router;
