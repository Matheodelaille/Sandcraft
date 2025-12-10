// ============================================
// DATABASE.JS - Gestion des données SandCraft
// ============================================

const SandCraftDB = {
    // ============================================
    // CONFIGURATION
    // ============================================
    
    config: {
        dataUrl: './assets/data/complete-data.json',
        localStorageKey: 'sandcraft_mods_data',
        backupLocalStorageKey: 'sandcraft_mods_backup'
    },
    
    // ============================================
    // DONNÉES EN MÉMOIRE
    // ============================================
    
    data: {
        mods: [],
        categories: [],
        tags: [],
        lastUpdate: null
    },
    
    // ============================================
    // INITIALISATION
    // ============================================
    
    /**
     * Initialise la base de données
     */
    async init() {
        console.log('🗃️ Initialisation de la base de données SandCraft...');
        
        try {
            // 1. Charger depuis localStorage (si disponible)
            const localData = this.loadFromLocalStorage();
            
            if (localData && localData.mods && localData.mods.length > 0) {
                console.log(`📁 Chargement depuis localStorage: ${localData.mods.length} mods`);
                this.data = localData;
            } else {
                // 2. Charger depuis le fichier JSON
                console.log('📁 Chargement depuis le fichier JSON...');
                await this.loadFromJSON();
            }
            
            // 3. Générer les catégories et tags
            this.generateCategoriesAndTags();
            
            // 4. Mettre à jour la date
            this.data.lastUpdate = new Date().toISOString();
            
            console.log(`✅ Base de données initialisée: ${this.data.mods.length} mods, ${this.data.categories.length} catégories`);
            
            return this.data;
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            
            // Données de secours
            this.loadFallbackData();
            return this.data;
        }
    },
    
    // ============================================
    // CHARGEMENT DES DONNÉES
    // ============================================
    
    /**
     * Charge les données depuis le fichier JSON
     */
    async loadFromJSON() {
        try {
            const response = await fetch(this.config.dataUrl);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const jsonData = await response.json();
            
            // Valider la structure
            if (!jsonData.mods || !Array.isArray(jsonData.mods)) {
                throw new Error('Structure de données JSON invalide');
            }
            
            // Normaliser les données
            this.data.mods = this.normalizeModsData(jsonData.mods);
            this.data.categories = jsonData.categories || [];
            this.data.tags = jsonData.tags || [];
            
            // Sauvegarder dans localStorage
            this.saveToLocalStorage();
            
            console.log(`✅ Données JSON chargées: ${this.data.mods.length} mods`);
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement JSON:', error);
            throw error;
        }
    },
    
    /**
     * Charge les données depuis localStorage
     */
    loadFromLocalStorage() {
        try {
            const storedData = localStorage.getItem(this.config.localStorageKey);
            
            if (!storedData) {
                return null;
            }
            
            const parsedData = JSON.parse(storedData);
            
            // Vérifier la validité des données
            if (!parsedData.mods || !Array.isArray(parsedData.mods)) {
                console.warn('⚠️ Données localStorage corrompues');
                localStorage.removeItem(this.config.localStorageKey);
                return null;
            }
            
            return parsedData;
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement localStorage:', error);
            localStorage.removeItem(this.config.localStorageKey);
            return null;
        }
    },
    
    /**
     * Charge des données de secours
     */
    loadFallbackData() {
        console.log('🔄 Chargement des données de secours...');
        
        this.data.mods = [
            {
                id: 1,
                name: "Create",
                category: "technology",
                description: "Automatisation créative et mécaniques ouvrières",
                longDescription: "Create est un mod de technologie axé sur l'automatisation, la mécanique et l'ingénierie. Il permet de créer des systèmes complexes de transport, traitement et assemblage d'items.",
                icon: "⚙️",
                tags: ["mécanique", "automatisation", "énergie", "transport"],
                features: [
                    "Systèmes de courroies et engrenages",
                    "Moteurs et génération d'énergie",
                    "Automatisation de craft",
                    "Contraptions mobiles"
                ],
                version: "0.5.1",
                author: "Simibubi",
                dateAdded: "2024-01-15",
                popularity: 95
            },
            {
                id: 2,
                name: "Ars Nouveau",
                category: "magic",
                description: "Magie moderne et système de sortilèges",
                longDescription: "Un mod de magie qui apporte un système de sortilèges personnalisables, des rituels et des automations magiques.",
                icon: "🔮",
                tags: ["magie", "sortilège", "enchantement", "rituel"],
                features: [
                    "Sortilèges personnalisables",
                    "Rituels de magie",
                    "Automations magiques",
                    "Création de glyphes"
                ],
                version: "3.2.0",
                author: "baileyholl",
                dateAdded: "2024-01-10",
                popularity: 88
            }
        ];
        
        this.generateCategoriesAndTags();
        this.data.lastUpdate = new Date().toISOString();
        
        console.log(`✅ Données de secours chargées: ${this.data.mods.length} mods`);
    },
    
    // ============================================
    // NORMALISATION DES DONNÉES
    // ============================================
    
    /**
     * Normalise les données des mods
     */
    normalizeModsData(modsArray) {
        return modsArray.map((mod, index) => {
            // Assurer que chaque mod a un ID
            if (!mod.id) {
                mod.id = index + 1;
            }
            
            // Assurer les champs obligatoires
            return {
                id: mod.id,
                name: mod.name || `Mod ${mod.id}`,
                category: mod.category || 'uncategorized',
                description: mod.description || 'Aucune description disponible',
                longDescription: mod.longDescription || mod.description || '',
                icon: mod.icon || this.getDefaultIconForCategory(mod.category),
                tags: Array.isArray(mod.tags) ? mod.tags : [],
                features: Array.isArray(mod.features) ? mod.features : [],
                dependencies: Array.isArray(mod.dependencies) ? mod.dependencies : [],
                version: mod.version || '1.0.0',
                author: mod.author || 'Inconnu',
                dateAdded: mod.dateAdded || new Date().toISOString().split('T')[0],
                popularity: typeof mod.popularity === 'number' ? mod.popularity : 50,
                ...mod // Garder les autres propriétés
            };
        });
    },
    
    /**
     * Retourne une icône par défaut selon la catégorie
     */
    getDefaultIconForCategory(category) {
        const iconMap = {
            'technology': '⚙️',
            'magic': '🔮',
            'agriculture': '🌱',
            'exploration': '🧭',
            'infrastructure': '🏗️',
            'decoration': '🎨',
            'storage': '📦',
            'combat': '⚔️',
            'utility': '🔧'
        };
        
        return iconMap[category] || '📦';
    }
};
    // ============================================
    // GÉNÉRATION DE MÉTADONNÉES
    // ============================================
    
    /**
     * Génère les listes de catégories et tags
     */
    generateCategoriesAndTags() {
        // Catégories
        const categorySet = new Set();
        this.data.mods.forEach(mod => {
            if (mod.category) {
                categorySet.add(mod.category);
            }
        });
        
        this.data.categories = Array.from(categorySet).map(category => ({
            id: category,
            name: this.formatCategoryName(category),
            icon: this.getDefaultIconForCategory(category),
            count: this.data.mods.filter(mod => mod.category === category).length
        }));
        
        // Tags
        const tagSet = new Set();
        this.data.mods.forEach(mod => {
            if (Array.isArray(mod.tags)) {
                mod.tags.forEach(tag => tagSet.add(tag));
            }
        });
        
        this.data.tags = Array.from(tagSet).map(tag => ({
            id: tag,
            name: tag,
            count: this.data.mods.filter(mod => 
                Array.isArray(mod.tags) && mod.tags.includes(tag)
            ).length
        }));
        
        // Trier par nombre décroissant
        this.data.categories.sort((a, b) => b.count - a.count);
        this.data.tags.sort((a, b) => b.count - a.count);
    },
    
    /**
     * Formate le nom d'une catégorie
     */
    formatCategoryName(categoryId) {
        const nameMap = {
            'technology': 'Technologie & Automation',
            'magic': 'Magie & Sorcellerie',
            'agriculture': 'Agriculture & Botanique',
            'exploration': 'Exploration & Aventure',
            'infrastructure': 'Infrastructure',
            'decoration': 'Décoration & Esthétique',
            'storage': 'Stockage & Organisation',
            'combat': 'Combat & Défense',
            'utility': 'Utilitaires',
            'uncategorized': 'Non catégorisé'
        };
        
        return nameMap[categoryId] || 
               categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    },
    
    // ============================================
    // REQUÊTES DE DONNÉES
    // ============================================
    
    /**
     * Récupère tous les mods
     */
    getAllMods() {
        return [...this.data.mods];
    },
    
    /**
     * Récupère un mod par son ID
     */
    getModById(id) {
        return this.data.mods.find(mod => mod.id === id);
    },
    
    /**
     * Récupère les mods par catégorie
     */
    getModsByCategory(categoryId) {
        return this.data.mods.filter(mod => mod.category === categoryId);
    },
    
    /**
     * Récupère les mods par tag
     */
    getModsByTag(tag) {
        return this.data.mods.filter(mod => 
            Array.isArray(mod.tags) && mod.tags.includes(tag)
        );
    },
    
    /**
     * Récupère les mods par recherche
     */
    searchMods(query, filters = {}) {
        let results = [...this.data.mods];
        
        // Recherche texte
        if (query && query.trim()) {
            const searchTerms = query.toLowerCase().trim().split(' ');
            
            results = results.filter(mod => {
                const searchString = `
                    ${mod.name} 
                    ${mod.description} 
                    ${mod.longDescription} 
                    ${mod.category} 
                    ${Array.isArray(mod.tags) ? mod.tags.join(' ') : ''}
                    ${Array.isArray(mod.features) ? mod.features.join(' ') : ''}
                `.toLowerCase();
                
                return searchTerms.every(term => searchString.includes(term));
            });
        }
        
        // Filtre catégorie
        if (filters.category) {
            results = results.filter(mod => mod.category === filters.category);
        }
        
        // Filtre tag
        if (filters.tag) {
            results = results.filter(mod => 
                Array.isArray(mod.tags) && mod.tags.includes(filters.tag)
            );
        }
        
        // Filtre auteur
        if (filters.author) {
            results = results.filter(mod => 
                mod.author && mod.author.toLowerCase().includes(filters.author.toLowerCase())
            );
        }
        
        // Trier les résultats
        const sortField = filters.sortBy || 'name';
        const sortOrder = filters.sortOrder || 'asc';
        
        results.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortField) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                    
                case 'dateAdded':
                    valueA = new Date(a.dateAdded || 0);
                    valueB = new Date(b.dateAdded || 0);
                    break;
                    
                case 'popularity':
                    valueA = a.popularity || 0;
                    valueB = b.popularity || 0;
                    break;
                    
                case 'author':
                    valueA = (a.author || '').toLowerCase();
                    valueB = (b.author || '').toLowerCase();
                    break;
                    
                default:
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
            }
            
            if (sortOrder === 'desc') {
                [valueA, valueB] = [valueB, valueA];
            }
            
            if (typeof valueA === 'string') {
                return valueA.localeCompare(valueB);
            } else {
                return valueA - valueB;
            }
        });
        
        return results;
    },
    
    /**
     * Récupère toutes les catégories
     */
    getAllCategories() {
        return [...this.data.categories];
    },
    
    /**
     * Récupère tous les tags
     */
    getAllTags() {
        return [...this.data.tags];
    },
    
    /**
     * Récupère les statistiques
     */
    getStats() {
        return {
            totalMods: this.data.mods.length,
            totalCategories: this.data.categories.length,
            totalTags: this.data.tags.length,
            lastUpdate: this.data.lastUpdate,
            popularMods: this.data.mods
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 5),
            recentMods: this.data.mods
                .sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0))
                .slice(0, 5)
        };
    },
    
    // ============================================
    // MODIFICATION DES DONNÉES
    // ============================================
    
    /**
     * Ajoute un nouveau mod
     */
    addMod(modData) {
        // Valider les données
        if (!modData.name || !modData.category) {
            throw new Error('Le nom et la catégorie sont obligatoires');
        }
        
        // Générer un nouvel ID
        const newId = this.data.mods.length > 0 
            ? Math.max(...this.data.mods.map(mod => mod.id)) + 1
            : 1;
        
        // Créer le mod complet
        const newMod = {
            id: newId,
            name: modData.name.trim(),
            category: modData.category,
            description: modData.description || '',
            longDescription: modData.longDescription || modData.description || '',
            icon: modData.icon || this.getDefaultIconForCategory(modData.category),
            tags: Array.isArray(modData.tags) ? modData.tags : [],
            features: Array.isArray(modData.features) ? modData.features : [],
            dependencies: Array.isArray(modData.dependencies) ? modData.dependencies : [],
            version: modData.version || '1.0.0',
            author: modData.author || 'Inconnu',
            dateAdded: new Date().toISOString().split('T')[0],
            popularity: 50, // Popularité par défaut
            ...modData // Garder les autres propriétés
        };
        
        // Ajouter à la liste
        this.data.mods.push(newMod);
        
        // Mettre à jour les métadonnées
        this.generateCategoriesAndTags();
        this.data.lastUpdate = new Date().toISOString();
        
        // Sauvegarder
        this.saveToLocalStorage();
        
        console.log(`✅ Mod ajouté: ${newMod.name} (ID: ${newMod.id})`);
        
        return newMod;
    },
    
    /**
     * Met à jour un mod existant
     */
    updateMod(id, updatedData) {
        const index = this.data.mods.findIndex(mod => mod.id === id);
        
        if (index === -1) {
            throw new Error(`Mod avec ID ${id} non trouvé`);
        }
        
        // Conserver l'ID et les champs non modifiables
        const originalMod = this.data.mods[index];
        
        this.data.mods[index] = {
            ...originalMod,
            ...updatedData,
            id: originalMod.id, // Toujours conserver l'ID original
            dateAdded: originalMod.dateAdded // Ne pas modifier la date d'ajout
        };
        
        // Mettre à jour les métadonnées
        this.generateCategoriesAndTags();
        this.data.lastUpdate = new Date().toISOString();
        
        // Sauvegarder
        this.saveToLocalStorage();
        
        console.log(`✏️ Mod mis à jour: ${this.data.mods[index].name} (ID: ${id})`);
        
        return this.data.mods[index];
    }
    /**
     * Supprime un mod
     */
    deleteMod(id) {
        const index = this.data.mods.findIndex(mod => mod.id === id);
        
        if (index === -1) {
            throw new Error(`Mod avec ID ${id} non trouvé`);
        }
        
        const deletedMod = this.data.mods[index];
        
        // Supprimer
        this.data.mods.splice(index, 1);
        
        // Mettre à jour les métadonnées
        this.generateCategoriesAndTags();
        this.data.lastUpdate = new Date().toISOString();
        
        // Sauvegarder
        this.saveToLocalStorage();
        
        console.log(`🗑️ Mod supprimé: ${deletedMod.name} (ID: ${id})`);
        
        return deletedMod;
    },
    
    // ============================================
    // PERSISTANCE
    // ============================================
    
    /**
     * Sauvegarde les données dans localStorage
     */
    saveToLocalStorage() {
        try {
            const dataToSave = {
                mods: this.data.mods,
                categories: this.data.categories,
                tags: this.data.tags,
                lastUpdate: this.data.lastUpdate,
                version: '1.0.0'
            };
            
            localStorage.setItem(this.config.localStorageKey, JSON.stringify(dataToSave));
            
            // Créer un backup
            localStorage.setItem(this.config.backupLocalStorageKey, JSON.stringify(dataToSave));
            
            console.log('💾 Données sauvegardées dans localStorage');
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde localStorage:', error);
        }
    },
    
    /**
     * Importe des données depuis un fichier
     */
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    if (!importedData.mods || !Array.isArray(importedData.mods)) {
                        reject(new Error('Format de fichier invalide'));
                        return;
                    }
                    
                    // Normaliser les données importées
                    const normalizedMods = this.normalizeModsData(importedData.mods);
                    
                    // Fusionner avec les données existantes
                    const existingIds = new Set(this.data.mods.map(mod => mod.id));
                    const newMods = normalizedMods.filter(mod => !existingIds.has(mod.id));
                    
                    this.data.mods = [...this.data.mods, ...newMods];
                    
                    // Mettre à jour les métadonnées
                    this.generateCategoriesAndTags();
                    this.data.lastUpdate = new Date().toISOString();
                    
                    // Sauvegarder
                    this.saveToLocalStorage();
                    
                    resolve({
                        success: true,
                        importedCount: newMods.length,
                        totalCount: this.data.mods.length,
                        message: `${newMods.length} nouveaux mods importés`
                    });
                    
                } catch (error) {
                    reject(new Error('Erreur lors du parsing du fichier JSON'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erreur lors de la lecture du fichier'));
            };
            
            reader.readAsText(file);
        });
    },
    
    /**
     * Exporte les données
     */
    exportData() {
        const exportData = {
            mods: this.data.mods,
            categories: this.data.categories,
            tags: this.data.tags,
            exportDate: new Date().toISOString(),
            totalMods: this.data.mods.length
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sandcraft-mods-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📤 Données exportées');
        
        return exportData;
    },
    
    /**
     * Réinitialise les données
     */
    async resetData() {
        // Supprimer du localStorage
        localStorage.removeItem(this.config.localStorageKey);
        localStorage.removeItem(this.config.backupLocalStorageKey);
        
        // Recharger depuis le fichier JSON
        await this.loadFromJSON();
        
        console.log('🔄 Données réinitialisées');
        
        return this.data;
    },
    
    /**
     * Restaure depuis un backup
     */
    restoreFromBackup() {
        const backupData = localStorage.getItem(this.config.backupLocalStorageKey);
        
        if (!backupData) {
            throw new Error('Aucun backup disponible');
        }
        
        try {
            const parsedData = JSON.parse(backupData);
            
            if (!parsedData.mods || !Array.isArray(parsedData.mods)) {
                throw new Error('Backup corrompu');
            }
            
            this.data = parsedData;
            
            // Sauvegarder comme données principales
            this.saveToLocalStorage();
            
            console.log('🔄 Backup restauré');
            
            return this.data;
            
        } catch (error) {
            throw new Error('Erreur lors de la restauration du backup');
        }
    },
    
    // ============================================
    // UTILITAIRES
    // ============================================
    
    /**
     * Valide les données d'un mod
     */
    validateModData(modData) {
        const errors = [];
        
        if (!modData.name || modData.name.trim().length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        }
        
        if (!modData.category) {
            errors.push('La catégorie est obligatoire');
        }
        
        if (!modData.description || modData.description.trim().length < 10) {
            errors.push('La description doit contenir au moins 10 caractères');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Recherche avancée avec plusieurs critères
     */
    advancedSearch(criteria) {
        let results = [...this.data.mods];
        
        // Nom
        if (criteria.name) {
            results = results.filter(mod => 
                mod.name.toLowerCase().includes(criteria.name.toLowerCase())
            );
        }
        
        // Description
        if (criteria.description) {
            results = results.filter(mod => 
                mod.description.toLowerCase().includes(criteria.description.toLowerCase()) ||
                (mod.longDescription && mod.longDescription.toLowerCase().includes(criteria.description.toLowerCase()))
            );
        }
        
        // Catégorie
        if (criteria.category && criteria.category !== 'all') {
            results = results.filter(mod => mod.category === criteria.category);
        }
        
        // Tags (multiple)
        if (criteria.tags && criteria.tags.length > 0) {
            results = results.filter(mod => 
                criteria.tags.every(tag => 
                    Array.isArray(mod.tags) && mod.tags.includes(tag)
                )
            );
        }
        
        // Auteur
        if (criteria.author) {
            results = results.filter(mod => 
                mod.author && mod.author.toLowerCase().includes(criteria.author.toLowerCase())
            );
        }
        
        // Date range
        if (criteria.dateFrom) {
            const fromDate = new Date(criteria.dateFrom);
            results = results.filter(mod => 
                new Date(mod.dateAdded) >= fromDate
            );
        }
        
        if (criteria.dateTo) {
            const toDate = new Date(criteria.dateTo);
            results = results.filter(mod => 
                new Date(mod.dateAdded) <= toDate
            );
        }
        
        // Popularité minimum
        if (criteria.minPopularity !== undefined) {
            results = results.filter(mod => 
                (mod.popularity || 0) >= criteria.minPopularity
            );
        }
        
        return results;
    }
};

// ============================================
// EXPORT GLOBAL
// ============================================

// Initialisation automatique si utilisée dans le navigateur
if (typeof window !== 'undefined') {
    window.SandCraftDB = SandCraftDB;
    
    // Initialiser au chargement de la page
    document.addEventListener('DOMContentLoaded', async () => {
        // Vérifier si on est sur une page qui utilise la DB
        const needsDB = document.querySelector('[data-requires-db]') || 
                       document.querySelector('.category-grid') ||
                       document.querySelector('.modlist-container');
        
        if (needsDB) {
            try {
                await SandCraftDB.init();
                console.log('✅ SandCraftDB prêt à l\'emploi');
                
                // Événement personnalisé pour signaler que la DB est prête
                const event = new CustomEvent('sandcraftdb:ready', {
                    detail: { db: SandCraftDB }
                });
                document.dispatchEvent(event);
                
            } catch (error) {
                console.error('❌ Échec de l\'initialisation de SandCraftDB:', error);
            }
        }
    });
}

// Export pour Node.js/ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SandCraftDB;
}

console.log('✅ database.js chargé avec succès');
