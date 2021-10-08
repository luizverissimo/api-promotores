const express = require("express");
const routes = express.Router();

const resaleController = require("../controllers/ResaleController");
const resaleEmployerController = require("../controllers/ResaleEmployerController");
const resaleValidator = require("../validators/ResaleValidator");

const passport = require("passport");

// @route      GET /resales
// @desc       Return all active resales
// @access     Private
routes.get(
  "/resales",
  passport.authenticate("jwt", { session: false }),
  resaleController.index
);

// @route      GET /resales
// @desc       Return resales by Id
// @access     Private
routes.get(
  "/resale/:id",
  passport.authenticate("jwt", { session: false }),
  resaleController.listById
);

// @route      GET /resales/lastFive
// @desc       Return last five updated resales
// @access     Private
routes.get(
  "/resales/lastFive",
  passport.authenticate("jwt", { session: false }),
  resaleController.listLastFive
);

// @route      POST /resales
// @desc       Insert new resale
// @access     Private
routes.post(
  "/resale",
  passport.authenticate("jwt", { session: false }),
  resaleValidator.validateResalePutRequest,
  resaleValidator.validateResale,
  resaleController.create
);

// @route      PUT /resales
// @desc       Edit resale
// @access     Private
routes.put(
  "/resale/:id",
  passport.authenticate("jwt", { session: false }),
  resaleValidator.validateResalePutRequest,
  resaleValidator.validateResale,
  resaleController.edit
);

// @route      GET /resales/search
// @desc       Search resale by name
// @access     Private
routes.get(
  "/resales/search",
  passport.authenticate("jwt", { session: false }),
  resaleController.listByName
);

// @route      DELETE /resales
// @desc       Delete resale
// @access     Private
routes.delete(
  "/resale/:id",
  passport.authenticate("jwt", { session: false }),
  resaleValidator.validateDeleteResale,
  resaleController.delete
);

// @route      GET /resale-employers
// @desc       Return all active resales employers
// @access     Private
routes.get(
  "/resale-employers",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.index
);

// @route      GET /resale-employers/:i_resale
// @desc       Return all active resales employers by Resale
// @access     Private
routes.get(
  "/resale-employers/:i_resale",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.listByIResale
);

// @route      GET /resale-employer/:id
// @desc       Return all active resales employers by ID
// @access     Private
routes.get(
  "/resale-employer/:id",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.listById
);

// @route      GET /resales/lastFive
// @desc       Return last five updated resales
// @access     Private
routes.get(
  "/resale-employers/:id/lastFive",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.listLastFive
);

// @route      POST /resale-employer
// @desc       New Resale Employer
// @access     Private
routes.post(
  "/resale-employer",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.create
);

// @route      PUT /resale-employer/:id
// @desc       Edit Resale Employer
// @access     Private
routes.put(
  "/resale-employer/:id",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.edit
);

// @route      GET /resale-employer/search
// @desc       Search resale employer by name
// @access     Private
routes.get(
  "/resale-employers/:i_resale/search",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.listByName
);

// @route      DELETE /resale-employer/:id
// @desc       Delete Resale Employer
// @access     Private
routes.delete(
  "/resale-employer/:id",
  passport.authenticate("jwt", { session: false }),
  resaleEmployerController.delete
);

module.exports = routes;
