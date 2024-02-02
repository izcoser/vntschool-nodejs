import { Sequelize } from "sequelize";

// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./db.sqlite",
//   transactionType: "IMMEDIATE",
// });

const sequelize = new Sequelize('sqlite::memory:');
const Cliente = sequelize.define("Cliente", {
  nome: Sequelize.STRING,
  sobrenome: Sequelize.STRING,
  cpf: Sequelize.STRING,
  telefone: Sequelize.STRING,
});

const Endereco = sequelize.define("Endereco", {
  numero: Sequelize.STRING,
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
    numero,
    bairro,
    cidade,
    estado,
    cep,
  } = clientData;

  console.log({ clientData });

  try {
    const cliente = await sequelize.transaction(async (t) => {
      const endereco = await Endereco.create(
        { numero, bairro, cidade, estado, cep },
        { transaction: t }
      );
  
      const client = await Cliente.create({
        nome,
        sobrenome,
        cpf,
        telefone,
      });
  
      await client.setEndereco(endereco, { transaction: t });
  
      return client;
    });
  
    console.log("Novo cliente adicionado.");
    return [cliente, ""];
  } catch (error) {
    console.error("Erro ao adicionar cliente: ", error.message);
    return [null, "Erro ao adicionar cliente: ", error.message];
  }
  
};

const readClient = async () => {
  try {
    const clients = await Cliente.findAll({
      include: "endereco",
      raw: true,
    });
    return [JSON.stringify(clients), ""];
  } catch (err) {
    return [[], err.message];
  }
};

const updateClient = async (cpf, updateData) => {
  try {
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
          client[key] = updateData[key];
        } else if (client.endereco && key in client.endereco) {
          client.endereco[key] = updateData[key];
        }
      }
      await client.save();
      return [client, ""];
    } else {
      console.log(`Cliente com CPF ${cpf} não encontrado.`);
      return [null, `Cliente com CPF ${cpf} não encontrado.`];
    }
  } catch (err) {
    return [null, err.message];
  }
};

const deleteClient = async (cpf) => {
  try {
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
      return [true, ""];
    } else {
      console.log(`Cliente com CPF ${cpf} não encontrado.`);
      return [false, `Cliente com CPF ${cpf} não encontrado.`];
    }
  } catch (err) {
    return [false, err.message];
  }
};

export {
  sequelize,
  Cliente,
  insertClient,
  readClient,
  updateClient,
  deleteClient,
};
