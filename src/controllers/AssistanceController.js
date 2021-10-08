const utils = require("../utils");
const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    const assistances = await connection("assistances")
      .select("*")
      .where({ deleted: false });

    return response.json(assistances);
  },

  async create(request, response) {
    try {
      const { i_user, i_customer, i_model, title, description } = request.body;

      const date = utils.dateFormatter(Date.now());

      const { i_assistance } = await connection("assistances").insert(
        {
          i_user,
          i_customer,
          i_model,
          title,
          description,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_assistance"]
      );
      return response.json({ i_assistance });
    } catch (error) {
      console.log(error);
      response
        .status(500)
        .json({ error: "Erro ao criar o funcionário do cliente." });
    }
  },

  async edit(request, response) {
    try {
      const i_assistance = request.params.id;
      const { i_user, i_model, i_customer, title, description } = request.body;

      const date = utils.dateFormatter(Date.now());

      const updateData = {
        i_customer: i_customer ? i_customer : undefined,
        title: title ? title : undefined,
        i_model: i_model ? i_model : undefined,
        description: description ? description : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("assistances")
        .where({ i_assistance })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listByCustomerName(request, response) {
    try {
      const { name } = request.query;
      const i_user = request.params.id;

      const assistances = await connection("assistances")
        .select(
          connection.ref("assistances.i_assistance").as("id"),
          connection.ref("customers.name").as("title"),
          connection.ref("assistances.title").as("secondTitle")
        )
        .join(
          "customers",
          "customers.i_customer",
          "=",
          "assistances.i_customer"
        )
        .where(
          connection.raw(
            "assistances.i_user = ? and assistances.deleted = false and LOWER(customers.name) like ?",
            [i_user, `%${name.toLowerCase()}%`]
          )
        )
        .limit(5);

      return response.json(assistances);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listLastFive(request, response) {
    try {
      const i_user = request.params.id;

      const assistances = await connection("assistances")
        .select(
          connection.ref("assistances.i_assistance").as("id"),
          connection.ref("customers.name").as("title"),
          connection.ref("assistances.title").as("secondTitle")
        )
        .join(
          "customers",
          "customers.i_customer",
          "=",
          "assistances.i_customer"
        )
        .where({ "assistances.i_user": i_user, "assistances.deleted": false })
        .limit(5);

      return response.json(assistances);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async delete(request, response) {
    try {
      const i_assistance = request.params.id;
      const { i_user } = request.headers;
      const date = utils.dateFormatter(Date.now());

      await connection("assistances").where({ i_assistance }).update({
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
      const i_assistance = request.params.id;

      const assistance = await connection("assistances")
        .select(
          connection.ref("assistances.i_assistance").as("i_assistance"),
          connection.ref("customers.name").as("customer_name"),
          connection.ref("customers.i_customer").as("i_customer"),
          connection.ref("assistances.title").as("title"),
          connection.ref("assistances.description").as("description"),
          connection.ref("assistances.i_model").as("i_model"),
          connection.raw(
            "equipaments.name || ' ' || models.name  as model_name"
          )
        )
        .join(
          "customers",
          "customers.i_customer",
          "=",
          "assistances.i_customer"
        )
        .join("models", "models.i_model", "=", "assistances.i_model")
        .join(
          "brands_equipaments",
          "brands_equipaments.i_brand_equipament",
          "=",
          "models.i_brand_equipament"
        )
        .join(
          "equipaments",
          "brands_equipaments.i_equipament",
          "=",
          "equipaments.i_equipament"
        )
        .where({ i_assistance })
        .first();

      return response.json({ assistance });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
