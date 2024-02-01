# vntschool-nodejs

Módulo X: Usando Sqlite3.

Neste módulo, adaptaremos a nossa API para usar Sqlite3 no lugar do sistema de arquivos. Todas as rotas permanecem as mesmas.

1. Lê dados de um arquivo e retorna para o usuário, no endpoint GET 127.0.0.1:3000/ler-clientes.

2. Cadastra um novo cliente no arquivo, no endpoint POST 127.0.0.1:3000/cadastrar-cliente.
```
curl -X POST 127.0.0.1:3000/cadastrar-cliente -H 'Content-Type: application/json' -d '{"nome":"Antonio Carlos","cpf":"123456"}'
```

3. Atualiza um cliente, no endpoint PATCH 127.0.0.1:3000/atualizar-cliente.

```
curl -X PATCH 127.0.0.1:3000/atualizar-cliente -H 'Content-Type: application/json' -d '{"nome":"Antonio Luiz","key":"123456"}'
```

4. Deleta um cliente, no endpoint DELETE 127.0.0.1:3000/deletar-cliente/{cpf}.
```
curl -X DELETE 127.0.0.1:3000/deletar-cliente/123456
```
