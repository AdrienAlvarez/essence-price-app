// URL de l'API pour récupérer les données au format JSON
const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Échec de la requête : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Parcourir chaque station
        for (let station of data) {
            // Vérifier si la station est située à Beynost
            if (station.ville === 'Beynost') {
                // Parcourir les différents carburants pour trouver le prix du Gazole
                let prixList = JSON.parse(station.prix.replace(/'/g, '"'));
                for (let prix of prixList) {
                    if (prix['@nom'] === 'Gazole') {
                        document.getElementById('result').innerText = `Le prix du Gazole à Beynost est : ${prix['@valeur']} €`;
                        break;
                    }
                }
                break;
            }
        }
    })
    .catch(error => console.error(error));
