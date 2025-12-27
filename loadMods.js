// Fichier: loadMods.js - VERSION COMPLÈTE
// Charger et afficher les mods par catégorie

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
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const jsonText = await response.text();
        console.log('JSON récupéré, longueur:', jsonText.length);
        const fixedJson = '[' + jsonText.replace(/}\s*{/g, '},{') + ']';
        const allMods = JSON.parse(fixedJson);
        console.log(`${allMods.length} mods chargés`);
        return allMods;
    } catch (error) {
        console.error('ERREUR:', error);
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
        <div class="mod-item">
            <div class="mod-header">
                <div class="mod-name">${mod['nom du mod'] || 'Nom inconnu'}</div>
                <div class="mod-version">${mod.version || 'N/A'}</div>
            </div>
            <p class="mod-description">${mod['description courte'] || ''}</p>
            <div class="mod-stats">
                ${mod['nombre d\'items'] ? `<div class="stat">${mod['nombre d\'items']} items</div>` : ''}
                ${mod['nombre de blocs'] ? `<div class="stat">${mod['nombre de blocs']} blocs</div>` : ''}
                ${mod['nombre d\'entités'] ? `<div class="stat">${mod['nombre d\'entités']} entités</div>` : ''}
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
    const contentContainer = container.querySelector('.category-content');
    if (!contentContainer) {
        console.warn(`Contenu non trouvé dans #${htmlId}`);
        return;
    }
    
    contentContainer.innerHTML = '<div class="loading">Chargement...</div>';
    const allMods = await loadAllMods();
    if (allMods.length === 0) {
        contentContainer.innerHTML = '<div class="error">Erreur</div>';
        return;
    }
    
    const categoryMods = allMods.filter(mod => modBelongsToCategory(mod, jsonCategoryKey));
    console.log(`${jsonCategoryKey}: ${categoryMods.length} mods`);
    
    if (categoryMods.length === 0) {
        contentContainer.innerHTML = '<div class="no-mods">Aucun mod</div>';
        return;
    }
    
    contentContainer.innerHTML = '';
    categoryMods.slice(0, 4).forEach(mod => {
        contentContainer.innerHTML += createModElement(mod);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé');
    const categories = [
        { htmlId: 'tech', key: 'tech' },
        { htmlId: 'magic', key: 'magic' },
        { htmlId: 'agriculture', key: 'agriculture' },
        { htmlId: 'adventure', key: 'adventure' },
        { htmlId: 'construction', key: 'construction' },
        { htmlId: 'library', key: 'library' },
        { htmlId: 'qol', key: 'qol' }
    ];
    categories.forEach(cat => displayCategoryMods(cat.htmlId, cat.key));
});
