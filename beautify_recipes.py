import os

recettes_dir = r"E:\Sandcraft\wiki\recettes"

# On définit les symboles pour chaque type de machine
symbols = {
    "minecraft:crafting": "🛠️",
    "minecraft:smelting": "🔥",
    "minecraft:blasting": "🌋",
    "minecraft:smoking": "💨",
    "minecraft:campfire_cooking": "🪵",
    "minecraft:stonecutting": "🧱",
    "minecraft:smithing": "🔨"
}

print("--- EMBELLISSEMENT DES RECETTES ---")

for filename in os.listdir(recettes_dir):
    if filename.endswith(".md"):
        path = os.path.join(recettes_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        for line in lines:
            # Si la ligne est un titre de recette (commence par ###)
            if line.startswith("### "):
                updated_line = line
                # On cherche si un mot clé de machine est dans le contexte (via le type de recette)
                # Note: Ce script suppose que le type est mentionné ou déductible
                # Pour l'instant, on va harmoniser les titres
                updated_line = line.replace("### ", "### 📦 ")
                new_lines.append(updated_line)
            else:
                new_lines.append(line)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

print("Titres harmonisés avec l'icône 📦 !")