import type { FastifyReply, FastifyRequest } from "fastify";

import prisma from "../../config/prisma";
import {
  type CreateTransactionBody,
  createTransactionSchema,
} from "../../schemas/transaction.schema";


const createTransactionController = async (
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
): Promise<void> => {
  
  
  const userId = request.userId;; 
  

  if (!userId) {
    
    reply.status(401).send({ error: "usuário não autenticado" });
    return; 
  }

  //validação dos dados recebidos do transaction.schema
  const result = createTransactionSchema.safeParse(request.body); 

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    reply.status(400).send({ errors: errorMessages });

    return;
  }
  const transaction = result.data;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        type: transaction.type,
      },
    });

    if (!category) {
      reply.status(400).send({ error: "Categoria inválida" });
      return;
    }
    const parseDate = new Date(transaction.date); // converto a data recebida em um objeto Date.

    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId: userId as string,
        date: parseDate,
      },
      include: {
        category: true,
      },
    });

    reply.status(201).send(newTransaction);
  } catch (err) {
    request.log.error("❌ Erro ao criar transação:", err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  }
};
export default createTransactionController;
