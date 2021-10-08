const app = require("./app");

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Sever listening on port: ${PORT}`);
});
