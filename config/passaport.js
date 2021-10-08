const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const connection = require("../src/database/connection");
const keys = require("../config/keys");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      await connection
        .select("*")
        .from("users")
        .where({ i_user: jwt_payload.user.i_user })
        .then((results) => {
          if (results.length < 1)
            return done(null, false, { message: "usuário não existe!" });

          return done(null, results[0]);
        })
        .catch((error) => {
          return done(null, false, { message: "Erro na autenticação." });
        });
    })
  );
};
