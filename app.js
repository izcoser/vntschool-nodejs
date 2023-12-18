import { createServer } from "node:http";
import { sequelize, insertClient, readClient, updateClient, deleteClient } from "./models.js";

const hostname = "127.0.0.1";
const port = 3000;

const handleCadastrarCliente = async (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", async () => {
    try {
      console.log("Cadastrando cliente...");
      const fullData = JSON.parse(data);

      console.log({ fullData });
      await insertClient(fullData);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Cliente adicionado.");
    } catch (e) {
      console.log(e);
    }
  });
};

const handleLerCliente = async (req, res) => {
  const cpf = req.url.split("/").at(-1);
  console.log({cpf});
  const client = await readClient(cpf);
  console.log({client});
  if (client) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(client.toJSON()));
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.end("Cliente não encontrado.");
  }
};

const handleAtualizarCliente = async (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", async () => {
    try {
      const fullData = JSON.parse(data);
      console.log({ fullData });
      const client = await updateClient(fullData.key, fullData);
      if (client) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(client.toJSON()));
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.end("Cliente não encontrado.");
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Cliente adicionado.");
    } catch (e) {
      console.log(e);
    }
  });
};

const handleDeleteCliente = async (req, res) => {
  const cpf = req.url.split("/").at(-1);
  const success = await deleteClient(cpf);
  res.setHeader("Content-Type", "text/plain");
  if (success) {
    res.end("Cliente deletado.");
  } else {
    res.end("Cliente não encontrado.");
  }
};

(async () => {
  await sequelize.sync();

  const server = createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/cadastrarCliente") {
      await handleCadastrarCliente(req, res);
    } else if (req.method === "GET" && req.url.includes("/lerCliente")) {
      await handleLerCliente(req, res);
    } else if (req.method === "POST" && req.url === "/atualizarCliente") {
      await handleAtualizarCliente(req, res);
    } else if (req.method === "DELETE" && req.url.includes("/deletarCliente")) {
      await handleDeleteCliente(req, res);
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
