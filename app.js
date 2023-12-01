const http = require("node:http");
const fs = require("node:fs");

const read = (file) => {
  try {
    const data = fs.readFileSync("clientes.json", "utf8");
    return data;
  } catch (err) {
    console.error(err);
    return `Arquivo ${file} não encontrado.`;
  }
};

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/clientes") {
    const contents = read("clientes.json");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(contents);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
