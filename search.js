// =============================================
// SEARCH.JS - Gestion de la recherche et de l'interface
// =============================================

// Éléments DOM
let searchInput, searchButton, categoryFilter, tagFilter, resetFilters;
let extensionsList, modsList, guidesList;
let tabButtons, tabContents;
let createModBtn, createGuideBtn;
let modForm, guideForm;
let createModForm, createGuideForm, detailModal;

// État de l'application
let currentView = 'grid';
let currentSort = 'name';
let currentFilters = {
    category: '',
    tag: ''
};

// Initialisation
function initSearch() {
    // Récupérer les éléments DOM
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    categoryFilter = document.getElementById('categoryFilter');
    tagFilter = document.getElementById('tagFilter');
    resetFilters = document.getElementById('resetFilters');
    
    extensionsList = document.getElementById('extensionsList');
    modsList = document.getElementById('modsList');
    guidesList = document.getElementById('guidesList');
    
    tabButtons = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');
    
    createModBtn = document.getElementById('createModBtn');
    createGuideBtn = document.getElementById('createGuideBtn');
    
    modForm = document.getElementById('modForm');
    guideForm = document.getElementById('guideForm');
    
    createModForm = document.getElementById('createModForm');
    createGuideForm = document.getElementById('createGuideForm');
    detailModal = document.getElementById('detailModal');
    
    // Charger les paramètres
    loadSettings();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Charger les données initiales
    loadInitialData();
    
    // Afficher les extensions
    displayExtensions();
    updateStats();
}

// Charger les paramètres
function loadSettings() {
    const settings = SandCraftDB.getSettings();
    currentView = settings.viewMode;
    currentSort = settings.sortBy;
    
    // Mettre à jour l'interface
    document.querySelectorAll('.view-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === currentView);
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = currentSort;
    }
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Recherche
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Filtres
    categoryFilter.addEventListener('change', function() {
        currentFilters.category = this.value;
        performSearch();
    });
    
    tagFilter.addEventListener('change', function() {
        currentFilters.tag = this.value;
        performSearch();
    });
    
    resetFilters.addEventListener('click', resetAllFilters);
    
    // Onglets
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Boutons de création
    createModBtn.addEventListener('click', showModForm);
    createGuideBtn.addEventListener('click', showGuideForm);
    
    // Formulaires
    if (modForm) {
        modForm.addEventListener('submit', handleModSubmit);
    }
    
    if (guideForm) {
        guideForm.addEventListener('submit', handleGuideSubmit);
    }
    
    // Annulation des formulaires
    const cancelMod = document.getElementById('cancelMod');
    const cancelGuide = document.getElementById('cancelGuide');
    const closeDetail = document.getElementById('closeDetail');
    
    if (cancelMod) cancelMod.addEventListener('click', hideModForm);
    if (cancelGuide) cancelGuide.addEventListener('click', hideGuideForm);
    if (closeDetail) closeDetail.addEventListener('click', hideDetailModal);
    
    // Boutons d'action rapide
    const showAllBtn = document.getElementById('showAll');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            searchInput.value = '';
            resetAllFilters();
            displayExtensions();
        });
    }
    
    // Toggle de vue
    document.querySelectorAll('.view-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            setViewMode(view);
        });
    });
    
    // Tri
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            SandCraftDB.setSortBy(currentSort);
            performSearch();
        });
    }
    
    // Actions du footer
    const exportBtn = document.getElementById('exportData');
    const importBtn = document.getElementById('importData');
    const clearBtn = document.getElementById('clearData');
    
    if (exportBtn) exportBtn.addEventListener('click', SandCraftDB.exportData);
    if (importBtn) importBtn.addEventListener('click', handleImport);
    if (clearBtn) clearBtn.addEventListener('click', handleClearData);
    
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === createModForm) hideModForm();
        if (e.target === createGuideForm) hideGuideForm();
        if (e.target === detailModal) hideDetailModal();
    });
}

// Charger les données initiales
function loadInitialData() {
    // Remplir les filtres de catégories
    const categories = SandCraftDB.getAllCategories();
    categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option);
    });
    
    // Remplir les filtres de tags
    const tags = SandCraftDB.getAllTags();
    tagFilter.innerHTML = '<option value="">Tous les tags</option>';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
    
    // Remplir le sélecteur d'extensions pour les mods
    const modExtensionsSelect = document.getElementById('modExtensions');
    if (modExtensionsSelect) {
        const extensions = SandCraftDB.getAllExtensions();
        extensions.forEach(ext => {
            const option = document.createElement('option');
            option.value = ext.id;
            option.textContent = ext.name;
            modExtensionsSelect.appendChild(option);
        });
    }
}

// Effectuer une recherche
function performSearch() {
    const query = searchInput.value.trim();
    const filters = {
        ...currentFilters,
        sortBy: currentSort
    };
    
    const results = SandCraftDB.searchExtensions(query, filters);
    displaySearchResults(results);
}

// Afficher les résultats de recherche
function displaySearchResults(extensions) {
    extensionsList.innerHTML = '';
    
    if (extensions.length === 0) {
        extensionsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucune extension trouvée</h3>
                <p>Essayez avec d'autres termes ou réinitialisez les filtres</p>
            </div>
        `;
        return;
    }
    
    extensions.forEach(extension => {
        const extensionElement = createExtensionCard(extension);
        extensionsList.appendChild(extensionElement);
    });
}
// Afficher toutes les extensions
function displayExtensions() {
    const extensions = SandCraftDB.getAllExtensions();
    displaySearchResults(extensions);
}

// Créer une carte d'extension
function createExtensionCard(extension) {
    const card = document.createElement('div');
    card.className = `extension-card ${currentView}-view`;
    card.dataset.id = extension.id;
    
    // Trouver la catégorie complète
    const categories = SandCraftDB.getAllCategories();
    const categoryObj = categories.find(c => c.id === extension.category);
    const categoryName = categoryObj ? categoryObj.name : extension.category;
    
    card.innerHTML = `
        <div class="extension-header">
            <div class="extension-icon">${extension.icon || '🧩'}</div>
            <div>
                <h3 class="extension-name">${extension.name}</h3>
                <span class="extension-category">${categoryName}</span>
            </div>
        </div>
        <p class="extension-description">${extension.description}</p>
        <div class="extension-tags">
            ${extension.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="extension-footer">
            <small>Version: ${extension.version} • Popularité: ${extension.popularity}%</small>
        </div>
    `;
    
    card.addEventListener('click', () => showExtensionDetail(extension.id));
    return card;
}

// Afficher les détails d'une extension
function showExtensionDetail(id) {
    const extension = SandCraftDB.getExtensionById(id);
    if (!extension) return;
    
    const categories = SandCraftDB.getAllCategories();
    const categoryObj = categories.find(c => c.id === extension.category);
    const categoryName = categoryObj ? categoryObj.name : extension.category;
    
    document.getElementById('detailContent').innerHTML = `
        <div class="extension-detail">
            <div class="detail-header">
                <span class="detail-icon">${extension.icon || '🧩'}</span>
                <h2>${extension.name}</h2>
                <span class="detail-category">${categoryName}</span>
            </div>
            <div class="detail-info">
                <p><strong>Description:</strong> ${extension.description}</p>
                <p><strong>Auteur:</strong> ${extension.author}</p>
                <p><strong>Version:</strong> ${extension.version}</p>
                <p><strong>Popularité:</strong> ${extension.popularity}%</p>
                <p><strong>Dernière mise à jour:</strong> ${extension.lastUpdated}</p>
            </div>
            <div class="detail-tags">
                <strong>Tags:</strong>
                ${extension.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="detail-actions">
                <button class="btn-primary" onclick="addExtensionToMod(${extension.id})">
                    <i class="fas fa-plus"></i> Ajouter à un Mod
                </button>
            </div>
        </div>
    `;
    
    detailModal.style.display = 'flex';
}

// Changer d'onglet
function switchTab(tabId) {
    // Mettre à jour les boutons d'onglet
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Mettre à jour le contenu des onglets
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    
    // Charger le contenu de l'onglet
    switch(tabId) {
        case 'mods':
            loadMods();
            break;
        case 'guides':
            loadGuides();
            break;
        default:
            performSearch();
    }
}

// Afficher le formulaire de mod
function showModForm() {
    createModForm.style.display = 'flex';
}

// Cacher le formulaire de mod
function hideModForm() {
    createModForm.style.display = 'none';
    modForm.reset();
}

// Afficher le formulaire de guide
function showGuideForm() {
    createGuideForm.style.display = 'flex';
}

// Cacher le formulaire de guide
function hideGuideForm() {
    createGuideForm.style.display = 'none';
    guideForm.reset();
}

// Cacher le modal de détail
function hideDetailModal() {
    detailModal.style.display = 'none';
}

// Gérer la soumission du formulaire de mod
function handleModSubmit(e) {
    e.preventDefault();
    
    const modData = {
        name: document.getElementById('modName').value,
        description: document.getElementById('modDescription').value,
        version: document.getElementById('modVersion').value || '1.0.0',
        author: document.getElementById('modAuthor').value || 'Anonyme',
        extensions: Array.from(document.getElementById('modExtensions').selectedOptions)
                      .map(opt => parseInt(opt.value))
    };
    
    SandCraftDB.addMod(modData);
    hideModForm();
    loadMods();
    updateStats();
    alert('Mod créé avec succès !');
}

// Gérer la soumission du formulaire de guide
function handleGuideSubmit(e) {
    e.preventDefault();
    
    const guideData = {
        title: document.getElementById('guideTitle').value,
        content: document.getElementById('guideContent').value,
        category: document.getElementById('guideCategory').value,
        tags: document.getElementById('guideTags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag)
    };
    
    SandCraftDB.addGuide(guideData);
    hideGuideForm();
    loadGuides();
    updateStats();
    alert('Guide créé avec succès !');
}

// Charger les mods
function loadMods() {
    const mods = SandCraftDB.getAllMods();
    modsList.innerHTML = '';
    
    if (mods.length === 0) {
        modsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-tools"></i>
                <h3>Aucun mod créé</h3>
                <p>Créez votre premier mod en cliquant sur "Créer un Mod"</p>
            </div>
        `;
        return;
    }
    
    mods.forEach(mod => {
        const modElement = document.createElement('div');
        modElement.className = 'mod-card';
        modElement.innerHTML = `
            <h3>${mod.name}</h3>
            <p>${mod.description || 'Pas de description'}</p>
            <small>Version: ${mod.version} • Auteur: ${mod.author}</small>
        `;
        modsList.appendChild(modElement);
    });
}

// Charger les guides
function loadGuides() {
    const guides = SandCraftDB.getAllGuides();
    guidesList.innerHTML = '';
    
    if (guides.length === 0) {
        guidesList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-book"></i>
                <h3>Aucun guide disponible</h3>
                <p>Créez votre premier guide en cliquant sur "Créer un Guide"</p>
            </div>
        `;
        return;
    }
    
    guides.forEach(guide => {
        const guideElement = document.createElement('div');
        guideElement.className = 'guide-card';
        guideElement.innerHTML = `
            <h3>${guide.title}</h3>
            <p class="guide-category">Catégorie: ${guide.category}</p>
            <p>${guide.content.substring(0, 150)}...</p>
            <div class="guide-tags">
                ${guide.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <small>Vues: ${guide.views || 0}</small>
        `;
        guidesList.appendChild(guideElement);
    });
}

// Réinitialiser tous les filtres
function resetAllFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    tagFilter.value = '';
    currentFilters = { category: '', tag: '' };
    displayExtensions();
}

// Définir le mode de vue
function setViewMode(mode) {
    currentView = mode;
    SandCraftDB.setViewMode(mode);
    
    // Mettre à jour les boutons
    document.querySelectorAll('.view-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === mode);
    });
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.extension-card').forEach(card => {
        card.className = `extension-card ${mode}-view`;
    });
}

// Mettre à jour les statistiques
function updateStats() {
    const stats = SandCraftDB.getStats();
    
    const extensionCount = document.getElementById('extensionCount');
    const modCount = document.getElementById('modCount');
    const guideCount = document.getElementById('guideCount');
    
    if (extensionCount) extensionCount.textContent = stats.extensions;
    if (modCount) modCount.textContent = stats.mods;
    if (guideCount) guideCount.textContent = stats.guides;
}

// Gérer l'import de données
function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const result = await SandCraftDB.importData(file);
            alert(result.message);
            location.reload(); // Recharger pour afficher les nouvelles données
        } catch (error) {
            alert('Erreur lors de l\'import: ' + error.message);
        }
    };
    
    input.click();
}

// Gérer l'effacement des données
function handleClearData() {
    const result = SandCraftDB.clearAllData();
    if (result.success) {
        alert(result.message);
        location.reload();
    }
}

// Fonction globale pour ajouter une extension à un mod
window.addExtensionToMod = function(extensionId) {
    hideDetailModal();
    showModForm();
    
    // Sélectionner l'extension dans le sélecteur
    const select = document.getElementById('modExtensions');
    const option = Array.from(select.options).find(opt => parseInt(opt.value) === extensionId);
    if (option) {
        option.selected = true;
    }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', initSearch);
