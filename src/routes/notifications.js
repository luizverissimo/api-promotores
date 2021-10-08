const express = require("express");
const routes = express.Router();

const passport = require("passport");

const notificationController = require("../controllers/NotificationController");

// @route      GET /notifications
// @desc       List all actives Notifications
// @access     Private
routes.get(
  "/notifications",
  passport.authenticate("jwt", { session: false }),
  notificationController.index
);

// @route      GET /notifications
// @desc       List all actives Notifications
// @access     Private
routes.post(
  "/notification",
  passport.authenticate("jwt", { session: false }),
  notificationController.create
);

// @route      GET /notifications/set
// @desc       List all actives Notifications sent
// @access     Private
routes.get(
  "/notification/:id/sent",
  passport.authenticate("jwt", { session: false }),
  notificationController.indexSent
);

// @route      POST /register-device
// @desc       register device to send notification
// @access     Private
routes.post(
  "/register-device",
  passport.authenticate("jwt", { session: false }),
  notificationController.registerDevice
);

module.exports = routes;
