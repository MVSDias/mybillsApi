import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";

const port = Number(env.PORT) || 3001;

initializeFirebaseAdmin();
const startServer = async () => {
  
  try {
    await prismaConnect(); 
    await initializeGlobalCategories();

    await app.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server online on port ${port}`);

    // await app.listen({ port: port, host: "0.0.0.0" }).then(() => {
    //   console.log(`🚀 Server online on port ${port}`);
    // });
  } catch (err) {
    console.error(err);
  }
};

startServer();
