import os

# Dossier des fiches
recettes_dir = r"E:\Sandcraft\wiki\recettes"

# Dictionnaire de correction manuelle (On ajoute les erreurs qu'on a trouvées)
# Format : "ancien_nom_erroné": "nouveau_nom_réel"
corrections = {
    "ae2_crafting_unit.png": "ae2_crafting_pattern.png", # Correction basée sur ton screen
    "ae2_cell_component_16k.png": "ae2_16k_cell_component.png", # Exemple de correction probable
    "minecraft_crafting_table.png": "minecraft_crafting_table_top.png"
}

print("--- CORRECTION INTELLIGENTE DES FICHES ---")

count = 0
for filename in os.listdir(recettes_dir):
    if filename.endswith(".md"):
        path = os.path.join(recettes_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for wrong, right in corrections.items():
            if wrong in new_content:
                new_content = new_content.replace(wrong, right)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Mis à jour : {filename}")
            count += 1

print(f"\nTerminé ! {count} fiches ont été corrigées.")