import {
  readClient,
  updateClient,
  deleteClient,
  insertClient,
} from "./models.js";

const camposCliente = [
  "nome",
  "sobrenome",
  "endereco",
  "cpf",
  "telefone",
  "cep",
];
const camposClienteObrigatorios = ["nome", "sobrenome", "cpf", "cep"];

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

const lerClientes = async (res) => {
  const [clientes, erro] = await readClient();
  if (erro) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erro }));
  } else {
    res.statusCode = 200;
    console.log(clientes);
    res.end(clientes);
  }
};

const cadastrarCliente = async (cliente, res) => {
  const clienteObj = JSON.parse(cliente);
  const [ok, erro] = verificaAtributos("POST", clienteObj);

  if (erro) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erro }));
    return;
  }

  const [novoCliente, erroCliente] = await insertClient(clienteObj);

  if (erroCliente) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erroCliente }));
  } else {
    res.statusCode = 200;
    res.end(JSON.stringify(novoCliente));
  }
};

const atualizarCliente = async (novosDados, res) => {
  const novosDadosObj = JSON.parse(novosDados);
  const [ok, erro] = verificaAtributos("PATCH", novosDadosObj);

  if (erro) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erro }));
    return;
  }

  const [clienteAtualizado, erroAtualizar] = await updateClient(novosDadosObj.key);

  if (erroAtualizar) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erroAtualizar }));
  } else {
    res.statusCode = 200;
    res.end(JSON.stringify(clienteAtualizado));
  }
};

const deletarCliente = async (cpfCliente, res) => {
  const [ok, erro] = verificaAtributos("DELETE", cpfCliente);

  if (erro) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erro }));
    return;
  }

  const [success, erroDeletar] = await deleteClient(cpfCliente);

  if (erroDeletar) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: erroDeletar }));
  } else {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        msg: `Cliente de cpf ${cpfCliente} deletado com sucesso!`,
      })
    );
  }
};

const rotas = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  req.on("error", (e) => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Erro na requisição: " + e.message }));
    return;
  });

  if (req.method === "GET") {
    await lerClientes(res);
    return;
  }
  if (req.method === "POST") {
    let corpo = [];
    req.on("data", (chunk) => {
      corpo.push(chunk);
    });
    req.on("end", async () => {
      await cadastrarCliente(corpo, res);
    });
    return;
  }
  if (req.method === "PATCH") {
    let corpo = [];
    req.on("data", (chunk) => {
      corpo.push(chunk);
    });
    req.on("end", async () => {
      await atualizarCliente(corpo, res);
    });
    return;
  }
  if (req.method === "DELETE") {
    const cpf = req.url.split("/").at(-1);
    await deletarCliente(cpf, res);
    return;
  }

  res.statusCode = 404;
  res.end(
    JSON.stringify({ error: `Rota ${req.method} ${req.url} não encontrada.` })
  );
};

export { rotas };
