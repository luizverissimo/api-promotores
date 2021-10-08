const express = require("express");
const routes = express.Router();

const UserController = require("../controllers/UserController");
const userValidator = require("../validators/UserValidator");

const passport = require("passport");

// @route      GET /users
// @desc       Return all actives users.
// @access     Private
routes.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.index
);

// @route      POST /user
// @desc       Insert user on database
// @access     Public
routes.post(
  "/user",
  userValidator.validateUserRequestPost,
  userValidator.validateUserToInsert,
  UserController.create
);

// @route      PUT /user/:id
// @desc       Update users
// @access     Private
routes.put(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  userValidator.validateUserRequestPut,
  userValidator.validateUserToUpdate,
  UserController.edit
);

// @route      GET /user/:id
// @desc       Return user data by id
// @access      Public
routes.get(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.listById
);

// @route      POST /login
// @desc       Authenticate user enter on app.
// @access     Public
routes.post(
  "/login",
  userValidator.validateUserRequestLogin,
  userValidator.validateUserToLogin,
  UserController.login
);

// @route      POST /reset-password
// @desc       Reset password.
// @access     Public
routes.post(
  "/reset-password",
  userValidator.validateUserExist,
  UserController.resetPassword
);

// @route      DELETE /user/:id
// @desc       Hide user data by id
// @access      Public
routes.delete(
  "/user/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.deleteUserById
);

module.exports = routes;
