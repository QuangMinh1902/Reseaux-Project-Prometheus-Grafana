const { Worker, isMainThread, workerData } = require("worker_threads");
const axios = require("axios");

// Fonction pour effectuer la requête une fois
async function fetchData() {
  try {
    const response = await axios.get(
      "http://localhost:1337/api/articles?pagination[page]=1&pagination[pageSize]=100"
    );
    const allIds = [];
    const { data } = response.data;
    data.map((e) => allIds.push(e.id));
    const result = {
      allIds,
      responseData: response.data.data,
    };
    // console.log(result);
    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    throw error; // Rejette la promesse en cas d'erreur
  }
}

// fetchData();

// Fonction pour créer un nouvel article
async function createArticle() {
  try {
    const newArticle = {
      data: {
        title:
          "Paris 2024 : transports, sécurité, chances de médailles... Posez toutes vos questions sur les Jeux olympiques",
        body:
          "Dans le cadre d'un référendum local, une ville demande à ses administrés de voter pour ou contre une mesure qui" +
          "va être mise en place directement. La ville, au lieu de voter quelque chose en son conseil municipal, demande aux citoyens de se prononcer et ce vote oblige la municipalité. Il s'agit d'un dispositif de démocratie directe." +
          "L'exercice de consultation locale est différent puisque, comme son nom l'indique, il s'agit de consulter la population. La ville n'est pas tenue d'appliquer le résultat de la consultation, ça ne l'engage à rien. Il faudra ensuite un vote en conseil municipal selon les procédures habituelles. La consultation locale est un outil de démocratie participative au sens où elle a vocation à faire participer les habitants. Hugo Touzet est chercheur en sociologie :  ",
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
    try {
      console.log(`Thread ${threadId}, Requête ${i}: fetchData()`);
      await fetchData();

      console.log(`Thread ${threadId}, Requête ${i}: createArticle()`);
      await createArticle();
    } catch (error) {
      console.error(
        `Thread ${threadId}, Erreur lors de la requête ${i}:`,
        error
      );
    }
  }

  console.log(`Thread ${threadId} terminé.`);
}

// Fonction principale pour lancer les threads
function main() {
  const totalThreads = 100;

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
