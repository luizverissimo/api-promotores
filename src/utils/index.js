const nodemailer = require("nodemailer");
const moment = require("moment");
const keys = require("../../config/keys");

module.exports = {
  dateFormatter(date) {
    return moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
  },

  async sendigMail(sender, recivers, subject, text, html) {
    try {
      const transporter = nodemailer.createTransport({
        host: keys.emailConf.host,
        port: keys.emailConf.port,
        secure: true,
        auth: {
          user: keys.emailConf.email,
          pass: keys.emailConf.password,
        },
      });

      await transporter.sendMail({
        from: sender,
        to: recivers,
        subject: subject,
        text: text,
        html: html,
      });
    } catch (error) {
      new Error("Erro ao enviar email.");
    }
  },
};
