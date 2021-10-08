const utils = require("../utils");
const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    try {
      const resales = await connection("resales")
        .select("*")
        .where({ deleted: false });
      return response.json({ resales });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async create(request, response) {
    try {
      const date = utils.dateFormatter(Date.now());

      const {
        i_user,
        name,
        phone,
        formatted_address,
        city,
        state,
        country,
        postal_code,

        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      } = request.body;

      const i_resale = await connection("resales").insert(
        {
          name,
          phone,
          formatted_address,
          city,
          state,
          country,
          postal_code,

          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_resale"]
      );
      return response.json(i_resale[0]);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async edit(request, response) {
    try {
      const i_resale = request.params.id;

      const date = utils.dateFormatter(Date.now());
      const {
        i_user,
        name,
        phone,
        formatted_address,
        city,
        state,
        country,
        postal_code,

        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      } = request.body;

      const updateData = {
        name: name ? name : undefined,
        phone: phone ? phone : undefined,
        formatted_address: formatted_address ? formatted_address : undefined,
        city: city ? city : undefined,
        state: state ? state : undefined,
        country: country ? country : undefined,
        postal_code: postal_code ? postal_code : undefined,

        latitude: latitude ? latitude : undefined,
        longitude: longitude ? longitude : undefined,
        latitudeDelta: latitudeDelta ? latitudeDelta : undefined,
        longitudeDelta: longitudeDelta ? longitudeDelta : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("resales")
        .where({ i_resale })
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

      const resales = await connection("resales")
        .select(
          connection.ref("i_resale").as("id"),
          connection.ref("name").as("title")
        )
        .where(
          connection.raw(
            'LOWER("name") like ? and deleted = false',
            `%${name.toLowerCase()}%`
          )
        )
        .limit(5);

      return response.json(resales);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async delete(request, response) {
    try {
      const i_resale = request.params.id;
      const { i_user } = request.body;
      const date = utils.dateFormatter(Date.now());

      await connection("resales").where({ i_resale }).update({
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
  async listById(request, response) {
    try {
      const i_resale = request.params.id;

      const resale = await connection("resales").where({ i_resale }).first();

      return response.json({ resale });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listLastFive(request, response) {
    try {
      const resales = await connection("resales")
        .select(
          connection.ref("i_resale").as("id"),
          connection.ref("name").as("title")
        )
        .where({ deleted: false })
        .orderBy("aud_created_by", "desc")
        .limit(5);

      console.log(resales);
      return response.json(resales);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
