const express = require("express");
const routes = express.Router();

const passport = require("passport");

const assistanceController = require("../controllers/AssistanceController");

// @route      GET /assistances
// @desc       Return all actives assistances
// @access     Private
routes.get(
  "/assistances",
  passport.authenticate("jwt", { session: false }),
  assistanceController.index
);

// @route      POST /assistances/:i_cutomer/
// @desc       Return all actives assistances
// @access     Private
routes.post(
  "/assistance",
  passport.authenticate("jwt", { session: false }),
  assistanceController.create
);

// @route      PUT /assistances/:id/
// @desc       Edit Assistance
// @access     Private
routes.put(
  "/assistance/:id",
  passport.authenticate("jwt", { session: false }),
  assistanceController.edit
);

// @route      GET /assistances/:id/search
// @desc       Return all actives assistances by name
// @access     Private
routes.get(
  "/assistances/:id/search",
  passport.authenticate("jwt", { session: false }),
  assistanceController.listByCustomerName
);

// @route      DELETE /assistances/:id/
// @desc       Delete assistance
// @access     Private
routes.delete(
  "/assistance/:id",
  passport.authenticate("jwt", { session: false }),
  assistanceController.delete
);

// @route      GET /assistances/:id/search
// @desc       Return all actives assistances by name
// @access     Private
routes.get(
  "/assistance/:id",
  passport.authenticate("jwt", { session: false }),
  assistanceController.listById
);

// @route      GET /assistances/:id/search
// @desc       Return all actives assistances by name
// @access     Private
routes.get(
  "/assistances/:id/lastFive",
  passport.authenticate("jwt", { session: false }),
  assistanceController.listLastFive
);

module.exports = routes;
