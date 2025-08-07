export interface CategorySummary {
  //tipos dos resumos das minhas categorias
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number; // total de transações da categoria
  percentage: number; // porcentagem do total de transações da categoria em relação ao total geral.
}
