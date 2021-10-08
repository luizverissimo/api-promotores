const utils = require("../utils");

module.exports = {
  async sendEmail(request, response) {
    try {
      const { sender, receivers, subject, text, html } = request.body;
      await utils.sendigMail(sender, receivers, subject, text, html);
      response.json({ ok: "ok" });
    } catch (error) {
      console.log(error);
      return response.status(405).json({ error: "Erro ao enviar o email." });
    }
  },
};
