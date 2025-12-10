// =============================================
// DATABASE.JS - Gestion des données SandCraft
// =============================================

// Données des extensions (exemple initial)
const extensionsData = [
    {
        id: 1,
        name: "Sand Physics",
        description: "Physique avancée pour le sable et les particules",
        category: "physique",
        tags: ["physique", "sable", "réalisme"],
        author: "SandDev",
        version: "1.2.0",
        popularity: 95,
        lastUpdated: "2024-01-15",
        icon: "🧪"
    },
    {
        id: 2,
        name: "Water Simulation",
        description: "Simulation réaliste de l'eau et des fluides",
        category: "eau",
        tags: ["eau", "fluide", "simulation"],
        author: "AquaTeam",
        version: "2.1.0",
        popularity: 88,
        lastUpdated: "2024-01-10",
        icon: "💧"
    },
    {
        id: 3,
        name: "Advanced Terrain",
        description: "Générateur de terrain procédural avancé",
        category: "terrain",
        tags: ["terrain", "génération", "procédural"],
        author: "TerrainMasters",
        version: "3.0.0",
        popularity: 92,
        lastUpdated: "2024-01-05",
        icon: "⛰️"
    },
    {
        id: 4,
        name: "Particle Effects",
        description: "Effets de particules pour explosions et magie",
        category: "effets",
        tags: ["particules", "effets", "visuels"],
        author: "FXPro",
        version: "1.5.0",
        popularity: 78,
        lastUpdated: "2024-01-12",
        icon: "✨"
    },
    {
        id: 5,
        name: "Multiplayer Sync",
        description: "Synchronisation réseau pour multijoueur",
        category: "réseau",
        tags: ["réseau", "multijoueur", "sync"],
        author: "NetCode",
        version: "2.3.0",
        popularity: 85,
        lastUpdated: "2024-01-08",
        icon: "🌐"
    },
    {
        id: 6,
        name: "AI System",
        description: "Système d'intelligence artificielle pour NPC",
        category: "ia",
        tags: ["ia", "intelligence", "npc"],
        author: "AIWorks",
        version: "1.8.0",
        popularity: 90,
        lastUpdated: "2024-01-03",
        icon: "🤖"
    }
];

// Catégories disponibles
const categories = [
    { id: "physique", name: "Physique" },
    { id: "eau", name: "Eau & Fluides" },
    { id: "terrain", name: "Terrain" },
    { id: "effets", name: "Effets Visuels" },
    { id: "réseau", name: "Réseau" },
    { id: "ia", name: "Intelligence Artificielle" },
    { id: "ui", name: "Interface" },
    { id: "audio", name: "Audio" },
    { id: "outils", name: "Outils" }
];

// Tags disponibles
const allTags = [
    "physique", "sable", "réalisme", "eau", "fluide", "simulation",
    "terrain", "génération", "procédural", "particules", "effets",
    "visuels", "réseau", "multijoueur", "sync", "ia", "intelligence",
    "npc", "optimisation", "performance", "debug", "mobile"
];

// =============================================
// GESTION DU LOCALSTORAGE
// =============================================

const STORAGE_KEYS = {
    EXTENSIONS: 'sandcraft_extensions',
    MODS: 'sandcraft_mods',
    GUIDES: 'sandcraft_guides',
    SETTINGS: 'sandcraft_settings'
};

// Initialiser le stockage local
function initializeStorage() {
    // Vérifier si les données existent déjà
    if (!localStorage.getItem(STORAGE_KEYS.EXTENSIONS)) {
        localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(extensionsData));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.MODS)) {
        localStorage.setItem(STORAGE_KEYS.MODS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.GUIDES)) {
        localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
            darkMode: false,
            viewMode: 'grid',
            sortBy: 'name'
        }));
    }
}

// Obtenir les données du localStorage
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Sauvegarder les données dans le localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// =============================================
// GESTION DES EXTENSIONS
// =============================================

function getAllExtensions() {
    return getFromStorage(STORAGE_KEYS.EXTENSIONS) || extensionsData;
}

function saveExtensions(extensions) {
    saveToStorage(STORAGE_KEYS.EXTENSIONS, extensions);
}

function addExtension(extension) {
    const extensions = getAllExtensions();
    // Générer un nouvel ID
    const newId = Math.max(...extensions.map(e => e.id)) + 1;
    const newExtension = {
        ...extension,
        id: newId,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    extensions.push(newExtension);
    saveExtensions(extensions);
    return newExtension;
}

function updateExtension(id, updatedData) {
    const extensions = getAllExtensions();
    const index = extensions.findIndex(e => e.id === id);
    if (index !== -1) {
        extensions[index] = {
            ...extensions[index],
            ...updatedData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        saveExtensions(extensions);
        return extensions[index];
    }
    return null;
}

function deleteExtension(id) {
    const extensions = getAllExtensions();
    const filtered = extensions.filter(e => e.id !== id);
    saveExtensions(filtered);
    return filtered;
}

function getExtensionById(id) {
    const extensions = getAllExtensions();
    return extensions.find(e => e.id === id);
}

// =============================================
// GESTION DES MODS
// =============================================

function getAllMods() {
    return getFromStorage(STORAGE_KEYS.MODS) || [];
}

function saveMods(mods) {
    saveToStorage(STORAGE_KEYS.MODS, mods);
}

function addMod(modData) {
    const mods = getAllMods();
    const newId = mods.length > 0 ? Math.max(...mods.map(m => m.id)) + 1 : 1;
    const newMod = {
        id: newId,
        ...modData,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
    };
    mods.push(newMod);
    saveMods(mods);
    return newMod;
}
function updateMod(id, updatedData) {
    const mods = getAllMods();
    const index = mods.findIndex(m => m.id === id);
    if (index !== -1) {
        mods[index] = {
            ...mods[index],
            ...updatedData,
            lastModified: new Date().toISOString().split('T')[0]
        };
        saveMods(mods);
        return mods[index];
    }
    return null;
}

function deleteMod(id) {
    const mods = getAllMods();
    const filtered = mods.filter(m => m.id !== id);
    saveMods(filtered);
    return filtered;
}

function getModById(id) {
    const mods = getAllMods();
    return mods.find(m => m.id === id);
}

// =============================================
// GESTION DES GUIDES
// =============================================

function getAllGuides() {
    return getFromStorage(STORAGE_KEYS.GUIDES) || [];
}

function saveGuides(guides) {
    saveToStorage(STORAGE_KEYS.GUIDES, guides);
}

function addGuide(guideData) {
    const guides = getAllGuides();
    const newId = guides.length > 0 ? Math.max(...guides.map(g => g.id)) + 1 : 1;
    const newGuide = {
        id: newId,
        ...guideData,
        createdDate: new Date().toISOString().split('T')[0],
        views: 0
    };
    guides.push(newGuide);
    saveGuides(guides);
    return newGuide;
}

function updateGuide(id, updatedData) {
    const guides = getAllGuides();
    const index = guides.findIndex(g => g.id === id);
    if (index !== -1) {
        guides[index] = {
            ...guides[index],
            ...updatedData
        };
        saveGuides(guides);
        return guides[index];
    }
    return null;
}

function deleteGuide(id) {
    const guides = getAllGuides();
    const filtered = guides.filter(g => g.id !== id);
    saveGuides(filtered);
    return filtered;
}

function getGuideById(id) {
    const guides = getAllGuides();
    return guides.find(g => g.id === id);
}

function incrementGuideViews(id) {
    const guides = getAllGuides();
    const index = guides.findIndex(g => g.id === id);
    if (index !== -1) {
        guides[index].views = (guides[index].views || 0) + 1;
        saveGuides(guides);
    }
}

// =============================================
// FONCTIONS DE FILTRAGE ET RECHERCHE
// =============================================

function searchExtensions(query, filters = {}) {
    let extensions = getAllExtensions();
    
    // Recherche par texte
    if (query) {
        const searchTerms = query.toLowerCase().split(' ');
        extensions = extensions.filter(ext => {
            const searchString = `
                ${ext.name} 
                ${ext.description} 
                ${ext.category} 
                ${ext.tags.join(' ')} 
                ${ext.author}
            `.toLowerCase();
            
            return searchTerms.every(term => searchString.includes(term));
        });
    }
    
    // Filtre par catégorie
    if (filters.category) {
        extensions = extensions.filter(ext => ext.category === filters.category);
    }
    
    // Filtre par tag
    if (filters.tag) {
        extensions = extensions.filter(ext => ext.tags.includes(filters.tag));
    }
    
    // Tri
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'name':
                extensions.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'date':
                extensions.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                break;
            case 'popularity':
                extensions.sort((a, b) => b.popularity - a.popularity);
                break;
        }
    }
    
    return extensions;
}

function getExtensionsByCategory(category) {
    const extensions = getAllExtensions();
    return extensions.filter(ext => ext.category === category);
}

function getExtensionsByTag(tag) {
    const extensions = getAllExtensions();
    return extensions.filter(ext => ext.tags.includes(tag));
}

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

function getAllCategories() {
    return categories;
}

function getAllTags() {
    return allTags;
}

function getStats() {
    return {
        extensions: getAllExtensions().length,
        mods: getAllMods().length,
        guides: getAllGuides().length,
        categories: categories.length,
        tags: allTags.length
    };
}

function exportData() {
    const data = {
        extensions: getAllExtensions(),
        mods: getAllMods(),
        guides: getAllGuides(),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandcraft-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validation basique des données
                if (data.extensions && data.mods && data.guides) {
                    // Sauvegarder les nouvelles données
                    saveToStorage(STORAGE_KEYS.EXTENSIONS, data.extensions);
                    saveToStorage(STORAGE_KEYS.MODS, data.mods);
                    saveToStorage(STORAGE_KEYS.GUIDES, data.guides);
                    
                    resolve({
                        success: true,
                        message: `Import réussi: ${data.extensions.length} extensions, ${data.mods.length} mods, ${data.guides.length} guides`
                    });
                } else {
                    reject(new Error('Format de fichier invalide'));
                }
            } catch (error) {
                reject(new Error('Erreur lors de la lecture du fichier'));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Erreur lors de la lecture du fichier'));
        };
        
        reader.readAsText(file);
    });
}

function clearAllData() {
    if (confirm('⚠️ ATTENTION ! Cette action va supprimer TOUTES les données.\n\nExtensions, mods et guides seront définitivement effacés.\n\nVoulez-vous continuer ?')) {
        localStorage.removeItem(STORAGE_KEYS.EXTENSIONS);
        localStorage.removeItem(STORAGE_KEYS.MODS);
        localStorage.removeItem(STORAGE_KEYS.GUIDES);
        
        // Réinitialiser avec les données par défaut
        initializeStorage();
        
        return {
            success: true,
            message: 'Toutes les données ont été effacées. Les extensions par défaut ont été restaurées.'
        };
    }
    return {
        success: false,
        message: 'Opération annulée'
    };
}

// =============================================
// GESTION DES PARAMÈTRES
// =============================================

function getSettings() {
    return getFromStorage(STORAGE_KEYS.SETTINGS) || {
        darkMode: false,
        viewMode: 'grid',
        sortBy: 'name'
    };
}

function saveSettings(settings) {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

function toggleDarkMode() {
    const settings = getSettings();
    settings.darkMode = !settings.darkMode;
    saveSettings(settings);
    
    // Appliquer le thème sur le body
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    return settings.darkMode;
}

function setViewMode(mode) {
    const settings = getSettings();
    settings.viewMode = mode;
    saveSettings(settings);
    return mode;
}

function setSortBy(sortBy) {
    const settings = getSettings();
    settings.sortBy = sortBy;
    saveSettings(settings);
    return sortBy;
}

// =============================================
// INITIALISATION
// =============================================

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    
    // Appliquer les paramètres
    const settings = getSettings();
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }
});

// =============================================
// EXPORT DES FONCTIONS
// =============================================

// Export pour utilisation dans d'autres fichiers
window.SandCraftDB = {
    // Initialisation
    initializeStorage,
    
    // Extensions
    getAllExtensions,
    getExtensionById,
    addExtension,
    updateExtension,
    deleteExtension,
    searchExtensions,
    getExtensionsByCategory,
    getExtensionsByTag,
    
    // Mods
    getAllMods,
    getModById,
    addMod,
    updateMod,
    deleteMod,
    
    // Guides
    getAllGuides,
    getGuideById,
    addGuide,
    updateGuide,
    deleteGuide,
    incrementGuideViews,
    
    // Données de référence
    getAllCategories,
    getAllTags,
    getStats,
    
    // Import/Export
    exportData,
    importData,
    clearAllData,
    
    // Paramètres
    getSettings,
    saveSettings,
    toggleDarkMode,
    setViewMode,
    setSortBy
};
