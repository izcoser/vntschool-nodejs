const http = require("node:http");
const fs = require("node:fs");
const { sequelize, Client, insertClient } = require("./models");

const read = (file) => {
  try {
    const data = fs.readFileSync("clientes.json", "utf8");
    return data;
  } catch (err) {
    console.error(err);
    return `Arquivo ${file} não encontrado.`;
  }
};

const hostname = "127.0.0.1";
const port = 3000;

(async () => {
  await sequelize.sync();

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/clientes") {
      const contents = read("clientes.json");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(contents);
    } else if (req.method === "GET" && req.url === "/cadastrarClientes") {
      insertClient({
        nome: "A",
        sobrenome: "B",
        cpf: "C",
        telefone: "D",
        logradouro: "E",
        numero: "F",
        complemento: "G",
        bairro: "H",
        cidade: "I",
        estado: "J",
        cep: "K",
      });

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Cliente adicionado.");
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
