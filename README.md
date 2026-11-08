# API de Produtos

API RESTful com operações CRUD de produtos, autenticação JWT e banco PostgreSQL, hospedada na AWS EC2.

Trabalho da disciplina de Sistemas Distribuídos — Ciência da Computação / UNASP.

## Tecnologias

- Node.js + Express
- PostgreSQL
- JWT (jsonwebtoken)
- dotenv (variáveis de ambiente)
- pm2 (execução no servidor)
- AWS EC2 (Ubuntu)

## Rotas

| Método | Rota | Descrição | Precisa de token? |
| --- | --- | --- | --- |
| POST | `/auth/login` | Faz login e retorna o token JWT | Não |
| GET | `/produtos` | Lista todos os produtos | Sim |
| GET | `/produtos/:id` | Busca um produto pelo id | Sim |
| POST | `/produtos` | Cria um produto | Sim |
| PUT | `/produtos/:id` | Atualiza um produto | Sim |
| DELETE | `/produtos/:id` | Remove um produto | Sim |

O token deve ser enviado no cabeçalho:

```
Authorization: Bearer SEU_TOKEN
```

### Exemplo de produto

```json
{
  "nome": "Teclado",
  "preco": 199.9,
  "estoque": 10,
  "categoria": "Periféricos"
}
```

### Respostas

| Código | Quando acontece |
| --- | --- |
| 200 | Sucesso |
| 201 | Produto criado |
| 204 | Produto removido |
| 400 | Dados inválidos (ex.: nome vazio, preço negativo) |
| 401 | Token ausente, inválido ou expirado |
| 404 | Produto não encontrado |

## Como rodar localmente

1. Instale o Node.js e o PostgreSQL.
2. Crie o banco `api_produtos` e rode o script `database.sql` nele.
3. Clone o repositório e instale as dependências:

```bash
git clone https://github.com/lorrainysilvap/produtos-api.git
cd produtos-api
npm install
```

4. Copie o arquivo `.env.example` para `.env` e preencha os valores.
5. Inicie a API:

```bash
npm run dev
```

A API fica disponível em `http://localhost:3000`.

## Testes

A coleção do Postman está no arquivo `API Produtos.postman_collection.json`. Para usar, importe no Postman e ajuste a variável `baseUrl` da coleção.

## Deploy na AWS

- Instância EC2 com Ubuntu 24.04 (nível gratuito), com IP elástico.
- Acesso ao servidor por SSH com par de chaves `.pem`.
- Security Group liberando apenas a porta 22 (SSH, restrita ao IP da equipe) e a porta 3000 (API). A porta do banco (5432) não fica exposta.
- Variáveis sensíveis ficam no arquivo `.env` do servidor, fora do repositório.
- A API roda com pm2, que reinicia o processo automaticamente.

Endereço da API: `http://77.113.143.110:3000`

## Segurança

- Rotas de produtos protegidas por JWT.
- Senhas e chaves em variáveis de ambiente (`.env`), ignoradas pelo Git.
- Consultas SQL parametrizadas (`$1, $2...`), evitando SQL injection.

## Integrantes e contribuições

| Integrante | Contribuição |
| --- | --- |
| Lorrainy | Estrutura do projeto, banco de dados, rotas do CRUD, coleção do Postman |
| Guilherme| Autenticação JWT, deploy na AWS (EC2, SSH, Security Group, pm2) |