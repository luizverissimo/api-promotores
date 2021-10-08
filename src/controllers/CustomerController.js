const connection = require("../database/connection");
const utils = require("../utils");

module.exports = {
  async index(request, response) {
    const customers = await connection("customers")
      .select("*")
      .where({ deleted: false });

    return response.json(customers);
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
        postal_code,

        country,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      } = request.body;

      const i_customer = await connection("customers").insert(
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
        ["i_customer"]
      );

      return response.json(i_customer[0]);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async edit(request, response) {
    try {
      const i_customer = request.params.id;

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
      const response_update = await connection("customers")
        .where({ i_customer })
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

      const customers = await connection("customers")
        .select(
          connection.ref("i_customer").as("id"),
          connection.ref("name").as("title")
        )
        .where(
          connection.raw(
            'LOWER("name") like ? and deleted = false',
            `%${name.toLowerCase()}%`
          )
        )
        .limit(5);

      return response.json(customers);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async delete(request, response) {
    try {
      const i_customer = request.params.id;
      const { i_user } = request.body;
      const date = utils.dateFormatter(Date.now());

      await connection("customers").where({ i_customer }).update({
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
      const i_customer = request.params.id;

      const customer = await connection("customers")
        .where({ i_customer })
        .first();

      return response.json({ customer });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listLastFive(request, response) {
    try {
      const customers = await connection("customers")
        .select(
          connection.ref("i_customer").as("id"),
          connection.ref("name").as("title")
        )
        .where({ deleted: false })
        .orderBy("aud_created_by", "desc")
        .limit(5);

      return response.json(customers);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
