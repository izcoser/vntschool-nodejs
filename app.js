import { createServer } from "node:http";
import { rotas } from "./routes.js";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  rotas(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Servidor executando em http://${hostname}:${port}/`);
});
