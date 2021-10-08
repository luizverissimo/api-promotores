const express = require("express");
const routes = express.Router();
const coreController = require("../controllers/CoreController");
//const passport = require("passport");

// @route      GET /customers
// @desc       Return all actives customers
// @access     Private
routes.post("/send-mail", coreController.sendEmail);

module.exports = routes;
