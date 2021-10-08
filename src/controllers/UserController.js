const connection = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const utils = require("../utils");

module.exports = {
  async index(request, response) {
    try {
      const users = await connection("users")
        .select("*")
        .where({ deleted: false });

      return response.json(users);
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  },

  async create(request, response) {
    const {
      name,
      email,
      password,
      operational_area,
      avatar,

      phone,
    } = request.body;

    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            return response.status(500).json(err);
          }

          const { i_user } = await connection("users").insert(
            {
              name,
              email,
              password: hash,
              operational_area,

              avatar,
              phone,
            },
            ["i_user"]
          );
          return response.json({ i_user });
        });
      });
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  },

  async edit(request, response) {
    try {
      const i_user = request.params.id;
      let hash;
      const {
        name,
        email,
        password,
        operational_area,

        avatar,
        phone,
      } = request.body;

      if (password) {
        hash = bcrypt.hashSync(password, 10);
      }

      const updateData = {
        name: name ? name : undefined,
        email: email ? email : undefined,
        password: password ? hash : undefined,
        operational_area: operational_area ? operational_area : undefined,
        avatar: avatar ? avatar : undefined,

        phone: phone ? phone : undefined,
      };
      const response_update = await connection("users")
        .where({ i_user })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  },

  async delete(request, response) {
    try {
      const i_user = request.params.id;

      await connection("users").where({ i_user }).delete();

      return response.status(204).send();
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listById(request, response) {
    try {
      const i_user = request.params.id;

      const user = await connection("users").where({ i_user }).first();

      return response.json({ user });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async login(request, response) {
    jwt.sign(
      request.payload,
      keys.secretOrKey,
      { expiresIn: "9999 years" },
      (err, token) => {
        if (err) return response.status(500).json(err);
        response.json({
          success: true,
          token: "Bearer " + token,
          user: request.payload.user,
        });
      }
    );
  },

  async resetPassword(request, response) {
    try {
      const { email } = request.body;
      let hash;
      const password = Math.random().toString(36).slice(-8);
      hash = bcrypt.hashSync(password, 10);

      await connection("users").where({ email }).update({ password: hash });

      await utils.sendigMail(
        "dev@movelin.com.br",
        email,
        "Nova Senha!",
        `Sua nova senha ${password}`,
        ""
      );
      response.json({ message: "senha atualizada!" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ err });
    }
  },
  async deleteUserById(request, response) {
    try {
      const i_user = request.params.id;

      await connection("users").where({ i_user }).update({
        deleted: true,
      });
      return response.status(204).send();
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
