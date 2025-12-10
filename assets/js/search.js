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

/**
 * Affiche tous les mods (page modlist.html)
 */
function displayAllMods() {
    if (!domElements.modlistContainer) return;
    
    console.log('📋 Affichage de tous les mods...');
    
    let html = `
        <div class="modlist-header">
            <h2>Tous les Mods (${appState.filteredMods.length})</h2>
            <div class="modlist-controls">
                <input type="text" class="search-input" placeholder="Rechercher un mod...">
                <button class="btn btn-primary search-button">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    `;
    
    if (appState.filteredMods.length === 0) {
        html += `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun mod trouvé</h3>
                <p>Essayez d'autres termes de recherche</p>
            </div>
        `;
    } else {
        html += `
            <table class="mod-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Description</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appState.filteredMods.map(mod => `
                        <tr>
                            <td>
                                <div class="mod-name-cell">
                                    <span class="mod-icon">${mod.icon || '📦'}</span>
                                    <strong>${mod.name}</strong>
                                </div>
                            </td>
                            <td>
                                <span class="category-badge" data-category="${mod.category}">
                                    ${CONFIG.categories.find(c => c.id === mod.category)?.icon || ''}
                                    ${CONFIG.categories.find(c => c.id === mod.category)?.name || mod.category}
                                </span>
                            </td>
                            <td>${mod.description}</td>
                            <td>
                                <div class="mod-tags">
                                    ${mod.tags ? mod.tags.map(tag => `
                                        <span class="tag">${tag}</span>
                                    `).join('') : ''}
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-secondary view-mod-btn" data-mod-id="${mod.id}">
                                    <i class="fas fa-eye"></i> Voir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    domElements.modlistContainer.innerHTML = html;
    
    // Réattacher les événements après le rendu
    reattachModlistEvents();
}

/**
 * Affiche les mods filtrés (page d'accueil)
 */
function displayFilteredMods() {
    if (!domElements.mainContent) return;
    
    const category = CONFIG.categories.find(c => c.id === appState.currentCategory);
    
    let html = `
        <div class="filtered-mods-header">
            <h2>${category?.name || 'Mods'} (${appState.filteredMods.length})</h2>
            <button class="btn btn-secondary back-to-categories">
                <i class="fas fa-arrow-left"></i> Retour aux catégories
            </button>
        </div>
    `;
    
    if (appState.filteredMods.length === 0) {
        html += `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun mod trouvé</h3>
                <button class="btn btn-primary reset-filters">
                    Réinitialiser les filtres
                </button>
            </div>
        `;
    } else {
        html += `
            <div class="filtered-mods-grid">
                ${appState.filteredMods.map(mod => `
                    <div class="mod-card" data-mod-id="${mod.id}">
                        <div class="mod-card-header">
                            <div class="mod-icon">${mod.icon || '📦'}</div>
                            <h3 class="mod-title">${mod.name}</h3>
                        </div>
                        <p class="mod-description">${mod.description}</p>
                        <div class="mod-tags">
                            ${mod.tags ? mod.tags.map(tag => `
                                <span class="tag">${tag}</span>
                            `).join('') : ''}
                        </div>
                        <div class="mod-card-actions">
                            <button class="btn btn-primary access-mod-btn" data-mod-id="${mod.id}">
                                Accéder
                            </button>
                            <button class="btn btn-secondary details-btn" data-mod-id="${mod.id}">
                                Détails
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    domElements.mainContent.innerHTML = html;
    
    // Réattacher les événements
    const backBtn = document.querySelector('.back-to-categories');
    if (backBtn) {
        backBtn.addEventListener('click', resetToCategories);
    }
    
    const modCards = document.querySelectorAll('.mod-card, .view-mod-btn, .access-mod-btn, .details-btn');
    modCards.forEach(element => {
        element.addEventListener('click', function(e) {
            const modId = this.dataset.modId || 
                         this.closest('[data-mod-id]')?.dataset.modId;
            if (modId) {
                showModDetail(parseInt(modId));
                e.stopPropagation();
            }
        });
    });
}

/**
 * Réattache les événements sur la page modlist
 */
function reattachModlistEvents() {
    // Recherche dans modlist
    const searchInput = document.querySelector('.modlist-container .search-input');
    const searchButton = document.querySelector('.modlist-container .search-button');
    
    if (searchInput) {
        searchInput.value = appState.currentSearch || '';
        searchInput.addEventListener('input', debounce(function(e) {
            appState.currentSearch = e.target.value.trim();
            applyFilters();
        }, 300));
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            if (searchInput) {
                appState.currentSearch = searchInput.value.trim();
                applyFilters();
            }
        });
    }
    
    // Boutons "Voir" dans le tableau
    const viewButtons = document.querySelectorAll('.view-mod-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modId = parseInt(this.dataset.modId);
            showModDetail(modId);
        });
    });
}

/**
 * Affiche les détails d'un mod
 */
function showModDetail(modId) {
    const mod = appState.allMods.find(m => m.id === modId);
    if (!mod) return;
    
    const category = CONFIG.categories.find(c => c.id === mod.category);
    
    let html = `
        <div class="mod-detail">
            <div class="mod-detail-header">
                <div class="mod-detail-icon">${mod.icon || '📦'}</div>
                <div>
                    <h2>${mod.name}</h2>
                    <div class="mod-detail-category">
                        ${category?.icon || ''} ${category?.name || mod.category}
                    </div>
                </div>
                <button class="close-modal-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="mod-detail-content">
                <div class="mod-detail-section">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${mod.description}</p>
                </div>
                
                ${mod.longDescription ? `
                    <div class="mod-detail-section">
                        <h3><i class="fas fa-align-left"></i> Description détaillée</h3>
                        <p>${mod.longDescription}</p>
                    </div>
                ` : ''}
                
                ${mod.features && mod.features.length > 0 ? `
                    <div class="mod-detail-section">
                        <h3><i class="fas fa-star"></i> Fonctionnalités</h3>
                        <ul class="features-list">
                            ${mod.features.map(feature => `
                                <li><i class="fas fa-check"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="mod-detail-section">
                    <h3><i class="fas fa-tags"></i> Tags</h3>
                    <div class="mod-detail-tags">
                        ${mod.tags ? mod.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('') : '<p>Aucun tag</p>'}
                    </div>
                </div>
                
                ${mod.dependencies && mod.dependencies.length > 0 ? `
                    <div class="mod-detail-section">
                        <h3><i class="fas fa-link"></i> Dépendances</h3>
                        <div class="dependencies-list">
                            ${mod.dependencies.map(dep => `
                                <span class="dependency">${dep}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${mod.version || mod.author ? `
                    <div class="mod-detail-section">
                        <h3><i class="fas fa-cog"></i> Informations techniques</h3>
                        <div class="mod-info-grid">
                            ${mod.version ? `
                                <div class="info-item">
                                    <strong>Version:</strong> ${mod.version}
                                </div>
                            ` : ''}
                            ${mod.author ? `
                                <div class="info-item">
                                    <strong>Auteur:</strong> ${mod.author}
                                </div>
                            ` : ''}
                            ${mod.dateAdded ? `
                                <div class="info-item">
                                    <strong>Ajouté le:</strong> ${new Date(mod.dateAdded).toLocaleDateString()}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="mod-detail-actions">
                <button class="btn btn-primary">
                    <i class="fas fa-download"></i> Télécharger
                </button>
                <button class="btn btn-secondary close-modal-btn">
                    <i class="fas fa-times"></i> Fermer
                </button>
            </div>
        </div>
    `;
    
    // Afficher le modal
    if (domElements.modDetailModal) {
        domElements.modDetailModal.innerHTML = html;
        domElements.modDetailModal.style.display = 'flex';
        
        // Événements de fermeture
        const closeButtons = domElements.modDetailModal.querySelectorAll('.close-modal-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                domElements.modDetailModal.style.display = 'none';
            });
        });
        
        // Fermer en cliquant à l'extérieur
        domElements.modDetailModal.addEventListener('click', (e) => {
            if (e.target === domElements.modDetailModal) {
                domElements.modDetailModal.style.display = 'none';
            }
        });
    } else {
        // Fallback: alert
        alert(`${mod.name}\n\n${mod.description}\n\nCatégorie: ${category?.name || mod.category}`);
    }
}
/**
 * Réinitialise tous les filtres
 */
function resetFilters() {
    console.log('🔄 Réinitialisation des filtres...');
    
    appState.currentCategory = null;
    appState.currentSearch = '';
    appState.currentTag = null;
    
    // Réinitialiser les champs UI
    if (domElements.searchInput) domElements.searchInput.value = '';
    if (domElements.categoryFilter) domElements.categoryFilter.value = '';
    if (domElements.tagFilter) domElements.tagFilter.value = '';
    
    appState.filteredMods = [...appState.allMods];
    
    // Revenir à l'affichage des catégories
    if (domElements.mainContent && !window.location.pathname.includes('modlist.html')) {
        displayCategories();
    } else if (window.location.pathname.includes('modlist.html')) {
        displayAllMods();
    }
    
    updateStats();
}

/**
 * Retourne à l'affichage des catégories
 */
function resetToCategories() {
    appState.currentCategory = null;
    appState.currentSearch = '';
    appState.currentTag = null;
    
    if (domElements.mainContent) {
        displayCategories();
    }
}

/**
 * Affiche tous les mods (sans filtres)
 */
function showAllMods() {
    appState.currentCategory = null;
    appState.currentSearch = '';
    appState.currentTag = null;
    
    // Rediriger vers modlist.html ou afficher directement
    if (window.location.pathname.includes('modlist.html')) {
        applyFilters();
    } else {
        window.location.href = 'modlist.html';
    }
}

/**
 * Met à jour les statistiques affichées
 */
function updateStats() {
    if (domElements.totalModsCount) {
        domElements.totalModsCount.textContent = appState.allMods.length;
    }
    
    if (domElements.categoriesCount) {
        // Compter le nombre de catégories qui ont au moins un mod
        const categoriesWithMods = new Set(appState.allMods.map(mod => mod.category));
        domElements.categoriesCount.textContent = categoriesWithMods.size;
    }
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    console.error('❌ Erreur:', message);
    
    // Créer un élément d'erreur
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="error-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Style pour l'erreur
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    const errorContent = errorDiv.querySelector('.error-content');
    errorContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Bouton de fermeture
    const closeBtn = errorDiv.querySelector('.error-close-btn');
    closeBtn.addEventListener('click', () => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

/**
 * Fonction debounce pour limiter les appels fréquents
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Triage des mods
 */
function sortMods(sortBy) {
    appState.sortBy = sortBy;
    applyFilters();
}

/**
 * Export des données
 */
function exportData() {
    const data = {
        mods: appState.allMods,
        exportDate: new Date().toISOString(),
        totalMods: appState.allMods.length,
        categories: CONFIG.categories
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandcraft-mods-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Import des données
 */
async function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.mods && Array.isArray(data.mods)) {
                    // Fusionner avec les mods existants
                    const existingIds = new Set(appState.allMods.map(mod => mod.id));
                    const newMods = data.mods.filter(mod => !existingIds.has(mod.id));
                    
                    appState.allMods = [...appState.allMods, ...newMods];
                    appState.filteredMods = [...appState.allMods];
                    
                    // Mettre à jour l'affichage
                    if (window.location.pathname.includes('modlist.html')) {
                        displayAllMods();
                    } else {
                        displayCategories();
                    }
                    
                    updateStats();
                    
                    resolve({
                        success: true,
                        message: `${newMods.length} nouveaux mods importés`
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

// ============================================
// EXPORTS GLOBAUX ET INITIALISATION
// ============================================

// Exporter les fonctions principales
window.SandCraftSearch = {
    initApp,
    searchMods: applyFilters,
    showModDetail,
    exportData,
    importData,
    resetFilters,
    showAllMods,
    sortMods
};

// Initialiser l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur une page qui a besoin du script
    const isWikiPage = document.querySelector('.category-grid') || 
                      document.querySelector('.modlist-container') ||
                      document.querySelector('.search-input');
    
    if (isWikiPage) {
        // Attendre que FontAwesome soit chargé si présent
        if (typeof FontAwesome !== 'undefined') {
            FontAwesome.config.autoReplaceSvg = 'nest';
            setTimeout(initApp, 100);
        } else {
            initApp();
        }
    }
});

// Support pour les pages qui appellent initApp manuellement
window.initSandCraftWiki = initApp;

// Ajouter des styles pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error-close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
    }
    
    .error-close-btn:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

console.log('✅ search.js chargé avec succès');
