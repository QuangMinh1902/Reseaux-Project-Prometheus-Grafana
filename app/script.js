const { Worker, isMainThread, workerData } = require("worker_threads");
const axios = require("axios");

// Fonction pour effectuer la requête une fois
async function fetchData() {
  try {
    const response = await axios.get("http://localhost:1337/api/articles");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    throw error; // Rejette la promesse en cas d'erreur
  }
}

// Fonction pour créer un nouvel article
async function createArticle() {
  try {
    const newArticle = {
      data: {
        title: "Title of article",
        body: "this is the body",
      },
    };

    const response = await axios.post(
      "http://localhost:1337/api/articles",
      newArticle
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'un nouvel article :", error);
    throw error; // Rejette la promesse en cas d'erreur
  }
}

// Fonction exécutée dans chaque thread
async function performRequestsInWorker() {
  const { threadId, totalRequests } = workerData;
  console.log(`Thread ${threadId} démarré.`);

  for (let i = 1; i <= totalRequests; i++) {
    console.log(`Thread ${threadId}, Requête ${i}: fetchData()`);
    await fetchData();
    // await createArticle();
  }

  console.log(`Thread ${threadId} terminé.`);
}

// Fonction principale pour lancer les threads
function main() {
  const totalThreads = 10;

  for (let i = 1; i <= totalThreads; i++) {
    // Créer un nouveau thread pour chaque requête
    const worker = new Worker(__filename, {
      workerData: { threadId: i, totalRequests: 1 },
    });
  }
}

// Si c'est le thread principal, lancez les threads
if (isMainThread) {
  main();
} else {
  // Si c'est un thread de travail, effectuez les requêtes
  performRequestsInWorker();
}
