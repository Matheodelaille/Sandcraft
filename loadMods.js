// Fichier: loadMods.js - VERSION COMPLÈTE CORRIGÉE
// Charger et afficher les mods par catégorie

// NOUVEAU MAPPING adapté à tes IDs HTML
const categoryMapping = {
    'tech': ['Technology', 'Automation', 'Storage', 'Industrial'],
    'magic': ['Magic', 'Sorcery', 'Thaumaturgy', 'Wizardry'],
    'agriculture': ['Agriculture', 'Farming', 'Food', 'Crops'],
    'adventure': ['Adventure', 'Exploration', 'World Gen', 'Dungeon'],
    'construction': ['Decoration', 'Building', 'Aesthetics', 'Furniture'],
    'library': ['Library', 'Utility', 'API', 'Core'],
    'qol': ['Quality of Life', 'Interface', 'Optimization', 'Utility']
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
    if (!mod.catégorie || !Array.isArray(mod.catégorie)) return false;
    
    const modCategories = mod.catégorie.map(cat => cat.toLowerCase());
    const targetCategories = categoryMapping[targetCategory] || [];
    
    return targetCategories.some(targetCat => 
        modCategories.some(modCat => modCat.includes(targetCat.toLowerCase()))
    );
}

function createModElement(mod) {
    return `
        <div class="mod-item" data-mod-id="${mod['nom du mod']?.toLowerCase().replace(/\s+/g, '_')}">
            <div class="mod-header">
                <div class="mod-name">${mod['nom du mod'] || 'Nom inconnu'}</div>
                <div class="mod-version">${mod.version || 'N/A'}</div>
            </div>
            <p class="mod-description">${mod['description courte'] || ''}</p>
            <div class="mod-stats">
                ${mod['nombre d\'items'] ? `<div class="stat">${mod['nombre d\'items']} items</div>` : ''}
                ${mod['nombre de blocs'] ? `<div class="stat">${mod['nombre de blocs']} blocs</div>` : ''}
                ${mod['nombre d\'entités'] ? `<div class="stat">${mod['nombre d\'entités']} entités</div>` : ''}
                ${!mod['nombre d\'items'] && !mod['nombre de blocs'] && !mod['nombre d\'entités'] ? 
                    '<div class="stat">Informations disponibles</div>' : ''}
            </div>
        </div>
    `;
}

async function displayCategoryMods(htmlId, jsonCategoryKey) {
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
    
    // Afficher les mods (limite à 4 comme ton design actuel)
    contentContainer.innerHTML = '';
    categoryMods.slice(0, 4).forEach(mod => {
        contentContainer.innerHTML += createModElement(mod);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    
    // Correspondance entre IDs HTML et clés de catégorie
    const categories = [
        { htmlId: 'tech', key: 'tech' },
        { htmlId: 'magic', key: 'magic' },
        { htmlId: 'agriculture', key: 'agriculture' },
        { htmlId: 'adventure', key: 'adventure' },
        { htmlId: 'construction', key: 'construction' },
        { htmlId: 'library', key: 'library' },
        { htmlId: 'qol', key: 'qol' }
    ];
    
    categories.forEach(cat => {
        displayCategoryMods(cat.htmlId, cat.key);
    });
});
