// src/scripts/data-loader.js
// Charge et affiche dynamiquement la liste des mods depuis mods.json et categories.json

// Configuration des chemins des fichiers de données
const DATA_CONFIG = {
    mods: '../src/data/mods.json',
    categories: '../src/data/categories.json'
};

// Fonction principale exécutée au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 1. Chargement parallèle des deux fichiers JSON
        const [modsData, categoriesData] = await Promise.all([
            loadJSON(DATA_CONFIG.mods),
            loadJSON(DATA_CONFIG.categories)
        ]);

        // 2. Combiner les données (ajouter les infos de catégorie aux mods)
        const enrichedMods = enrichModsWithCategoryData(modsData, categoriesData);
        
        // 3. Initialiser l'interface
        initializePage(enrichedMods, categoriesData);
        
        console.log(`✅ ${enrichedMods.length} mods chargés avec succès.`);
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        displayErrorMessage();
    }
});

// Fonction générique pour charger un fichier JSON
async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Impossible de charger ${url}: ${response.status}`);
    }
    return await response.json();
}
// Associe les informations de catégorie (couleur, etc.) à chaque mod
function enrichModsWithCategoryData(mods, categories) {
    // Créer une map pour un accès rapide aux catégories par leur ID
    const categoryMap = {};
    categories.forEach(cat => {
        categoryMap[cat.id] = cat;
    });

    // Enrichir chaque mod avec les données de sa catégorie
    return mods.map(mod => {
        return {
            ...mod, // Conserve toutes les propriétés originales du mod
            categoryInfo: categoryMap[mod.category] || { 
                id: mod.category, 
                name: mod.category, 
                color: '#cccccc' 
            }
        };
    });
}

// Initialise toute la page avec les données
function initializePage(mods, categories) {
    // Stocker les données globalement pour les filtres
    window.modsData = mods;
    window.categoriesData = categories;

    // Remplir le filtre par catégorie
    populateCategoryFilter(categories);
    
    // Afficher tous les mods initialement
    renderModsTable(mods);
    
    // Configurer la recherche en temps réel
    setupSearch(mods);
    
    // Configurer le tri des colonnes
    setupSorting(mods);
}

// Remplit le dropdown de filtre avec les catégories disponibles
function populateCategoryFilter(categories) {
    const filterSelect = document.getElementById('categoryFilter');
    if (!filterSelect) return;

    // Option "Toutes les catégories"
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = '📂 Toutes les catégories';
    filterSelect.appendChild(defaultOption);

    // Une option par catégorie
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${getCategoryIcon(category.id)} ${category.name}`;
        filterSelect.appendChild(option);
    });

    // Écouter les changements pour filtrer
    filterSelect.addEventListener('change', function() {
        filterModsByCategory(this.value);
    });
}

// Retourne un emoji pour chaque catégorie (personnalisable)
function getCategoryIcon(categoryId) {
    const icons = {
        'agriculture': '🌱',
        'aventure': '⚔️',
        'bibliotheque': '📚',
        'construction': '🏗️',
        'magie': '🔮',
        'quality': '✨',
        'technology': '⚙️'
    };
    return icons[categoryId] || '📁';
}
// Affiche les mods dans le tableau HTML
function renderModsTable(mods) {
    const tableBody = document.getElementById('modsTableBody');
    if (!tableBody) return;

    // Vider le tableau actuel
    tableBody.innerHTML = '';

    // Générer une ligne pour chaque mod
    mods.forEach(mod => {
        const row = document.createElement('tr');
        
        // Utiliser innerHTML pour les badges de couleur (attention à la sécurité)
        row.innerHTML = `
            <td>
                <span class="category-badge" style="background-color: ${mod.categoryInfo.color || '#6c757d'};">
                    ${mod.categoryInfo.name}
                </span>
            </td>
            <td><strong>${mod.name}</strong></td>
            <td>${mod.description}</td>
            <td><code>${mod.fileName}</code></td>
            <td>
                <button class="btn-details" data-mod-id="${mod.id}">
                    Voir détails
                </button>
            </td>
        `;
        
        // Ajouter un événement au bouton "Voir détails"
        const detailsBtn = row.querySelector('.btn-details');
        if (detailsBtn && mod.id) {
            detailsBtn.addEventListener('click', () => {
                // Rediriger vers la page wiki du mod
                window.location.href = `../wiki/${mod.id}.html`;
            });
        }
        
        tableBody.appendChild(row);
    });

    // Mettre à jour le compteur
    updateModsCounter(mods.length);
}

// Filtre les mods par catégorie
function filterModsByCategory(categoryId) {
    let filteredMods;
    if (categoryId === 'all') {
        filteredMods = window.modsData;
    } else {
        filteredMods = window.modsData.filter(mod => mod.category === categoryId);
    }
    renderModsTable(filteredMods);
}

// Configure la recherche en temps réel
function setupSearch(mods) {
    const searchInput = document.getElementById('modSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            renderModsTable(mods);
            return;
        }

        const filtered = mods.filter(mod => 
            mod.name.toLowerCase().includes(searchTerm) ||
            mod.description.toLowerCase().includes(searchTerm) ||
            mod.detailedDescription.toLowerCase().includes(searchTerm)
        );
        
        renderModsTable(filtered);
    });
}

// Configure le tri des colonnes
function setupSorting(mods) {
    const headers = document.querySelectorAll('#modsTable thead th[data-sort]');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const sortKey = this.getAttribute('data-sort');
            const isAscending = !this.classList.contains('asc');
            
            // Réinitialiser les autres tris
            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // Appliquer la direction du tri
            this.classList.toggle('asc', isAscending);
            this.classList.toggle('desc', !isAscending);
            
            // Trier et réafficher les mods
            const sortedMods = sortMods([...mods], sortKey, isAscending);
            renderModsTable(sortedMods);
        });
    });
}

// Fonction de tri générique
function sortMods(modsArray, key, ascending = true) {
    return modsArray.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        // Pour le tri par catégorie, utiliser le nom de la catégorie
        if (key === 'category') {
            valA = a.categoryInfo.name;
            valB = b.categoryInfo.name;
        }
        
        // Comparaison
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });
}

// Met à jour le compteur de mods affichés
function updateModsCounter(count) {
    const counterElement = document.getElementById('modsCounter');
    if (counterElement) {
        counterElement.textContent = `Affichage de ${count} mod(s)`;
    }
}

// Affiche un message d'erreur si le chargement échoue
function displayErrorMessage() {
    const container = document.getElementById('modsContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>😕 Impossible de charger la liste des mods</h3>
                <p>Vérifiez que les fichiers mods.json et categories.json sont bien présents dans le dossier src/data/.</p>
                <button onclick="window.location.reload()">Réessayer</button>
            </div>
        `;
    }
}
