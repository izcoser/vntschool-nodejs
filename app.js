import { createServer } from "node:http";
import { readFile } from 'node:fs';

const hostname = "127.0.0.1";
const port = 3000;

readFile("./clientes.json", "utf-8", (erro, conteudo) => {
  if (erro) {
    console.log("Falha na leitura do arquivo", erro);
    return;
  }

  console.log(`Conteúdo: ${conteudo}`);

  const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json; charset=utf-8");
    res.end(conteudo);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
