import express from "express";
import { sequelize, insertClient, readClient, updateClient, deleteClient } from "./models.js";

const ROUTES = {
  CADASTRAR: "/cadastrarCliente",
  LER: "/lerCliente",
  ATUALIZAR: "/atualizarCliente",
  DELETAR: "/deletarCliente",
};

const port = 3000;

const app = express();

const verifyData = (data) => {
  for (const field of [
    "nome",
    "sobrenome",
    "cpf",
    "telefone",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
    "cep",
  ]) {
    if (!(field in data)) {
      return [false, field];
    }
  }
  return [true, ""];
};

const handleCadastrarCliente = async (req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", async () => {
    try {
      console.log("Cadastrando cliente...");
      const fullData = JSON.parse(data);
      const [validData, missingField] = verifyData(fullData);
      if (validData) {
        console.log({ fullData });
        await insertClient(fullData);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Cliente adicionado.");
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end(
          `Campo ${missingField} não encontrado, cliente não pode ser cadastrado.`
        );
      }
    } catch (e) {
      console.log(e);
    }
  });
};

const handleLerCliente = async (req, res) => {
  const cpf = req.params.cpf;
  console.log({ cpf });
  const client = await readClient(cpf);
  console.log({ client });
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
  const cpf = req.params.cpf;
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

  app.post(ROUTES.CADASTRAR, async (req, res) => {
    await handleCadastrarCliente(req, res);
  });

  app.get(`${ROUTES.LER}/:cpf`, async (req, res) => {
    await handleLerCliente(req, res);
  });

  app.post(ROUTES.ATUALIZAR, async (req, res) => {
    await handleAtualizarCliente(req, res);
  });

  app.delete(`${ROUTES.DELETAR}/:cpf`, async (req, res) => {
    await handleDeleteCliente(req, res);
  });

  app.listen(port, () => {
    console.log(`App escutando na porta ${port}.`);
  });
})();
