import { readFile, writeFile } from "node:fs";

const filename = "clientes.json";
const format = "utf8";

const lerClientes = (res) => {
  readFile(filename, format, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err.message }));
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(data);
    }
  });
};

const cadastrarCliente = (cliente, res) => {
  readFile(filename, format, (err, d) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const data = JSON.parse(d);
      data.clientes.push(JSON.parse(cliente));
      writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: err.message }));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(cliente));
        }
      });
    }
  });
};

const atualizarCliente = (novosDados, res) => {
  readFile(filename, format, (err, d) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const data = JSON.parse(d);
      const novosDadosObj = JSON.parse(novosDados);
      const cliente = data.clientes.find((c) => c.cpf === novosDadosObj.key);

      if (cliente) {
        for (const key in novosDadosObj) {
          if (key in cliente) {
            cliente[key] = novosDadosObj[key];
          }
        }

        writeFile(filename, JSON.stringify(data), (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(cliente));
          }
        });
      }
    }
  });
};

const deletarCliente = (cpfCliente, res) => {
  readFile(filename, format, (err, d) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const data = JSON.parse(d);
      const newData = data.clientes.filter((c) => c.cpf !== cpfCliente);

      if (newData.length < data.clientes.length) {
        data.clientes = newData;
        writeFile(filename, JSON.stringify(data), (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                msg: `Cliente de cpf ${cpfCliente} deletado com sucesso!`,
              })
            );
          }
        });
      }
    }
  });
};

const handleRequest = (req, res) => {
  if (req.method === "GET" && req.url === "/ler-clientes") {
    lerClientes(res);
  } else if (req.method === "POST" && req.url === "/cadastrar-cliente") {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      cadastrarCliente(cliente, res);
    });
  } else if (req.method === "PATCH" && req.url === "/atualizar-cliente") {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      atualizarCliente(cliente, res);
    });
  } else if (req.method === "DELETE" && req.url.includes("/deletar-cliente")) {
    const cpf = req.url.split("/").at(-1);
    deletarCliente(cpf, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("404, rota inexistente.\n");
  }
};

export { handleRequest };
