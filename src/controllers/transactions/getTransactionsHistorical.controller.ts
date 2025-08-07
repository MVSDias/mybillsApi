import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/pt-br";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsHistoricalQuery } from "../../schemas/transaction.schema";

dayjs.extend(utc); 
dayjs.locale("pt-br");

export const getTransactionsHistoricalController = async (
  request: FastifyRequest<{ Querystring: GetTransactionsHistoricalQuery }>, 
  reply: FastifyReply,
): Promise<void> => {
  
  const userId = request.userId;

  
  if (!userId) {
    
    reply.status(401).send({ error: "usuário não autenticado" });
    return;
  }

  const { month, year, quantityMonths = 4 } = request.query; 
  const baseDate = new Date(year, month - 1, 1); // crio a data base = data de hj com parâmetros.

  //CRIO A DATA INICIAL E FINAL - quando vai começar = x meses atras E QUANDO VAI ACABAR = baseDate
  const startDate = dayjs 
    .utc(baseDate) 
    .subtract(quantityMonths - 1, "month") 
    .startOf("month") 
    .toDate(); 

  const endDate = dayjs.utc(baseDate).endOf("month").toDate(); 

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    
    const monthlyData = Array.from({ length: quantityMonths }, (_, i) => {
      const date = dayjs
        .utc(baseDate)
        .subtract(quantityMonths - 1 - i, "month"); 
        
      return {
        name: date.format("MMM/YYYY"),
        income: 0,
        expenses: 0,
      };
    });

    
    transactions.forEach((transaction) => {
      const monthKey = dayjs(transaction.date).format("MMM/YYYY");
      const monthData = monthlyData.find((m) => m.name === monthKey);

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else {
          monthData.expenses += transaction.amount;
        }
      } 
    });

    reply.send({ history: monthlyData }); 
  } catch (err) {
    console.error(err);
  }
};
