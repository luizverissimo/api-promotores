const express = require("express");
const routes = express.Router();

const visitsController = require("../controllers/VisitsController");

const passport = require("passport");

// @route      GET /visits
// @desc       Return all actives visits.
// @access     Private
routes.get(
  "/visits",
  passport.authenticate("jwt", { session: false }),
  visitsController.index
);

// @route      GET /visits/:i_user
// @desc       Return all actives visits by user.
// @access     Private
routes.get(
  "/visits/:i_user/search",
  passport.authenticate("jwt", { session: false }),
  visitsController.listByUserAndName
);

// @route      GET /visits/:i_user
// @desc       Return all actives visits by user.
// @access     Private
routes.get(
  "/visit/:i_visit",
  passport.authenticate("jwt", { session: false }),
  visitsController.listById
);

// @route      GET /visits/:i_user
// @desc       Return all actives visits by user.
// @access     Private
routes.get(
  "/visit/:i_user/:i_customer/last",
  passport.authenticate("jwt", { session: false }),
  visitsController.listLast
);

// @route      GET /visits/:i_user/map
// @desc       Get visits to insert in map app.
// @access     Private
routes.get(
  "/visits/:i_user/map",
  passport.authenticate("jwt", { session: false }),
  visitsController.listToMap
);

// @route      GET /visits/:i_user
// @desc       Return all actives visits by user.
// @access     Private
routes.get(
  "/visits/:i_user/lastFive",
  passport.authenticate("jwt", { session: false }),
  visitsController.listByUserLastFive
);

// @route      POST /visit
// @desc       New visit.
// @access     Private
routes.post(
  "/visit",
  passport.authenticate("jwt", { session: false }),
  visitsController.create
);

// @route      PUT /visit
// @desc       Edit visit.
// @access     Private
routes.put(
  "/visit/:id",
  passport.authenticate("jwt", { session: false }),
  visitsController.edit
);

module.exports = routes;
