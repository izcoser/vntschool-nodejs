const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");
const Cliente = sequelize.define("Cliente", {
  nome: Sequelize.STRING,
  sobrenome: Sequelize.STRING,
  cpf: Sequelize.STRING,
  telefone: Sequelize.STRING,
});

const Endereco = sequelize.define("Endereco", {
  logradouro: Sequelize.STRING,
  numero: Sequelize.DATE,
  complemento: Sequelize.STRING,
  bairro: Sequelize.STRING,
  cidade: Sequelize.STRING,
  estado: Sequelize.STRING,
  cep: Sequelize.STRING,
});

Cliente.hasOne(Endereco, { as: "endereco" });

const insertClient = async (clientData) => {
  const {
    nome,
    sobrenome,
    cpf,
    telefone,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
  } = clientData;

  console.log({ clientData });

  sequelize
    .transaction(async (t) => {
      const endereco = await Endereco.create(
        { logradouro, numero, complemento, bairro, cidade, estado, cep },
        { transaction: t }
      );

      const client = await Cliente.create({
        nome,
        sobrenome,
        cpf,
        telefone,
      });

      await client.setEndereco(endereco, { transaction: t });
    })
    .then((result) => {
      console.log("Novo cliente adicionado: ", result);
    })
    .catch((error) => {
      console.error("Erro ao adicionar cliente:", error);
    });
};

module.exports = { sequelize, Cliente, insertClient };
