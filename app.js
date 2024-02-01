import { createServer } from "node:http";
import { sequelize } from "./models.js";
import { handleRequest } from "./routes.js";

const hostname = "127.0.0.1";
const port = 3000;

(async () => {
  await sequelize.sync();

  const server = createServer(async (req, res) => {
    handleRequest(req, res);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
