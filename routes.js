import {
  insertClient,
  readClient,
  updateClient,
  deleteClient,
} from "./models.js";

const handleCadastrarCliente = async (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", async () => {
    try {
      res.setHeader("Content-Type", "application/json");
      console.log("Cadastrando cliente...");
      const fullData = JSON.parse(data);

      console.log({ fullData });
      await insertClient(fullData);
      res.statusCode = 200;

      res.end("Cliente adicionado.");
    } catch (e) {
      console.log(e);
    }
  });
};

const handleLerCliente = async (req, res) => {
  const cpf = req.url.split("/").at(-1);
  console.log({ cpf });
  const client = await readClient(cpf);
  console.log({ client });
  res.setHeader("Content-Type", "application/json");
  if (client) {
    res.end(JSON.stringify(client.toJSON()));
  } else {
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
      res.setHeader("Content-Type", "application/json");
      if (client) {
        res.statusCode = 200;
        res.end(JSON.stringify(client.toJSON()));
      } else {
        res.statusCode = 404;
        res.end("Cliente não encontrado.");
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const handleDeleteCliente = async (req, res) => {
  const cpf = req.url.split("/").at(-1);
  const success = await deleteClient(cpf);
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  if (success) {
    res.end("Cliente deletado.");
  } else {
    res.end("Cliente não encontrado.");
  }
};

const handleRequest = async (req, res) => {
  if (req.method === "POST" && req.url === "/cadastrar-cliente") {
    await handleCadastrarCliente(req, res);
  } else if (req.method === "GET" && req.url.includes("/ler-cliente")) {
    await handleLerCliente(req, res);
  } else if (req.method === "PATCH" && req.url === "/atualizar-cliente") {
    await handleAtualizarCliente(req, res);
  } else if (req.method === "DELETE" && req.url.includes("/deletar-cliente")) {
    await handleDeleteCliente(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("404, rota inexistente.\n");
  }
};

export { handleRequest };
