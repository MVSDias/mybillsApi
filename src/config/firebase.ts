// arquivo de configuração do firebase no backend

import admin from 'firebase-admin';
import { env } from './env'; // importo a validação do firebase 

const initializeFirebaseAdmin = ():void => {
  if(admin.apps.length > 0){ // verifico se o firebase já iniciou. se já iniciou...
    return; // ...paro aqui pqnão preciso iniciar de novo.
  }

  // pego as credenciais validadas do env.ts
  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL} = env;

  if(!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL){ // se não tiver essas informações...
     throw new Error("❌ Falha ao iniciar Firebase - Faltando credenciais");// ...crio um erro.
  }  
  
   // se estiver tudo ok, inicio o firebase
  try {
    admin.initializeApp({ //inicializo com as credenciais que peguei do env.ts...
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,

      })
    })
  } catch(err) {
    console.error("❌ Falha ao conectar ao Firebase", err)
    process.exit(1);//finalizo o processo com erro.
  }
}

export default initializeFirebaseAdmin; // vou usá-lo no server.ts para inicializar o firebase antes de iniciar o servidor.
