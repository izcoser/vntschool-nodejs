import {
  insertClient,
  readClient,
  updateClient,
  deleteClient,
} from "./models.js";

const ROUTES = {
  CADASTRAR: "/cadastrar-cliente",
  LER: "/ler-clientes",
  ATUALIZAR: "/atualizar-cliente",
  DELETAR: "/deletar-cliente",
};

const verifyData = (data) => {
  for (const field of [
    "nome",
    "sobrenome",
    "cpf",
    "telefone",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
    "cep",
  ]) {
    if (!(field in data)) {
      return [false, field];
    }
  }
  return [true, ""];
};

const handleCadastrarCliente = async (cliente, res) => {
  try {
    console.log("Cadastrando cliente...");
    const fullData = JSON.parse(cliente);
    const [validData, missingField] = verifyData(fullData);
    if (validData) {
      console.log({ fullData });
      await insertClient(fullData);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Cliente adicionado.");
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end(
        `Campo ${missingField} não encontrado, cliente não pode ser cadastrado.`
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const handleLerClientes = async (res) => {
  const clients = await readClient();
  console.log({ clients });
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(clients));
};

const handleAtualizarCliente = async (data, res) => {
    console.log("XXXXXXXXXXXXXXX");
    try {
    console.log(data);
    const fullData = JSON.parse(data);
    console.log({ fullData });
    const client = await updateClient(fullData.key, fullData);
    if (client) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(client.toJSON()));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ msg: "Cliente não encontrado." }));
    }
  } catch (e) {
    console.log(e);
  }
};

const handleDeleteCliente = async (cpfCliente, res) => {
  const success = await deleteClient(cpfCliente);
  res.setHeader("Content-Type", "text/plain");
  if (success) {
    res.end("Cliente deletado.");
  } else {
    res.end("Cliente não encontrado.");
  }
};

const handleRequest = async (req, res) => {
  if (req.method === "GET" && req.url === ROUTES.LER) {
    handleLerClientes(res);
  } else if (req.method === "POST" && req.url === ROUTES.CADASTRAR) {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      handleCadastrarCliente(cliente, res);
    });
  } else if (req.method === "PATCH" && req.url === ROUTES.ATUALIZAR) {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      handleAtualizarCliente(cliente, res);
    });
  } else if (req.method === "DELETE" && req.url.includes(ROUTES.DELETAR)) {
    const cpf = req.url.split("/").at(-1);
    handleDeleteCliente(cpf, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("404, rota inexistente.\n");
  }
};

export { handleRequest };
