import os
import re

img_folder = r"E:\Sandcraft\wiki\images"
recettes_folder = r"E:\Sandcraft\wiki\recettes"

print("--- PHASE DE RÉCUPÉRATION D'URGENCE ---")
real_files = os.listdir(img_folder)
real_images_map = {f.lower(): f for f in real_files}

# On crée une liste de mots-clés pour chaque image réelle pour aider la recherche
image_keywords = {f: set(re.split(r'[_.]', f.lower())) for f in real_files}

fixed_count = 0

for filename in os.listdir(recettes_folder):
    if filename.endswith(".md"):
        path = os.path.join(recettes_folder, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        links = re.findall(r'(?:images/|src=\'|src=")(.*?\.png)', content)
        
        for link in set(links):
            clean_link = os.path.basename(link)
            link_lower = clean_link.lower()
            
            # 1. Si l'image n'existe pas
            if link_lower not in real_images_map:
                link_parts = set(re.split(r'[_.]', link_lower))
                
                # 2. On cherche une image qui partage le plus de mots-clés
                best_match = None
                highest_score = 0
                
                for img_name, keywords in image_keywords.items():
                    # On vérifie si c'est le même mod (préfixe) pour éviter les erreurs
                    if img_name.split('_')[0] == clean_link.split('_')[0]:
                        common = link_parts.intersection(keywords)
                        score = len(common)
                        if score > highest_score:
                            highest_score = score
                            best_match = img_name
                
                # 3. Si on trouve une correspondance solide (au moins 2 mots en commun)
                if best_match and highest_score >= 2:
                    new_content = new_content.replace(clean_link, best_match)
                    fixed_count += 1
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)

print(f"--- RÉPARATION TERMINÉE ---")
print(f"Nombre d'images 'devinées' et réparées : {fixed_count}")