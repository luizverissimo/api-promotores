const { celebrate, Segments, Joi } = require("celebrate");
const connection = require("../../database/connection");

const {
  userExistsError,
  userNotExistsError,
  passwordIncorrect,
  emailInmesError,
} = require("../../errors/User");
const bcrypt = require("bcrypt");

// Guarantee that the password will have a letter and a number
const regexComplexityPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

const validateUserRequestLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserRequestPut = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6).regex(regexComplexityPassword),
    operational_area: Joi.string(),
    avatar: Joi.string(),

    phone: Joi.number(),
  }),
});

const validateUserRequestPost = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).regex(regexComplexityPassword),
    operational_area: Joi.string(),
    avatar: Joi.string(),
    phone: Joi.number(),

    passwordValidate: Joi.string(),
  }),
});

const validateUserExist = async (request, response, next) => {
  const { email } = request.body;
  const { count } = await connection("users")
    .where({ email, deleted: false })
    .count("email")
    .first();

  const schema = Joi.object().keys({
    count: Joi.number().min(1).required(),
  });

  const validationReturn = schema.validate({ count });
  if (validationReturn.error) {
    const errorMessage = userNotExistsError;
    return response.status(400).json({ errorMessage });
  }

  next();
};

const validateUserToInsert = async (request, response, next) => {
  const { email } = request.body;

  if (
    !email.toLowerCase().includes("@inmes") &&
    !email.toLowerCase().includes("@movelin")
  ) {
    const errorMessage = emailInmesError;
    return response.status(400).json({ errorMessage });
  }

  const { count } = await connection("users")
    .where({ email, deleted: false })
    .count("email")
    .first();

  const schema = Joi.object().keys({
    count: Joi.number().max(0).required(),
  });

  const validationReturn = schema.validate({ count });
  if (validationReturn.error) {
    const errorMessage = userExistsError;
    return response.status(400).json({ errorMessage });
  }

  next();
};

const validateUserToUpdate = async (request, response, next) => {
  const i_user = request.params.id;
  const { count } = await connection("users")
    .where({ i_user, deleted: false })
    .count("i_user")
    .first();

  const schema = Joi.object().keys({
    count: Joi.number().min(1).required(),
  });

  const validationReturn = schema.validate({ count });
  if (validationReturn.error) {
    const errorMessage = userNotExistsError;
    return response.status(400).json({ errorMessage });
  }

  next();
};

const validateUserToLogin = async (request, response, next) => {
  const { email, password } = request.body;

  const returnData = await connection("users")
    .select(
      "password as passwordDatabase",
      "i_user",
      "name",
      "avatar",
      "email as emailDatabase",
      "operational_area",
      "phone"
    )
    .where({ email, deleted: false })
    .first();

  const {
    passwordDatabase,
    i_user,
    name,
    avatar,
    emailDatabase,
    operational_area,
    phone,
  } = returnData || {};

  if (!passwordDatabase) {
    const errorMessage = userNotExistsError;
    return response.status(400).json({ errorMessage });
  }

  bcrypt.compare(password, passwordDatabase).then((isMatch) => {
    if (isMatch) {
      const payload = {
        user: {
          i_user,
          name,
          avatar,
          email: emailDatabase,
          operational_area,
          phone,
        },
      };
      request.payload = payload;
      next();
    } else {
      const errorMessage = passwordIncorrect;
      return response.status(400).json({ errorMessage });
    }
  });
};

module.exports = {
  validateUserRequestPost,
  validateUserRequestPut,
  validateUserToInsert,
  validateUserToUpdate,
  validateUserToLogin,
  validateUserRequestLogin,
  validateUserExist,
};
