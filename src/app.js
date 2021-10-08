const express = require("express");
require("dotenv").config();
const passaport = require("passport");
const cors = require("cors");
const { errors } = require("celebrate");

const users = require("./routes/users");
const customers = require("./routes/customers");
const resales = require("./routes/resales");
const core = require("./routes/core");
const assistances = require("./routes/assistances");
const equipaments = require("./routes/equipaments");
const visits = require("./routes/visits");
const notifications = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(passaport.initialize());
require("../config/passaport")(passaport);

app.use(express.json());
app.use(users);
app.use(customers);
app.use(resales);
app.use(core);
app.use(assistances);
app.use(equipaments);
app.use(visits);
app.use(notifications);
app.use(errors());

module.exports = app;
