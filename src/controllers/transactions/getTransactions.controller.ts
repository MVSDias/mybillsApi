import dayjs from "dayjs"; // Biblioteca para manipulação de datas.
import utc from "dayjs/plugin/utc"; // Plugin do dayjs para manipulação de datas em UTC.
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";

dayjs.extend(utc); // Extensão do dayjs para manipulação de datas em UTC

export const getTransactionsController = async (
  request: FastifyRequest<{ Querystring: GetTransactionsQuery }>, 
  reply: FastifyReply,
): Promise<void> => {

  
  const userId = request.userId;;

  
  if (!userId) {
    
    reply.status(401).send({ error: "usuário não autenticado" });
    return; 
  }

  const { month, categoryId, type, year } = request.query; 

 
  const filters: TransactionFilter = { userId: userId as string };

  if (month && year) {
   
    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate(); 
    const endDate = dayjs.utc(startDate).endOf("month").toDate(); 
    filters.date = { gte: startDate, lte: endDate }; 
  }

  if (type) {    
    filters.type = type;
  }

  if (categoryId) {
    filters.categoryId = categoryId; 
  }

  
  try {
    const transactions = await prisma.transaction.findMany({
      
      where: filters, 
      orderBy: { date: "desc" },
      include: {
        category: {
          select: {
            color: true,
            name: true,
            type: true,
          },
        },
      },
    });
    reply.send(transactions);
  } catch (err) {
    request.log.error("❌ Erro ao buscar transações:", err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  }
};
