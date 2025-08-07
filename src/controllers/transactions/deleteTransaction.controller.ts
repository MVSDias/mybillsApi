import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransactionController = async (request: FastifyRequest<{ Params: DeleteTransactionParams }>, reply: FastifyReply): Promise<void> => {

  
  const userId = request.userId;
  
  if (!userId) {
    
    reply.status(401).send({ error: "usuário não autenticado" });
    return; 
  }

  const { id } = request.params; 
  console.log(id)

  if (!id) {
    request.log.error("❌ ID da transação não fornecido");
    reply.status(400).send({ error: "ID da transação é obrigatório" });
  }

  try {

    const transaction = await prisma.transaction.findFirst({ 
      where: { id, userId }, 
    })

    if (!transaction) { 
      reply.status(400).send({ message: 'Id inválido ou transação não encontrada' });
      return; 

      await prisma.transaction.delete({
      where: { id }, 
      })
    }

    reply.status(201).send({ message: "Transação deletada com sucesso!" }); 
  } catch (err) {
    request.log.error("❌ Erro ao deletar transação:", err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  }
}