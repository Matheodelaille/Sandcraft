// ============================================
// SEARCH.JS - Système de recherche SandCraft
// ============================================

// Configuration globale
const CONFIG = {
    dataUrl: './assets/data/complete-data.json',
    categories: [
        { id: 'technology', name: 'Technologie & Automation', icon: '⚙️' },
        { id: 'magic', name: 'Magie & Sorcellerie', icon: '🔮' },
        { id: 'agriculture', name: 'Agriculture & Botanique', icon: '🌱' },
        { id: 'exploration', name: 'Exploration & Aventure', icon: '🧭' },
        { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️' },
        { id: 'decoration', name: 'Décoration & Esthétique', icon: '🎨' }
    ],
    tags: [
        'mécanique', 'énergie', 'automatisation', 'magie', 
        'agriculture', 'exploration', 'transport', 'stockage',
        'défense', 'cuisine', 'biome', 'dimension', 'équipement'
    ]
};

// État de l'application
let appState = {
    allMods: [],
    filteredMods: [],
    currentCategory: null,
    currentSearch: '',
    currentTag: null,
    sortBy: 'name'
};

// Éléments DOM
let domElements = {};

// ============================================
// INITIALISATION
// ============================================

/**
 * Initialise l'application
 */
function initApp() {
    console.log('🚀 Initialisation de SandCraft Wiki...');
    
    // Récupérer les éléments DOM
    cacheDOMElements();
    
    // Charger les données
    loadData();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Afficher les catégories
    displayCategories();
    
    // Mettre à jour les compteurs
    updateStats();
    
    console.log('✅ Application initialisée');
}

/**
 * Cache les références aux éléments DOM fréquemment utilisés
 */
function cacheDOMElements() {
    domElements = {
        // Conteneurs principaux
        mainContent: document.querySelector('.main-content'),
        categoryGrid: document.querySelector('.category-grid'),
        modlistContainer: document.querySelector('.modlist-container'),
        
        // Recherche et filtres
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button'),
        categoryFilter: document.querySelector('.category-filter'),
        tagFilter: document.querySelector('.tag-filter'),
        
        // Boutons et actions
        resetFiltersBtn: document.querySelector('.reset-filters'),
        showAllBtn: document.querySelector('.show-all-mods'),
        
        // Statistiques
        totalModsCount: document.querySelector('.total-mods-count'),
        categoriesCount: document.querySelector('.categories-count'),
        
        // Modals
        modDetailModal: document.getElementById('modDetailModal'),
        createModal: document.getElementById('createModal')
    };
}

/**
 * Charge les données depuis le fichier JSON
 */
async function loadData() {
    try {
        console.log('📥 Chargement des données...');
        
        const response = await fetch(CONFIG.dataUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Valider la structure des données
        if (!data.mods || !Array.isArray(data.mods)) {
            throw new Error('Structure de données invalide');
        }
        
        appState.allMods = data.mods;
        appState.filteredMods = [...appState.allMods];
        
        console.log(`✅ ${appState.allMods.length} mods chargés`);
        
        // Si on est sur la page modlist.html, afficher tous les mods
        if (window.location.pathname.includes('modlist.html')) {
            displayAllMods();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        showError('Impossible de charger les données. Vérifiez votre connexion.');
        
        // Données de secours
        appState.allMods = getFallbackData();
        appState.filteredMods = [...appState.allMods];
    }
}

/**
 * Données de secours en cas d'erreur
 */
function getFallbackData() {
    return [
        {
            id: 1,
            name: "Create",
            category: "technology",
            description: "Automatisation créative et mécaniques ouvrières",
            tags: ["mécanique", "automatisation", "énergie"],
            icon: "⚙️"
        },
        {
            id: 2,
            name: "Ars Nouveau",
            category: "magic",
            description: "Magie moderne et système de sortilèges",
            tags: ["magie", "sortilège", "enchantement"],
            icon: "🔮"
        }
    ];
}
// ============================================
// AFFICHAGE DES CATÉGORIES
// ============================================

/**
 * Affiche toutes les catégories sur la page d'accueil
 */
function displayCategories() {
    if (!domElements.categoryGrid) return;
    
    console.log('🎨 Affichage des catégories...');
    
    domElements.categoryGrid.innerHTML = '';
    
    CONFIG.categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        domElements.categoryGrid.appendChild(categoryCard);
    });
}

/**
 * Crée une carte de catégorie
 */
function createCategoryCard(category) {
    // Filtrer les mods de cette catégorie
    const categoryMods = appState.allMods.filter(mod => mod.category === category.id);
    
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.category = category.id;
    
    // HTML de la carte
    card.innerHTML = `
        <div class="category-header">
            <div class="category-icon">${category.icon}</div>
            <h2 class="category-title">${category.name}</h2>
        </div>
        
        <p class="category-description">
            ${getCategoryDescription(category.id)}
        </p>
        
        <div class="mod-count">
            <i class="fas fa-box"></i>
            ${categoryMods.length} mods disponibles
        </div>
        
        <ul class="mod-list">
            ${categoryMods.slice(0, 4).map(mod => `
                <li class="mod-item">
                    <span class="mod-name">${mod.name}</span>
                    <button class="access-btn" data-mod-id="${mod.id}">
                        Accéder
                    </button>
                </li>
            `).join('')}
            
            ${categoryMods.length > 4 ? `
                <li class="mod-item more-mods">
                    <span>+ ${categoryMods.length - 4} autres mods...</span>
                    <button class="view-all-btn" data-category="${category.id}">
                        Voir tout
                    </button>
                </li>
            ` : ''}
        </ul>
    `;
    
    // Événements
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.access-btn') && !e.target.closest('.view-all-btn')) {
            showCategoryMods(category.id);
        }
    });
    
    // Déléguation des événements pour les boutons dans la carte
    card.addEventListener('click', (e) => {
        const accessBtn = e.target.closest('.access-btn');
        const viewAllBtn = e.target.closest('.view-all-btn');
        
        if (accessBtn) {
            const modId = parseInt(accessBtn.dataset.modId);
            showModDetail(modId);
            e.stopPropagation();
        }
        
        if (viewAllBtn) {
            const categoryId = viewAllBtn.dataset.category;
            showCategoryMods(categoryId);
            e.stopPropagation();
        }
    });
    
    return card;
}

/**
 * Retourne la description d'une catégorie
 */
function getCategoryDescription(categoryId) {
    const descriptions = {
        'technology': 'Systèmes mécaniques, automatisation industrielle et ingénierie avancée',
        'magic': 'Sortilèges, enchantements et arts occultes pour étendre vos pouvoirs',
        'agriculture': 'Culture, élevage et botanique pour une autosuffisance totale',
        'exploration': 'Découverte de nouveaux mondes, dimensions et biomes mystérieux',
        'infrastructure': 'Construction, transport et gestion des ressources à grande échelle',
        'decoration': 'Design, esthétique et personnalisation de votre environnement'
    };
    
    return descriptions[categoryId] || 'Mods divers pour étendre vos possibilités';
}

/**
 * Affiche tous les mods d'une catégorie
 */
function showCategoryMods(categoryId) {
    appState.currentCategory = categoryId;
    appState.currentTag = null;
    appState.currentSearch = '';
    
    // Réinitialiser les champs de recherche
    if (domElements.searchInput) domElements.searchInput.value = '';
    if (domElements.categoryFilter) domElements.categoryFilter.value = categoryId;
    if (domElements.tagFilter) domElements.tagFilter.value = '';
    
    // Filtrer et afficher
    applyFilters();
}

// ============================================
// RECHERCHE ET FILTRES
// ============================================

/**
 * Initialise les écouteurs d'événements
 */
function initEventListeners() {
    // Recherche
    if (domElements.searchInput) {
        domElements.searchInput.addEventListener('input', debounce(function(e) {
            appState.currentSearch = e.target.value.trim();
            applyFilters();
        }, 300));
    }
    
    if (domElements.searchButton) {
        domElements.searchButton.addEventListener('click', () => {
            if (domElements.searchInput) {
                appState.currentSearch = domElements.searchInput.value.trim();
                applyFilters();
            }
        });
    }
    
    // Filtres
    if (domElements.categoryFilter) {
        domElements.categoryFilter.addEventListener('change', function(e) {
            appState.currentCategory = e.target.value || null;
            applyFilters();
        });
    }
    
    if (domElements.tagFilter) {
        domElements.tagFilter.addEventListener('change', function(e) {
            appState.currentTag = e.target.value || null;
            applyFilters();
        });
    }
    
    // Boutons
    if (domElements.resetFiltersBtn) {
        domElements.resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    if (domElements.showAllBtn) {
        domElements.showAllBtn.addEventListener('click', showAllMods);
    }
    
    // Touche Entrée pour la recherche
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && domElements.searchInput && 
            document.activeElement === domElements.searchInput) {
            appState.currentSearch = domElements.searchInput.value.trim();
            applyFilters();
        }
    });
}

/**
 * Applique tous les filtres en cours
 */
function applyFilters() {
    console.log('🔍 Application des filtres...');
    
    let filtered = [...appState.allMods];
    
    // Filtre par recherche texte
    if (appState.currentSearch) {
        const searchTerms = appState.currentSearch.toLowerCase().split(' ');
        filtered = filtered.filter(mod => {
            const searchString = `
                ${mod.name} 
                ${mod.description} 
                ${mod.category} 
                ${mod.tags ? mod.tags.join(' ') : ''}
            `.toLowerCase();
            
            return searchTerms.every(term => searchString.includes(term));
        });
    }
    
    // Filtre par catégorie
    if (appState.currentCategory) {
        filtered = filtered.filter(mod => mod.category === appState.currentCategory);
    }
    
    // Filtre par tag
    if (appState.currentTag) {
        filtered = filtered.filter(mod => 
            mod.tags && mod.tags.includes(appState.currentTag)
        );
    }
    
    // Tri
    filtered.sort((a, b) => {
        switch (appState.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'date':
                return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
            case 'popularity':
                return (b.popularity || 0) - (a.popularity || 0);
            default:
                return 0;
        }
    });
    
    appState.filteredMods = filtered;
    
    // Mettre à jour l'affichage selon la page courante
    if (window.location.pathname.includes('modlist.html')) {
        displayAllMods();
    } else if (domElements.mainContent && appState.currentCategory) {
        displayFilteredMods();
    }
    
    updateStats();
}
