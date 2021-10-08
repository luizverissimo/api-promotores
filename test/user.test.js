const request = require("supertest");
const app = require("../src/app");
const connection = require("../src/database/connection");

describe("User", () => {
  beforeEach(async () => {
    await connection.migrate.latest();
  });

  it("should be able to create a new user.", async () => {
    const response = await request(app).post("/user").send({
      name: "Luiz Verissimo",
      email: "luizverissimosouza@gmail.com",
      password: "Aas1dasd",
      operational_area: 1,
      avatar: "http://localhost/imagens/1.jpg",
      phone: 5548999491633,
    });

    console.log(response.body);
  });
});
