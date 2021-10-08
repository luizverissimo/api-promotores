const utils = require("../utils");
const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    try {
      const resale_employers = await connection("resale_employers")
        .select("*")
        .where({ deleted: false });
      return response.json({ resale_employers });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listByIResale(request, response) {
    try {
      const { i_resale } = request.params;
      const resaleEmployer = await connection("resale_employers")
        .select(
          connection.ref("i_resale_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where({ i_resale, deleted: false });
      return response.json(resaleEmployer);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listById(request, response) {
    try {
      const i_resale_employer = request.params.id;
      const resaleEmployer = await connection("resale_employers")
        .select("*")
        .where({ i_resale_employer, deleted: false })
        .first();
      return response.json({ resaleEmployer });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async create(request, response) {
    try {
      const { i_user, i_resale, name, email, phone, position } = request.body;

      const date = utils.dateFormatter(Date.now());

      const i_resale_employer = await connection("resale_employers").insert(
        {
          i_resale,
          name,
          email,
          phone,
          position,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_resale_employer"]
      );
      return response.json(i_resale_employer[0]);
    } catch (error) {
      console.log(error);
      response
        .status(500)
        .json({ error: "Erro ao criar o funcionário do cliente." });
    }
  },

  async edit(request, response) {
    try {
      const i_resale_employer = request.params.id;
      const { i_user, name, email, phone, position } = request.body;

      const date = utils.dateFormatter(Date.now());

      const updateData = {
        name: name ? name : undefined,
        phone: phone ? phone : undefined,
        email: email,
        position: position ? position : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("resale_employers")
        .where({ i_resale_employer })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async listByName(request, response) {
    try {
      const { name } = request.query;
      const { i_resale } = request.params;

      const resale_employers = await connection("resale_employers")
        .select(
          connection.ref("i_resale_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where(
          connection.raw(
            'i_resale = ? and deleted = false and LOWER("name") like ?',
            [i_resale, `%${name.toLowerCase()}%`]
          )
        )
        .limit(5);

      return response.json(resale_employers);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async delete(request, response) {
    try {
      const i_resale_employer = request.params.id;
      const { i_user } = request.headers;
      const date = utils.dateFormatter(Date.now());

      await connection("resale_employers").where({ i_resale_employer }).update({
        aud_updated_by: i_user,
        aud_updated_date: date,
        deleted: true,
      });
      return response.status(204).send();
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async listLastFive(request, response) {
    try {
      const i_resale = request.params.id;

      const resaleEmployer = await connection("resale_employers")
        .select(
          connection.ref("i_resale_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where({ i_resale, deleted: false })
        .orderBy("aud_created_by", "desc")
        .limit(5);

      return response.json(resaleEmployer);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
