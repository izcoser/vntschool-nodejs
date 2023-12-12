const express = require("express");
const { sequelize } = require("./models");
const {
  handleLerCliente,
  handleAtualizarCliente,
  handleDeleteCliente,
  handleCadastrarCliente,
} = require("./handlers");

const ROUTES = {
  CADASTRAR: "/cadastrarCliente",
  LER: "/lerCliente",
  ATUALIZAR: "/atualizarCliente",
  DELETAR: "/deletarCliente",
};

const port = 3000;
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

(async () => {
  await sequelize.sync();
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
