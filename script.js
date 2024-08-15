const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";
const cacheKey = 'prixGazoleBeynost';
const cacheExpiryKey = 'prixGazoleBeynostExpiry';

// Fonction pour vérifier si le cache est valide
function isCacheValid() {
    const expiryDate = localStorage.getItem(cacheExpiryKey);
    if (!expiryDate) return false;

    const now = new Date();
    const expiry = new Date(expiryDate);
    return now < expiry;
}

// Fonction pour enregistrer les données dans le cache avec une expiration d'un jour
function cacheData(data) {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 jour

    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheExpiryKey, expiry.toISOString());
}

// Fonction pour récupérer le prix du Gazole à Beynost depuis l'API
async function fetchPrixGazoleBeynost() {
    try {
        const response = await fetch(proxyUrl + targetUrl);
        if (!response.ok) {
            throw new Error(`Échec de la requête : ${response.status}`);
        }
        const data = await response.json();
        let gazoleTrouve = false;

        for (let station of data) {
            if (station.ville.toLowerCase() === 'beynost') {
                try {
                    let prixList = JSON.parse(station.prix.replace(/'/g, '"'));
                    for (let prix of prixList) {
                        if (prix['@nom'] === 'Gazole') {
                            const result = `Le prix du Gazole à Beynost est : ${prix['@valeur']} €`;
                            document.getElementById('gazole-price').innerText = result;
                            cacheData(result); // Cache les données récupérées
                            gazoleTrouve = true;
                            break;
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors du traitement du prix de la station:", error);
                }
                
                if (gazoleTrouve) break;
            }
        }

        if (!gazoleTrouve) {
            const message = "Prix du Gazole introuvable à Beynost.";
            document.getElementById('gazole-price').innerText = message;
            cacheData(message); // Cache le message d'erreur
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        document.getElementById('gazole-price').innerText = "Erreur lors de la récupération des données.";
    }
}

// Fonction principale pour afficher le prix du Gazole
function afficherPrixGazole() {
    if (isCacheValid()) {
        // Si le cache est valide, afficher les données en cache
        document.getElementById('gazole-price').innerText = localStorage.getItem(cacheKey);
    } else {
        // Sinon, récupérer les données depuis l'API
        fetchPrixGazoleBeynost();
    }
}

// Appeler la fonction pour afficher le prix au chargement de la page
afficherPrixGazole();
