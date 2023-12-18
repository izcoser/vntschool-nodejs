const fetch = require("node-fetch");

const baseUrl = "http://127.0.0.1:3000";

const clienteExemplo = {
  nome: "TestNome",
  sobrenome: "TestSobrenome",
  cpf: "TestCPF",
  telefone: "TestTelefone",
  logradouro: "TestLogradouro",
  numero: "TestNumero",
  complemento: "TestComplemento",
  bairro: "TestBairro",
  cidade: "TestCidade",
  estado: "TestEstado",
  cep: "TestCEP",
};

const makePostRequest = async (url: string, data: Object) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const makeGetRequest = async (url: string) => {
  try {
    const response = await fetch(url);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const makeDeleteRequest = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Jest tests
describe("API Tests", () => {
  test("Cadastrar Cliente Test", async () => {
    const data = clienteExemplo;

    const result = await makePostRequest(`${baseUrl}/cadastrarCliente`, data);
    const text = await result.text();
    expect(text).toEqual("Cliente adicionado.");
    expect(result.status).toEqual(200);
  });

  test("Cadastrar Cliente Error Test", async () => {
    const data = {
      sobrenome: "TestSobrenome", // Faltando o nome do cliente, deve falhar.
      cpf: "TestCPF",
      telefone: "TestTelefone",
      logradouro: "TestLogradouro",
      numero: "TestNumero",
      complemento: "TestComplemento",
      bairro: "TestBairro",
      cidade: "TestCidade",
      estado: "TestEstado",
      cep: "TestCEP",
    };

    const missingField = "nome";
    const result = await makePostRequest(`${baseUrl}/cadastrarCliente`, data);
    const text = await result.text();
    expect(text).toEqual(
      `Campo ${missingField} não encontrado, cliente não pode ser cadastrado.`
    );
    expect(result.status).toEqual(400);
  });

  test("Ler Cliente Test", async () => {
    const result = await makeGetRequest(
      `${baseUrl}/lerCliente/${clienteExemplo.cpf}`
    );
    const cliente = await result.json();
    for (const key in clienteExemplo) {
      if (key in cliente) {
        expect(cliente[key]).toEqual(clienteExemplo[key as keyof ClientData]);
      } else if (cliente.endereco && key in cliente.endereco) {
        expect(cliente.endereco[key]).toEqual(clienteExemplo[key as keyof ClientData]);
      }
    }
    expect(result.status).toEqual(200);
  });

  test("Ler Cliente Error", async () => {
    const wrongCpf = "123123";
    const result = await makeGetRequest(`${baseUrl}/lerCliente/${wrongCpf}`);
    const text = await result.text();
    expect(text).toEqual("Cliente não encontrado.");

    expect(result.status).toEqual(404);
  });

  test("Atualizar Cliente Test", async () => {
    const updateData: Partial<ClientData> & {key: string } = {
      nome: "UpdatedNome",
      sobrenome: "UpdatedSobrenome",
      telefone: "UpdatedTelefone",
      key: clienteExemplo.cpf,
    };

    const result = await makePostRequest(
      `${baseUrl}/atualizarCliente`,
      updateData
    );

    const updatedCliente = await result.json();
    for(const key in updateData){
      key != "key" && expect(updatedCliente[key]).toEqual(updateData[key as keyof ClientData]);
    }
    
    expect(result.status).toEqual(200);
  });

  test("Atualizar Cliente Test Error", async () => {
    const wrongCpf = "123123";
    const updateData = {
      nome: "UpdatedNome",
      sobrenome: "UpdatedSobrenome",
      telefone: "UpdatedTelefone",
      key: wrongCpf,
    };

    const result = await makePostRequest(
      `${baseUrl}/atualizarCliente`,
      updateData
    );

    const text = await result.text();
    expect(text).toEqual("Cliente não encontrado.");
    
    expect(result.status).toEqual(404);
  });
  
  test("Deletar Cliente Test", async () => {
    const result = await makeDeleteRequest(`${baseUrl}/deletarCliente/TestCPF`);
    const text = await result.text();
    expect(text).toEqual("Cliente deletado.");
    expect(result.status).toEqual(200);
  });

  test("Deletar Cliente Test", async () => {
    const wrongCpf = "123123";
    const result = await makeDeleteRequest(`${baseUrl}/deletarCliente/${wrongCpf}`);
    const text = await result.text();
    expect(text).toEqual("Cliente não encontrado.");
    expect(result.status).toEqual(404);
  });

});

export {};