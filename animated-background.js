// animated-background.js - VERSION AUGMENTÉE (60+ items)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Création de l\'arrière-plan animé Sandcraft...');
    
    const background = document.getElementById('minecraft-background');
    if (!background) {
        console.error('Élément #minecraft-background non trouvé!');
        return;
    }
    
    // LISTE DE 40 ITEMS MINECRAFT DIFFÉRENTS
    const minecraftItems = [
        'diamond', 'emerald', 'redstone', 'lapis', 'quartz', 'coal',
        'iron-ingot', 'gold-ingot', 'ender-pearl', 'ender-eye', 
        'nether-star', 'blaze-rod', 'ghast-tear', 'magma-cream',
        'pickaxe-diamond', 'sword-diamond', 'helmet-diamond', 'chestplate-diamond',
        'crafting-table', 'furnace', 'chest', 'enchanting-table', 'anvil',
        'apple', 'golden-apple', 'carrot', 'potato', 'bread',
        'egg', 'feather', 'leather', 'string', 'spider-eye', 'bone', 'arrow',
        'grass-block', 'stone', 'dirt', 'wood-oak', 'cobblestone',
        'obsidian', 'glowstone', 'book'
    ];
    
    // ===== CRÉATION DE 100 PARTICULES LUMINEUSES =====
    console.log(`✨ Création de 100 particules...`);
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tailles variées
        const size = Math.random() * 6 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Couleurs Minecraft (bleu, vert, rouge, violet)
        const colors = [
            'rgba(59, 130, 246, 0.6)',    // Blue
            'rgba(34, 197, 94, 0.5)',     // Green
            'rgba(239, 68, 68, 0.5)',     // Red
            'rgba(168, 85, 247, 0.5)',    // Purple
            'rgba(245, 158, 11, 0.5)'     // Orange
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Position aléatoire
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Animations variées
        const animDuration = Math.random() * 8 + 4;
        const animDelay = Math.random() * 10;
        particle.style.animation = 
            `particleTwinkle ${animDuration}s infinite ease-in-out, 
             particleFloat ${animDuration * 3}s infinite alternate`;
        particle.style.animationDelay = `${animDelay}s`;
        
        background.appendChild(particle);
    }
    
    // ===== CRÉATION DE 60 ITEMS FLOTTANTS =====
    console.log(`🎮 Création de 60 items Minecraft...`);
    const createdItems = new Set(); // Pour éviter trop de doublons
    const maxAttempts = 80; // On essaie 80 fois pour avoir 60 items uniques
    
    for (let attempts = 0, created = 0; attempts < maxAttempts && created < 60; attempts++) {
        const item = document.createElement('div');
        const itemType = minecraftItems[Math.floor(Math.random() * minecraftItems.length)];
        
        // Limite à 3 du même type maximum
        const sameTypeCount = Array.from(createdItems).filter(type => type === itemType).length;
        if (sameTypeCount >= 3) continue;
        
        item.className = `minecraft-item ${itemType}`;
        createdItems.add(itemType);
        
        // Taille variable (0.7 à 1.3)
        const scale = Math.random() * 0.6 + 0.7;
        item.style.transform = `scale(${scale})`;
        
        // Position aléatoire avec marge
        const leftMargin = 5; // Ne pas coller aux bords
        item.style.left = `${Math.random() * (100 - leftMargin * 2) + leftMargin}vw`;
        
        // Vitesse d'animation variable
        const duration = Math.random() * 40 + 25; // 25-65 secondes
        item.style.animationDuration = `${duration}s`;
        
        // Délai de départ aléatoire
        item.style.animationDelay = `${Math.random() * 20}s`;
        
        // Opacité légèrement variable
        item.style.opacity = `${Math.random() * 0.15 + 0.15}`;
        
        // Rotation aléatoire
        const startRotate = Math.random() * 360;
        item.style.setProperty('--start-rotate', `${startRotate}deg`);
        
        background.appendChild(item);
        created++;
    }
    
    console.log(`✅ Arrière-plan créé avec succès!`);
    console.log(`   ${createdItems.size} types d'items différents`);
    console.log(`   100 particules lumineuses`);
    console.log(`   60 items flottants`);
    
    // ===== ANIMATION DYNAMIQUE (optionnel) =====
    // Ajoute quelques particules supplémentaires au survol
    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.7) { // 30% de chance
            const spark = document.createElement('div');
            spark.className = 'particle';
            spark.style.background = 'rgba(255, 255, 255, 0.8)';
            spark.style.width = '3px';
            spark.style.height = '3px';
            spark.style.left = `${e.clientX}px`;
            spark.style.top = `${e.clientY}px`;
            spark.style.animation = 'particleTwinkle 1.5s forwards';
            
            background.appendChild(spark);
            
            // Supprime après l'animation
            setTimeout(() => {
                if (spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            }, 1500);
        }
    });
});
