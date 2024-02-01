# Módulo Cancelado após mudanças no escopo.

# vntschool-nodejs
Módulo ?: Persistência de Dados

Neste módulo, usamos o Sequelize para persistir os dados em um banco em memória.

As novas rotas continuam iguais, com exceção de `ler-clientes` que foi transformada em `ler-cliente` com especificação do CPF:

```curl 127.0.0.1:3000/ler-cliente/{cpf}```
