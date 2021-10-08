const userExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O E-mail já foi cadastrado.",
  validation: {
    source: "body",
    keys: ["email"],
  },
};

const emailInmesError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O E-mail é inválido.",
  validation: {
    source: "body",
    keys: ["email"],
  },
};

const customerExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O Cliente já foi cadastrado.",
  validation: {
    source: "body",
    keys: ["name"],
  },
};

const resaleExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "A revenda já foi cadastrado.",
  validation: {
    source: "body",
    keys: ["name"],
  },
};

const brandExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "a marca já foi cadastrada.",
  validation: {
    source: "body",
    keys: ["name"],
  },
};

const equipamentexistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O equipamento já foi cadastrado.",
  validation: {
    source: "body",
    keys: ["name"],
  },
};

const modelExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O modelo já foi cadastrado.",
  validation: {
    source: "body",
    keys: ["name"],
  },
};

const userNotExistsError = {
  statusCode: 400,
  error: "Bad Request",
  message: "O E-mail não foi encontrado no banco de dados.",
  validation: {
    source: "body",
    keys: ["email"],
  },
};

const passwordIncorrect = {
  statusCode: 400,
  error: "Bad Request",
  message: "A senha ou E-mail estão incorretos.",
  validation: {
    source: "body",
    keys: ["password"],
  },
};

module.exports = {
  userExistsError,
  userNotExistsError,
  passwordIncorrect,
  customerExistsError,
  resaleExistsError,
  brandExistsError,
  equipamentexistsError,
  modelExistsError,
  emailInmesError,
};
