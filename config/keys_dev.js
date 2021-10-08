module.exports = {
  secretOrKey: "secret",
  emailConf: {
    email: process.env.SECRET_EMAIL,
    password: process.env.SECRET_EMAIL_PASSWORD,
    host: process.env.SECRET_EMAIL_HOST,
    port: process.env.SECRET_EMAIL_PORT,
  },
};
