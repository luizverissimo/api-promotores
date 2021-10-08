const { celebrate, Segments, Joi } = require("celebrate");
const { resaleExistsError } = require("../../errors/User");
const connection = require("../../database/connection");

const validateResalePostRequest = celebrate({
  [Segments.BODY]: Joi.object().keys({
    i_user: Joi.number(),
    name: Joi.string().required(),
    phone: Joi.number().required(),
    formatted_address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postal_code: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    latitudeDelta: Joi.number(),
    longitudeDelta: Joi.number(),
  }),
});

const validateResalePutRequest = celebrate({
  [Segments.BODY]: Joi.object().keys({
    i_user: Joi.number(),
    name: Joi.string(),
    phone: Joi.number(),
    formatted_address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postal_code: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    latitudeDelta: Joi.number(),
    longitudeDelta: Joi.number(),
  }),
});

const validateResale = async (request, response, next) => {
  const { name } = request.body;

  if (name) {
    const { count } = await connection("resales")
      .where({ name, deleted: false })
      .count("name")
      .first();

    const schema = Joi.object().keys({
      count: Joi.number().max(0).required(),
    });
    const validationReturn = schema.validate({ count });
    if (validationReturn.error) {
      const errorMessage = resaleExistsError;
      return response.status(400).json({ errorMessage });
    }
  }
  next();
};

const validateDeleteResale = async (request, response, next) => {
  const i_resale = request.params.id;
  let count = { count: 0 };

  count = await connection("resales")
    .join("visits", "visits.i_resale", "=", "resales.i_resale")

    .where({
      "resales.i_resale": i_resale,
      "resales.deleted": false,
      "visits.deleted": false,
    })
    .count("resales.name")
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
      .json({ error: "A revenda está vinculada a uma visita." });
  }

  next();
};

module.exports = {
  validateResalePostRequest,
  validateResalePutRequest,
  validateResale,
  validateDeleteResale,
};
