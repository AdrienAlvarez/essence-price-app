// URL de l'API pour récupérer les données au format JSON
const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";

// Fonction pour récupérer le prix du Gazole à Beynost
async function getPrixGazoleBeynost() {
    try {
        const response = await fetch(url);
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
                            document.getElementById('gazole-price').innerText = `Le prix du Gazole à Beynost est : ${prix['@valeur']} €`;
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
            document.getElementById('gazole-price').innerText = "Prix du Gazole introuvable à Beynost.";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        document.getElementById('gazole-price').innerText = "Erreur lors de la récupération des données.";
    }
}

// Appeler la fonction pour obtenir le prix au chargement de la page
getPrixGazoleBeynost();
