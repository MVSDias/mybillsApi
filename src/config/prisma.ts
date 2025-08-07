//Conectando ao banco de dados - faz a interface com o banco de dados

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// exporto a conexão pro server
export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("☑️ DB conectado com sucesso!");
  } catch (err) {
    console.error("❌ falha ao conectar DB, erro:", err);
  }
};

export default prisma;
