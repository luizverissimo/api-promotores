const connection = require("../../database/connection");
const { Joi } = require("celebrate");
const {
  modelExistsError,
  brandExistsError,
  equipamentexistsError,
} = require("../../errors/User");

const validateModel = async (request, response, next) => {
  const { name, i_brand, i_equipament } = request.body;

  if (name) {
    const { count } = await connection("models")
      .join(
        "brands_equipaments",
        "models.i_brand_equipament",
        "=",
        "brands_equipaments.i_brand_equipament"
      )
      .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
      .join(
        "equipaments",
        "equipaments.i_equipament",
        "=",
        "brands_equipaments.i_equipament"
      )
      .where({
        "models.name": name,
        "brands.i_brand": i_brand,
        "equipaments.i_equipament": i_equipament,
        "models.deleted": false,
      })
      .count("models.name")
      .first();

    const schema = Joi.object().keys({
      count: Joi.number().max(0).required(),
    });
    const validationReturn = schema.validate({ count });
    if (validationReturn.error) {
      const errorMessage = modelExistsError;
      return response.status(400).json({ errorMessage });
    }
  }
  next();
};

const validateBrand = async (request, response, next) => {
  const { name } = request.body;

  if (name) {
    const { count } = await connection("brands")
      .where({ name, deleted: false })
      .count("name")
      .first();

    const schema = Joi.object().keys({
      count: Joi.number().max(0).required(),
    });
    const validationReturn = schema.validate({ count });
    if (validationReturn.error) {
      const errorMessage = brandExistsError;
      return response.status(400).json({ errorMessage });
    }
  }
  next();
};

const validateDeleteBrand = async (request, response, next) => {
  const i_brand = request.params.id;
  let count = { count: 0 };

  count = await connection("brands")
    .join(
      "brands_equipaments",
      "brands.i_brand",
      "=",
      "brands_equipaments.i_brand"
    )
    .join(
      "models",
      "models.i_brand_equipament",
      "=",
      "brands_equipaments.i_brand_equipament"
    )
    .join("customers_models", "models.i_model", "=", "customers_models.i_model")

    .where({ "brands.i_brand": i_brand, "brands.deleted": false })
    .count("brands.name")
    .first();

  const schema = Joi.object().keys({
    count: Joi.number().max(0).required(),
  });
  count = { count: parseInt(count.count) };
  let validationReturn = schema.validate(count);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "A marca está vinculada a uma visita." });
  }

  count = await connection("brands")
    .join(
      "brands_equipaments",
      "brands.i_brand",
      "=",
      "brands_equipaments.i_brand"
    )
    .join(
      "models",
      "models.i_brand_equipament",
      "=",
      "brands_equipaments.i_brand_equipament"
    )
    .join("models_desired", "models.i_model", "=", "models_desired.i_model")

    .where({ "brands.i_brand": i_brand, "brands.deleted": false })
    .count("brands.name")
    .first();
  count = { count: parseInt(count.count) };
  validationReturn = schema.validate(count);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "A marca está vinculada a uma visita." });
  }

  next();
};

const validateDeleteEquipament = async (request, response, next) => {
  const i_equipament = request.params.id;
  let count = { count: 0 };

  count = await connection("equipaments")
    .join(
      "brands_equipaments",
      "equipaments.i_equipament",
      "=",
      "brands_equipaments.i_equipament"
    )
    .join(
      "models",
      "models.i_brand_equipament",
      "=",
      "brands_equipaments.i_brand_equipament"
    )
    .join("customers_models", "models.i_model", "=", "customers_models.i_model")

    .where({
      "equipaments.i_equipament": i_equipament,
      "equipaments.deleted": false,
    })
    .count("equipaments.name")
    .first();
  const schema = Joi.object().keys({
    count: Joi.number().max(0).required(),
  });

  count = { count: parseInt(count.count) };
  let validationReturn = schema.validate(count);
  console.log(validationReturn);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O equipamento está vinculado a uma visita." });
  }

  count = await connection("equipaments")
    .join(
      "brands_equipaments",
      "equipaments.i_equipament",
      "=",
      "brands_equipaments.i_equipament"
    )
    .join(
      "models",
      "models.i_brand_equipament",
      "=",
      "brands_equipaments.i_brand_equipament"
    )
    .join("models_desired", "models.i_model", "=", "models_desired.i_model")

    .where({
      "equipaments.i_equipament": i_equipament,
      "equipaments.deleted": false,
    })
    .count("equipaments.name")
    .first();
  console.log(count);
  count = { count: parseInt(count.count) };
  validationReturn = schema.validate(count);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O equipamento está vinculado a uma visita." });
  }

  next();
};

const validateDeleteModel = async (request, response, next) => {
  const i_model = request.params.id;
  let count = { count: 0 };

  count = await connection("models")
    .join("customers_models", "models.i_model", "=", "customers_models.i_model")

    .where({
      "models.i_model": i_model,
      "models.deleted": false,
    })
    .count("models.name")
    .first();
  const schema = Joi.object().keys({
    count: Joi.number().max(0).required(),
  });

  count = { count: parseInt(count.count) };
  let validationReturn = schema.validate(count);
  console.log(validationReturn);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O modelo está vinculado a uma visita." });
  }

  count = await connection("models")
    .join("models_desired", "models.i_model", "=", "models_desired.i_model")

    .where({
      "models.i_model": i_model,
      "models.deleted": false,
    })
    .count("models.name")
    .first();
  console.log(count);
  count = { count: parseInt(count.count) };
  validationReturn = schema.validate(count);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O modelo está vinculado a uma visita." });
  }

  count = await connection("models")
    .join("assistances", "models.i_model", "=", "assistances.i_model")

    .where({
      "models.i_model": i_model,
      "models.deleted": false,
    })
    .count("models.name")
    .first();
  console.log(count);
  count = { count: parseInt(count.count) };
  validationReturn = schema.validate(count);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O modelo está vinculado a uma assistência." });
  }

  next();
};

const validateEquipament = async (request, response, next) => {
  const { name } = request.body;

  if (name) {
    const { count } = await connection("equipaments")
      .where({ name, deleted: false })
      .count("name")
      .first();

    const schema = Joi.object().keys({
      count: Joi.number().max(0).required(),
    });
    const validationReturn = schema.validate({ count });
    if (validationReturn.error) {
      const errorMessage = equipamentexistsError;
      return response.status(400).json({ errorMessage });
    }
  }
  next();
};

module.exports = {
  validateModel,
  validateBrand,
  validateEquipament,
  validateDeleteBrand,
  validateDeleteEquipament,
  validateDeleteModel,
};
