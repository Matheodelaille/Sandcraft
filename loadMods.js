// Fichier: loadMods.js
// Charger et afficher les mods par catégorie

// Correspondance entre les catégories du JSON et les IDs HTML
// NOUVEAU MAPPING adapté à tes IDs HTML
const categoryMapping = {
    'tech': ['Technology', 'Automation', 'Storage', 'Industrial'], // Correspond à id="tech"
    'magic': ['Magic', 'Sorcery', 'Thaumaturgy', 'Wizardry'],      // Correspond à id="magic"
    'agriculture': ['Agriculture', 'Farming', 'Food', 'Crops'],    // Correspond à id="agriculture"
    'adventure': ['Adventure', 'Exploration', 'World Gen', 'Dungeon'], // Correspond à id="adventure"
    'construction': ['Decoration', 'Building', 'Aesthetics', 'Furniture'], // id="construction"
    'library': ['Library', 'Utility', 'API', 'Core'],              // id="library"
    'qol': ['Quality of Life', 'Interface', 'Optimization', 'Utility'] // id="qol"
};

// Par :
async function displayCategoryMods(htmlId, jsonCategoryKey) {
    // htmlId = "tech", "magic", etc. (les IDs dans ton HTML)
    // jsonCategoryKey = "tech", "magic", etc. (les clés du mapping)
    
    const container = document.getElementById(htmlId);
    if (!container) {
        console.warn(`Container #${htmlId} non trouvé`);
        return;
    }
    
    // Trouver le conteneur des mods à l'intérieur
    const contentContainer = container.querySelector('.category-content');
    if (!contentContainer) {
        console.warn(`Contenu non trouvé dans #${htmlId}`);
        return;
    }
    
    // Afficher un indicateur de chargement
    contentContainer.innerHTML = '<div class="loading">Chargement des mods...</div>';
    
    const allMods = await loadAllMods();
    
    if (allMods.length === 0) {
        contentContainer.innerHTML = '<div class="error">Erreur de chargement des données</div>';
        return;
    }
    
    // Filtrer les mods pour cette catégorie
    const categoryMods = allMods.filter(mod => modBelongsToCategory(mod, jsonCategoryKey));
    console.log(`Catégorie ${jsonCategoryKey}: ${categoryMods.length} mods trouvés`);
    
    if (categoryMods.length === 0) {
        contentContainer.innerHTML = '<div class="no-mods">Aucun mod dans cette catégorie</div>';
        return;
    }
    
    // Afficher les mods
    contentContainer.innerHTML = '';
    categoryMods.slice(0, 4).forEach(mod => { // Limite à 4 mods par catégorie comme ton design
        contentContainer.innerHTML += createModElement(mod);
    });
}

function modBelongsToCategory(mod, targetCategory) {
    // Vérifie si un mod appartient à une catégorie cible
    if (!mod.catégorie || !Array.isArray(mod.catégorie)) return false;
    
    const modCategories = mod.catégorie.map(cat => cat.toLowerCase());
    const targetCategories = categoryMapping[targetCategory] || [];
    
    // Vérifie si une catégorie du mod correspond à la catégorie cible
    return targetCategories.some(targetCat => 
        modCategories.some(modCat => modCat.includes(targetCat.toLowerCase()))
    );
}

function createModElement(mod) {
    // Crée l'élément HTML pour un mod
    return `
        <div class="mod-item">
            <h3>${mod['nom du mod'] || 'Nom inconnu'}</h3>
            <p class="version">${mod.version || 'N/A'}</p>
            <p class="short-desc">${mod['description courte'] || ''}</p>
            
            ${mod['description détaillée'] ? 
                `<p class="detailed-desc">${mod['description détaillée']}</p>` : ''}
            
            <div class="mod-stats">
                ${mod['nombre d\'items'] ? `<span>${mod['nombre d\'items']} items</span>` : ''}
                ${mod['nombre de blocs'] ? `<span>${mod['nombre de blocs']} blocs</span>` : ''}
                ${mod['nombre d\'entités'] ? `<span>${mod['nombre d\'entités']} entités</span>` : ''}
            </div>
            
            ${mod.tags && mod.tags.length ? 
                `<div class="mod-tags">${mod.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
        </div>
    `;
}

async function displayCategoryMods(categoryId, categoryKey) {
    const container = document.getElementById(categoryId);
    if (!container) {
        console.warn(`Container #${categoryId} non trouvé`);
        return;
    }
    
    // Afficher un indicateur de chargement
    container.innerHTML = '<p class="loading">Chargement des mods...</p>';
    
    const allMods = await loadAllMods();
    
    if (allMods.length === 0) {
        container.innerHTML = '<p class="error">Erreur de chargement des données</p>';
        return;
    }
    
    // Filtrer les mods pour cette catégorie
    const categoryMods = allMods.filter(mod => modBelongsToCategory(mod, categoryKey));
    console.log(`Catégorie ${categoryKey}: ${categoryMods.length} mods trouvés`);
    
    if (categoryMods.length === 0) {
        container.innerHTML = '<p class="no-mods">Aucun mod dans cette catégorie</p>';
        return;
    }
    
    // Afficher les mods
    container.innerHTML = '';
    categoryMods.forEach(mod => {
        container.innerHTML += createModElement(mod);
    });
}

// Par :
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    
    // Correspondance entre IDs HTML et clés de catégorie
    const categories = [
        { htmlId: 'tech', key: 'tech' },           // TECHNOLOGIE
        { htmlId: 'magic', key: 'magic' },         // MAGIE
        { htmlId: 'agriculture', key: 'agriculture' }, // AGRICULTURE
        { htmlId: 'adventure', key: 'adventure' }, // AVENTURE
        { htmlId: 'construction', key: 'construction' }, // CONSTRUCTION
        { htmlId: 'library', key: 'library' },     // BIBLIOTHÈQUE
        { htmlId: 'qol', key: 'qol' }              // QUALITÉ DE VIE
    ];
    
    categories.forEach(cat => {
        displayCategoryMods(cat.htmlId, cat.key);
    });
});
    
    // Démarrer le chargement pour chaque catégorie
    const categories = [
        { id: 'technologyMods', key: 'technologie' },
        { id: 'magicMods', key: 'magie' },
        { id: 'agricultureMods', key: 'agriculture' },
        { id: 'adventureMods', key: 'aventure' },
        { id: 'buildingMods', key: 'construction' },
        { id: 'libraryMods', key: 'bibliothèque' },
        { id: 'qualityMods', key: 'qualité' }
    ];
    
    categories.forEach(cat => {
        displayCategoryMods(cat.id, cat.key);
    });
});
