import prisma from "../config/prisma";
import type { FastifyRequest, FastifyReply } from "fastify";

export const getCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    reply.send(categories);

  } catch (err) {
    request.log.error("❌ Erro ao buscar categorias:", err); 
    reply.status(500).send({ error: "Erro ao buscar categorias" }); 
  }
};
