import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";


const isValidObjectId = (id: string): boolean => {
  
  return ObjectId.isValid(id); 
};

// crio um schema de validação das transações usando zod. Como deve ser os dados que serão enviados para criar as transações. Uso na rota de criação das transações.
export const createTransactionSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.number().positive("O valor deve ser um número positivo"),

  categoryId: z.string().refine(isValidObjectId, {
    message: "ID de categoria inválido",
  }),
  date: z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), {
    // coerce faz uma validação mais profunda, transformando uma string enviada em data.
    message: "Data inválida",
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    message: "Tipo de transação inválido",
  }),
});


export const getTransactionsSchema = z.object({
  month: z.string().optional(), // mês é opcional, mas se for enviado, deve ser uma string.
  year: z.string().optional(), //
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      message: "Tipo de transação inválido",
    })
    .optional(), // tipo é opcional, mas se for enviado, deve ser um dos tipos válidos.
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "ID de categoria inválido",
    })
    .optional(), // categoryId é opcional, mas se for enviado, deve ser um ObjectId válido.
});

// crio uma validação para receber os dados para criação da tela de sumário. Uso na rota de busca do resumo das transações.
export const getTransactionsSummarySchema = z.object({
  month: z.string({ message: "Mês é obrigatório" }),
  year: z.string({ message: "Ano é obrigatório" }),
});

// crio uma validação para receber os dados para criação da tela de histórico. Uso na rota de busca do histórico das transações.
export const getTransactionsHistoricalSchema = z.object({
  month: z.coerce.number().min(1).max(12), // mês - numero - no minimo 1 mes, no max 12 meses
  year: z.coerce.number().min(2000).max(2100), // ano no min ano 2000, no max ano 2100
  quantityMonths: z.coerce.number().min(1).max(12).optional(), // quantidade de meses q entrarão no histórico - min 1 max 12 e eopcional pq terei um valor padrão p isso.
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
      message: "ID inválido",
    }),
});


//AQUI EXPORTO OS TYPES BASEADOS NOS SCHEMAS

export type GetTransactionsHistoricalQuery  = z.infer<typeof getTransactionsHistoricalSchema>; // cria automaticamente um type baseado no schema de validação getTransactionsHistoricalSchema, para ser usado no controller, tipificando a querystring do request.

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>; // cria automaticamente um type baseado no schema de validação createTransactionSchema, para ser usado no controller, tipificando o body do request.

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>; // cria automaticamente um type baseado no schema de validação getTransactionsSchema, para ser usado no controller, querystrings do request.

export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>; // cria automaticamente um type baseado no schema de validação getTransactionSummarySchema, para ser usado no controller, tipicando o querystrings do request

export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>; // cria automaticamente um type baseado no schema de validação deleteTransactionSchema, para ser usado no controller, tipicando o params do request
