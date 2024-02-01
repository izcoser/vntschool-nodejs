# vntschool-nodejs
Módulo 3: Persistência de Dados

Neste módulo, usamos o Sequelize para persistir os dados em um banco em memória.

As novas rotas continuam iguais, com exceção de `ler-clientes` que foi transformada em `ler-cliente` com especificação do CPF:

```curl -X 127.0.0.1:3000/ler-cliente/{cpf}'
```