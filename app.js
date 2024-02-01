import { createServer } from "node:http";
import { handleRequest } from "./routes.js";
import { sequelize } from "./models.js";

const hostname = "127.0.0.1";
const port = 3000;

(async () => {
  await sequelize.sync();
  const server = createServer((req, res) => {
    handleRequest(req, res);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();