import os
import re

img_folder = r"E:\Sandcraft\wiki\images"
recettes_folder = r"E:\Sandcraft\wiki\recettes"

# Indexation avec log pour débogage
print("--- DÉBUT DE L'ANALYSE ---")
real_images_map = {f.lower(): f for f in os.listdir(img_folder)}
print(f"Images détectées dans le dossier : {len(real_images_map)}")

fixed_count = 0
not_found_count = 0

for filename in os.listdir(recettes_folder):
    if filename.endswith(".md"):
        path = os.path.join(recettes_folder, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        
        # Regex qui capture TOUT (Markdown standard ET balises HTML img)
        # Elle cherche ce qui finit par .png ou .jpg à l'intérieur de parenthèses ou de guillemets
        links = re.findall(r'(?:images/|src=\'|src=")(.*?\.png)', content)
        
        for link in set(links): # 'set' pour éviter de traiter 2 fois le même lien dans un fichier
            clean_link = os.path.basename(link)
            link_lower = clean_link.lower()
            
            if link_lower in real_images_map:
                correct_name = real_images_map[link_lower]
                if clean_link != correct_name:
                    new_content = new_content.replace(clean_link, correct_name)
                    fixed_count += 1
            else:
                # Si l'image n'est même pas dans le dossier images/
                not_found_count += 1
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)

print(f"\n--- RÉSULTATS ---")
print(f"Corrections de nom/casse effectuées : {fixed_count}")
print(f"Images introuvables (liens morts définitifs) : {not_found_count}")