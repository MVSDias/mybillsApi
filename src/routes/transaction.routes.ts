import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";

import createTransactionController from "../controllers/transactions/createTransactions.controller";
import { deleteTransactionController } from "../controllers/transactions/deleteTransaction.controller";
import { getTransactionsController } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsHistoricalController } from "../controllers/transactions/getTransactionsHistorical.controller";
import { getTransactionsSummaryController } from "../controllers/transactions/getTransactionsSummary.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsHistoricalSchema,
  getTransactionsSchema,
  getTransactionsSummarySchema,
} from "../schemas/transaction.schema";

const transactionRoutes = async (fastify: FastifyInstance) => {

  fastify.addHook('preHandler', authMiddleware);

  
  // criar uma transaction - aqui eu uso o fastify.route para definir a rota de criação de transação.
  fastify.route({
    method: "POST",
    url: "/",
    schema: {
      body: zodToJsonSchema(createTransactionSchema), 
    },
    handler: createTransactionController,
  });

  //Buscar uma transaction com filtros
  fastify.route({
    method: "GET",
    url: "/",
    schema: {
      params: zodToJsonSchema(getTransactionsSchema)
    },
    handler: getTransactionsController, // aqui chama o controller que vai lidar com a busca das transações.
  });

  //Buscar o resumo(summary) das transactions.
  fastify.route({
    method: "GET",
    url: "/summary",
    schema: {
      querystring: zodToJsonSchema(getTransactionsSummarySchema), //
    },
    handler: getTransactionsSummaryController, // aqui chama o controller que vai lidar com a busca do resumo das transações.
  });

  //Buscar o histórico(historical) das transactions.
  fastify.route({
    method: "GET",
    url: "/historical",
    schema: {
      querystring: zodToJsonSchema(getTransactionsHistoricalSchema), //vem do transactions schemas
    },
    handler: getTransactionsHistoricalController, // aqui chama o controller que vai lidar com a busca do histórico das transações.
  });

  // Rota de delete
  fastify.route({
    method: "DELETE",
    url: "/:id",
    schema: {
     params: zodToJsonSchema(deleteTransactionSchema)
    },
    handler: deleteTransactionController
  });
};

export default transactionRoutes;
