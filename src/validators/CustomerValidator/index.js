const { celebrate, Segments, Joi } = require("celebrate");
const { userCustomerError, customerExistsError } = require("../../errors/User");
const connection = require("../../database/connection");

const validateCustomerPostRequest = celebrate({
  [Segments.BODY]: Joi.object().keys({
    i_user: Joi.number(),
    name: Joi.string().required(),
    phone: Joi.number().required(),
    formatted_address: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postal_code: Joi.string(),

    country: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    latitudeDelta: Joi.number(),
    longitudeDelta: Joi.number(),
  }),
});

const validateCustomerPutRequest = celebrate({
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

const validateCustomer = async (request, response, next) => {
  const { name } = request.body;

  if (name) {
    const { count } = await connection("customers")
      .where({ name, deleted: false })
      .count("name")
      .first();

    const schema = Joi.object().keys({
      count: Joi.number().max(0).required(),
    });
    const validationReturn = schema.validate({ count });
    if (validationReturn.error) {
      const errorMessage = customerExistsError;
      return response.status(400).json({ errorMessage });
    }
  }
  next();
};

const validateDeleteCustomer = async (request, response, next) => {
  const i_customer = request.params.id;
  let count = { count: 0 };

  count = await connection("customers")
    .join("visits", "visits.i_customer", "=", "customers.i_customer")

    .where({
      "customers.i_customer": i_customer,
      "customers.deleted": false,
      "visits.deleted": false,
    })
    .count("customers.name")
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
      .json({ error: "O cliente está vinculado a uma visita." });
  }

  count = await connection("customers")
    .join("assistances", "assistances.i_customer", "=", "customers.i_customer")

    .where({
      "customers.i_customer": i_customer,
      "customers.deleted": false,
      "assistances.deleted": false,
    })
    .count("customers.name")
    .first();

  count = { count: parseInt(count.count) };
  validationReturn = schema.validate(count);
  console.log(validationReturn);

  if (validationReturn.error) {
    return response
      .status(405)
      .json({ error: "O cliente está vinculado a uma assistência." });
  }

  next();
};

module.exports = {
  validateCustomerPostRequest,
  validateCustomerPutRequest,
  validateDeleteCustomer,
  validateCustomer,
};
