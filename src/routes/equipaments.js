const express = require("express");
const routes = express.Router();

const passport = require("passport");

const equipamentController = require("../controllers/EquipamentController");
const equipamentValidator = require("../validators/EquipamentValidator");

// @route      GET /equipaments/brands
// @desc       List all actives Equipaments Brands
// @access     Private
routes.get(
  "/brands",
  passport.authenticate("jwt", { session: false }),
  equipamentController.indexBrand
);

// @route      GET /equipaments
// @desc       List all actives Equipaments
// @access     Private
routes.get(
  "/equipaments",
  passport.authenticate("jwt", { session: false }),
  equipamentController.indexEquipament
);

// @route      GET /equipaments/models
// @desc       List all actives Equipaments Models
// @access     Private
routes.get(
  "/models",
  passport.authenticate("jwt", { session: false }),
  equipamentController.indexModel
);

// @route      POST /equipaments/brand
// @desc       Insert new equipament brand
// @access     Private
routes.post(
  "/brand",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateBrand,
  equipamentController.createBrand
);

// @route      POST /equipaments
// @desc       Insert new equipament
// @access     Private
routes.post(
  "/equipament",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateEquipament,
  equipamentController.createEquipament
);

// @route      POST /equipaments/model
// @desc       Insert new equipament model
// @access     Private
routes.post(
  "/model",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateModel,
  equipamentController.createModel
);

// @route      PUT /equipaments/:id
// @desc       Edit equipament
// @access     Private
routes.put(
  "/equipament/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateEquipament,
  equipamentController.editEquipament
);

// @route      PUT /equipaments/brand/:id
// @desc       Edit equipament brand
// @access     Private
routes.put(
  "/brand/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateBrand,
  equipamentController.editBrand
);

// @route      PUT /equipaments/model/:id
// @desc       Edit equipament model
// @access     Private
routes.put(
  "/model/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateModel,
  equipamentController.editModel
);

// @route      GET /equipaments/brand/search
// @desc       List actives equipament brand by name
// @access     Private
routes.get(
  "/brands/search",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listBrandsByName
);

// @route      GET /equipaments/search
// @desc       List actives equipament by name
// @access     Private
routes.get(
  "/equipaments/search",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listEquipamentsByName
);

// @route      GET /equipaments/model/search
// @desc       List actives equipament model by name
// @access     Private
routes.get(
  "/models/search",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listModelsByName
);

// @route      GET /equipaments/model/search
// @desc       List actives equipament model by name
// @access     Private
routes.get(
  "/models-total/search",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listModelsTotalByName
);

// @route      DELETE /equipament
// @desc       Delete equipament
// @access     Private
routes.delete(
  "/equipament/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateDeleteEquipament,
  equipamentController.deleteEquipament
);

// @route      DELETE /equipament/brand
// @desc       Delete brand
// @access     Private
routes.delete(
  "/brand/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateDeleteBrand,
  equipamentController.deleteBrand
);

// @route      DELETE /equipament/model
// @desc       Delete model
// @access     Private
routes.delete(
  "/model/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentValidator.validateDeleteModel,
  equipamentController.deleteModel
);

// @route      GET /models/lastFive
// @desc       List last Five models
// @access     Private
routes.get(
  "/models/lastFive",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listModelsLastFive
);

// @route      GET /brand/:id
// @desc       List brands by Id
// @access     Private
routes.get(
  "/brand/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listBrandById
);

// @route      GET /equipament/:id
// @desc       List equipaments by Id
// @access     Private
routes.get(
  "/equipament/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listEquipamentById
);

// @route      GET /models/:id
// @desc       List models by Id
// @access     Private
routes.get(
  "/model/:id",
  passport.authenticate("jwt", { session: false }),
  equipamentController.listModelById
);

module.exports = routes;
