import express from "express";
import { sequelize } from "./models.js";
import { handleLerCliente, handleAtualizarCliente, handleDeleteCliente, handleCadastrarCliente } from "./handlers.js";

const ROUTES = {
  CADASTRAR: "/cadastrarCliente",
  LER: "/lerCliente",
  ATUALIZAR: "/atualizarCliente",
  DELETAR: "/deletarCliente",
};

const port = 3000;
const app = express();
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert {type: "json"};

(async () => {
  await sequelize.sync();
  app.use('/docs', serve, setup(swaggerDocument));

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
