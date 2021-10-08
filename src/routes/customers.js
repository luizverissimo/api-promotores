const express = require("express");
const routes = express.Router();

const customersController = require("../controllers/CustomerController");
const custumerValidator = require("../validators/CustomerValidator");

const customerEmployersController = require("../controllers/CustomerEmployerController");

const passport = require("passport");

// @route      GET /customers
// @desc       Return all actives customers
// @access     Private
routes.get(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  customersController.index
);

// @route      GET /customers
// @desc       Return customers by Id
// @access     Private
routes.get(
  "/customer/:id",
  passport.authenticate("jwt", { session: false }),
  customersController.listById
);

// @route      GET /customers/lastFive
// @desc       Return last five updated users
// @access     Private
routes.get(
  "/customers/lastFive",
  passport.authenticate("jwt", { session: false }),
  customersController.listLastFive
);

// @route      POST /customer
// @desc       Insert customer
// @access     Private
routes.post(
  "/customer",
  passport.authenticate("jwt", { session: false }),
  custumerValidator.validateCustomerPostRequest,
  custumerValidator.validateCustomer,
  customersController.create
);

// @route      PUT /customer
// @desc       Edit customer
// @access     Private
routes.put(
  "/customer/:id",
  passport.authenticate("jwt", { session: false }),
  custumerValidator.validateCustomerPutRequest,
  custumerValidator.validateCustomer,
  customersController.edit
);

// @route      GET /customers
// @desc       Search actives customer by name
// @access     Private
routes.get(
  "/customers/search",
  passport.authenticate("jwt", { session: false }),
  customersController.listByName
);

// @route      DELETE /customers
// @desc       Delete a customer
// @access     Private
routes.delete(
  "/customer/:id",
  passport.authenticate("jwt", { session: false }),
  custumerValidator.validateDeleteCustomer,
  customersController.delete
);

// @route      GET /customer-employers
// @desc       Return all customer employers
// @access     Private
routes.get(
  "/customer-employers",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.index
);

// @route      GET /customer-employers/:id
// @desc       Return all customer employers by i_customer
// @access     Private
routes.get(
  "/customer-employers/:i_customer",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.listByICustomer
);

// @route      POST /customer-employers
// @desc       Add new Customer Employer
// @access     Private
routes.post(
  "/customer-employer",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.create
);

// @route      PUT /customer-employers
// @desc       Edit Customer Employer
// @access     Private
routes.put(
  "/customer-employer/:id",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.edit
);

// @route      GET /customer-employers/:i_customer/search
// @desc       List Customer Employers by name
// @access     Private
routes.get(
  "/customer-employers/:i_customer/search",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.listByName
);

// @route      GET /customer-employers/:id
// @desc       List Customer Employers by id
// @access     Private
routes.get(
  "/customer-employer/:id",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.listById
);

// @route      GET /customer-employer/:id/lastFive
// @desc       List Customer Employers lastFive
// @access     Private
routes.get(
  "/customer-employers/:id/lastFive",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.listLastFive
);

// @route      DELETE /customer-employer/:id
// @desc       Delete Customer Employer
// @access     Private
routes.delete(
  "/customer-employer/:id",
  passport.authenticate("jwt", { session: false }),
  customerEmployersController.delete
);

module.exports = routes;
