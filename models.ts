import Sequelize, { Error, Transaction } from "sequelize";

// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./db.sqlite",
//   transactionType: "IMMEDIATE",
// });

//@ts-ignore
const sequelize = new Sequelize("sqlite::memory:");
const Cliente = sequelize.define("Cliente", {
  nome: Sequelize.STRING,
  sobrenome: Sequelize.STRING,
  cpf: Sequelize.STRING,
  telefone: Sequelize.STRING,
});

const Endereco = sequelize.define("Endereco", {
  logradouro: Sequelize.STRING,
  numero: Sequelize.STRING,
  complemento: Sequelize.STRING,
  bairro: Sequelize.STRING,
  cidade: Sequelize.STRING,
  estado: Sequelize.STRING,
  cep: Sequelize.STRING,
});

Cliente.hasOne(Endereco, { as: "endereco" });

const insertClient = async (clientData: ClientData) => {
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

  await sequelize
    .transaction(async (t: Transaction) => {
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
    .then(() => {
      console.log("Novo cliente adicionado.");
    })
    .catch((error: Error) => {
      console.error("Erro ao adicionar cliente:", error);
    });
};

const readClient = async (cpf: string) => {
  console.log("Obtendo cliente com cpf ", cpf);
  const client = await Cliente.findOne({
    where: { cpf },
    include: "endereco",
  });
  if (client) {
    console.log("Cliente encontrado: ", client.toJSON());
    return client;
  } else {
    console.log("Cliente não encontrado.");
    return null;
  }
};

const updateClient = async (cpf: string, updateData: Partial<ClientData>) => {
  console.log("Obtendo cliente com cpf ", cpf);
  console.log({ updateData });
  const client = await Cliente.findOne({
    where: { cpf },
    include: "endereco",
  });
  if (client) {
    console.log("Cliente encontrado, realizando update.");
    for (const key in updateData) {
      if (key in client) {
        client[key] = updateData[key as keyof ClientData];
      } else if (client.endereco && key in client.endereco) {
        client.endereco[key] = updateData[key as keyof ClientData];
      }
    }
    await client.save();
    return client;
  } else {
    console.log("Cliente não encontrado.");
    return null;
  }
};

const deleteClient = async (cpf: string) => {
  console.log("Obtendo cliente com cpf ", cpf);

  const client = await Cliente.findOne({
    where: { cpf },
    include: "endereco",
  });
  if (client) {
    console.log("Cliente encontrado, deletando..");
    if (client.endereco) {
      await client.endereco.destroy();
    }
    await client.destroy();
    return true;
  } else {
    console.log("Cliente não encontrado.");
    return false;
  }
};

export{
  sequelize,
  Cliente,
  insertClient,
  readClient,
  updateClient,
  deleteClient,
}