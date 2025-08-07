import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transaction.routes";

// criando as rotas com fastify
async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/health", async () => {
    return {
      status: "Ok",
      message: "Mybill api rodando normalmente",
    };
  });

  fastify.register(categoryRoutes, { prefix: "/categories" }); // aqui registro as rotas de categorias com o prefixo /categories.
  fastify.register(transactionRoutes, { prefix: "/transactions" }); // aqui registro as rotas de transações com o prefixo /transaction.
}

export default routes;
