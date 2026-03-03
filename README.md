# Sistema de Controle de Estoque - Autoflex

Projeto full stack do desafio tecnico Autoflex, com frontend React e backend Spring Boot para gestao de produtos, materias-primas, composicao de produto e simulacao de producao.

## Visao geral

O sistema atende os fluxos principais:

- CRUD de produtos
- CRUD de materias-primas
- CRUD da composicao produto x materia-prima
- Simulacao de producao com base no estoque atual
- Priorizacao por maior valor de produto (na simulacao)
- Dashboard com indicadores operacionais

## Arquitetura

- Frontend: React + TypeScript + Redux Toolkit + React Router + Axios + Bootstrap
- Backend: Spring Boot 2.7 + JPA/Hibernate + MapStruct + Maven
- Banco de dados: PostgreSQL (perfil padrao `prod`) e H2 (perfil `dev`)

## Estrutura do repositorio

```text
.
|- java-web-spring-api-autoflex/   # API Spring Boot
|- web-app-autoflex/               # App React (Vite)
|- docker-compose.dev.yml          # Ambiente dev completo (db + api + web)
|- REQUISITOS.md
`- README.md
```

## Requisitos de ambiente

- Docker Desktop
- Java 11+
- Maven 3.9+
- Node.js 20+ (recomendado)
- npm

## Como executar

### Opcao 1: ambiente completo com Docker (recomendado)

Na raiz do repositorio:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

Servicos:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- PostgreSQL: `localhost:5432` (`inventory_db`)

Parar ambiente:

```powershell
docker compose -f docker-compose.dev.yml down
```

### Opcao 2: execucao local por modulo

1. Subir PostgreSQL + restore/backup:

```powershell
cd java-web-spring-api-autoflex
docker compose up -d
```

2. Subir backend:

```powershell
cd java-web-spring-api-autoflex
mvn spring-boot:run
```

3. Subir frontend:

```powershell
cd web-app-autoflex
npm install
npm run dev
```

## Backup e restore (PostgreSQL)

No compose do backend existe rotina automatica:

- Restore automatico na subida, se existir `database/backups/inventory_db.backup`
- Backup continuo a cada 60 segundos
- Arquivo de backup em `java-web-spring-api-autoflex/database/backups/inventory_db.backup`

Logs uteis:

```powershell
cd java-web-spring-api-autoflex
docker compose logs -f postgres restore backup
```

## Rotas do frontend

- `/` dashboard
- `/products` gestao de produtos e composicao
- `/raw-materials` gestao de materias-primas
- `/production` simulacao RF008

## Endpoints da API

Base URL: `http://localhost:8080/api`

Produtos:

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `GET /products/production`

Materias-primas:

- `GET /raw-materials`
- `GET /raw-materials/{id}`
- `POST /raw-materials`
- `PUT /raw-materials/{id}`
- `DELETE /raw-materials/{id}`

Composicao produto x materia-prima:

- `POST /product-raw-materials`
- `GET /product-raw-materials/{id}`
- `GET /product-raw-materials/product/{productId}`
- `PUT /product-raw-materials/{id}`
- `DELETE /product-raw-materials/{id}`

Productions (modulo de registros de producao):

- `GET /productions`
- `GET /productions/{id}`
- `POST /productions`
- `PUT /productions/{id}`
- `DELETE /productions/{id}`

## Regra de negocio da simulacao

A simulacao (`GET /api/products/production`) segue este fluxo:

1. Ordena produtos por maior valor
2. Calcula o maximo produzivel por produto com base nos insumos disponiveis
3. Desconta o consumo no estoque simulado
4. Retorna itens produziveis, quantidade total sugerida e valor total sugerido

## Scripts uteis

Frontend (`web-app-autoflex/package.json`):

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

Backend (`java-web-spring-api-autoflex`):

- `mvn spring-boot:run`
- `mvn test`

## Pendencias e melhorias

- Suite de testes automatizados no frontend
- Maior cobertura de testes de integracao no backend
- Pipeline CI/CD

## Autor

Paulo Vargas
