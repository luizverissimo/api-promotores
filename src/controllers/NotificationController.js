const utils = require("../utils");
const connection = require("../database/connection");

module.exports = {
  async index(request, response) {
    try {
      const notifications = await connection("notifications")
        .select("*")
        .where({ deleted: false });

      return response.json(notifications);
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error.message });
    }
  },

  async create(request, response) {
    const date = utils.dateFormatter(Date.now());
    const { i_user, title, description, sent_date } = request.body;

    try {
      const i_notification = await connection("notifications").insert(
        {
          i_user,
          title,
          description,
          sent_date,
          i_user,
          aud_created_by: i_user,
          aud_created_date: date,
        },
        ["i_notification"]
      );
      return response.json(i_notification[0]);
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  },
  async indexSent(request, response) {
    try {
      const i_user = request.params.id;
      const notifications = await connection("notifications")
        .select("*")
        .where({ deleted: false, sent: true, i_user });

      return response.json(notifications);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async registerDevice(request, response) {
    const date = utils.dateFormatter(Date.now());
    const { i_user, expo_push_token } = request.body;

    try {
      const i_device_notification = await connection(
        "devices_notifications"
      ).insert(
        {
          i_user: i_user,
          expo_push_token,
          aud_created_date: date,
        },
        ["i_device_notification"]
      );
      return response.json(i_device_notification[0]);
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  },
};
