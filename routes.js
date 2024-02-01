import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./tic.db ", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Conectado ao banco de dados SQLite.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        sobrenome TEXT,
        endereco TEXT,
        cpf TEXT,
        telefone TEXT
    )
`);

const lerClientes = (res) => {
  db.all("SELECT * FROM clientes", [], (err, rows) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
};

const cadastrarCliente = (cliente, res) => {
  const { nome, sobrenome, endereco, cpf, telefone } = JSON.parse(cliente);

  if (!cpf) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "É necessário passar o CPF." }));
  } else {
    db.run(
      "INSERT INTO clientes (nome, sobrenome, endereco, cpf, telefone) VALUES (?,?,?,?,?)",
      [nome, sobrenome, endereco, cpf, telefone],
      function (err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              id: this.lastID,
              nome,
              sobrenome,
              endereco,
              cpf,
              telefone,
            })
          );
        }
      }
    );
  }
};

const atualizarCliente = (novosDados, res) => {
  const clienteObj = JSON.parse(novosDados);
  if (!clienteObj.key) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "É necessário o CPF do cliente (chave) que deseja atualizar.",
      })
    );
  } else {
    const keys = Object.keys(clienteObj).filter((k) => k !== "key");
    const values = [];
    let updateString = "UPDATE clientes SET ";
    for (const k of keys) {
      updateString += `${k} = ?,`;
      values.push(clienteObj[k]);
    }
    updateString = updateString.slice(0, -1);
    updateString += "WHERE cpf = ?";
    values.push(clienteObj.key);

    db.run(updateString, values, function (err) {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: this.lastID, clienteObj }));
      }
    });
  }
};

const deletarCliente = (cpfCliente, res) => {
  if (!cpfCliente) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "É necessário passar o CPF." }));
  } else {
    db.run("DELETE FROM clientes WHERE cpf = ?", [cpfCliente], function (err) {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            msg: `Cliente com cpf ${cpfCliente} deletado`,
          })
        );
      }
    });
  }
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
