const utils = require("../utils");
const connection = require("../database/connection");
const moment = require("moment");

module.exports = {
  async index(request, response) {
    try {
      const visits = await connection("visits")
        .select("*")
        .where({ deleted: false });
      return response.json({ visits });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  async listById(request, response) {
    try {
      const { i_visit } = request.params;
      const visits = await connection("visits")
        .select(
          connection.ref("customers.name").as("customer"),
          connection.ref("customers.i_customer").as("i_customer"),
          connection.ref("resales.i_resale").as("i_resale"),
          connection.ref("resales.name").as("resale"),
          connection.ref("visits.anotation").as("anotation"),
          connection.ref("visits.aud_created_date").as("aud_created_date")
        )
        .leftJoin("customers", "customers.i_customer", "=", "visits.i_customer")
        .leftJoin("resales", "resales.i_resale", "=", "visits.i_resale")
        .where({ "visits.i_visit": i_visit, "visits.deleted": false })
        .first();

      const customer_employers_visits = await connection("customer_employers")
        .select("customer_employers.name")
        .join(
          "customer_employers_visits",
          " customer_employers.i_customer_employer",
          "=",
          "customer_employers_visits.i_customer_employer"
        )
        .where({
          "customer_employers_visits.i_visit": i_visit,
          "customer_employers.i_customer": visits.i_customer,
        });

      const resale_employers_visits = await connection("resale_employers")
        .select("resale_employers.name")
        .join(
          "resale_employers_visits",
          " resale_employers.i_resale_employer",
          "=",
          "resale_employers_visits.i_resale_employer"
        )
        .where({
          "resale_employers_visits.i_visit": i_visit,
          "resale_employers.i_resale": visits.i_resale,
        });

      const customers_models_visits = await connection(
        "customers_models_visits"
      )
        .select(
          connection.raw(
            "equipaments.name || ' ' || models.name || ' (' || brands.name || ')'  as name"
          )
        )
        .join(
          "customers_models",
          "customers_models.i_customer_model",
          "=",
          "customers_models_visits.i_customer_model"
        )
        .join("models", "models.i_model", "=", "customers_models.i_model")
        .join(
          "brands_equipaments",
          "brands_equipaments.i_brand_equipament",
          "=",
          "models.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where({
          "customers_models.i_customer": visits.i_customer,
          "customers_models_visits.i_visit": i_visit,
          "customers_models_visits.deleted": false,
        });
      const models_desired = await connection("models_desired")
        .select(
          connection.raw(
            "equipaments.name || ' ' || models.name || ' (' || brands.name || ')'  as name"
          )
        )
        .join("models", "models.i_model", "=", "models_desired.i_model")
        .join(
          "brands_equipaments",
          "brands_equipaments.i_brand_equipament",
          "=",
          "models.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where({
          "models_desired.i_visit": i_visit,
          "models_desired.deleted": false,
        });
      const visit = {
        ...visits,
        customer_employers_visits: customer_employers_visits,
        resale_employers_visits: resale_employers_visits,
        customers_models_visits: customers_models_visits,
        models_desired: models_desired,
      };
      console.log(visit);
      return response.json({ visit });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async listLast(request, response) {
    try {
      const { i_customer, i_user } = request.params;

      const visit = await connection("visits")
        .select(
          connection.ref("customers.name").as("customer"),
          connection.ref("visits.i_visit").as("i_visit"),
          connection.ref("customers.i_customer").as("i_customer"),
          connection.ref("resales.i_resale").as("i_resale"),
          connection.ref("resales.name").as("resale"),
          connection.ref("visits.anotation").as("anotation")
        )
        .leftJoin("customers", "customers.i_customer", "=", "visits.i_customer")
        .leftJoin("resales", "resales.i_resale", "=", "visits.i_resale")
        .where({
          "visits.i_user": i_user,
          "visits.i_customer": i_customer,
          "visits.deleted": false,
        })
        .orderBy("visits.aud_created_date", "desc")
        .first();

      if (!visit) return response.json([]);

      const customer_employers_visits = await connection("customer_employers")
        .select(
          connection.ref("customer_employers.name").as("title"),
          connection.ref("customer_employers.i_customer_employer").as("id")
        )
        .join(
          "customer_employers_visits",
          " customer_employers.i_customer_employer",
          "=",
          "customer_employers_visits.i_customer_employer"
        )
        .where({
          "customer_employers_visits.i_visit": visit.i_visit,
          "customer_employers.i_customer": visit.i_customer,
        });

      const resale_employers_visits = await connection("resale_employers")
        .select(
          connection.ref("resale_employers.name").as("title"),
          connection.ref("resale_employers.i_resale_employer").as("id")
        )
        .join(
          "resale_employers_visits",
          " resale_employers.i_resale_employer",
          "=",
          "resale_employers_visits.i_resale_employer"
        )
        .where({
          "resale_employers_visits.i_visit": visit.i_visit,
          "resale_employers.i_resale": visit.i_resale,
        });

      const customers_models = await connection("customers_models")
        .select(
          connection.raw(
            "equipaments.name || ' ' || models.name as title, models.i_model as id"
          )
        )
        .join("models", "models.i_model", "=", "customers_models.i_model")
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where({
          "customers_models.i_customer": visit.i_customer,
          "customers_models.deleted": false,
        });

      const models_desired = await connection("models_desired")
        .select(
          connection.raw(
            "equipaments.name || ' ' || models.name as title, models.i_model as id"
          )
        )
        .join("models", "models.i_model", "=", "models_desired.i_model")
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )

        .where({
          "models_desired.i_visit": visit.i_visit,
          "models_desired.deleted": false,
        });
      visitResponse = {
        ...visit,
        customer_employers_visits: customer_employers_visits,
        resale_employers_visits: resale_employers_visits,
        customers_models: customers_models,
        models_desired: models_desired,
      };
      console.log(visit);
      return response.json(visitResponse);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
  async listByUserAndName(request, response) {
    try {
      const { i_user } = request.params;
      const { name, startDate, endDate } = request.query;

      let visits;

      if (!!startDate) {
        visits = await connection("visits")
          .select(
            connection.ref("i_visit").as("id"),
            connection.ref("customers.name").as("title"),
            connection.ref("visits.aud_created_date").as("date")
          )
          .join("customers", "customers.i_customer", "=", "visits.i_customer")
          .where(
            connection.raw(
              "i_user = ? and visits.deleted = false and LOWER(customers.name) like ? ",
              [i_user, `%${name.toLowerCase()}%`]
            )
          )
          .where("visits.aud_created_date", ">=", startDate)
          .where("visits.aud_created_date", "<", endDate)
          .orderBy("visits.aud_created_date", "desc");
      } else {
        visits = await connection("visits")
          .select(
            connection.ref("i_visit").as("id"),
            connection.ref("customers.name").as("title"),
            connection.ref("visits.aud_created_date").as("date")
          )
          .join("customers", "customers.i_customer", "=", "visits.i_customer")
          .where(
            connection.raw(
              "i_user = ? and visits.deleted = false and LOWER(customers.name) like ? ",
              [i_user, `%${name.toLowerCase()}%`]
            )
          )
          .orderBy("visits.aud_created_date", "desc");
      }

      return response.json(visits);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listByUserLastFive(request, response) {
    try {
      const { i_user } = request.params;

      const visits = await connection("visits")
        .select(
          connection.ref("i_visit").as("id"),
          connection.ref("customers.name").as("title"),
          connection.ref("visits.aud_created_date").as("date")
        )
        .join("customers", "customers.i_customer", "=", "visits.i_customer")
        .where({ i_user, "visits.deleted": false })
        .orderBy("visits.aud_created_date", "desc")

        .limit(5);

      return response.json(visits);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async create(request, response) {
    try {
      const {
        i_user,
        anotation,
        i_customer,
        i_resale,
        days_return,
        resale_employers,
        equipaments_customers,
        equipaments_desired,
        customer_employers,
      } = request.body;
      const date = utils.dateFormatter(Date.now());

      const newVisitPromise = new Promise(async (resolve, reject) => {
        const i_visits = await connection("visits").insert(
          {
            anotation,
            i_customer,
            days_return,
            i_resale: !!i_resale ? i_resale : null,
            i_user: i_user,
            aud_created_by: i_user,
            aud_created_date: date,
          },
          ["i_visit"]
        );

        if (i_visits) resolve(i_visits);

        reject(Error("Erro ao inserir os funcionários da revenda"));
      });

      newVisitPromise.then(async (result) => {
        const { i_visit } = result[0];

        if (
          typeof customer_employers !== "undefined" &&
          customer_employers.length > 0
        ) {
          await customer_employers.map(async (customer_employers) => {
            const i_customer_employer = customer_employers.id;
            const i_customer_employer_visit = await connection(
              "customer_employers_visits"
            ).insert(
              {
                i_customer_employer,
                i_visit,
                aud_created_by: i_user,
                aud_created_date: date,
              },
              ["i_customer_employer_visit"]
            );
            if (!i_customer_employer_visit)
              new Error("Erro ao cadastrar funcionário do cliente.");
          });
        }

        if (
          typeof resale_employers !== "undefined" &&
          resale_employers.length > 0
        ) {
          await resale_employers.map(async (resale_employer) => {
            const i_resale_employer = resale_employer.id;
            const i_resale_employer_visit = await connection(
              "resale_employers_visits"
            ).insert(
              {
                i_resale_employer,
                i_visit,
                aud_created_by: i_user,
                aud_created_date: date,
              },
              ["i_resale_employer_visit"]
            );
            if (!i_resale_employer_visit)
              new Error("Erro ao cadastrar funcionário revenda.");
          });
        }

        if (
          typeof equipaments_customers !== "undefined" &&
          equipaments_customers.length > 0
        ) {
          const customers_models = await connection("customers_models")
            .select(
              connection.ref("customers_models.i_model").as("i_model"),
              connection
                .ref("customers_models.i_customer_model")
                .as("i_customer_model")
            )
            .where({ i_customer, deleted: false });
          await equipaments_customers.map(async (equipament_customer) => {
            const i_model = equipament_customer.id;
            const customer_model_exist = customers_models.find((e) => {
              return e.i_model === i_model;
            });

            if (!customer_model_exist) {
              const i_customer_model = await connection(
                "customers_models"
              ).insert(
                {
                  i_model,
                  i_customer,
                  aud_created_by: i_user,
                  aud_created_date: date,
                },
                ["i_customer_model"]
              );
              console.log(`i_customer_model nao exist ${i_customer_model}`);
              if (!i_customer_model)
                new Error(
                  "Erro ao cadastrar um equipamento do cliente que não tinha no banco."
                );
              const { i_customer_model_visit } = await connection(
                "customers_models_visits"
              ).insert(
                {
                  i_visit,
                  i_customer_model: i_customer_model[0].i_customer_model,
                  aud_created_by: i_user,
                  aud_created_date: date,
                },
                ["i_customer_model_visit"]
              );
              if (!i_customer_model_visit)
                new Error(
                  "Erro ao cadastrar um equipamento do cliente na visita que não tinha no bando."
                );
            } else {
              const { i_customer_model } = customer_model_exist;
              console.log(`i_customer_model  exist ${i_customer_model}`);
              console.log(customer_model_exist);
              const i_customer_model_visit = await connection(
                "customers_models_visits"
              ).insert(
                {
                  i_visit,
                  i_customer_model,
                  aud_created_by: i_user,
                  aud_created_date: date,
                },
                ["i_customer_model_visit"]
              );
              if (!i_customer_model_visit)
                new Error(
                  "Erro ao cadastrar um equipamento do cliente que existia no banco."
                );
            }
          });
          await customers_models.map(async (customers_model) => {
            if (
              !equipaments_customers.find(
                (e) => e.id === customers_model.i_model
              )
            ) {
              console.log(customers_model.i_model);
              const i_customer_model = await connection("customers_models")
                .update(
                  {
                    aud_updated_by: i_user,
                    aud_updated_date: date,
                    deleted: true,
                  },
                  ["i_customer_model"]
                )
                .where({ i_customer, i_model: customers_model.i_model });
              if (!i_customer_model)
                new Error("Erro ao cadastrar modelo que o cliente tem.");
            }
          });
        }

        if (
          typeof equipaments_desired !== "undefined" &&
          equipaments_desired.length > 0
        ) {
          await equipaments_desired.map(async (equipament_desired) => {
            console.log(equipament_desired.id);
            const i_model = equipament_desired.id;
            const i_model_desired = await connection("models_desired").insert(
              {
                i_model,
                i_visit,
                aud_created_by: i_user,
                aud_created_date: date,
              },
              ["i_model_desired"]
            );
            console.log(i_model_desired);
            if (!i_model_desired)
              new Error("Erro ao cadastrar o modelo que o cliente quer ter");
          });
        }

        return response.json({ result });
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async edit(request, response) {
    try {
      const i_visit = request.params.id;
      const date = utils.dateFormatter(Date.now());
      const { i_user, anotation } = request.body;
      const updateData = {
        anotation: anotation ? anotation : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };

      const returnVisit = await connection("visits")
        .where({ i_visit })
        .update(updateData);

      return response.json({ returnVisit });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  async listToMap(request, response) {
    try {
      const { i_user } = request.params;

      const customersVisited = await connection("visits")
        .select(
          connection.ref("customers.name").as("customer"),
          connection.ref("customers.latitude").as("latitude"),
          connection.ref("customers.longitude").as("longitude")
        )
        .join("customers", "customers.i_customer", "=", "visits.i_customer")
        .where({ i_user, "visits.deleted": false })
        .groupBy("visits.i_customer")
        .groupBy("customers.name")
        .groupBy("customers.latitude")
        .groupBy("customers.longitude");

      return response.json(customersVisited);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
