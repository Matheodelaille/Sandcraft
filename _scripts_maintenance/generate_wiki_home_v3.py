import os
import string

img_folder = r"E:\Sandcraft\wiki\images"
recettes_folder = r"E:\Sandcraft\wiki\recettes"
output_home = r"E:\Sandcraft\wiki\README.md"

# 1. Préparation des données
mods = [m.replace('.md', '') for m in os.listdir(recettes_folder) if m.endswith('.md')]
mods.sort()

mod_icons = {}
for img in sorted(os.listdir(img_folder)):
    mod_prefix = img.split('_')[0]
    if mod_prefix not in mod_icons:
        mod_icons[mod_prefix] = img

# 2. Construction du fichier
with open(output_home, 'w', encoding='utf-8') as f:
    f.write("# 🌐 Sandcraft - Encyclopédie des Mods\n\n")
    f.write("Cliquez sur une lettre pour accéder rapidement aux mods correspondants.\n\n")
    
    # Barre de navigation alphabétique
    alphabet_nav = " | ".join([f"[**{l}**](#{l.lower()})" for l in string.ascii_uppercase])
    f.write(f"### {alphabet_nav}\n\n---\n\n")
    
    f.write("| Icône | Nom du Mod | Lien Direct |\n")
    f.write("| :---: | :--- | :--- |\n")
    
    current_letter = ""
    
    for mod in mods:
        first_letter = mod[0].upper()
        
        # Si on change de lettre, on insère une ancre invisible pour la navigation
        if first_letter != current_letter:
            current_letter = first_letter
            # L'ancre est placée dans la colonne du nom pour être invisible mais fonctionnelle
            display_name = f"<a name='{current_letter.lower()}'></a>**{mod.replace('_', ' ').title()}**"
        else:
            display_name = f"**{mod.replace('_', ' ').title()}**"
        
        icon = mod_icons.get(mod.split('_')[0], "")
        icon_html = f"<img src='./images/{icon}' width='32' />" if icon else "📦"
        f_path = f"./recettes/{mod}.md"
        
        f.write(f"| {icon_html} | {display_name} | [Ouvrir la fiche]({f_path}) |\n")

print("Sommaire V3 avec navigation rapide généré !")