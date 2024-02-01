import { readFileSync, writeFileSync } from "node:fs";

const filename = "clientes.json";
const format = "utf8";

const lerClientes = () => {
  try {
    const data = readFileSync(filename, { encoding: format });
    return data;
  } catch (err) {
    console.error(err);
    return `Erro ao ler clientes: ${err}.`;
  }
};

const cadastrarCliente = (cliente) => {
  try {
    const data = JSON.parse(readFileSync(filename, { encoding: format }));
    data.clientes.push(JSON.parse(cliente));
    writeFileSync(filename, JSON.stringify(data), { encoding: format });
    return `Cliente cadastrado com sucesso: ${JSON.stringify(cliente)}`;
  } catch (err) {
    console.error(err);
    return `Erro ao cadastrar cliente: ${err}.`;
  }
};

const atualizarCliente = (novosDados) => {
  try {
    const data = JSON.parse(readFileSync(filename, { encoding: format }));
    const novosDadosObj = JSON.parse(novosDados);
    const cliente = data.clientes.find((c) => c.cpf === novosDadosObj.key);
    if (cliente) {
      for (const key in novosDadosObj) {
        if (key in cliente) {
          cliente[key] = novosDadosObj[key];
        }
      }
      writeFileSync(filename, JSON.stringify(data), { encoding: format });
      return `Cliente atualizado com sucesso: ${JSON.stringify(cliente)}`;
    } else {
      return `Cliente com CPF ${novosDadosObj.key} não encontrado.`;
    }
  } catch (err) {
    console.error(err);
    return `Erro ao atualizar cliente: ${err}.`;
  }
};

const deletarCliente = (cpfCliente) => {
  try {
    const data = JSON.parse(readFileSync(filename, { encoding: format }));
    const newData = data.clientes.filter((c) => c.cpf !== cpfCliente);
    if (newData.length < data.clientes.length) {
      data.clientes = newData;
      writeFileSync(filename, JSON.stringify(data), { encoding: format });
      return `Cliente com CPF ${cpfCliente} deletado.`;
    } else {
      return `Cliente com CPF ${cpfCliente} não encontrado.`;
    }
  } catch (err) {
    console.error(err);
    return `Erro ao deletar cliente: ${err}.`;
  }
};

const handleRequest = (req, res) => {
  if (req.method === "GET" && req.url === "/ler-clientes") {
    const contents = lerClientes();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    console.log(contents);
    res.end(contents);
  } else if (req.method === "POST" && req.url === "/cadastrar-cliente") {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      const contents = cadastrarCliente(cliente);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(contents);
    });
  } else if (req.method === "PATCH" && req.url === "/atualizar-cliente") {
    let cliente = "";
    req.on("data", (chunk) => {
      cliente += chunk;
    });
    req.on("end", () => {
      const contents = atualizarCliente(cliente);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(contents);
    });
  } else if (req.method === "DELETE" && req.url.includes("/deletar-cliente")) {
    const cpf = req.url.split("/").at(-1);
    const contents = deletarCliente(cpf);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(contents);
  }
  else{
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end("404, rota inexistente.\n");
  }
};

export { handleRequest };
