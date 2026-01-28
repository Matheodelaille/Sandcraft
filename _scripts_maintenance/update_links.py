import os

# Tes chemins exacts
folder_recettes = r"E:\Sandcraft\wiki\recettes"

print("--- MISE À JOUR DES LIENS DES IMAGES ---")

count = 0
for filename in os.listdir(folder_recettes):
    if filename.endswith(".md"):
        path = os.path.join(folder_recettes, filename)
        
        # Lecture du fichier
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Correction : on change l'ancien dossier par le nouveau dossier 'images'
        # On cherche "../ICONES_WIKI/" pour le remplacer par "../images/"
        new_content = content.replace("../ICONES_WIKI/", "../images/")
        
        # Ecriture si changement
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1

print(f"TERMINÉ : {count} fichiers mis à jour dans {folder_recettes}")