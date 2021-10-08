const utils = require("../utils");
const connection = require("../database/connection");

async function createBrandModel(i_brand, i_equipament, i_user, date) {
  let i_brand_equipament;
  i_brand_equipament = await connection("brands_equipaments")
    .select("i_brand_equipament")
    .where({ i_brand, i_equipament, deleted: false })
    .first();

  if (!i_brand_equipament) {
    const i_brand_equipaments = await connection("brands_equipaments").insert(
      {
        i_brand,
        i_equipament,
        aud_created_by: i_user,
        aud_created_date: date,
      },
      ["i_brand_equipament"]
    );
    i_brand_equipament = i_brand_equipaments[0];
  }
  return i_brand_equipament;
}

module.exports = {
  async indexBrand(request, response) {
    try {
      const brands = await connection("brands")
        .select("*")
        .where({ deleted: false });

      return response.json(brands);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async indexEquipament(request, response) {
    try {
      const equipaments = await connection("equipaments")
        .select("*")
        .where({ deleted: false });

      return response.json(equipaments);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async indexModel(request, response) {
    try {
      const models = await connection("models")
        .select("*")
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )

        .where({ "models.deleted": false });

      return response.json(models);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async createBrand(request, response) {
    try {
      const { i_user, name } = request.body;

      const date = utils.dateFormatter(Date.now());

      const i_brands = await connection("brands").insert(
        {
          name,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_brand"]
      );
      const { i_brand } = i_brands[0];
      return response.json({ i_brand });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async createEquipament(request, response) {
    try {
      const { i_user, name } = request.body;

      const date = utils.dateFormatter(Date.now());

      const i_equipaments = await connection("equipaments").insert(
        {
          name,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_equipament"]
      );
      const { i_equipament } = i_equipaments[0];
      return response.json({ i_equipament });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async createModel(request, response) {
    try {
      const { i_user, name, i_brand, i_equipament } = request.body;

      const date = utils.dateFormatter(Date.now());
      const { i_brand_equipament } = await createBrandModel(
        i_brand,
        i_equipament,
        i_user,
        date
      );

      const i_models = await connection("models").insert(
        {
          name,
          i_brand_equipament,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_model"]
      );
      const { i_model } = i_models[0];

      return response.json(i_model);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },
  async editBrand(request, response) {
    try {
      const i_brand = request.params.id;

      const date = utils.dateFormatter(Date.now());
      const { i_user, name } = request.body;

      const updateData = {
        name: name ? name : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("brands")
        .where({ i_brand })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async editEquipament(request, response) {
    try {
      const i_equipament = request.params.id;

      const date = utils.dateFormatter(Date.now());
      const { i_user, name } = request.body;

      const updateData = {
        name: name ? name : undefined,

        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("equipaments")
        .where({ i_equipament })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async editModel(request, response) {
    try {
      const i_model = request.params.id;

      const date = utils.dateFormatter(Date.now());
      const { i_user, name, i_brand, i_equipament } = request.body;
      let model;
      if (i_brand && i_equipament) {
        model = await createBrandModel(i_brand, i_equipament, i_user, date);
      }
      const updateData = {
        name: name ? name : undefined,
        i_brand_equipament: model.i_brand_equipament
          ? model.i_brand_equipament
          : undefined,
        aud_updated_by: i_user,
        aud_updated_date: date,
      };
      const response_update = await connection("models")
        .where({ i_model })
        .update(updateData);

      return response.json({ response_update });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listBrandsByName(request, response) {
    try {
      const { name } = request.query;

      const brands = await connection("brands")
        .select(
          connection.ref("i_brand").as("id"),
          connection.ref("name").as("title")
        )
        .where(
          connection.raw(
            'LOWER("name") like ? and deleted = false',
            `%${name.toLowerCase()}%`
          )
        )
        .limit(5);

      return response.json(brands);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listEquipamentsByName(request, response) {
    try {
      const { name } = request.query;

      const equipaments = await connection("equipaments")
        .select(
          connection.ref("equipaments.i_equipament").as("id"),
          connection.ref("equipaments.name").as("title")
        )

        .where(
          connection.raw(
            "LOWER(equipaments.name) like ? and equipaments.deleted = false ",
            `%${name.toLowerCase()}%`
          )
        )
        .limit(5);

      return response.json(equipaments);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listModelsByName(request, response) {
    try {
      const { i_brand, i_equipament, name } = request.query;
      let whereDynamic = { "models.deleted": false };
      let nameFilter = {};
      if (!!i_brand && i_brand > 0)
        whereDynamic = { ...whereDynamic, "brands.i_brand": parseInt(i_brand) };
      if (!!i_equipament && i_equipament > 0)
        whereDynamic = {
          ...whereDynamic,
          "equipaments.i_equipament": parseInt(i_equipament),
        };
      if (!!name && name != "")
        nameFilter = connection.raw("LOWER(models.name) like ? ", [
          `%${name.toLowerCase()}%`,
        ]);

      const models = await connection("models")
        .select(
          connection.ref("models.i_model").as("id"),
          connection.ref("models.name").as("title"),
          connection.ref("brands.name").as("verticalContent"),
          connection.ref("equipaments.name").as("subtitle")
        )
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where(whereDynamic)
        .where(nameFilter);

      return response.json(models);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async listModelsTotalByName(request, response) {
    try {
      const { name } = request.query;

      const models = await connection("models")
        .select(
          connection.ref("models.i_model").as("id"),
          connection.ref("models.name").as("title"),
          connection.ref("brands.name").as("verticalContent"),
          connection.ref("equipaments.name").as("subtitle")
        )
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where(
          connection.raw(
            "LOWER(brands.name|| equipaments.name || models.name) like ? and equipaments.deleted = false ",
            `%${name.toLowerCase()}%`
          )
        )
        .limit(5);
      return response.json(models);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error });
    }
  },

  async deleteEquipament(request, response) {
    try {
      const i_equipament = request.params.id;
      const { i_user } = request.body;
      const date = utils.dateFormatter(Date.now());

      await connection("equipaments").where({ i_equipament }).update({
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

  async deleteBrand(request, response) {
    try {
      const i_brand = request.params.id;
      const { i_user } = request.body;
      const date = utils.dateFormatter(Date.now());

      await connection("brands").where({ i_brand }).update({
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

  async deleteModel(request, response) {
    try {
      const i_model = request.params.id;
      const { i_user } = request.body;
      const date = utils.dateFormatter(Date.now());

      await connection("models").where({ i_model }).update({
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

  async listBrandById(request, response) {
    try {
      const i_brand = request.params.id;

      const brands = await connection("brands")
        .where({ "brands.i_brand": i_brand, "brands.deleted": false })
        .first();

      return response.json(brands);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listEquipamentById(request, response) {
    try {
      const i_equipament = request.params.id;

      const equipaments = await connection("equipaments")
        .where({
          "equipaments.i_equipament": i_equipament,
          "equipaments.deleted": false,
        })
        .first();

      return response.json(equipaments);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listModelById(request, response) {
    try {
      const i_model = request.params.id;
      console.log(i_model);
      const models = await connection("models")
        .select(
          connection.ref("models.i_model").as("id"),
          connection.ref("models.name").as("name"),
          connection.ref("brands.name").as("brand_name"),
          connection.ref("brands.i_brand").as("i_brand"),
          connection.ref("equipaments.i_equipament").as("i_equipament"),
          connection.ref("equipaments.name").as("equipament_name")
        )
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where({ "models.i_model": i_model, "models.deleted": false })
        .first();

      return response.json(models);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async listModelsLastFive(request, response) {
    try {
      const models = await connection("models")
        .select(
          connection.ref("models.i_model").as("id"),
          connection.ref("models.name").as("title"),
          connection.ref("brands.name").as("verticalContent"),
          connection.ref("equipaments.name").as("subtitle")
        )
        .join(
          "brands_equipaments",
          "models.i_brand_equipament",
          "=",
          "brands_equipaments.i_brand_equipament"
        )
        .join("brands", "brands.i_brand", "=", "brands_equipaments.i_brand")
        .join(
          "equipaments",
          "equipaments.i_equipament",
          "=",
          "brands_equipaments.i_equipament"
        )
        .where({ "models.deleted": false })
        .limit(5);

      return response.json(models);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },
};
