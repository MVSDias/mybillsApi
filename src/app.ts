import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { env } from "./config/env";
import routes from "./routes";



const app: FastifyInstance = Fastify({
  
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error",   
  },
});

app.register(cors, {
  origin: '*', // ou o domínio do seu front, ex: 'http://localhost:5173'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],}) // libera todos os métodos necessários); // aqui permito q dominio pode acessar a api.  Assim permito q qq frontend acesse.

app.register(routes, { prefix: "/api" }); // aqui registro as rotas com prefixo api

export default app;
