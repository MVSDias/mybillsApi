import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// validando as variáveis de ambiente usando zod.
const envSchema = z.object({
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
  NODE_ENV: z.enum(["dev", "test", "prod"], {
    message: "O node_env deve ser dev, teste ou prod",
  }),

  //validação do FIREBASE no backend.:  
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY:z.string().optional(),
  FIREBASE_CLIENT_EMAIL:z.string().optional(),

});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variáveis de ambiente INVÁLIDAS", _env.error.format());
  process.exit(1); // encerra o processo com erro.
}

export const env = _env.data;
