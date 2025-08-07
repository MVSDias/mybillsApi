import type { TransactionType } from "@prisma/client";
import type { CategorySummary } from "./category.types";

export interface TransactionFilter {
  userId: string;
  date?: {
    gte: Date; // Greater than or equal to - maior ou igual a. Data de início do filtro.
    lte: Date; // Less than or equal to - menor ou igual a. Data de fim do filtro.
  };
  type?: TransactionType;
  categoryId?: string;
}

// interface que vai definir q é e e como serão os dados  vou enviar pro frontend.
export interface TransactionSummary {
  totalIncomes: number; // total de receitas
  totalExpenses: number; // total de despesas
  balance: number; // saldo total
  expensesByCategory: CategorySummary[]; // despesas por categoria. Importo de category.types.
}
