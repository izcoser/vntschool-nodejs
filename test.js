import fetch from "node-fetch";

const baseUrl = "http://127.0.0.1:3000";

// Test for POST /cadastrarCliente
const cadastrarClienteTest = async () => {
  const data = {
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

  try {
    const response = await fetch(`${baseUrl}/cadastrarCliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test for POST /cadastrarCliente
const cadastrarClienteTestErro = async () => {
  const data = {
    sobrenome: "TestSobrenome", // faltando o nome do cliente.
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

  try {
    const response = await fetch(`${baseUrl}/cadastrarCliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test for GET /lerCliente
const lerClienteTest = async () => {
  try {
    const response = await fetch(`${baseUrl}/lerCliente/TestCPF`);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test for POST /atualizarCliente
const atualizarClienteTest = async () => {
  const updateData = {
    nome: "UpdatedNome",
    sobrenome: "UpdatedSobrenome",
    telefone: "UpdatedTelefone",
    key: "TestCPF",
  };

  try {
    const response = await fetch(`${baseUrl}/atualizarCliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Test for DELETE /deletarCliente
const deletarClienteTest = async () => {
  try {
    const response = await fetch(`${baseUrl}/deletarCliente/TestCPF`, {
      method: "DELETE",
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Run the tests
(async () => {
  await cadastrarClienteTest();
  await cadastrarClienteTestErro();
  await lerClienteTest();
  await atualizarClienteTest();
  await deletarClienteTest();
})();
