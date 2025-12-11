// data-loader.js
class DataLoader {
    constructor() {
        this.data = {
            mods: null,
            items: null,
            recipes: null,
            categories: null
        };
        this.loaded = false;
    }

    async init() {
        try {
            console.log('📦 Chargement des données Sandcraft...');
            
            // Chargement parallèle des données principales
            const [modsData, itemsData, categoriesData] = await Promise.all([
                this.loadJSON('data/mods-index.json'),
                this.loadJSON('data/items-index.json'),
                this.loadJSON('data/categories.json')
            ]);
            
            this.data.mods = modsData;
            this.data.items = itemsData;
            this.data.categories = categoriesData;
            this.loaded = true;
            
            console.log(`✅ Données chargées : ${modsData.mods.length} mods, ${itemsData.items.length} items`);
            this.dispatchEvent(new CustomEvent('dataLoaded', { detail: this.data }));
            
        } catch (error) {
            console.error('❌ Erreur chargement données:', error);
        }
    }

    async loadJSON(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    }

    getMod(id) {
        return this.data.mods?.mods.find(mod => mod.id === id);
    }

    getModsByCategory(category) {
        return this.data.mods?.mods.filter(mod => 
            mod.categories?.includes(category)
        ) || [];
    }

    searchItems(query, limit = 50) {
        if (!this.data.items) return [];
        
        const q = query.toLowerCase();
        return this.data.items.items
            .filter(item => 
                item.name.toLowerCase().includes(q) ||
                item.id.toLowerCase().includes(q) ||
                item.mod.toLowerCase().includes(q)
            )
            .slice(0, limit);
    }

    dispatchEvent(event) {
        window.dispatchEvent(event);
    }
}

// Instance globale
window.SandcraftData = new DataLoader();

// Chargement automatique au démarrage
document.addEventListener('DOMContentLoaded', () => {
    window.SandcraftData.init();
});
