const utils = require("../utils");
const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    try {
      const customerEmployer = await connection("customer_employers")
        .select("*")
        .where({ deleted: false });

      return response.json(customerEmployer);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listByICustomer(request, response) {
    try {
      const { i_customer } = request.params;

      const customerEmployer = await connection("customer_employers")
        .select(
          connection.ref("i_customer_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where({ i_customer, deleted: false });

      return response.json(customerEmployer);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async create(request, response) {
    try {
      const { i_user, i_customer, name, email, phone, position } = request.body;

      const date = utils.dateFormatter(Date.now());

      const i_customer_employer = await connection("customer_employers").insert(
        {
          i_customer,
          name,
          email,
          phone,
          position,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_customer_employer"]
      );
      return response.json(i_customer_employer[0]);
    } catch (error) {
      response
        .status(500)
        .json({ error: "Erro ao criar o funcionário do cliente." });
    }
  },

  async edit(request, response) {
    try {
      const i_customer_employer = request.params.id;
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
      const response_update = await connection("customer_employers")
        .where({ i_customer_employer })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },
  async listByName(request, response) {
    try {
      const { name } = request.query;
      const { i_customer } = request.params;

      const customer_employers = await connection("customer_employers")
        .select(
          connection.ref("i_customer_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where(
          connection.raw(
            'i_customer = ? and deleted = false and LOWER("name") like ?',
            [i_customer, `%${name.toLowerCase()}%`]
          )
        )
        .limit(5);

      return response.json(customer_employers);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listById(request, response) {
    try {
      const i_customer_employer = request.params.id;

      const customerEmployer = await connection("customer_employers")
        .where({ i_customer_employer })
        .first();

      return response.json({ customerEmployer });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listLastFive(request, response) {
    try {
      const i_customer = request.params.id;

      const customerEmployer = await connection("customer_employers")
        .select(
          connection.ref("i_customer_employer").as("id"),
          connection.ref("name").as("title")
        )
        .where({ i_customer, deleted: false })
        .orderBy("aud_created_by", "desc")
        .limit(5);

      return response.json(customerEmployer);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async delete(request, response) {
    try {
      const i_customer_employer = request.params.id;
      const { i_user } = request.headers;
      const date = utils.dateFormatter(Date.now());

      await connection("customer_employers")
        .where({ i_customer_employer })
        .update({
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
};
