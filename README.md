# vntschool-nodejs

Módulo 2: Desenvolvendo nossa primeira API Node.js

Neste módulo, criamos a API simples possível em Node.js. A API:

1. Lê dados de um arquivo e retorna para o usuário, no endpoint GET 127.0.0.1:3000/clientes.

2. Cadastra um novo cliente no arquivo, no endpoint POST 127.0.0.1:3000/cliente.
```
curl -X POST 127.0.0.1:3000/cliente -H 'Content-Type: application/json' -d '{"nome":"Antonio Carlos","cpf":"123456","sobrenome":"Jose"}'
```

3. Atualiza um cliente, no endpoint PATCH 127.0.0.1:3000/cliente.

```
curl -X PATCH 127.0.0.1:3000/cliente -H 'Content-Type: application/json' -d '{"nome":"Antonio Luiz","key":"123456"}'
```

4. Deleta um cliente, no endpoint DELETE 127.0.0.1:3000/cliente/{cpf}.
```
curl -X DELETE 127.0.0.1:3000/cliente/123456
```
