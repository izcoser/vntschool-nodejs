import { readFile, writeFile } from "node:fs";

const filename = "clientes.json";
const format = "utf8";

const camposCliente = ["nome", "sobrenome", "endereco", "cpf", "telefone"];
const camposClienteObrigatorios = ["nome", "sobrenome", "cpf"];

// Recebe um método de rota (POST, DELETE, PATCH)
// e um dado (Object ou string) e verifica está
// faltando algum dado para a rota.
const verificaAtributos = (metodo, dado) => {
  switch (metodo) {
    case "POST":
      const possuiCamposObrigatorios = camposClienteObrigatorios.every((item) =>
        dado.hasOwnProperty(item)
      );
      if (possuiCamposObrigatorios) {
        return [true, ""];
      } else {
        return [
          false,
          "O cadastro de um cliente requer os campos: " +
            camposClienteObrigatorios.join(", ") +
            ".",
        ];
      }
    case "DELETE":
      // Verificando se foi passado o CPF.
      if (dado.length > 0) {
        return [true, ""];
      } else {
        return [false, "É necessário passar o CPF. (DELETE /cliente/{cpf})"];
      }
    case "PATCH":
      // Verificando se há uma chave e no mínimo um campo para ser atualizado.
      if (
        dado.hasOwnProperty("key") &&
        camposCliente.some((item) => dado.hasOwnProperty(item))
      ) {
        return [true, ""];
      } else {
        return [
          false,
          "É necessário passar o CPF (key) e ao menos um dos campos: " +
            camposCliente.join(", ") +
            ".",
        ];
      }
  }
};

const lerClientes = (res) => {
  readFile(filename, format, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
};

const cadastrarCliente = (cliente, res) => {
  readFile(filename, format, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const arquivo = JSON.parse(data);
      const clienteObj = JSON.parse(cliente);

      const [ok, erro] = verificaAtributos("POST", clienteObj);

      if (erro) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: erro }));
        return;
      }

      arquivo.clientes.push(clienteObj);
      writeFile(filename, JSON.stringify(arquivo), (err) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify(clienteObj));
        }
      });
    }
  });
};

const atualizarCliente = (novosDados, res) => {
  readFile(filename, format, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const arquivo = JSON.parse(data);
      const novosDadosObj = JSON.parse(novosDados);

      const [ok, erro] = verificaAtributos("PATCH", novosDadosObj);

      if (erro) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: erro }));
        return;
      }

      const cliente = arquivo.clientes.find((c) => c.cpf === novosDadosObj.key);

      if (cliente) {
        for (const key in novosDadosObj) {
          if (key in cliente) {
            cliente[key] = novosDadosObj[key];
          }
        }

        writeFile(filename, JSON.stringify(arquivo), (err) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.statusCode = 200;
            res.end(JSON.stringify(cliente));
          }
        });
      } else {
        res.statusCode = 404;
        res.end(
          JSON.stringify({
            error: `Cliente com CPF ${novosDadosObj.key} não encontrado.`,
          })
        );
      }
    }
  });
};

const deletarCliente = (cpfCliente, res) => {
  readFile(filename, format, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    } else {
      const arquivo = JSON.parse(data);

      const [ok, erro] = verificaAtributos("DELETE", cpfCliente);

      if (erro) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: erro }));
        return;
      }

      // Filtra a lista de clientes, removendo aquele que tem o CPF especificado.
      const novoClientes = arquivo.clientes.filter((c) => c.cpf !== cpfCliente);

      if (novoClientes.length < arquivo.clientes.length) {
        arquivo.clientes = novoClientes;
        writeFile(filename, JSON.stringify(arquivo), (err) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                msg: `Cliente de cpf ${cpfCliente} deletado com sucesso!`,
              })
            );
          }
        });
      } else {
        res.statusCode = 404;
        res.end(
          JSON.stringify({
            error: `Cliente com CPF ${cpfCliente} não encontrado.`,
          })
        );
      }
    }
  });
};

const rotas = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  req.on("error", (e) => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Erro na requisição: " + e.message }));
    return;
  });

  if (req.method === "GET") {
    lerClientes(res);
    return;
  }
  if (req.method === "POST") {
    let corpo = [];
    req.on("data", (chunk) => {
      corpo.push(chunk);
    });
    req.on("end", () => {
      cadastrarCliente(corpo, res);
    });
    return;
  }
  if (req.method === "PATCH") {
    let corpo = [];
    req.on("data", (chunk) => {
      corpo.push(chunk);
    });
    req.on("end", () => {
      atualizarCliente(corpo, res);
    });
    return;
  }
  if (req.method === "DELETE") {
    const cpf = req.url.split("/").at(-1);
    deletarCliente(cpf, res);
    return;
  }

  res.statusCode = 404;
  res.end(
    JSON.stringify({ error: `Rota ${req.method} ${req.url} não encontrada.` })
  );
};

export { rotas };
