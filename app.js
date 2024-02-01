import { createServer } from "node:http";
import { handleRequest } from "./routes.js";

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
