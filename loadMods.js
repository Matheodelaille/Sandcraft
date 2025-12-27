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

async function loadAllMods() {
    try {
        console.log('Début du chargement des mods...');
        const response = await fetch('data/mods.json');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const jsonText = await response.text();
        console.log('JSON brut récupéré, longueur:', jsonText.length);
        
        // CORRECTION: Le JSON semble être un tableau sans crochets extérieurs
        // On va l'encapsuler dans un tableau
        const fixedJson = '[' + jsonText.replace(/}\s*{/g, '},{') + ']';
        
        const allMods = JSON.parse(fixedJson);
        console.log(`${allMods.length} mods chargés avec succès`);
        
        return allMods;
    } catch (error) {
        console.error('ERREUR lors du chargement des mods:', error);
        return [];
    }
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    
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
