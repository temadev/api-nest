# GraphQL API with Nest, Prisma, TypeScript, JWT Authentication

## Installation

Install dependencies:

```bash
$ yarn
$ mv .env-default .env
```

Create prisma service at app.prisma.io and save http endpoint data in `.env` file as `PRISMA_ENDPOINT`.
Then generate and deploy your schema:

```bash
$ yarn prisma generate
$ yarn prisma deploy
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```
