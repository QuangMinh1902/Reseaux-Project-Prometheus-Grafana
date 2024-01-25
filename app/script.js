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

// Fonction principale asynchrone pour effectuer la requête 1000 fois
async function fetchDataMultipleTimes() {
  const numberOfRequests = 1000;

  // Crée un tableau de promesses pour les 1000 requêtes
  const promises = Array.from({ length: numberOfRequests }, () => fetchData());

  try {
    // Utilise Promise.all pour exécuter toutes les promesses en parallèle
    const results = await Promise.all(promises);

    // Les résultats contiennent les données de chaque requête
    for (const result of results) {
      for (const data of result.data) {
        console.log(data);
      }
    }
  } catch (error) {
    console.error("Une ou plusieurs requêtes ont échoué :", error);
  }
}

// Appelle la fonction principale
fetchDataMultipleTimes();
