import os

recettes_dir = r"E:\Sandcraft\wiki\recettes"

print("--- AJOUT DE LA NAVIGATION ---")

for filename in os.listdir(recettes_dir):
    if filename.endswith(".md"):
        path = os.path.join(recettes_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # On vérifie si le bouton n'existe pas déjà pour éviter les doublons
        nav_bar = "[⬅️ Retour à l'index des mods](../README.md)\n\n---\n\n"
        
        if not content.startswith("[⬅️"):
            with open(path, 'w', encoding='utf-8') as f:
                f.write(nav_bar + content)

print("Navigation ajoutée à toutes les fiches !")