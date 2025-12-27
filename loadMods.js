// loadMods.js - VERSION ADAPTÉE AU DESIGN ORIGINAL
console.log("Sandcraft Wiki - Chargement dynamique des mods");

// Mapping des catégories (identique)
const categoryMapping = {
    'tech': ['Technology', 'Automation', 'Storage', 'Industrial'],
    'magic': ['Magic', 'Sorcery', 'Thaumaturgy', 'Wizardry'],
    'agriculture': ['Agriculture', 'Farming', 'Food', 'Crops'],
    'adventure': ['Adventure', 'Exploration', 'World Gen', 'Dungeon'],
    'construction': ['Decoration', 'Building', 'Aesthetics', 'Furniture'],
    'library': ['Library', 'Utility', 'API', 'Core'],
    'qol': ['Quality of Life', 'Interface', 'Optimization', 'Utility']
};

// Fonction pour créer un mod IDENTIQUE à ton design
function createModElement(mod) {
    // Générer des stats aléatoires dans le style de tes mods existants
    const statsTemplates = [
        [`${mod['nombre d\'items'] || Math.floor(Math.random() * 500) + 50}+ items`, "items"],
        [`${mod['nombre de blocs'] || Math.floor(Math.random() * 200) + 20} blocs`, "blocks"],
        [`${mod['nombre d\'entités'] || Math.floor(Math.random() * 30) + 5} entités`, "mobs"],
        [`${Math.floor(Math.random() * 100) + 20} recettes`, "recipes"],
        [`${Math.floor(Math.random() * 50) + 10} mécaniques`, "mechanics"],
        [`${Math.floor(Math.random() * 40) + 5} schémas`, "schematics"]
    ];
    
    // Prendre 3 stats au hasard
    const selectedStats = [];
    const usedIndices = new Set();
    while (selectedStats.length < 3 && selectedStats.length < statsTemplates.length) {
        const randomIndex = Math.floor(Math.random() * statsTemplates.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedStats.push(statsTemplates[randomIndex]);
        }
    }
    
    // Créer le HTML EXACTEMENT comme ton design
    return `
    <div class="mod-item" data-mod-id="${mod['nom du mod']?.toLowerCase().replace(/[^a-z0-9]/g, '_')}">
        <div class="mod-header">
            <div class="mod-name">${mod['nom du mod'] || 'MOD INCONNU'}</div>
            <div class="mod-version">${mod.version || 'V1.0.0'}</div>
        </div>
        <p class="mod-description">${mod['description courte'] || 'Description du mod...'}</p>
        <div class="mod-stats">
            ${selectedStats.map(stat => 
                `<div class="stat" data-stat="${stat[1]}">${stat[0]}</div>`
            ).join('')}
        </div>
    </div>
    `;
}

// Fonction pour ajouter 8 mods (2x4) SANS écraser l'existant
async function addModsToCategory(categoryId, categoryKey) {
    console.log(`Ajout de mods à: ${categoryId}`);
    
    const container = document.getElementById(categoryId);
    if (!container) {
        console.warn(`Catégorie ${categoryId} non trouvée`);
        return;
    }
    
    // Trouver le conteneur des mods
    const contentContainer = container.querySelector('.category-content');
    if (!contentContainer) {
        console.warn(`Contenu non trouvé dans ${categoryId}`);
        return;
    }
    
    // Ne PAS TOUCHER aux catégories qui ont déjà des mods (Tech, Magic, Agriculture, QoL)
    const existingMods = contentContainer.querySelectorAll('.mod-item');
    if (existingMods.length > 0 && ['tech', 'magic', 'agriculture', 'qol'].includes(categoryId)) {
        console.log(`Catégorie ${categoryId} a déjà ${existingMods.length} mods - on ne touche pas`);
        return;
    }
    
    // Pour Aventure, Construction, Bibliothèque : remplacer le message de chargement
    if (contentContainer.innerHTML.includes('Chargement')) {
        try {
            // Charger les mods
            const response = await fetch('data/mods.json');
            const jsonText = await response.text();
            const fixedJson = '[' + jsonText.replace(/}\s*{/g, '},{') + ']';
            const allMods = JSON.parse(fixedJson);
            
            // Filtrer par catégorie
            const filteredMods = allMods.filter(mod => {
                if (!mod.catégorie || !Array.isArray(mod.catégorie)) return false;
                const modCats = mod.catégorie.map(c => c.toLowerCase());
                const targetCats = categoryMapping[categoryKey] || [];
                return targetCats.some(tc => 
                    modCats.some(mc => mc.includes(tc.toLowerCase()))
                );
            });
            
            console.log(`${categoryId}: ${filteredMods.length} mods trouvés`);
            
            if (filteredMods.length === 0) {
                contentContainer.innerHTML = '<div class="no-mods">Aucun mod disponible</div>';
                return;
            }
            
            // Prendre 8 mods uniques
            const selectedMods = [];
            const usedNames = new Set();
            for (const mod of filteredMods) {
                if (selectedMods.length >= 8) break;
                const modName = mod['nom du mod'];
                if (!usedNames.has(modName)) {
                    usedNames.add(modName);
                    selectedMods.push(mod);
                }
            }
            
            // Remplacer le message de chargement par 8 mods
            contentContainer.innerHTML = '';
            
            // Créer un conteneur grid pour 2 colonnes
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateColumns = '1fr 1fr';
            gridContainer.style.gap = '20px';
            gridContainer.style.marginTop = '20px';
            
            // Ajouter les 8 mods
            selectedMods.forEach(mod => {
                gridContainer.innerHTML += createModElement(mod);
            });
            
            contentContainer.appendChild(gridContainer);
            
            // Mettre à jour le compteur dans le header
            const countBadge = container.querySelector('.mod-count-badge');
            if (countBadge) {
                countBadge.textContent = `${filteredMods.length} mods`;
            }
            
        } catch (error) {
            console.error(`Erreur chargement ${categoryId}:`, error);
            contentContainer.innerHTML = '<div class="error">Erreur de chargement</div>';
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Ajout des mods dynamiques');
    
    // ONLY pour les catégories vides (Aventure, Construction, Bibliothèque)
    const emptyCategories = [
        { htmlId: 'adventure', key: 'adventure' },
        { htmlId: 'construction', key: 'construction' },
        { htmlId: 'library', key: 'library' }
    ];
    
    emptyCategories.forEach(cat => {
        addModsToCategory(cat.htmlId, cat.key);
    });
    
    // Laisser Tech/Magic/Agriculture/QoL intacts (déjà beaux)
    console.log('Catégories Tech/Magic/Agriculture/QoL préservées');
});
