// URL de l'API pour récupérer les données au format JSON
const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";
// URL du proxy CORS
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
// Durée du cache en millisecondes (1 heure = 3600000 ms)
const cacheDuration = 3600000;

function isCacheValid(cacheTime) {
    const currentTime = new Date().getTime();
    return (currentTime - cacheTime) < cacheDuration;
}

// Fonction pour récupérer le prix du Gazole à Beynost
async function getPrixGazoleBeynost() {
    try {
        const cachedData = localStorage.getItem('prixGazoleBeynost');
        const cacheTime = localStorage.getItem('cacheTime');

        if (cachedData && cacheTime && isCacheValid(parseInt(cacheTime))) {
            console.log("Utilisation des données en cache");
            displayPrixGazole(JSON.parse(cachedData));
        } else {
            console.log("Récupération des données depuis l'API");
            const response = await fetch(proxyUrl + url);
            if (!response.ok) {
                throw new Error(`Échec de la requête : ${response.status}`);
            }
            const data = await response.json();
            let prixGazole = null;

            for (let station of data) {
                if (station.ville.toLowerCase() === 'beynost') {
                    try {
                        let prixList = JSON.parse(station.prix.replace(/'/g, '"'));
                        for (let prix of prixList) {
                            if (prix['@nom'] === 'Gazole') {
                                prixGazole = prix['@valeur'];
                                break;
                            }
                        }
                    } catch (error) {
                        console.error("Erreur lors du traitement du prix de la station:", error);
                    }
                    if (prixGazole) break;
                }
            }

            if (prixGazole) {
                localStorage.setItem('prixGazoleBeynost', JSON.stringify(prixGazole));
                localStorage.setItem('cacheTime', new Date().getTime().toString());
                displayPrixGazole(prixGazole);
            } else {
                document.getElementById('gazole-price').innerText = "Prix du Gazole introuvable à Beynost.";
            }
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        document.getElementById('gazole-price').innerText = "Erreur lors de la récupération des données.";
    }
}

function displayPrixGazole(prixGazole) {
    document.getElementById('gazole-price').innerText = `Le prix du Gazole à Beynost est : ${prixGazole} €`;
}

// Appeler la fonction pour obtenir le prix au chargement de la page
getPrixGazoleBeynost();
