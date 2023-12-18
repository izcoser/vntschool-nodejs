import express, { Request, Response } from "express";
import { sequelize } from "./models";
import { handleLerCliente, handleAtualizarCliente, handleDeleteCliente, handleCadastrarCliente } from "./handlers";


const ROUTES = {
  CADASTRAR: "/cadastrarCliente",
  LER: "/lerCliente",
  ATUALIZAR: "/atualizarCliente",
  DELETAR: "/deletarCliente",
};

const port = 3000;
const app = express();
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

(async () => {
  await sequelize.sync();
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.post(ROUTES.CADASTRAR, async (req: Request, res: Response) => {
    await handleCadastrarCliente(req, res);
  });

  app.get(`${ROUTES.LER}/:cpf`, async (req: Request, res: Response) => {
    await handleLerCliente(req, res);
  });

  app.post(ROUTES.ATUALIZAR, async (req: Request, res: Response) => {
    await handleAtualizarCliente(req, res);
  });

  app.delete(`${ROUTES.DELETAR}/:cpf`, async (req: Request, res: Response) => {
    await handleDeleteCliente(req, res);
  });

  app.listen(port, () => {
    console.log(`App escutando na porta ${port}.`);
  });
})();
